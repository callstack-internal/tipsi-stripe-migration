import React, {useEffect} from 'react';
import {SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import stripe from 'tipsi-stripe';
import CardPaymentScreen from './src/CardPaymentScreen';
import ApplePayScreen from './src/ApplePayScreen';
import GooglePayScreen from './src/GooglePayScreen';
import {BACKEND_URL} from './src/config';

const App: React.FC = () => {
  const fetchPublishableKey = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/stripe-key`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    } catch (error) {
      console.log(error);
      return {error};
    }
  };
  useEffect(() => {
    async function initialize() {
      const {publishable_key, error} = await fetchPublishableKey();

      if (error) {
        console.log(error);
        return;
      }

      stripe.setOptions({
        publishableKey: publishable_key,
        merchantId: 'MERCHANT_ID', // Optional
        androidPayMode: 'test', // Android only
      });
    }
    initialize();
  }, []);

  return (
    <SafeAreaView>
      <ScrollView style={styles.container}>
        <CardPaymentScreen />
        <ApplePayScreen />
        <GooglePayScreen />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 22,
  },
});

export default App;
