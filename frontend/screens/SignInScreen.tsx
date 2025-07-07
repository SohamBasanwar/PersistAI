import React, { useState, useContext } from 'react';
import { View, TextInput, StyleSheet, Alert, Text } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { auth, signInAnonymously, db } from '../services/firebase';
import { LinearGradient } from 'expo-linear-gradient';
import { getDoc, doc } from 'firebase/firestore';
import ThemedButton from '../components/ThemedButton';
import theme from '../theme';

export function SignInScreen({ navigation }: any) {
  const { signIn } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const goToResumeInput = () => {
    navigation.getParent()?.navigate('Resumes', {
      screen: 'ResumeInput',
    });
  };

  const goToJDInput = () => {
    navigation.getParent()?.navigate('JDFlow', {
      screen: 'JDInput',
    });
  };

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const cred = await signIn(email.trim(), password);
      const uid = cred.user.uid;
      const snap = await getDoc(doc(db, 'users', uid, 'resumeData', 'main'));
      if (snap.exists()) {
        goToJDInput();
      } else {
        goToResumeInput();
      }
    } catch (e: any) {
      Alert.alert('Login failed', e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = async () => {
    setLoading(true);
    try {
      await signInAnonymously(auth);
      goToResumeInput();
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
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
          title={loading ? 'Signing In...' : 'Sign In'}
          onPress={handleSignIn}
          variant="large"
          style={styles.button}
          disabled={loading || !email.trim() || !password}
        />

        <View style={styles.linkContainer}>
          <Text style={styles.linkText}>Don't have an account?</Text>
          <ThemedButton
            title="Sign Up"
            onPress={() => navigation.navigate('SignUp')}
            variant="medium"
            style={styles.button}
            disabled={loading}
          />
        </View>

        <View style={styles.guestContainer}>
          <ThemedButton
            title={loading ? 'Loading...' : 'Continue as Guest'}
            onPress={handleGuest}
            variant="medium"
            style={styles.button}
            disabled={loading}
          />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
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
    marginTop: theme.spacing.md,
    alignItems: 'center',
  },
  linkText: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily,
    marginBottom: theme.spacing.xs,
  },
  guestContainer: {
    marginTop: theme.spacing.lg,
  },
});
