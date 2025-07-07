import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthContext } from '../context/AuthContext';
import { auth, db } from '../services/firebase';
import { deleteDoc, doc, getDoc } from 'firebase/firestore';
import ThemedButton from '../components/ThemedButton';
import theme from '../theme';

export default function AccountHomeScreen({ navigation }: any) {
  const { signOutUser } = useContext(AuthContext);
  const [name, setName] = useState<string>('');

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    getDoc(doc(db, 'users', uid, 'resumeData', 'main'))
      .then(snap => {
        if (snap.exists()) {
          const data = snap.data() as any;
          setName(data.personal?.name || '');
        }
      })
      .catch(e => Alert.alert('Error', e.message));
  }, []);

  const handleLogout = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const uid = user.uid;
        if (user.isAnonymous) {
          await deleteDoc(doc(db, 'users', uid, 'resumeData', 'main'));
          await user.delete();
        }
      }
      await signOutUser();
    } catch (e: any) {
      Alert.alert('Error', e.message);
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
        {name ? <Text style={styles.greeting}>Hi {name}!</Text> : null}

        <ThemedButton
          title="Modify Resume Data"
          onPress={() => navigation.navigate('ModifyUserData')}
          variant="medium"
          style={styles.button}
        />

        <ThemedButton
          title="Logout"
          onPress={handleLogout}
          variant="medium"
          style={styles.button}
        />

        <ThemedButton
          title="Contact Us"
          onPress={() => navigation.navigate('Contact')}
          variant="medium"
          style={styles.button}
        />
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
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  greeting: {
    fontSize: theme.typography.fontSizes.h2,
    color: theme.colors.buttonText,
    fontFamily: theme.typography.fontFamily,
    marginBottom: theme.spacing.xl * 2,
  },
  button: {
    width: '100%',
    marginVertical: theme.spacing.md,
  },
});
