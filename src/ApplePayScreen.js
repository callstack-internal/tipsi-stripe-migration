import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useApplePay} from '@stripe/stripe-react-native';
import {BACKEND_URL} from './config';

const ApplePayScreen = () => {
  const [savedPaymentMethod, setPaymentMethod] = useState();
  const {presentApplePay, confirmApplePayPayment, isApplePaySupported} =
    useApplePay();

  const cart = [
    {label: 'Subtotal', amount: '12.75', type: 'final'},
    {label: 'Shipping', amount: '0.00', type: 'pending'},
    {label: 'Total', amount: '12.75', type: 'pending'}, // Last item in array needs to reflect the total.
  ];

  const fetchPaymentIntentClientSecret = async () => {
    const response = await fetch(`${BACKEND_URL}/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currency: 'usd',
        items: cart,
        force3dSecure: true,
      }),
    });
    const {clientSecret} = await response.json();

    return clientSecret;
  };

  const handlePressPay = async () => {
    const shippingMethods = [
      {
        identifier: 'free',
        detail: 'Arrives by July 2',
        label: 'Free Shipping',
        amount: '0.0',
      },
      {
        identifier: 'standard',
        detail: 'Arrives by June 29',
        label: 'Standard Shipping',
        amount: '3.21',
      },
      {
        identifier: 'express',
        detail: 'Ships within 24 hours',
        label: 'Express Shipping',
        amount: '24.63',
      },
    ];

    const {error, paymentMethod} = await presentApplePay({
      cartItems: cart,
      country: 'US',
      currency: 'USD',
      shippingMethods,
      requiredShippingAddressFields: [
        'emailAddress',
        'phoneNumber',
        'postalAddress',
        'name',
      ],
      requiredBillingContactFields: ['phoneNumber', 'name'],
    });

    setPaymentMethod(paymentMethod);

    if (error) {
      console.log(error.code, error.message);
    } else {
      const clientSecret = await fetchPaymentIntentClientSecret();

      const {error: confirmApplePayError} = await confirmApplePayPayment(
        clientSecret,
      );

      if (confirmApplePayError) {
        console.log(confirmApplePayError.code, confirmApplePayError.message);
      } else {
        console.log('Success', 'The payment was confirmed successfully!');
      }
    }
  };

  return (
    <View>
      {isApplePaySupported && (
        <TouchableOpacity style={styles.button} onPress={handlePressPay}>
          <Text style={styles.text}>Pay with ApplePay</Text>
        </TouchableOpacity>
      )}
      <Text>{JSON.stringify(savedPaymentMethod, null, 2)}</Text>
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

export default ApplePayScreen;
