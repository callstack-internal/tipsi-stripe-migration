import env from 'dotenv';

// Replace if using a different env file or config.
env.config({path: './.env'});

import bodyParser from 'body-parser';
import express from 'express';
import Stripe from 'stripe';

const stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY || '';
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
const app = express();

app.use((req, res, next) => {
  if (req.originalUrl === '/webhook') {
    next();
  } else {
    /* @ts-ignore */
    bodyParser.json()(req, res, next);
  }
});

app.get('/stripe-key', (req, res) => {
  return res.send({publishableKey: stripePublishableKey});
});

app.post('/create-payment-intent', async (req, res) => {
  const {email, currency} = req.body;
  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2020-08-27',
    typescript: true,
  });

  const customer = await stripe.customers.create({email});
  // Create a PaymentIntent with the order amount and currency.
  const params = {
    amount: 1400,
    currency,
    customer: customer.id,
    payment_method_options: {
      card: {
        request_three_d_secure: 'automatic',
      },
    },
  };
  try {
    const paymentIntent = await stripe.paymentIntents.create(params);
    // Send publishable key and PaymentIntent client_secret to client.
    return res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    return res.send({
      error: error.raw.message,
    });
  }
});

app.post('/create-setup-intent', async (req, res) => {
  const {email, payment_method_types = []} = req.body;
  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2020-08-27',
    typescript: true,
  });

  const customer = await stripe.customers.create({email});
  const setupIntent = await stripe.setupIntents.create({
    customer: customer.id,
    payment_method_types,
  });

  // Send publishable key and SetupIntent details to client
  return res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    clientSecret: setupIntent.client_secret,
  });
});

app.listen(4242, () => console.log(`Node server listening on port ${4242}!`));
