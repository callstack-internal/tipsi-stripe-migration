import React, {useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  useColorScheme,
} from 'react-native';
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
      return null;
    }
  };
  useEffect(() => {
    async function initialize() {
      const {publishableKey} = await fetchPublishableKey();

      stripe.setOptions({
        publishableKey: publishableKey,
        merchantId: 'MERCHANT_ID', // Optional
        androidPayMode: 'test', // Android only
      });
    }
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
