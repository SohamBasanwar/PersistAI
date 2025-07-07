import React, { useState, useEffect, FC } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
  useWindowDimensions,
  Platform
} from 'react-native';
import { auth, db, signInAnonymously } from '../services/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';
import { Dimensions } from 'react-native';

import ThemedButton from '../components/ThemedButton';
import theme from '../theme';

// Generic entry type
type Entry = Record<string, string>;

const MAX_CONTENT_WIDTH = 1200;

// Section component
interface SectionProps {
  title: string;
  items: Entry[];
  setItems: React.Dispatch<React.SetStateAction<Entry[]>>;
  fields: string[];
}

const Section: FC<SectionProps> = ({ title, items, setItems, fields }) => (
  <View style={styles.section}>

    {items.map((item, idx) => (
      <View key={idx} style={styles.box}>
        {/* Date fields */}
        {fields.includes('date_from') && (
          <View style={styles.dateRow}>
            <TextInput
              style={[styles.input, styles.dateInput]}
              placeholder="Start Date"
              placeholderTextColor={theme.colors.textSecondary}
              value={item.date_from}
              onChangeText={text => {
                const copy = [...items];
                copy[idx] = { ...copy[idx], date_from: text };
                setItems(copy);
              }}
            />
            <TextInput
              style={[styles.input, styles.dateInput]}
              placeholder="End Date (optional)"
              placeholderTextColor={theme.colors.textSecondary}
              value={item.date_to}
              onChangeText={text => {
                const copy = [...items];
                copy[idx] = { ...copy[idx], date_to: text };
                setItems(copy);
              }}
            />
          </View>
        )}

        {/* Other fields */}
        {fields
          .filter(f => f !== 'date_from' && f !== 'date_to')
          .map(field => {
            const isDesc = field === 'description';
            const placeholder =
              field === 'from'
                ? 'From (e.g. Company Name)'
                : field.charAt(0).toUpperCase() + field.slice(1);

            return (
              <TextInput
                key={field}
                style={[styles.input, isDesc && styles.multiline]}
                placeholder={placeholder}
                placeholderTextColor={theme.colors.textSecondary}
                value={item[field]}
                onChangeText={text => {
                  const copy = [...items];
                  copy[idx] = { ...copy[idx], [field]: text };
                  setItems(copy);
                }}
                multiline={isDesc}
                maxLength={isDesc ? 300 : undefined}
              />
            );
          })}
      </View>
    ))}

    <ThemedButton
      title={`+ Add ${title}`}
      onPress={() =>
        setItems([
          ...items,
          Object.fromEntries(fields.map(f => [f, ''])) as Entry
        ])
      }
    />
  </View>
);

