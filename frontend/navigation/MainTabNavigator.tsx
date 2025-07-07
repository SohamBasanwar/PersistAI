import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import theme from '../theme';

import AppStack from './AppStack';
import ResumesStack from './ResumeStack';
import AccountStack from './AccountStack';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName='Resumes'
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'transparent',
          borderTopWidth: 0,
        },
        tabBarBackground: () => (
          <LinearGradient
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            colors={[theme.gradient.start, theme.gradient.end]}
          />
        ),
        tabBarActiveTintColor: theme.colors.buttonText,
        tabBarInactiveTintColor: theme.colors.textSecondary,
      }}
    >
      <Tab.Screen
        name="JDFlow"
        component={AppStack}
        options={{ title: 'JD Input' }}
      />
      <Tab.Screen
        name="Resumes"
        component={ResumesStack}
        options={{ title: 'My Resume' }}
      />
      <Tab.Screen
        name="Account"
        component={AccountStack}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? '';
          return {
            title: 'My Account',
            tabBarStyle: routeName === 'ModifyUserData' ? { display: 'none' } : undefined,
          };
        }}
      />
    </Tab.Navigator>
  );
}
