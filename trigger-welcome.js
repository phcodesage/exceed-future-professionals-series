// Script to manually trigger welcome email for existing Mailchimp members
// Usage: node trigger-welcome.js <email>

import 'dotenv/config';
import mailchimp from '@mailchimp/mailchimp_marketing';
import crypto from 'crypto';

const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
const MAILCHIMP_SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX;
const MAILCHIMP_AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;

// Configure Mailchimp
mailchimp.setConfig({
    apiKey: MAILCHIMP_API_KEY,
    server: MAILCHIMP_SERVER_PREFIX,
});

async function triggerWelcomeEmail(email) {
    try {
        console.log(`\n🔄 Re-triggering welcome email for: ${email}\n`);

        // Get subscriber hash
        const subscriberHash = crypto
            .createHash('md5')
            .update(email.toLowerCase())
            .digest('hex');

        // Get current member info
        console.log('📋 Fetching member info...');
        const member = await mailchimp.lists.getListMember(
            MAILCHIMP_AUDIENCE_ID,
            subscriberHash
        );

        console.log(`✓ Found member: ${member.merge_fields.FNAME} ${member.merge_fields.LNAME}`);
        console.log(`  Current status: ${member.status}`);

        // Step 1: Temporarily unsubscribe
        console.log('\n⏸️  Temporarily unsubscribing...');
        await mailchimp.lists.updateListMember(
            MAILCHIMP_AUDIENCE_ID,
            subscriberHash,
            {
                status: 'unsubscribed',
            }
        );
        console.log('✓ Unsubscribed');

        // Wait a moment
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Step 2: Re-subscribe to trigger automation
        console.log('\n▶️  Re-subscribing to trigger automation...');
        await mailchimp.lists.updateListMember(
            MAILCHIMP_AUDIENCE_ID,
            subscriberHash,
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: member.merge_fields,
            }
        );
        console.log('✓ Re-subscribed');

        console.log('\n✅ Success! Welcome email should be sent within a few minutes.\n');
    } catch (error) {
        console.error('\n❌ Error:', error.response ? error.response.body : error.message);
        process.exit(1);
    }
}

// Get email from command line argument
const email = process.argv[2];

if (!email) {
    console.error('Usage: node trigger-welcome.js <email>');
    console.error('Example: node trigger-welcome.js alex.binya@gmail.com');
    process.exit(1);
}

// Validate email format
if (!email.includes('@')) {
    console.error('Invalid email format');
    process.exit(1);
}

// Run the function
triggerWelcomeEmail(email);
