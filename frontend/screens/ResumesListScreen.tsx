import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import { auth, db, storage } from '../services/firebase';
import {
  collection,
  query,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { LinearGradient } from 'expo-linear-gradient';

import theme from '../theme';

type ResumeMeta = {
  sessionId:     string;
  createdAt:     string;
  storagePath:   string;
  thumbnailPath: string;
  thumbUrl?:     string;
};

export default function ResumesListScreen({ navigation }: any) {
  const [list, setList]       = useState<ResumeMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const uid = auth.currentUser?.uid;

  useEffect(() => {
    if (!uid) {
      Alert.alert('Error', 'Not logged in');
      return;
    }
    const q = query(
      collection(db, 'users', uid, 'resumes'),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(
      q,
      async snapshot => {
        const metas: ResumeMeta[] = snapshot.docs.map(d => ({
          sessionId:     d.id,
          createdAt:     d.data().createdAt,
          storagePath:   d.data().storagePath,
          thumbnailPath: d.data().thumbnailPath
        }));
        const withThumbs = await Promise.all(
          metas.map(async m => {
            try {
              const url = await getDownloadURL(ref(storage, m.thumbnailPath));
              return { ...m, thumbUrl: url };
            } catch {
              return m;
            }
          })
        );
        setList(withThumbs);
        setLoading(false);
      },
      error => {
        console.error(error);
        Alert.alert('Error', 'Failed to load resumes.');
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [uid]);

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

  if (!list.length) {
    return (
      <LinearGradient
        style={styles.gradient}
        colors={[theme.gradient.start, theme.gradient.end]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.center}>
          <Text style={styles.empty}>No saved resumes yet.</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      style={styles.gradient}
      colors={[theme.gradient.start, theme.gradient.end]}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
    >
      <FlatList
        data={list}
        keyExtractor={item => item.sessionId}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate('Preview', {
                storagePath: item.storagePath,
                thumbnailPath: item.thumbnailPath
              })
            }
          >
            {item.thumbUrl ? (
              <Image
                source={{ uri: item.thumbUrl }}
                style={styles.thumbnail}
              />
            ) : (
              <View style={[styles.thumbnail, styles.missing]}>
                <ActivityIndicator color={theme.colors.button} />
              </View>
            )}
            <View style={styles.info}>
              <Text style={styles.title}>{item.sessionId}</Text>
              <Text style={styles.date}>
                {new Date(item.createdAt).toLocaleString()}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.md
  },
  empty: {
    fontSize: theme.typography.fontSizes.body,
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily
  },
  list: {
    padding: theme.spacing.md,
  },
  card: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.card,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    alignItems: 'center'
  },
  thumbnail: {
    width: 60,
    height: 80,
    marginRight: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.card
  },
  missing: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  info: {
    flex: 1
  },
  title: {
    fontSize: theme.typography.fontSizes.body,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily,
    marginBottom: theme.spacing.xs
  },
  date: {
    fontSize: theme.typography.fontSizes.caption,
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily
  }
});
