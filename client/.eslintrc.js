module.exports = {
  root: true,
  extends: ['expo'],
  ignorePatterns: [
    '/node_modules/**',
    '/android/**',
    '/ios/**',
    '/.expo/**',
    '/dist/**',
  ],
  env: {
    node: true,
    jest: true,
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx'],
      },
    },
    'import/ignore': ['expo', 'expo-status-bar', 'expo-secure-store', 'expo-constants'],
  },
};
