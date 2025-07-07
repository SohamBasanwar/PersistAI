// @ts-nocheck
import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ThemedButton from '../components/ThemedButton';
import theme from '../theme';
import { API_BASE_URL } from '../config'; // ✅ Use your dynamic dev/prod setup

// EmailJS setup (not used here for backend forwarding)
import { init } from '@emailjs/react-native';
init({ publicKey: '9DIDUs9yUhApjRZiQ' });

export default function ContactScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      return Alert.alert('Missing fields', 'Please complete all fields.');
    }
    setSending(true);
    try {
      console.log("📡 Using API:", API_BASE_URL);
      console.log('Sending to:', `${API_BASE_URL}/contact`);
      const res = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Unknown error');

      setSent(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (e) {
      console.error('❌ Error sending contact message:', e);
      Alert.alert('Error', 'Unable to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <LinearGradient
      colors={[theme.gradient.start, theme.gradient.end]}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={styles.bg}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Contact the Developer</Text>

          {sent && <Text style={styles.success}>Thanks! Your message has been sent.</Text>}

          <TextInput
            style={styles.input}
            placeholder="Your Name"
            placeholderTextColor={theme.colors.textSecondary}
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Your Email"
            placeholderTextColor={theme.colors.textSecondary}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Subject"
            placeholderTextColor={theme.colors.textSecondary}
            value={subject}
            onChangeText={setSubject}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Message"
            placeholderTextColor={theme.colors.textSecondary}
            multiline
            value={message}
            onChangeText={setMessage}
          />

          <ThemedButton
            title={sending ? 'Sending...' : 'Send'}
            onPress={handleSend}
            disabled={sending}
            variant="large"
            style={styles.button}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  flex: { flex: 1 },
  container: {
    padding: theme.spacing.md,
    justifyContent: 'center',
    marginTop: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.fontSizes.h2,
    color: theme.colors.buttonText,
    fontFamily: theme.typography.fontFamily,
    textAlign: 'center',
    marginBottom: theme.spacing.lg
  },
  success: {
    color: theme.colors.buttonText,
    textAlign: 'center',
    marginBottom: theme.spacing.md
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.card,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top'
  },
  button: {
    width: '95%',
    alignSelf: 'center',
    marginVertical: theme.spacing.md
  }
});
