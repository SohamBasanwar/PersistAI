// Example: AppStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../theme';

import JDInputScreen from '../screens/JDInputScreen';
import ScoreScreen from '../screens/ScoreScreen';
import LoadingScreen from '../screens/LoadingScreen';
import PreviewScreen from '../screens/PreviewScreen';

const Stack = createNativeStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        // Make header background a gradient
        headerBackground: () => (
          <LinearGradient
            colors={[theme.gradient.start, theme.gradient.end]}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1 }}
          />
        ),
        // Title & back button color
        headerTintColor: theme.colors.buttonText,
        // Title style (font, size, etc.)
        headerTitleStyle: {
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.fontSizes.h2,
        },
        // Remove the default shadow/underline
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen 
        name="JDInput" 
        component={JDInputScreen} 
        options={{ title: 'Job Description' }}
      />
      <Stack.Screen 
        name="Score" 
        component={ScoreScreen} 
        options={{ title: 'Generating Resume' }}
      />
      <Stack.Screen 
        name="Loading" 
        component={LoadingScreen} 
        options={{ title: 'Almost There…' }}
      />
      <Stack.Screen 
        name="Preview" 
        component={PreviewScreen} 
        options={{ title: 'Your Resume' }}
      />
    </Stack.Navigator>
  );
}
