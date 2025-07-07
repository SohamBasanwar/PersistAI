import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../theme';
import ResumesListScreen from '../screens/ResumesListScreen';
import PreviewScreen from '../screens/PreviewScreen';
import ResumeInputScreen from '../screens/ResumeInputScreen';
import { auth, db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';

// Gate component to route users based on existing resume data
function ResumeGate({ navigation }: any) {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const uid = auth.currentUser?.uid;
        if (!uid) throw new Error('Not authenticated');
        const snap = await getDoc(doc(db, 'users', uid, 'resumeData', 'main'));
        if (snap.exists()) {
          navigation.replace('ResumesList');
        } else {
          navigation.replace('ResumeInput');
        }
      } catch {
        navigation.replace('ResumeInput');
      }
    })();
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color={theme.colors.button} />
    </View>
  );
}

const Stack = createNativeStackNavigator();

export default function ResumesStack() {
  return (
    <Stack.Navigator
      initialRouteName="ResumeGate"
      screenOptions={{
        headerShown: true,
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
        name="ResumeGate"
        component={ResumeGate}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ResumeInput"
        component={ResumeInputScreen}
        options={{ title: 'Create Resume', gestureEnabled: false, headerLeft: () => null }}
      />
      <Stack.Screen
        name="ResumesList"
        component={ResumesListScreen}
        options={{ title: 'My Resumes' }}
      />
      <Stack.Screen
        name="Preview"
        component={PreviewScreen}
        options={{ title: 'Preview Resume' }}
      />
    </Stack.Navigator>
  );
}
