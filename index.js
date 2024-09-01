require('dotenv').config();
const express = require('express');
const cors = require('cors');
const twilio = require('twilio');

const app = express();

// Load environment variables
const port = process.env.PORT || 3000; // Default to 3000 if PORT is not set
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappFrom = process.env.TWILIO_WHATSAPP_FROM;
const whatsappTo = process.env.TWILIO_WHATSAPP_TO;

const client = twilio(accountSid, authToken);

app.use(cors());
app.use(express.json());

app.post('/send-whatsapp', (req, res) => {
  const { name, email, phone, message } = req.body;
  console.log('Received data:', { name, email, phone, message });

  client.messages
    .create({
      from: whatsappFrom, // Numéro WhatsApp Twilio from .env
      to: whatsappTo, // Numéro marocain au format international from .env
      body: `Nouveau message de ${name} (${email}, ${phone}):\n\n${message}`,
    })
    .then((message) => {
      console.log('Twilio response:', message);
      res.status(200).send({ success: true, sid: message.sid });
    })
    .catch((err) => {
      console.error('Twilio error:', err);
      res.status(500).send({ success: false, error: err.message });
    });
});

// Route to display "Hello Backend" in the browser
app.get('/', (req, res) => {
  res.send('<h1>Hello Backend</h1>');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
