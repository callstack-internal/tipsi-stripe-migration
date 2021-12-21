import React, {useEffect} from 'react';
import {SafeAreaView, StyleSheet, useColorScheme} from 'react-native';
import stripe from 'tipsi-stripe';
import CardPaymentScreen from './src/CardPaymentScreen';
import ApplePayScreen from './src/ApplePayScreen';
import GooglePayScreen from './src/GooglePayScreen';

const App: React.FC = () => {
  useEffect(() => {
    async function initialize() {
      stripe.setOptions({
        publishableKey: 'pk_****',
        merchantId: 'MERCHANT_ID', // Optional
        androidPayMode: 'test', // Android only
      });
    }
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView>
      <CardPaymentScreen />
      <ApplePayScreen />
      <GooglePayScreen />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default App;
