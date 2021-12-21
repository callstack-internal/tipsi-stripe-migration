import React, {useState} from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import stripe from 'tipsi-stripe';

const ApplePayScreen = () => {
  const [applePayToken, setToken] = useState();
  const handlePressPay = async () => {
    try {
      const token = await stripe.paymentRequestWithNativePay(
        {
          // requiredBillingAddressFields: ['all'],
          // requiredShippingAddressFields: ['all'],
          shippingMethods: [
            {
              id: 'fedex',
              label: 'FedEX',
              detail: 'Test @ 10',
              amount: '10.00',
            },
          ],
        },
        [
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
        ],
      );
      console.log(token);

      setToken(token);

      await stripe.completeNativePayRequest();
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  };

  return (
    <View>
      {Platform.OS === 'ios' && (
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
