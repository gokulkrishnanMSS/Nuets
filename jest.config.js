module.exports = {
  preset: '@react-native/jest-preset',
  // The RN preset only transpiles react-native itself; these ship untranspiled
  // ESM and have to go through Babel too.
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?' +
      '|@react-navigation|react-native-screens|react-native-svg' +
      '|react-native-safe-area-context|react-native-vision-camera' +
      '|@react-native-async-storage|lottie-react-native|react-native-chart-kit' +
      '|react-native-reanimated|react-native-worklets)/)',
  ],
};
