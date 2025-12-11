import type { VercelRequest, VercelResponse } from '@vercel/node';
import mailchimp from '@mailchimp/mailchimp_marketing';
import { setCorsHeaders } from '../_lib/cors';
import { verifyToken } from '../_lib/auth';

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

    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    // Verify JWT token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded) {
        return res.status(401).json({ message: 'Invalid token' });
    }

    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        if (!MAILCHIMP_API_KEY || !MAILCHIMP_AUDIENCE_ID) {
            return res.status(500).json({ message: 'Mailchimp not configured' });
        }

        // Get subscriber hash for the email
        const crypto = require('crypto');
        const subscriberHash = crypto
            .createHash('md5')
            .update(email.toLowerCase())
            .digest('hex');

        // Get current member info
        const member = await mailchimp.lists.getListMember(
            MAILCHIMP_AUDIENCE_ID,
            subscriberHash
        );

        if (!member) {
            return res.status(404).json({ message: 'Member not found in Mailchimp' });
        }

        // Step 1: Temporarily unsubscribe
        await mailchimp.lists.updateListMember(
            MAILCHIMP_AUDIENCE_ID,
            subscriberHash,
            {
                status: 'unsubscribed',
            }
        );
        console.log(`Temporarily unsubscribed ${email}`);

        // Step 2: Re-subscribe to trigger automation
        await mailchimp.lists.updateListMember(
            MAILCHIMP_AUDIENCE_ID,
            subscriberHash,
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: member.merge_fields,
            }
        );
        console.log(`Re-subscribed ${email} - welcome automation triggered`);

        return res.status(200).json({
            message: 'Welcome email re-triggered successfully',
            email
        });
    } catch (error: any) {
        console.error('Error re-triggering welcome email:', error);
        return res.status(500).json({
            message: 'Failed to re-trigger welcome email',
            error: error.response ? error.response.body : error.message
        });
    }
}
