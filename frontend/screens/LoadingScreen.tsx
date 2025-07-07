import React, { useEffect } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Alert
} from 'react-native';
import { auth, db } from '../services/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';

import theme from '../theme';

export default function LoadingScreen({ route, navigation }: any) {
  const { sessionId } = route.params;
  const uid = auth.currentUser?.uid;

  useEffect(() => {
    if (!uid) return;

    const unsub = onSnapshot(
      doc(db, 'users', uid, 'resumes', sessionId),
      snap => {
        if (snap.exists()) {
          const { storagePath, thumbnailPath } = snap.data() as any;
          if (storagePath && thumbnailPath) {
            navigation.replace('Preview', { storagePath, thumbnailPath });
          }
        }
      },
      err => {
        console.error(err);
        Alert.alert('Error', 'Failed to load resume. Please try again.');
      }
    );
    return () => unsub();
  }, [sessionId, uid, navigation]);

  return (
    <LinearGradient
      style={styles.gradient}
      colors={[theme.gradient.start, theme.gradient.end]}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
    >
      <View style={styles.container}>
        <Image
          source={require('../assets/loading.png')}
          style={styles.loader}
          resizeMode="contain"
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.md
  },
  loader: {
    width: 200,
    height: 200,
    tintColor: theme.colors.button
  }
});
