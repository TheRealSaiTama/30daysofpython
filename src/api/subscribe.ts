import { Request, Response } from "express";
import admin from "firebase-admin";
import { sendWelcomeEmail } from "../lib/email-service";

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

export const handler = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address",
      });
    }

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

    const emailSent = await sendWelcomeEmail(email);

    if (!emailSent) {
      console.warn(`Welcome email could not be sent to ${email}, but subscription was successful`);
    } else {
      console.log(`Welcome email sent successfully to ${email}`);
    }

    return res.status(200).json({
      success: true,
      message: emailSent
        ? "Subscription successful! Welcome email sent."
        : "Subscription successful, but there was an issue sending the welcome email.",
    });
  } catch (error) {
    console.error("Error in subscribe handler:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while processing subscription",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
