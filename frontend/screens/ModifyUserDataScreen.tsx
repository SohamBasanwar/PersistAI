import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet
} from 'react-native';
import { auth, db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import ResumeInputScreen from './ResumeInputScreen';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../theme';

export default function ModifyUserDataScreen({ navigation }: any) {
  const [initialData, setInitialData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      Alert.alert('Error', 'Not logged in');
      return;
    }
    getDoc(doc(db, 'users', uid, 'resumeData', 'main'))
      .then(snap => {
        if (snap.exists()) {
          setInitialData(snap.data());
        } else {
          Alert.alert('No Data', 'No resume data found to modify.');
        }
      })
      .catch((e: any) => Alert.alert('Error', e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <LinearGradient
        style={styles.gradient}
        colors={[theme.gradient.start, theme.gradient.end]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
      >
        <ActivityIndicator size="large" color={theme.colors.button} />
      </LinearGradient>
    );
  }

  if (!initialData) return null;

  return (
    <LinearGradient
      style={styles.gradient}
      colors={[theme.gradient.start, theme.gradient.end]}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
    >
      <ResumeInputScreen
        navigation={navigation}
        route={{ params: { prefill: initialData } }}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.md
  }
});
