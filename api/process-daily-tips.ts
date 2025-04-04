import { VercelRequest, VercelResponse } from '@vercel/node';
import admin from "firebase-admin";
import sgMail from "@sendgrid/mail";
import { getDailyTipContent } from "./utils";

// Properly handle Firebase initialization
const initializeFirebase = () => {
  try {
    if (!admin.apps.length) {
      // Check if environment variables are present
      const projectId = process.env.FIREBASE_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
      let privateKey = process.env.FIREBASE_PRIVATE_KEY;
      
      console.log(`Project ID: ${projectId ? 'Found' : 'Missing'}`);
      console.log(`Client Email: ${clientEmail ? 'Found' : 'Missing'}`);
      console.log(`Private Key: ${privateKey ? 'Found' : 'Missing'}`);
      
      // Handle private key with special care - it may have quotes or need replacements
      if (privateKey) {
        // If the key has quotes, remove them
        if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
          privateKey = privateKey.slice(1, -1);
        }
        
        // Replace literal \n with actual newlines
        privateKey = privateKey.replace(/\\n/g, '\n');
      }
      
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      
      return true;
    }
    return true;
  } catch (error) {
    console.error("Firebase admin initialization error:", error);
    return false;
  }
};

// Initialize SendGrid
const initializeSendGrid = () => {
  const apiKey = process.env.VITE_SENDGRID_API_KEY || process.env.SENDGRID_API_KEY;
  if (apiKey) {
    sgMail.setApiKey(apiKey);
    console.log("SendGrid API key found and configured");
    return true;
  } else {
    console.warn("SendGrid API key is missing");
    return false;
  }
};

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,OPTIONS,PATCH,DELETE,POST,PUT'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Return early for OPTIONS requests (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    // Initialize Firebase and SendGrid
    const firebaseInitialized = initializeFirebase();
    const sendgridInitialized = initializeSendGrid();
    
    if (!firebaseInitialized) {
      return res.status(500).json({
        success: false,
        message: "Failed to initialize Firebase",
      });
    }

    if (!sendgridInitialized) {
      return res.status(500).json({
        success: false,
        message: "Failed to initialize email service",
      });
    }
    
    // Check for API key in both request body and headers for flexibility
    const apiKey = req.body?.apiKey || req.headers['x-api-key'];
    
    // Verify authorization
    if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized. Invalid or missing API key.",
      });
    }

    const db = admin.firestore();

    // Get active subscribers who are due for an email
    const now = new Date();
    const subscribersSnapshot = await db
      .collection("subscribers")
      .where("isActive", "==", true)
      .where("nextEmailDate", "<=", now)
      .where("completedSequence", "==", false)
      .get();

    if (subscribersSnapshot.empty) {
      return res.status(200).json({
        success: true,
        message: "No subscribers due for emails today",
        processed: 0,
      });
    }

    console.log(`Found ${subscribersSnapshot.size} subscribers due for emails`);

    let successCount = 0;
    let errorCount = 0;

    // Process each subscriber
    for (const doc of subscribersSnapshot.docs) {
      const subscriber = { id: doc.id, ...doc.data() } as any;
      const currentDay = subscriber.currentDay !== undefined ? subscriber.currentDay : 0;
      const nextDay = currentDay + 1;
      
      // Get the content for this day
      const tipContent = await getDailyTipContent(nextDay);
      
      if (!tipContent) {
        console.error(`No content found for day ${nextDay}`);
        
        if (nextDay > 30) {
          // Mark as completed if we've gone through all 30 days
          await doc.ref.update({
            completedSequence: true,
          });
        }
        
        continue;
      }

      try {
        // Send the email
        const msg = {
          to: subscriber.email,
          from: 'keshavjhagithub@gmail.com', // Use your verified sender email
          subject: `Day ${nextDay}: ${tipContent.subject} - 30 Days of Python`,
          html: `
            <h2>Day ${nextDay}: ${tipContent.subject}</h2>
            <div>${tipContent.content}</div>
            <hr>
            <p><small>You're receiving this because you subscribed to 30 Days of Python. 
            If you'd like to unsubscribe, click <a href="https://30daysofpython.vercel.app/unsubscribe?email=${subscriber.email}">here</a>.</small></p>
          `
        };

        await sgMail.send(msg);
        console.log(`Sent day ${nextDay} email to ${subscriber.email}`);
        
        // Update the subscriber's info
        const nextEmailDate = new Date();
        nextEmailDate.setDate(now.getDate() + 1); // Send the next tip tomorrow
        
        await doc.ref.update({
          currentDay: nextDay,
          nextEmailDate: nextEmailDate,
          completedSequence: nextDay >= 30 // Mark as completed if this was day 30
        });
        
        successCount++;
      } catch (error) {
        console.error(`Error sending email to ${subscriber.email}:`, error);
        errorCount++;
      }
    }

    return res.status(200).json({
      success: true,
      message: `Processed ${subscribersSnapshot.size} subscribers`,
      stats: {
        total: subscribersSnapshot.size,
        success: successCount,
        errors: errorCount
      }
    });
  } catch (error) {
    console.error('Error in process-daily-tips handler:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Server error occurred',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}