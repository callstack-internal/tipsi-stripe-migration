import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {CardField, useStripe} from '@stripe/stripe-react-native';
import {BACKEND_URL} from './config';

const CardPaymentScreen = () => {
  const [savedPaymentIntent, setPaymentIntent] = useState();
  const {confirmPayment} = useStripe();

  const createPaymentIntent = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/create-payment-intent`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currency: 'usd',
          email: 'test@stripe.com',
        }),
      });
      return await response.json();
    } catch (error) {
      console.log(error);
      return {};
    }
  };

  const handlePressPay = async () => {
    const {clientSecret} = await createPaymentIntent();

    if (!clientSecret) {
      console.error("Couldn't create a PaymentIntent");
    }

    const billingDetails = {
      email: 'email@stripe.com',
      phone: '+48888000888',
      addressCity: 'Houston',
      addressCountry: 'US',
      addressLine1: '1459  Circle Drive',
      addressLine2: 'Texas',
      addressPostalCode: '77063',
    };
    const {error, paymentIntent} = await confirmPayment(clientSecret, {
      type: 'Card',
      billingDetails,
    });

    if (error) {
      console.log('Payment confirmation error', error.message);
    } else if (paymentIntent) {
      setPaymentIntent(paymentIntent);
      console.log('The payment was confirmed successfully!', paymentIntent);
    }
  };

  return (
    <View>
      <CardField
        postalCodeEnabled={false}
        autofocus
        placeholder={{
          number: '4242 4242 4242 4242',
          postalCode: '12345',
          cvc: 'CVC',
          expiration: 'MM|YY',
        }}
        onCardChange={cardDetails => {
          console.log('cardDetails', cardDetails);
        }}
        onFocus={focusedField => {
          console.log('focusField', focusedField);
        }}
        style={styles.cardField}
      />

      <Text>{JSON.stringify(savedPaymentIntent, null, 2)}</Text>

      <TouchableOpacity style={styles.button} onPress={handlePressPay}>
        <Text style={styles.text}>Pay with card</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cardField: {
    height: 44,
    width: '100%',
    marginTop: 30,
  },
  button: {
    backgroundColor: 'darkgreen',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginVertical: 22,
  },
  text: {
    color: '#FFF',
    fontSize: 14,
  },
});

export default CardPaymentScreen;
