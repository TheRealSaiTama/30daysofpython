import { VercelRequest, VercelResponse } from '@vercel/node';
import admin from "firebase-admin";
import sgMail from "@sendgrid/mail";

// Initialize Firebase if it hasn't been initialized
try {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
  }
} catch (error) {
  console.error("Firebase admin initialization error:", error);
}

const db = admin.firestore();

// Configure SendGrid
const SENDGRID_API_KEY = process.env.VITE_SENDGRID_API_KEY || "";
if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
  console.log("SendGrid API Key configured successfully");
} else {
  console.warn("SendGrid API Key is missing!");
}

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
  
  // Make sure we're dealing with a POST request
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }
  
  console.log('Received subscription request:', req.body);
  
  try {
    const { email } = req.body;
    
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address'
      });
    }
    
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
      subscriptionDate: admin.firestore.FieldValue.serverTimestamp(),
      isActive: true,
      currentDay: 0,
      nextEmailDate: nextEmailDate,
      completedSequence: false
    });

    // Try to send a welcome email
    try {
      const msg = {
        to: email,
        from: 'keshavjhagithub@gmail.com', // Use your verified sender
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
        message: 'Subscription successful! Welcome email sent.'
      });
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      
      return res.status(200).json({
        success: true,
        message: 'Subscription successful, but there was an issue sending the welcome email.'
      });
    }
  } catch (error) {
    console.error('Error in subscription handler:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Server error occurred',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}