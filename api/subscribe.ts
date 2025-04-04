import { VercelRequest, VercelResponse } from '@vercel/node';
import admin from "firebase-admin";
import sgMail from "@sendgrid/mail";
import { Firestore } from 'firebase-admin/firestore';

// Enable better error logging
console.log('Starting subscribe API endpoint');

// Check for environment variables first
if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
  console.error("Firebase environment variables are missing");
}

// Initialize Firebase if it hasn't been initialized
try {
  if (!admin.apps.length) {
    console.log('Initializing Firebase Admin SDK');
    const firebaseCreds = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Handle potential double-escaped newlines in the private key
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")
    };
    
    console.log(`Project ID: ${firebaseCreds.projectId ? '[SET]' : '[MISSING]'}`);
    console.log(`Client Email: ${firebaseCreds.clientEmail ? '[SET]' : '[MISSING]'}`);
    console.log(`Private Key: ${firebaseCreds.privateKey ? '[SET]' : '[MISSING]'}`);
    
    admin.initializeApp({
      credential: admin.credential.cert(firebaseCreds),
    });
    console.log('Firebase Admin SDK initialized successfully');
  }
} catch (error) {
  console.error("Firebase admin initialization error:", error);
}

// Configure SendGrid
const SENDGRID_API_KEY = process.env.VITE_SENDGRID_API_KEY || process.env.SENDGRID_API_KEY || "";
if (SENDGRID_API_KEY) {
  try {
    sgMail.setApiKey(SENDGRID_API_KEY);
    console.log("SendGrid API Key configured successfully");
  } catch (error) {
    console.error("Error configuring SendGrid:", error);
  }
} else {
  console.warn("SendGrid API Key is missing!");
}

// Initialize Firestore safely
let db: Firestore;
try {
  db = admin.firestore();
} catch (error) {
  console.error("Failed to initialize Firestore:", error);
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  console.log(`Processing ${req.method} request to /api/subscribe`);
  
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
    console.log('Responding to OPTIONS request');
    return res.status(200).end();
  }
  
  // Make sure we're dealing with a POST request
  if (req.method !== 'POST') {
    console.log(`Method ${req.method} not allowed`);
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }
  
  console.log('Received subscription request body:', JSON.stringify(req.body));
  
  try {
    // Check if db was initialized properly
    if (!db) {
      throw new Error("Database not initialized");
    }
    
    // Extract and validate email
    const { email } = req.body;
    
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      console.log(`Invalid email: ${email}`);
      return res.status(400).json({
        success: false,
        message: 'Invalid email address'
      });
    }
    
    console.log(`Checking if email ${email} already exists`);
    
    try {
      // Check if email already exists
      const existingSubscriber = await db
        .collection("subscribers")
        .where("email", "==", email)
        .get();

      if (!existingSubscriber.empty) {
        console.log(`Email ${email} already subscribed`);
        return res.status(409).json({
          success: false,
          message: "Email already subscribed",
        });
      }
      
      console.log(`Adding new subscriber: ${email}`);
      
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
      
      console.log(`Subscriber ${email} added successfully`);

      // Try to send a welcome email if SendGrid is configured
      if (SENDGRID_API_KEY) {
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
      } else {
        console.log('SendGrid API key not configured, skipping welcome email');
        return res.status(200).json({
          success: true,
          message: 'Subscription successful! (Email sending not configured)'
        });
      }
    } catch (dbError) {
      console.error('Database operation error:', dbError);
      throw new Error(`Database error: ${dbError.message}`);
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