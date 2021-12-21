import {useGooglePay} from '@stripe/stripe-react-native';
import React, {useEffect} from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {BACKEND_URL} from './config';

const GooglePayScreen = () => {
  const {initGooglePay, presentGooglePay} = useGooglePay();

  useEffect(() => {
    const initialize = async () => {
      const {error} = await initGooglePay({
        testEnv: true,
        merchantName: 'Test',
        countryCode: 'US',
        billingAddressConfig: {
          format: 'FULL',
          isPhoneNumberRequired: true,
          isRequired: false,
        },
        existingPaymentMethodRequired: false,
        isEmailRequired: true,
      });

      if (error) {
        console.log(error.code, error.message);
      }
    };

    initialize();
  });

  const fetchPaymentIntentClientSecret = async () => {
    const response = await fetch(`${BACKEND_URL}/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currency: 'usd',
      }),
    });
    const {clientSecret} = await response.json();

    return clientSecret;
  };

  const handlePressPay = async () => {
    const clientSecret = await fetchPaymentIntentClientSecret();

    const {error} = await presentGooglePay({
      clientSecret,
      forSetupIntent: false,
    });

    if (error) {
      console.log(error.code, error.message);
      return;
    }
    console.log('Success', 'The payment was confirmed successfully.');
  };

  return (
    <View>
      {Platform.OS === 'android' && (
        <TouchableOpacity style={styles.button} onPress={handlePressPay}>
          <Text style={styles.text}>Pay with GooglePay</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 22,
  },
  button: {
    backgroundColor: 'black',
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

export default GooglePayScreen;
