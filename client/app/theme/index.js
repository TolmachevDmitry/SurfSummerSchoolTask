export const colors = {
  background: '#fbf7f1',
  surface: '#ffffff',
  surfaceMuted: '#f3ece1',
  border: '#e6dccd',
  borderStrong: '#d3c4ab',

  text: '#1f1b16',
  textMuted: '#6b6253',
  textOnPrimary: '#ffffff',
  textInverse: '#ffffff',

  primary: '#b5471f',
  primaryDark: '#8f3514',
  primarySoft: '#fbe6dc',
  accent: '#caa14a',

  success: '#2f7d4f',
  successSoft: '#e1f1e7',
  warning: '#b8860b',
  warningSoft: '#f8eed1',
  danger: '#c0392b',
  dangerSoft: '#f8e1de',
  info: '#2c5f8d',
  infoSoft: '#dde9f3',

  disabled: '#c9bfb0',
  disabledText: '#ffffff',
  overlay: 'rgba(15, 12, 8, 0.45)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  none: 0,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  pill: 999,
};

export const typography = {
  title: { fontSize: 28, fontWeight: '700', color: colors.text },
  h1: { fontSize: 24, fontWeight: '700', color: colors.text },
  h2: { fontSize: 20, fontWeight: '600', color: colors.text },
  h3: { fontSize: 17, fontWeight: '600', color: colors.text },
  body: { fontSize: 16, fontWeight: '400', color: colors.text, lineHeight: 22 },
  bodyMuted: { fontSize: 16, fontWeight: '400', color: colors.textMuted, lineHeight: 22 },
  caption: { fontSize: 13, fontWeight: '400', color: colors.textMuted, lineHeight: 18 },
  label: { fontSize: 15, fontWeight: '600', color: colors.text },
  button: { fontSize: 17, fontWeight: '600', color: colors.textOnPrimary },
};

export const theme = {
  colors,
  spacing,
  radius,
  typography,
};

export default theme;
