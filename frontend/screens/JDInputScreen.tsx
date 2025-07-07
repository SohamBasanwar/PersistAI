import React, { useState, useEffect } from 'react';
import {
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import axios from 'axios';
import { auth, db } from '../services/firebase';
import { getDoc, doc } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';

import { API_BASE_URL } from '../config';
import ThemedButton from '../components/ThemedButton';
import theme from '../theme';

export default function JDInputScreen({ navigation }: any) {
  const [checking, setChecking] = useState(true);
  const [jd, setJd] = useState('');

  useEffect(() => {
    (async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) {
        setChecking(false);
        return;
      }
      setChecking(false);
    })();
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setJd('');
    });
    return unsubscribe;
  }, [navigation]);

  const handleStructureAndScore = async () => {
    try {
      const structRes = await axios.post(
        `${API_BASE_URL}/structure`,
        { job_description: jd }
      );
      const structuredJD = structRes.data.structured_jd;

      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error('Not authenticated');
      const scoreRes = await axios.post(
        `${API_BASE_URL}/score`,
        { uid, structured_jd: structuredJD }
      );
      const { session_id, scored_entries } = scoreRes.data;

      navigation.navigate('Score', {
        sessionId: session_id,
        scoredEntries: scored_entries
      });
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to structure & score JD');
    }
  };

  if (checking) {
    return (
      <LinearGradient
        style={styles.loader}
        colors={[theme.gradient.start, theme.gradient.end]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
      >
        <ActivityIndicator
          size="large"
          color={theme.colors.button}
        />
      </LinearGradient>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.flex}
    >
      <LinearGradient
        style={styles.flex}
        colors={[theme.gradient.start, theme.gradient.end]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <TextInput
            placeholder="Paste job description..."
            placeholderTextColor={theme.colors.textSecondary}
            value={jd}
            onChangeText={setJd}
            multiline
            style={styles.input}
          />

          <ThemedButton
            title="Structure & Score JD"
            onPress={handleStructureAndScore}
            disabled={!jd.trim()}
            variant="large"
            style={{
              width: '95%',
              alignSelf: 'center',
              marginVertical: theme.spacing.md,
            }}
          />
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flexGrow: 1,
    padding: theme.spacing.md,
    justifyContent: 'center',
  },
  input: {
    marginBottom: theme.spacing.md,
    marginLeft: theme.spacing.md,
    marginRight: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.surface,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.card,
    padding: theme.spacing.sm,
    height: 250,
    textAlignVertical: 'top',
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSizes.body,
  },
});
