import React, { useContext, useState } from 'react';
import {
  View,
  TextInput,
  Alert,
  StyleSheet,
  Text
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import ThemedButton from '../components/ThemedButton';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../theme';

export function SignUpScreen({ navigation }: any) {
  const { signUp } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    try {
      await signUp(email.trim(), password);
    } catch (e: any) {
      Alert.alert('Sign Up failed', e.message);
    }
  };

  return (
    <LinearGradient
      style={styles.gradient}
      colors={[theme.gradient.start, theme.gradient.end]}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
    >
      <View style={styles.inner}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={theme.colors.textSecondary}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={theme.colors.textSecondary}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <ThemedButton
          title="Sign Up"
          onPress={handleSignUp}
          variant="large"
          style={styles.button}
        />

        <View style={styles.linkContainer}>
          <Text style={styles.linkText}>Already have an account?</Text>
          <ThemedButton
            title="Sign In"
            onPress={() => navigation.goBack()}
            variant="medium"
            style={styles.button}
          />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.md,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.surface,
    borderRadius: theme.radii.card,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSizes.body,
  },
  button: {
    width: '100%',
    marginVertical: theme.spacing.xs,
  },
  linkContainer: {
    marginTop: theme.spacing.lg,
    alignItems: 'center',
  },
  linkText: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily,
    marginBottom: theme.spacing.xs,
  },
});
