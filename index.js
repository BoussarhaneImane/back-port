require('dotenv').config(); // Load environment variables
const express = require('express');
const twilio = require('twilio');
const app = express();
const cors = require('cors');

// Load environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappFrom = process.env.TWILIO_WHATSAPP_FROM;
const whatsappTo = process.env.TWILIO_WHATSAPP_TO;

// Initialize Twilio client
const client = twilio(accountSid, authToken);

app.use(express.json());
app.use(cors());

app.post('/send-whatsapp', (req, res) => {
  const { name, email, phone, message } = req.body;

  client.messages
    .create({
      from: whatsappFrom,
      to: whatsappTo,
      body: `New message from ${name} (${email}, ${phone}):\n\n${message}`,
    })
    .then((message) => res.status(200).send({ success: true, sid: message.sid }))
    .catch((err) => res.status(500).send({ success: false, error: err.message }));
});

app.listen(process.env.PORT || 8080, () => {
  console.log(`Server running on port ${process.env.PORT || 8080}`);
});
