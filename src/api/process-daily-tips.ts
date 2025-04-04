import { Request, Response } from "express";
import { getActiveSubscribersDueForEmail, updateSubscriberAfterEmailSent } from "../lib/firebase-service";
import { sendDailyTipEmail } from "../lib/email-service";

export const handler = async (req: Request, res: Response) => {
  try {
    // Check for API key in both request body and headers for flexibility
    const apiKey = req.body?.apiKey || req.headers['x-api-key'];
    
    // Verify authorization
    if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized. Invalid or missing API key.",
      });
    }

    // Get subscribers who need an email today
    const subscribersDueForEmail = await getActiveSubscribersDueForEmail();
    
    if (subscribersDueForEmail.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No subscribers due for emails today",
        processed: 0,
      });
    }

    // Process each subscriber
    let successCount = 0;
    let failureCount = 0;
    const errors: string[] = [];

    for (const subscriber of subscribersDueForEmail) {
      const nextDay = subscriber.currentDay + 1;
      
      // Skip if they've completed the sequence
      if (nextDay > 30) {
        continue;
      }

      // Send the email for the next day
      const emailSent = await sendDailyTipEmail(subscriber.email, nextDay);
      
      if (emailSent) {
        // Update subscriber record with id from the subscriber object
        await updateSubscriberAfterEmailSent(subscriber.id, subscriber.currentDay);
        successCount++;
      } else {
        failureCount++;
        errors.push(`Failed to send email to ${subscriber.email} for day ${nextDay}`);
      }
    }

    return res.status(200).json({
      success: true,
      message: `Processed ${successCount + failureCount} subscribers`,
      results: {
        success: successCount,
        failure: failureCount,
        errors: errors.length > 0 ? errors : undefined,
      },
    });
  } catch (error) {
    console.error("Error processing daily tips:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while processing daily tips",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};