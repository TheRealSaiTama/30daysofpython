import sgMail from "@sendgrid/mail";
import { getTipForDay, DailyTip } from "./daily-tips-content";

let SENDGRID_API_KEY: string;

if (typeof import.meta !== 'undefined') {
  SENDGRID_API_KEY = import.meta.env.VITE_SENDGRID_API_KEY || "";
} 
else if (typeof process !== 'undefined') {
  SENDGRID_API_KEY = process.env.VITE_SENDGRID_API_KEY || "";
}

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

export const welcomeEmailTemplate = (email: string): string => `
  <h1>Welcome to 30 Days of Python!</h1>
  <p>Hi there,</p>
  <p>Thank you for subscribing to our 30 Days of Python challenge!</p>
  <p>Over the next 30 days, you'll receive daily Python tips, tricks, and mini-projects to help you build your skills. Your first tip will arrive tomorrow!</p>
  <p>Happy coding!</p>
  <p>The Python30 Team</p>
  <p><small>If you didn't subscribe to this service, please ignore this email.</small></p>
`;

export const dailyTipEmailTemplate = (email: string, tip: DailyTip): string => `
  ${tip.content}
  <hr>
  <p><small>You're receiving this because you subscribed to 30 Days of Python. 
  Day ${tip.day} of 30.</small></p>
  <p><small>If you'd like to unsubscribe, click <a href="https://yoursite.com/unsubscribe?email=${email}">here</a>.</small></p>
`;

export const verifyEmailConnection = async (): Promise<boolean> => {
  try {
    if (!SENDGRID_API_KEY) {
      console.error("SendGrid API key is not set");
      return false;
    }

    await sgMail.request({
      method: 'GET',
      url: '/v3/scopes',
    });
    
    console.log("SendGrid connection verified successfully");
    return true;
  } catch (error) {
    console.error("SendGrid connection verification failed:", error);
    return false;
  }
};

export const sendWelcomeEmail = async (email: string): Promise<boolean> => {
  try {
    if (!SENDGRID_API_KEY) {
      console.error("SendGrid API key is not set");
      return false;
    }

    const msg = {
      to: email,
      from: "keshavjhagithub@gmail.com",
      subject: "Welcome to 30 Days of Python!",
      html: welcomeEmailTemplate(email),
    };

    await sgMail.send(msg);
    console.log(`Welcome email sent successfully to ${email}`);
    return true;
  } catch (error) {
    console.error("Failed to send welcome email:", error);
    return false;
  }
};

export const sendDailyTipEmail = async (email: string, day: number): Promise<boolean> => {
  try {
    if (!SENDGRID_API_KEY) {
      console.error("SendGrid API key is not set");
      return false;
    }

    const tip = getTipForDay(day);
    if (!tip) {
      console.error(`No content found for day ${day}`);
      return false;
    }

    const msg = {
      to: email,
      from: "keshavjhagithub@gmail.com",
      subject: `Day ${day}: ${tip.subject} - 30 Days of Python`,
      html: dailyTipEmailTemplate(email, tip),
    };

    await sgMail.send(msg);
    console.log(`Day ${day} email sent successfully to ${email}`);
    return true;
  } catch (error) {
    console.error(`Failed to send day ${day} email:`, error);
    return false;
  }
};
