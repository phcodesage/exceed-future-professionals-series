import type { NextApiRequest, NextApiResponse } from 'next';
import mailchimp from '@mailchimp/mailchimp_marketing';
import { connectDB, WaitlistEntry } from '../../lib/db';

const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
const MAILCHIMP_SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX;
const MAILCHIMP_AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;

if (MAILCHIMP_API_KEY && MAILCHIMP_SERVER_PREFIX) {
  mailchimp.setConfig({
    apiKey: MAILCHIMP_API_KEY,
    server: MAILCHIMP_SERVER_PREFIX,
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { parentName, childName, email, phone, gradeLevel, programInterests, interests } = req.body;

    if (!parentName || !childName || !email || !phone || !gradeLevel) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    await connectDB();

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

    if (MAILCHIMP_API_KEY && MAILCHIMP_AUDIENCE_ID) {
      try {
        const [firstName, ...lastNameParts] = parentName.split(' ');
        const lastName = lastNameParts.join(' ') || '';

        const memberData: any = {
          email_address: email,
          status: 'subscribed',
          tags: ['Exceed-Website-Signup'],
          merge_fields: {
            FNAME: firstName,
            LNAME: lastName,
            PHONE: phone,
          },
        };

        await (mailchimp.lists as any).addListMember(MAILCHIMP_AUDIENCE_ID, memberData);
      } catch (error) {
        console.error('Mailchimp addListMember failed:', error);
      }
    }

    return res.status(201).json({ message: 'Waitlist entry saved.' });
  } catch (error) {
    console.error('Error saving waitlist entry', error);
    return res.status(500).json({ message: 'Something went wrong.' });
  }
}
