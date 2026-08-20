module.exports = {
  presets: ['module:@react-native/babel-preset'],
  // Reanimated 4 compiles worklets through this plugin, which now ships in
  // react-native-worklets. It has to stay last in the list.
  plugins: ['react-native-worklets/plugin'],
};
