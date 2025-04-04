import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sgMail from '@sendgrid/mail';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sendgridEnvPath = path.join(__dirname, 'sendgrid.env');
if (fs.existsSync(sendgridEnvPath)) {
  try {
    const sendgridEnvContent = fs.readFileSync(sendgridEnvPath, 'utf-8');
    const sendgridEnv = dotenv.parse(sendgridEnvContent);
    for (const key in sendgridEnv) {
      process.env[key] = sendgridEnv[key];
    }
    console.log("SendGrid environment variables loaded successfully");
  } catch (error) {
    console.error("Error loading SendGrid environment variables:", error);
  }
}

const SENDGRID_API_KEY = process.env.VITE_SENDGRID_API_KEY;
if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
  console.log("SendGrid API Key configured successfully");
} else {
  console.warn("SendGrid API Key is missing!");
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ['http://localhost:8080', 'http://127.0.0.1:8080'],
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running correctly!' });
});

app.post('/api/subscribe', async (req, res) => {
  console.log('Received subscription request:', req.body);
  
  try {
    const { email } = req.body;
    
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address'
      });
    }
    
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
      message: 'Server error occurred'
    });
  }
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Test the API with: http://localhost:${PORT}/api/test`);
});
