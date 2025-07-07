import React, { useRef } from 'react';
import {
  Animated,
  Pressable,
  Text,
  StyleSheet,
  GestureResponderEvent,
  View,
  ViewStyle,
  TextStyle
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../theme';

type Variant = 'small' | 'medium' | 'large';

interface Props {
  title: string;
  onPress: (e: GestureResponderEvent) => void;
  variant?: Variant;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

const sizeStyles = {
  small: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    fontSize: theme.typography.fontSizes.caption,
  },
  medium: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    fontSize: theme.typography.fontSizes.body,
  },
  large: {
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    fontSize: theme.typography.fontSizes.h2,
  },
};

export default function ThemedButton({
  title,
  onPress,
  variant = 'medium',
  style,
  textStyle,
  disabled = false
}: Props) {
  const anim = useRef(new Animated.Value(1)).current;
  const { paddingVertical, paddingHorizontal, fontSize } = sizeStyles[variant];

  const handlePressIn = () => {
    if (!disabled) {
      Animated.spring(anim, { toValue: 0.95, useNativeDriver: true }).start();
    }
  };

  const handlePressOut = () => {
    if (!disabled) {
      Animated.spring(anim, { toValue: 1, useNativeDriver: true }).start();
    }
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={{ marginVertical: theme.spacing.xs }}
    >
      <Animated.View
        style={[
          styles.button,
          {
            paddingVertical,
            paddingHorizontal,
            transform: [{ scale: anim }]
          },
          style
        ]}
      >
        {disabled ? (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.colors.surface }]} />
        ) : (
          <LinearGradient
            style={StyleSheet.absoluteFill}
            start={[0, 1]}
            end={[1, 0]}
            colors={[theme.gradient.start, theme.gradient.end]}
          />
        )}
        <Text
          style={[
            styles.text,
            {
              fontSize,
              lineHeight: fontSize * 1.2,
              opacity: disabled ? 0.4 : 1
            },
            textStyle
          ]}
        >
          {title}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.radii.button,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  text: {
    color: theme.colors.buttonText,
    fontFamily: theme.typography.fontFamily,
    zIndex: 1
  },
});
