import test from 'node:test';
import assert from 'node:assert/strict';

const baseUrl = process.env.VITE_API_URL || 'http://localhost:5000';

const samplePayload = {
  parentName: 'Test Parent',
  childName: 'Test Child',
  email: 'test@example.com',
  phone: '+1234567890',
  gradeLevel: '3-4',
  programInterests: ['Future Dentist', 'Young Artist'],
  interests: 'Testing submission from automated test.',
};

// This test assumes the backend server is already running
// (e.g. via `npm run dev:full` or `npm run dev:server`).

test('POST /api/waitlist saves a waitlist entry', async () => {
  const response = await fetch(`${baseUrl}/api/waitlist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(samplePayload),
  });

  assert.equal(response.status, 201, 'Expected HTTP 201 Created');

  const data = await response.json();
  assert.equal(data.message, 'Waitlist entry saved.');
});
