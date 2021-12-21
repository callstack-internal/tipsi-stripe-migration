import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import stripe from 'tipsi-stripe';
import {BACKEND_URL} from './config';

const CardPaymentScreen = () => {
  const [cardDetails, setCardDetails] = useState({
    number: null,
    expMonth: null,
    expYear: null,
    cvc: null,
  });

  const createPaymentIntent = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/create_intent`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 2000,
          currency: 'usd',
        }),
      });
      return await response.json();
    } catch (error) {
      return null;
    }
  };

  const handlePressPay = async () => {
    const paymentIntent = await createPaymentIntent();

    if (!paymentIntent) {
      console.error("Couldn't create a PaymentIntent");
    }

    try {
      const demoBillingDetails = {
        address: {
          city: 'New York',
          country: 'US',
          line1: '11 Wall St.',
          postalCode: '10005',
          state: 'New York',
        },
        email: 'abc@xyz.com',
        name: 'Jason Bourne',
        phone: '123-456-7890',
      };

      const confirmPaymentResult = await stripe.confirmPaymentIntent({
        clientSecret: paymentIntent.secret,
        paymentMethod: {
          billingDetails: demoBillingDetails,
          card: cardDetails,
        },
      });

      if (confirmPaymentResult.status === 'succeeded') {
        console.log('Success!');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        placeholder="Card number"
        style={styles.input}
        onChange={value =>
          setCardDetails(prev => ({
            ...prev,
            number: value.nativeEvent.text,
          }))
        }
      />
      <TextInput
        placeholder="Expiry month"
        style={styles.input}
        onChange={value =>
          setCardDetails(prev => ({
            ...prev,
            expMonth: value.nativeEvent.text,
          }))
        }
      />

      <TextInput
        placeholder="Expiry year"
        style={styles.input}
        onChange={value =>
          setCardDetails(prev => ({
            ...prev,
            expYear: value.nativeEvent.text,
          }))
        }
      />

      <TextInput
        placeholder="cvc"
        style={styles.input}
        onChange={value =>
          setCardDetails(prev => ({
            ...prev,
            cvc: value.nativeEvent.text,
          }))
        }
      />

      <TouchableOpacity style={styles.button} onPress={handlePressPay}>
        <Text style={styles.text}>Pay with card</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 22,
  },
  input: {
    height: 44,
    borderBottomWidth: 1,
    borderBottomColor: '#c0c0c0',
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
