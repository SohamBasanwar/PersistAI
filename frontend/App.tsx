import React, { useContext, useState, useEffect } from 'react';
import {
  StatusBar,
  StyleSheet,
  SafeAreaView,
  LogBox,
  ActivityIndicator,
  View
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Suppress Firestore warnings
LogBox.ignoreLogs([
  /WebChannelConnection RPC 'Listen' stream .* transport errored/,
  /Firestore shutting down/,
]);

import { LinearGradient } from 'expo-linear-gradient';
import { NavigationContainer } from '@react-navigation/native';

import { AuthProvider, AuthContext } from './context/AuthContext';
import AuthStack from './navigation/AuthStack';
import MainTabNavigator from './navigation/MainTabNavigator';
import TermsScreen from './screens/TermsScreen';
import theme from './theme';

function RootNavigator() {
  const { user, loading } = useContext(AuthContext);
  if (loading) return null;
  return user ? <MainTabNavigator /> : <AuthStack />;
}

export default function App() {
  const [loadingTerms, setLoadingTerms] = useState(true);
  const [hasAgreed, setHasAgreed] = useState(false);

  useEffect(() => {
    (async () => {
      const val = await AsyncStorage.getItem('hasAgreed');
      setHasAgreed(val === 'true');
      setLoadingTerms(false);
    })();
  }, []);

  const handleAgree = async () => {
    await AsyncStorage.setItem('hasAgreed', 'true');
    setHasAgreed(true);
  };

  if (loadingTerms) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.button} />
      </View>
    );
  }

  if (!hasAgreed) {
    return <TermsScreen onAgree={handleAgree}/>;
  }

  return (
    <AuthProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={theme.gradient.start}
        />
        <LinearGradient
          colors={[theme.gradient.start, theme.gradient.end]}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </LinearGradient>
      </SafeAreaView>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.gradient.start,
  },
  gradient: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  }
});
