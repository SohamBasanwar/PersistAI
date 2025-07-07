import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Button,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import theme from '../theme';

type Props = {
  onAgree: () => void;
};

export default function TermsScreen({ onAgree }: Props) {
  const handleAgree = async () => {
    try {
      await AsyncStorage.setItem('hasAgreed', 'true');
      onAgree();  // ← simply notify App.tsx
    } catch (err) {
      Alert.alert('Error', 'Failed to save agreement.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Terms & Conditions</Text>
      <ScrollView style={styles.scroll}>
        <Text style={styles.sectionHeader}>1. Intellectual Property</Text>
        <Text style={styles.bodyText}>
          All content, design, and code in this app are the property of PersistAI, a product of Soham Basanwar. You may not copy, reproduce, distribute, reverse-engineer, or otherwise reuse any part of this app without the express written permission of Soham Basanwar. Unauthorized copying will result in heavy legal action, including potential monetary damages.
        </Text>

        <Text style={styles.sectionHeader}>2. Licensing Fees</Text>
        <Text style={styles.bodyText}>
          Any licensed use of the app’s content, design, or code by third parties requires express written permission from Soham Basanwar and may incur licensing fees. Contact sohamdono03@gmail.com for inquiries about commercial or non-commercial licensing.
        </Text>

        <Text style={styles.sectionHeader}>3. Disclaimer</Text>
        <Text style={[styles.bodyText, styles.bold]}>
          PersistAI can and will make mistakes.
        </Text>
        <Text style={styles.bodyText}>
          The suggestions and outputs from this app are provided “as is” and without warranty of any kind, express or implied. Always verify any critical information before acting on it.
        </Text>

        <Text style={styles.sectionHeader}>4. Limitation of Liability</Text>
        <Text style={styles.bodyText}>
          In no event shall Soham Basanwar or PersistAI be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from your use of, or inability to use, this app—even if advised of the possibility of such damages.
        </Text>

        <Text style={styles.sectionHeader}>5. Changes to These Terms</Text>
        <Text style={styles.bodyText}>
          Soham Basanwar reserves the right to modify these Terms & Conditions at any time. Continued use of the app after any changes constitutes acceptance of the new terms.
        </Text>
      </ScrollView>


      <View style={styles.button}>
        <Button title="I Agree" onPress={handleAgree} color={theme.colors.button} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: theme.spacing.md, backgroundColor: theme.colors.surface },
  title: { fontSize: theme.typography.fontSizes.h2, color: theme.colors.textPrimary, marginBottom: theme.spacing.sm },
  scroll: { flex: 1 },
  sectionHeader: { fontSize: theme.typography.fontSizes.body, fontFamily: theme.typography.fontFamily, marginTop: theme.spacing.md, marginBottom: theme.spacing.xs },
  bodyText: { fontSize: theme.typography.fontSizes.body, color: theme.colors.textSecondary, marginBottom: theme.spacing.sm },
  bold: { fontWeight: 'bold', color: theme.colors.textPrimary },
  button: { marginVertical: theme.spacing.md }
});
