import { Request, Response } from "express";
import admin from "firebase-admin";
import sgMail from "@sendgrid/mail";

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

const SENDGRID_API_KEY = process.env.VITE_SENDGRID_API_KEY || "";
if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

export const handler = async (req: Request, res: Response) => {
  try {
    const { apiKey } = req.body;
    
    if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized. Invalid or missing API key.",
      });
    }

    const { day, subject, content } = req.body;

    if (!day || !subject || !content) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: day, subject, and content are all required",
      });
    }

    const subscribersSnapshot = await db
      .collection("subscribers")
      .where("isActive", "==", true)
      .get();

    if (subscribersSnapshot.empty) {
      return res.status(404).json({
        success: false,
        message: "No active subscribers found",
      });
    }

    const emailSubject = `Day ${day}: ${subject} - 30 Days of Python`;
    const emailContent = `
      <h2>Day ${day}: ${subject}</h2>
      <div>${content}</div>
      <hr>
      <p><small>You're receiving this because you subscribed to 30 Days of Python. 
      If you'd like to unsubscribe, click <a href="https://yoursite.com/unsubscribe?email={{email}}">here</a>.</small></p>
    `;

    const emails = subscribersSnapshot.docs.map((doc) => doc.data().email);
    const messages = emails.map((email) => ({
      to: email,
      from: "keshavjhagithub@gmail.com",
      subject: emailSubject,
      html: emailContent.replace("{{email}}", email),
    }));

    const response = await sgMail.send(messages);
    
    return res.status(200).json({
      success: true,
      message: `Daily tips for day ${day} sent to ${emails.length} subscribers`,
      emails: emails.length,
    });
  } catch (error) {
    console.error("Error sending daily tips:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while sending daily tips",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
