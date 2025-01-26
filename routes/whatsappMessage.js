const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();



// Webhook endpoint for Meta
router.post('/', async (req, res) => {
  const { body } = req;

  // Verify the webhook (required by Meta)
  if (body.object === 'whatsapp_business_account') {
    if (body.entry && body.entry[0].changes && body.entry[0].changes[0].value.messages) {
      const message = body.entry[0].changes[0].value.messages[0];
      console.log('Received message:', message);
    }
    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.status(404).send('Invalid webhook event');
  }
});

// Endpoint to verify the webhook (required by Meta)
router.get('/', async (req, res) => {
  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token === verifyToken) {
    res.status(200).send(challenge);
  } else {
    res.status(403).send('Verification failed');
  }
});

module.exports = router;