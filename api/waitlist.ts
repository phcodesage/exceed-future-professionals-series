import type { VercelRequest, VercelResponse } from '@vercel/node';
import mailchimp from '@mailchimp/mailchimp_marketing';
import { connectDB, WaitlistEntry } from './_lib/db';
import { setCorsHeaders } from './_lib/cors';

const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
const MAILCHIMP_SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX;
const MAILCHIMP_AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;

// Configure Mailchimp
if (MAILCHIMP_API_KEY && MAILCHIMP_SERVER_PREFIX) {
    mailchimp.setConfig({
        apiKey: MAILCHIMP_API_KEY,
        server: MAILCHIMP_SERVER_PREFIX,
    });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Handle CORS
    if (setCorsHeaders(req, res)) {
        return;
    }

    // Handle GET request - fetch all waitlist entries
    if (req.method === 'GET') {
        try {
            await connectDB();
            const entries = await WaitlistEntry.find().sort({ createdAt: -1 });
            return res.status(200).json(entries);
        } catch (error) {
            console.error('Error fetching waitlist entries', error);
            return res.status(500).json({ message: 'Something went wrong.' });
        }
    }

    // Handle POST request - create new waitlist entry
    if (req.method === 'POST') {
        try {
            const { parentName, childName, email, phone, gradeLevel, programInterests, interests } =
                req.body;

            // Validate required fields
            if (!parentName || !childName || !email || !phone || !gradeLevel) {
                return res.status(400).json({ message: 'Missing required fields.' });
            }

            // Connect to database
            await connectDB();

            // Create new entry
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
                } catch (mcError: any) {
                    console.error(
                        'Error adding to Mailchimp:',
                        mcError.response ? mcError.response.body : mcError
                    );
                    // Do not fail the request if Mailchimp fails, as the DB save was successful
                }
            }

            return res.status(201).json({ message: 'Waitlist entry saved.' });
        } catch (error) {
            console.error('Error saving waitlist entry', error);
            return res.status(500).json({ message: 'Something went wrong.' });
        }
    }

    // Method not allowed
    return res.status(405).json({ message: 'Method not allowed' });
}
