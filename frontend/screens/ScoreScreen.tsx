import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator
} from 'react-native';
import axios from 'axios';
import { auth } from '../services/firebase';
import { API_BASE_URL } from '../config';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../theme';

export default function ScoreScreen({ route, navigation }: any) {
  const { sessionId } = route.params;
  const uid = auth.currentUser?.uid;

  useEffect(() => {
    if (!uid) {
      Alert.alert('Error', 'Not logged in');
      return;
    }

    axios
      .post(`${API_BASE_URL}/compile`, { session_id: sessionId, uid })
      .then(() => {
        navigation.replace('Loading', { sessionId });
      })
      .catch(err => {
        console.error(err);
        Alert.alert(
          'Error',
          'Failed to generate resume. Please try again.',
          [{ text: 'OK', onPress: () => navigation.popToTop() }]
        );
      });
  }, []);

  return (
    <LinearGradient
      style={styles.gradient}
      colors={[theme.gradient.start, theme.gradient.end]}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
    >
      <ActivityIndicator
        size="large"
        color={theme.colors.button}
        style={styles.spinner}
      />
      <Text style={styles.text}>Preparing your resume…</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.md
  },
  spinner: {
    marginBottom: theme.spacing.md
  },
  text: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSizes.body,
    color: theme.colors.buttonText,
    textAlign: 'center'
  }
});
