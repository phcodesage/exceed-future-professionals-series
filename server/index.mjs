import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.warn('MONGODB_URI is not set. Please add it to your .env file.');
}

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_SERVER,
  port: process.env.MAIL_PORT,
  secure: process.env.MAIL_USE_SSL === 'True',
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

// Verify email configuration
transporter.verify((error, success) => {
  if (error) {
    console.warn('Email configuration error:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

app.use(cors());
app.use(express.json());

const waitlistEntrySchema = new mongoose.Schema(
  {
    parentName: { type: String, required: true },
    childName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    gradeLevel: { type: String, required: true },
    programInterests: { type: [String], default: [] },
    interests: { type: String },
  },
  { timestamps: true },
);

const WaitlistEntry = mongoose.model('WaitlistEntry', waitlistEntrySchema);

app.post('/api/waitlist', async (req, res) => {
  try {
    const { parentName, childName, email, phone, gradeLevel, programInterests, interests } = req.body;

    if (!parentName || !childName || !email || !phone || !gradeLevel) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    const entry = new WaitlistEntry({
      parentName,
      childName,
      email,
      phone,
      gradeLevel,
      programInterests: Array.isArray(programInterests) ? programInterests : [],
      interests: interests || '',
    });

    await entry.save();

    // Send email notification
    try {
      const mailOptions = {
        from: process.env.MAIL_DEFAULT_SENDER || process.env.MAIL_USERNAME,
        to: process.env.MAIL_RECEIVER,
        subject: 'New Waitlist Entry - Exceed Future Professionals Series',
        html: `
          <h2>New Waitlist Entry Received</h2>
          <p><strong>Parent Name:</strong> ${parentName}</p>
          <p><strong>Child Name:</strong> ${childName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Grade Level:</strong> ${gradeLevel}</p>
          <p><strong>Program Interests:</strong> ${programInterests.length > 0 ? programInterests.join(', ') : 'None specified'}</p>
          <p><strong>Additional Interests:</strong> ${interests || 'None specified'}</p>
          <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log('Notification email sent successfully');
    } catch (emailError) {
      console.error('Failed to send notification email:', emailError);
    }

    return res.status(201).json({ message: 'Waitlist entry saved.' });
  } catch (error) {
    console.error('Error saving waitlist entry', error);
    return res.status(500).json({ message: 'Something went wrong.' });
  }
});

app.get('/api/waitlist', async (_req, res) => {
  try {
    const entries = await WaitlistEntry.find().sort({ createdAt: -1 });
    return res.json(entries);
  } catch (error) {
    console.error('Error fetching waitlist entries', error);
    return res.status(500).json({ message: 'Something went wrong.' });
  }
});

async function start() {
  try {
    if (!MONGODB_URI) {
      console.error('Cannot start server without MONGODB_URI.');
      process.exit(1);
    }

    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
}

start();
