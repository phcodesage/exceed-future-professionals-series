import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import { connectDB, ExperienceRegistration } from './_lib/db';
import { setCorsHeaders } from './_lib/cors';

const RESEND_API_KEY = process.env.RESEND_API_KEY;

// Initialize Resend
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

// Admin recipients for notifications
const adminRecipients = [
    'Info@exceedlearningcenterny.com',
    'olganyc21@gmail.com',
    'phcodesage@gmail.com',
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Handle CORS
    if (setCorsHeaders(req, res)) {
        return;
    }

    // Only accept POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { fullName, emailOrContact, selectedDate, selectedTime } = req.body;

        // Validate required fields
        if (!fullName || !emailOrContact || !selectedDate || !selectedTime) {
            return res.status(400).json({ message: 'Missing required fields.' });
        }

        // Connect to database
        await connectDB();

        // Create new registration entry
        const registration = new ExperienceRegistration({
            fullName,
            emailOrContact,
            selectedDate,
            selectedTime,
        });

        await registration.save();
        console.log(`Experience registration saved for ${fullName}`);

        // Send email notification to admins
        if (resend) {
            try {
                await resend.emails.send({
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
                                        This registration is for the FREE Future Professionals experience where kids can explore what it means to be a Future Doctor or Dentist!
                                    </p>
                                </div>
                            </div>
                            <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
                                <p>Exceed Learning Center NY - Future Professionals Series</p>
                            </div>
                        </div>
                    `,
                });
                console.log(`Email notification sent to admins for ${fullName}`);
            } catch (emailError) {
                console.error('Error sending email:', emailError);
                // Don't fail the request if email fails - the registration was saved
            }
        } else {
            console.warn('Resend not configured - skipping email notification');
        }

        return res.status(201).json({ message: 'Registration successful!' });
    } catch (error) {
        console.error('Error saving experience registration', error);
        return res.status(500).json({ message: 'Something went wrong.' });
    }
}
