// index.js
// require(".env").config();
import pkg from "twilio";
const { twiml } = pkg;
import express from "express";
const { MessagingResponse } = twiml;
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express(); // Import express

// Middleware to parse incoming request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Correct

const TWILIO_WHATSAPP_NUMBER = "whatsapp:+16304895598";

// Helper functions
const sendWhatsAppMessage = (to, message) => {
  const client = require("twilio")(
    ACf0acb71f3d2b8c08cfc1a57f27435163,
    d77fec6dbd6c6036cf2f962f1f4a38
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
  const incomingMessage = req.body.Body ? req.body.Body.toLowerCase() : "";
  console.log("Incoming Message:", req.body.Body);

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

// Base route for /api
app.get("/api", (req, res) => {
  res.send("Welcome to the WhatsApp Chatbot API!"); // Simple response for the base route
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

// const express = require("express");
// const { MessagingResponse } = require("twilio").twiml;
// const app = express();

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.post("/api/webhook", (req, res) => {
//   try {
//     console.log("Incoming message:", req.body);
//     const twiml = new MessagingResponse();
//     const incomingMsg = req.body.Body.toLowerCase();

//     if (incomingMsg.includes("hi")) {
//       twiml.message("Hello! How can I assist you today?");
//     } else {
//       twiml.message("Sorry, I did not understand that.");
//     }

//     res.writeHead(200, { "Content-Type": "text/xml" });
//     res.end(twiml.toString());
//   } catch (error) {
//     console.error("Error in webhook:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// module.exports = app;

// import express from "express"; // Correct ES6 import

// // Initialize Express app
// const app = express(); // Make sure to call express()

// // Middleware to parse incoming request bodies
// app.use(express.json()); // Use express.json() middleware
// app.use(express.urlencoded({ extended: true })); // Use express.urlencoded()

// // Example route (you can replace this with your webhook handler)
// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

// // Set the port and start the server
// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });

// export default app;
