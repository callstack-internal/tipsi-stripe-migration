import React, {useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import {StripeProvider} from '@stripe/stripe-react-native';
import CardPaymentScreen from './src/CardPaymentScreen';
import ApplePayScreen from './src/ApplePayScreen';
import GooglePayScreen from './src/GooglePayScreen';
import {BACKEND_URL} from './src/config';

const App: React.FC = () => {
  const [publishableKey, setPublishableKey] = useState();
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
      setPublishableKey(publishable_key);
    }
    initialize();
  }, []);

  return (
    <SafeAreaView>
      <StripeProvider
        publishableKey={publishableKey}
        merchantIdentifier="com.example.app">
        <ScrollView style={styles.container}>
          <CardPaymentScreen />
          <ApplePayScreen />
          <GooglePayScreen />
        </ScrollView>
      </StripeProvider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 22,
  },
});

export default App;
