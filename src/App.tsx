/**
 * @format
 */

import React, { useEffect } from 'react';
import { StatusBar, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from './common/constants';
import { hydrateBaseUrl } from './common/services';
import { RootNavigator } from './navigation';

function App() {
  useEffect(() => {
    hydrateBaseUrl();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <RootNavigator />
      </View>
    </SafeAreaProvider>
  );
}

export default App;
