import React from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import stripe from 'tipsi-stripe';

const GooglePayScreen = () => {
  const handlePressPay = async () => {
    try {
      const token = await stripe.paymentRequestWithNativePay({
        total_price: '100.00',
        currency_code: 'USD',
        shipping_address_required: true,
        phone_number_required: true,
        shipping_countries: ['US', 'CA'],
        line_items: [
          {
            currency_code: 'USD',
            description: 'Whisky',
            total_price: '50.00',
            unit_price: '50.00',
            quantity: '1',
          },
          {
            currency_code: 'USD',
            description: 'Vine',
            total_price: '30.00',
            unit_price: '30.00',
            quantity: '1',
          },
          {
            currency_code: 'USD',
            description: 'Tipsi',
            total_price: '20.00',
            unit_price: '20.00',
            quantity: '1',
          },
        ],
      });
      console.log(token);
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };

  return (
    <View>
      {stripe.deviceSupportsNativePay() && (
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
