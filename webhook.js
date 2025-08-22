const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// Replace with your webhook secret set in GitHub
const WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET || '53897304';

function verifySignature(req, res, buf) {
  const signature = req.headers['x-hub-signature-256'];
  if (!signature) {
    throw new Error('No signature found on request');
  }
  const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
  const digest = 'sha256=' + hmac.update(buf).digest('hex');
  if (signature !== digest) {
    throw new Error('Signature does not match');
  }
}

// Use the raw body parser to verify the signature
app.use(
  bodyParser.json({
    verify: verifySignature,
  })
);

app.post('/github-webhook', (req, res) => {
  const event = req.headers['x-github-event'];
  const payload = req.body;
  console.log(`Received event: ${event}`);
  // Handle deployment events here
  if (event === 'deployment' || event === 'deployment_status') {
    // Your logic for deployment events
    console.log('Deployment event payload:', payload);
  }
  res.status(200).send('Webhook received');
});

app.listen(PORT, () => {
  console.log(`Webhook service running on port ${PORT}`);
});