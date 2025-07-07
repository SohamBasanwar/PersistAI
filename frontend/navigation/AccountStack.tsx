import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../theme';

import AccountHomeScreen from '../screens/AccountHomeScreen';
import ModifyUserDataScreen from '../screens/ModifyUserDataScreen';
import ContactScreen from '../screens/ContactScreen';

const Stack = createNativeStackNavigator();

export default function AccountStack() {
  return (
    <Stack.Navigator
      initialRouteName="AccountHome"
      screenOptions={{
        headerShown: true,
        // Gradient header background
        headerBackground: () => (
          <LinearGradient
            colors={[theme.gradient.start, theme.gradient.end]}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1 }}
          />
        ),
        headerTintColor: theme.colors.buttonText,
        headerTitleStyle: {
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.fontSizes.h2,
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="AccountHome"
        component={AccountHomeScreen}
        options={{ title: 'My Account' }}
      />
      <Stack.Screen
        name="ModifyUserData"
        component={ModifyUserDataScreen}
        options={{ title: 'Modify Resume Data' }}
      />
      <Stack.Screen
        name="Contact"
        component={ContactScreen}
        options={{ title: 'Contact Us' }}
      />
    </Stack.Navigator>
  );
}
