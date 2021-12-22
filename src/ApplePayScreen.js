import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import stripe from 'tipsi-stripe';

const ApplePayScreen = () => {
  const [applePayToken, setToken] = useState();

  const cart = [
    {
      label: 'Whisky',
      amount: '50.00',
    },
    {
      label: 'Vine',
      amount: '60.00',
    },
    {
      label: 'Tipsi',
      amount: '110.00',
    },
  ];

  const handlePressPay = async () => {
    try {
      const shippingMethods = [
        {
          id: 'fedex',
          label: 'FedEX',
          detail: 'Test @ 10',
          amount: '10.00',
        },
      ];

      const token = await stripe.paymentRequestWithNativePay(
        {
          requiredShippingAddressFields: [
            'email',
            'phone',
            'postal_address',
            'name',
          ],
          requiredBillingAddressFields: ['phone', 'name'],
          shippingMethods,
        },
        cart,
      );

      setToken(token);

      await stripe.completeNativePayRequest();
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  };

  return (
    <View>
      {stripe.deviceSupportsNativePay() && (
        <TouchableOpacity style={styles.button} onPress={handlePressPay}>
          <Text style={styles.text}>Pay with ApplePay</Text>
        </TouchableOpacity>
      )}
      <Text>{JSON.stringify(applePayToken, null, 2)}</Text>
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
