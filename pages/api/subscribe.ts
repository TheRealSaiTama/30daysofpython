import { NextApiRequest, NextApiResponse } from "next";
import admin from "firebase-admin";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

dotenv.config();

const sendgridEnvPath = path.join(process.cwd(), 'sendgrid.env');
if (fs.existsSync(sendgridEnvPath)) {
  const sendgridEnv = dotenv.parse(fs.readFileSync(sendgridEnvPath));
  for (const key in sendgridEnv) {
    process.env[key] = sendgridEnv[key];
  }
}

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

import { sendWelcomeEmail } from "../../src/lib/email-service";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader("Content-Type", "application/json");

  try {
    if (req.method !== "POST") {
      return res.status(405).json({
        success: false,
        message: "Method not allowed",
      });
    }

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

    await db.collection("subscribers").add({
      email,
      subscriptionDate: admin.firestore.FieldValue.serverTimestamp(),
      isActive: true,
    });

    const emailSent = await sendWelcomeEmail(email);

    if (!emailSent) {
      console.warn("Failed to send welcome email, but subscription was successful");
    }

    return res.status(200).json({
      success: true,
      message: emailSent 
        ? "Subscription successful! Welcome email sent." 
        : "Subscription successful, but there was an issue sending the welcome email.",
    });
  } catch (error) {
    console.error("Error handling subscription:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
