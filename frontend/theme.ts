import { Platform } from 'react-native';

// ——————————————————
// Colors
// ——————————————————
export const colors = {
  gradientStart: '#2E005F',   // deep purple (bottom-left)
  gradientEnd:   '#E100FF',   // vibrant pink (top-right)
  button:        '#9333EA',   // primary button fill (optional accent)
  buttonText:    '#FFFFFF',   // buttons & headlines
  textPrimary:   '#111827',   // dark on light (if needed)
  textSecondary: '#6B7280',   // gray
  background:    '#FFFFFF',   // white fallback
  surface:       '#F3F4F6',   // light gray cards / inputs
};

// ——————————————————
// Border Radii
// ——————————————————
export const radii = {
  button: 24,  // pill-shape
  card:    8,
};

// ——————————————————
// Spacing (multiples of 8px)
// ——————————————————
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

// ——————————————————
// Typography
// ——————————————————
export const typography = {
  fontFamily: Platform.OS === 'ios' ? 'Inter' : 'Roboto',
  fontSizes: {
    h1: 32,
    h2: 24,
    body: 16,
    caption: 12,
  },
};

export default {
  colors,
  radii,
  spacing,
  typography,
  gradient: {
    start: colors.gradientStart,
    end:   colors.gradientEnd
  },
};