export default function ResumeInputScreen({ navigation, route }: any) {
  const { width } = useWindowDimensions();
  const contentWidth = width < MAX_CONTENT_WIDTH ? width * 0.95 : MAX_CONTENT_WIDTH;
  const prefill = route.params?.prefill as
    | {
        personal: Entry;
        education: Entry[];
        projects: Entry[];
        experience: Entry[];
        achievements: Entry[];
      }
    | null;

  // anonymous sign-in
  useEffect(() => {
    if (!auth.currentUser) signInAnonymously(auth).catch(console.error);
  }, []);

  // state
  const [personal, setPersonal] = useState<Entry>(
    prefill?.personal ?? {
      name: '',
      contact: '',
      location: '',
      email: '',
      github: '',
      linkedin: ''
    }
  );
  const [education, setEducation] = useState<Entry[]>(
    prefill?.education ?? [
      { university: '', degree: '', major: '', minor: '', gradDate: '', gpa: '' }
    ]
  );
  const [projects, setProjects] = useState<Entry[]>(
    prefill?.projects ?? [
      { title: '', skills: '', description: '', date_from: '', date_to: '' }
    ]
  );
  const [experience, setExperience] = useState<Entry[]>(
    prefill?.experience ?? [
      { title: '', skills: '', description: '', date_from: '', date_to: '' }
    ]
  );
  const [achievements, setAchievements] = useState<Entry[]>(
    prefill?.achievements ?? [
      { title: '', from: '', description: '', date_from: '', date_to: '' }
    ]
  );

  const steps = ['Personal', 'Education', 'Projects', 'Experience', 'Achievements'];
  const [step, setStep] = useState(0);

  const handleSave = async () => {
    // validate personal
    const required: (keyof Entry)[] = ['name', 'contact', 'email', 'linkedin'];
    for (const field of required) {
      if (!(personal[field]?.trim())) {
        return Alert.alert('Missing Info', `Please fill in your ${field}.`);
      }
    }

    // filter sections
    const filteredEdu = education.filter(e =>
      e.university && e.degree && e.major && e.gradDate && e.gpa
    );
    const filteredProj = projects.filter(p =>
      p.title && p.skills && p.description && p.date_from
    );
    const filteredExp = experience.filter(ex =>
      ex.title && ex.skills && ex.description && ex.date_from
    );
    const filteredAch = achievements.filter(a =>
      a.title && a.from && a.description && a.date_from
    );

    const totalCount =
      filteredEdu.length + filteredProj.length + filteredExp.length + filteredAch.length;
    if (totalCount < 3) {
      return Alert.alert('Too Few Items', 'Please add at least 3 total entries.');
    }

    const uid = auth.currentUser?.uid;
    if (!uid) return Alert.alert('Error', 'Not logged in');

    try {
      await setDoc(doc(db, 'users', uid, 'resumeData', 'main'), {
        uid,
        personal,
        education: filteredEdu,
        projects: filteredProj,
        experience: filteredExp,
        achievements: filteredAch
      });
      Alert.alert('Success', 'Data saved.');
      navigation.getParent()?.navigate('JDFlow', { screen: 'JDInput' });
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <View>
            {Object.entries(personal).map(([key, val]) => (
              <View key={key} style={{ marginBottom: theme.spacing.sm }}>
                <Text style={styles.label}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                  {!['github', 'location'].includes(key) && (
                    <Text style={styles.star}> *</Text>
                  )}
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder={key}
                  placeholderTextColor={theme.colors.textSecondary}
                  value={val}
                  onChangeText={txt => setPersonal(prev => ({ ...prev, [key]: txt }))}
                />
              </View>
            ))}
          </View>
        );
      case 1:
        return (
          <Section
            title="Education"
            fields={['university', 'degree', 'major', 'minor', 'gradDate', 'gpa']}
            items={education}
            setItems={setEducation}
          />
        );
      case 2:
        return (
          <Section
            title="Projects"
            fields={['title', 'skills', 'description', 'date_from', 'date_to']}
            items={projects}
            setItems={setProjects}
          />
        );
      case 3:
        return (
          <Section
            title="Experience"
            fields={['title', 'skills', 'description', 'date_from', 'date_to']}
            items={experience}
            setItems={setExperience}
          />
        );
      case 4:
        return (
          <Section
            title="Achievements"
            fields={['title', 'from', 'description', 'date_from', 'date_to']}
            items={achievements}
            setItems={setAchievements}
          />
        );
      default:
        return null;
    }
  };

  return (
    <LinearGradient
      style={styles.gradient}
      colors={[theme.gradient.start, theme.gradient.end]}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={[
            styles.innerContainer,
            { width: contentWidth }
          ]}
        >
          <Text style={styles.header}>{steps[step]}</Text>

          {renderStep()}

          <View style={styles.nav}>
            {step > 0 && (
              <ThemedButton title="Previous" onPress={() => setStep(step - 1)} />
            )}
            {step < steps.length - 1 && (
              <ThemedButton title="Next" onPress={() => setStep(step + 1)} />
            )}
            {step === steps.length - 1 && (
              <ThemedButton title="Save Resume Data" onPress={handleSave} />
            )}
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}


const styles = StyleSheet.create({
  gradient: {
    flex: 1
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  innerContainer: {
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,          // uses the constant you defined
    paddingHorizontal: theme.spacing.md,
  },
  header: {
    fontSize: theme.typography.fontSizes.h2,
    fontFamily: theme.typography.fontFamily,
    color: theme.colors.buttonText,
    marginBottom: theme.spacing.md
  },
  label: {
    fontSize: theme.typography.fontSizes.body,
    fontFamily: theme.typography.fontFamily,
    color: theme.colors.buttonText,
    marginBottom: theme.spacing.xs
  },
  star: {
    color: '#EF4444'  // red for required
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.card,
    padding: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.surface,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSizes.body,
    marginBottom: theme.spacing.sm
  },
  multiline: {
    height: 80,
    textAlignVertical: 'top'
  },
  section: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.lg
  },
  subHeader: {
    fontSize: theme.typography.fontSizes.h2,
    fontFamily: theme.typography.fontFamily,
    color: theme.colors.buttonText,
    marginBottom: theme.spacing.sm
  },
  box: {
    elevation: 12,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    zIndex: 15,
    backgroundColor: theme.colors.gradientEnd,
    borderRadius: theme.radii.card,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm
  },
  dateInput: {
    flex: 1,
    marginRight: theme.spacing.sm,
    backgroundColor: theme.colors.surface
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.lg
  }
});
