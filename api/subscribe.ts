import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getApp, getApps, initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue, Timestamp } from 'firebase-admin/firestore';
import sgMail from '@sendgrid/mail';

// Properly handle Firebase initialization
const initializeFirebase = () => {
  try {
    if (!getApps().length) {
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
      
      initializeApp({
        credential: cert({
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS headers for all requests
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
  
  // Make sure we're dealing with a POST request
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }
  
  console.log('Received subscription request:', req.body);

  try {
    // Extract email from request body
    const { email } = req.body;
    
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address'
      });
    }
    
    // Initialize Firebase
    const firebaseInitialized = initializeFirebase();
    const sendgridInitialized = initializeSendGrid();
    
    if (!firebaseInitialized) {
      console.log('Using fallback mode - Firebase not initialized');
      return res.status(200).json({
        success: true,
        message: 'Subscription received (database not available)',
        email: email,
        mode: 'fallback'
      });
    }
    
    const db = getFirestore();
    
    // Check if email already exists
    const existingSubscriber = await db
      .collection("subscribers")
      .where("email", "==", email)
      .get();

    if (!existingSubscriber.empty) {
      return res.status(409).json({
        success: false,
        message: "Email already subscribed",
      });
    }

    // Add the new subscriber to the database
    const now = new Date();
    const nextEmailDate = new Date(now);
    nextEmailDate.setDate(now.getDate() + 1);

    await db.collection("subscribers").add({
      email,
      subscriptionDate: FieldValue.serverTimestamp(),
      isActive: true,
      currentDay: 0,
      nextEmailDate: nextEmailDate,
      completedSequence: false
    });
    
    // Try to send a welcome email if SendGrid is initialized
    if (sendgridInitialized) {
      try {
        const msg = {
          to: email,
          from: 'keshavjhagithub@gmail.com',
          subject: 'Welcome to 30 Days of Python!',
          html: `
            <h1>Welcome to 30 Days of Python!</h1>
            <p>Hi there,</p>
            <p>Thank you for subscribing to our 30 Days of Python challenge!</p>
            <p>Happy coding!</p>
            <p>Keshav Kumar Jha</p>
            <p><small>If you didn't subscribe to this service, please ignore this email.</small></p>
          `
        };
        
        await sgMail.send(msg);
        console.log(`Welcome email sent successfully to ${email}`);
        
        return res.status(200).json({
          success: true,
          message: 'Subscription successful! Welcome email sent.',
          email: email
        });
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        
        return res.status(200).json({
          success: true,
          message: 'Subscription successful, but there was an issue sending the welcome email.',
          email: email
        });
      }
    } else {
      return res.status(200).json({
        success: true,
        message: 'Subscription successful! (Email sending not configured)',
        email: email
      });
    }
  } catch (error) {
    console.error('Error in subscription handler:', error);
    
    // Send a proper JSON response even on error
    return res.status(500).json({
      success: false,
      message: 'Server error occurred',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}