import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import stripe from 'tipsi-stripe';
import {BACKEND_URL} from './config';

const CardPaymentScreen = () => {
  const [paymentIntent, setPaymentIntent] = useState();
  const [cardDetails, setCardDetails] = useState({
    number: null,
    expMonth: null,
    expYear: null,
    cvc: null,
  });

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
        clientSecret: clientSecret,
        paymentMethod: {
          billingDetails: demoBillingDetails,
          card: cardDetails,
        },
      });

      if (confirmPaymentResult.status === 'succeeded') {
        setPaymentIntent(confirmPaymentResult);
        console.log('Success!');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View>
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

      <Text>{JSON.stringify(paymentIntent, null, 2)}</Text>

      <TouchableOpacity style={styles.button} onPress={handlePressPay}>
        <Text style={styles.text}>Pay with card</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
