import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { storage } from '../services/firebase';
import { ref, getDownloadURL } from 'firebase/storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { LinearGradient } from 'expo-linear-gradient';

import ThemedButton from '../components/ThemedButton';
import theme from '../theme';

export default function PreviewScreen({ route, navigation }: any) {
  const { storagePath, thumbnailPath } = route.params as {
    storagePath: string;
    thumbnailPath: string;
  };

  const [thumbUrl, setThumbUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!thumbnailPath) {
      setLoading(false);
      return;
    }
    getDownloadURL(ref(storage, thumbnailPath))
      .then((url) => setThumbUrl(url))
      .catch((err) => {
        console.error(err);
        Alert.alert('Error', 'Could not load preview image.');
      })
      .finally(() => setLoading(false));
  }, [thumbnailPath]);

  const handleDownload = async () => {
    try {
      const pdfUrl = await getDownloadURL(ref(storage, storagePath));

      if (Platform.OS === 'web') {
        const filename = storagePath.split('/').pop() || 'resume.pdf';
        const a = document.createElement('a');
        a.href = pdfUrl;
        a.download = filename;
        a.click();
        return;
      }

      const filename = storagePath.split('/').pop() || 'resume.pdf';
      const localUri = FileSystem.documentDirectory + filename;
      const downloadResult = await FileSystem.downloadAsync(pdfUrl, localUri);
      if (downloadResult.status !== 200) {
        throw new Error(`HTTP status ${downloadResult.status}`);
      }

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(downloadResult.uri, {
          mimeType: 'application/pdf',
        });
      } else {
        Alert.alert('Downloaded', `Saved to ${downloadResult.uri}`);
      }
    } catch (err: any) {
      console.error(err);
      Alert.alert('Error', 'Failed to download PDF: ' + err.message);
    }
  };

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

  return (
    <LinearGradient
      style={styles.gradient}
      colors={[theme.gradient.start, theme.gradient.end]}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
    >
      <View style={styles.container}>
        {thumbUrl ? (
          <Image
            source={{ uri: thumbUrl }}
            style={styles.thumbnail}
            resizeMode="contain"
          />
        ) : (
          <View style={[styles.thumbnail, styles.missing]}>
            <ActivityIndicator size="large" color={theme.colors.button} />
          </View>
        )}

        <View style={styles.buttons}>
          <ThemedButton
            title="Download PDF"
            onPress={handleDownload}
            variant="medium"
            style={styles.downloadButton}
          />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
    padding: theme.spacing.md,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnail: {
    flex: 1,
    width: '100%',
    marginBottom: theme.spacing.md,
    borderRadius: theme.radii.card,
    backgroundColor: theme.colors.surface,
  },
  missing: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttons: {
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  downloadButton: {
    width: '100%',
  },
});