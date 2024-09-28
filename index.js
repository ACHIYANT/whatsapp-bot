// index.js
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const { MessagingResponse } = require("twilio").twiml;
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER;

// Helper functions
const sendWhatsAppMessage = (to, message) => {
  const client = require("twilio")(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
  return client.messages.create({
    body: message,
    from: TWILIO_WHATSAPP_NUMBER,
    to: to,
  });
};

// WhatsApp webhook to receive incoming messages
app.post("/webhook", async (req, res) => {
  const twiml = new MessagingResponse();
  const incomingMessage = req.body.Body.toLowerCase();
  const from = req.body.From;

  if (incomingMessage.includes("hi")) {
    twiml.message(
      'Hello! How can I assist you today? Reply with "products" to browse.'
    );
  } else if (incomingMessage.includes("products")) {
    twiml.message(
      "We offer the following products: \n1. Product A \n2. Product B \nReply with the product number to get more details."
    );
  } else if (incomingMessage.includes("1")) {
    twiml.message('Product A is available for $20. Reply "buy 1" to purchase.');
  } else if (incomingMessage.includes("buy 1")) {
    // Trigger payment link
    const paymentIntent = await createStripePaymentIntent(
      2000,
      "usd",
      "Product A"
    );
    twiml.message(`You can pay using this link: ${paymentIntent.url}`);
  } else {
    twiml.message(
      'Sorry, I didn’t understand that. Please type "hi" to start over.'
    );
  }

  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(twiml.toString());
});

// Create Stripe payment intent
// const createStripePaymentIntent = async (amount, currency, description) => {
//   const paymentIntent = await stripe.paymentIntents.create({
//     amount: amount,
//     currency: currency,
//     description: description,
//     automatic_payment_methods: { enabled: true },
//   });
//   return paymentIntent;
// };

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
