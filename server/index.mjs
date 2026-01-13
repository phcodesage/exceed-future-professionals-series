import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import mailchimp from '@mailchimp/mailchimp_marketing';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;
const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
const MAILCHIMP_SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX;
const MAILCHIMP_AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;

if (MAILCHIMP_API_KEY && MAILCHIMP_SERVER_PREFIX) {
  mailchimp.setConfig({
    apiKey: MAILCHIMP_API_KEY,
    server: MAILCHIMP_SERVER_PREFIX,
  });
} else {
  console.warn('Mailchimp credentials not found. Mailchimp integration disabled.');
}

if (!MONGODB_URI) {
  console.warn('MONGODB_URI is not set. Please add it to your .env file.');
}

if (!ADMIN_USERNAME || !ADMIN_PASSWORD || !JWT_SECRET) {
  console.warn('Admin credentials or JWT_SECRET are not fully set. Admin routes will be unavailable.');
}

// Email sending is currently disabled; waitlist entries are managed via the admin dashboard.

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  'https://exceed-future-professionals-series.vercel.app',
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.options('*', cors());
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

function requireAdmin(req, res, next) {
  if (!JWT_SECRET) {
    return res.status(503).json({ message: 'Admin authentication is not configured.' });
  }

  const authHeader = req.headers.authorization || '';
  const [, token] = authHeader.split(' ');

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.admin = payload;
    return next();
  } catch {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

app.post('/api/admin/login', (req, res) => {
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD || !JWT_SECRET) {
    return res.status(503).json({ message: 'Admin authentication is not configured.' });
  }

  const { username, password } = req.body || {};

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '7d' });
  return res.json({ token });
});

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

    // Add to Mailchimp
    if (MAILCHIMP_API_KEY && MAILCHIMP_AUDIENCE_ID) {
      try {
        const [firstName, ...lastNameParts] = parentName.split(' ');
        const lastName = lastNameParts.join(' ') || '';

        await mailchimp.lists.addListMember(MAILCHIMP_AUDIENCE_ID, {
          email_address: email,
          status: 'subscribed',
          tags: ['Exceed-Website-Signup'],
          merge_fields: {
            FNAME: firstName,
            LNAME: lastName,
            PHONE: phone,
          },
        });
        console.log(`Added ${email} to Mailchimp.`);
      } catch (mcError) {
        console.error('Error adding to Mailchimp:', mcError.response ? mcError.response.body : mcError);
        // Do not fail the request if Mailchimp fails, as the DB save was successful
      }
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

app.get('/api/admin/waitlist', requireAdmin, async (_req, res) => {
  try {
    const entries = await WaitlistEntry.find().sort({ createdAt: -1 });
    return res.json(entries);
  } catch (error) {
    console.error('Error fetching admin waitlist entries', error);
    return res.status(500).json({ message: 'Something went wrong.' });
  }
});

app.get('/api/admin/experience-registrations', requireAdmin, async (_req, res) => {
  try {
    const registrations = await ExperienceRegistration.find().sort({ createdAt: -1 });
    return res.json(registrations);
  } catch (error) {
    console.error('Error fetching admin experience registrations', error);
    return res.status(500).json({ message: 'Something went wrong.' });
  }
});

// Experience Registration Schema and Route
const experienceRegistrationSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    emailOrContact: { type: String, required: true },
    selectedDate: { type: String, required: true },
    selectedTime: { type: String, required: true },
  },
  { timestamps: true },
);

const ExperienceRegistration = mongoose.model('ExperienceRegistration', experienceRegistrationSchema);

const RESEND_API_KEY = process.env.RESEND_API_KEY;

const adminRecipients = [
  'Info@exceedlearningcenterny.com',
  'olganyc21@gmail.com',
  'phcodesage@gmail.com',
];

app.post('/api/experience-registration', async (req, res) => {
  try {
    const { fullName, emailOrContact, selectedDate, selectedTime } = req.body;

    if (!fullName || !emailOrContact || !selectedDate || !selectedTime) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    const registration = new ExperienceRegistration({
      fullName,
      emailOrContact,
      selectedDate,
      selectedTime,
    });

    await registration.save();
    console.log(`Experience registration saved for ${fullName}`);

    // Send email notification to admins using Resend
    if (RESEND_API_KEY) {
      try {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Exceed Future Professionals <noreply@swe-rech.site>',
            to: adminRecipients,
            subject: `🎉 New Experience Day Registration - ${selectedDate}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #ca3433, #e85653); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
                  <h1 style="color: white; margin: 0; font-size: 24px;">✨ New Experience Day Registration</h1>
                </div>
                <div style="background: #fff; padding: 30px; border: 1px solid #eee; border-radius: 0 0 12px 12px;">
                  <h2 style="color: #0e1f3e; margin-top: 0;">Registration Details</h2>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 12px; border-bottom: 1px solid #eee; color: #666;"><strong>Full Name:</strong></td>
                      <td style="padding: 12px; border-bottom: 1px solid #eee; color: #0e1f3e;">${fullName}</td>
                    </tr>
                    <tr>
                      <td style="padding: 12px; border-bottom: 1px solid #eee; color: #666;"><strong>Email/Contact:</strong></td>
                      <td style="padding: 12px; border-bottom: 1px solid #eee; color: #0e1f3e;">${emailOrContact}</td>
                    </tr>
                    <tr>
                      <td style="padding: 12px; border-bottom: 1px solid #eee; color: #666;"><strong>Selected Date:</strong></td>
                      <td style="padding: 12px; border-bottom: 1px solid #eee; color: #ca3433; font-weight: bold;">${selectedDate}</td>
                    </tr>
                    <tr>
                      <td style="padding: 12px; color: #666;"><strong>Selected Time:</strong></td>
                      <td style="padding: 12px; color: #ca3433; font-weight: bold;">${selectedTime}</td>
                    </tr>
                  </table>
                  <div style="margin-top: 20px; padding: 15px; background: #fff7e5; border-radius: 8px; border-left: 4px solid #ca3433;">
                    <p style="margin: 0; color: #0e1f3e;">
                      <strong>60-Minute Experience Day</strong><br>
                      This registration is for the FREE Future Professionals experience!
                    </p>
                  </div>
                </div>
              </div>
            `,
          }),
        });

        if (response.ok) {
          console.log(`Email notification sent to admins for ${fullName}`);
        } else {
          console.error('Error sending email:', await response.text());
        }
      } catch (emailError) {
        console.error('Error sending email:', emailError);
      }
    } else {
      console.warn('RESEND_API_KEY not configured - skipping email notification');
    }

    return res.status(201).json({ message: 'Registration successful!' });
  } catch (error) {
    console.error('Error saving experience registration', error);
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
