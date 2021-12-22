import {useGooglePay} from '@stripe/stripe-react-native';
import React, {useEffect, useState} from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {BACKEND_URL} from './config';

const GooglePayScreen = () => {
  const {initGooglePay, presentGooglePay} = useGooglePay();
  const [initialized, setInitialized] = useState(false);

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
      } else {
        setInitialized(true);
      }
    };

    initialize();
  });

  return (
    <View>
      {initialized && Platform.OS === 'android' && (
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
