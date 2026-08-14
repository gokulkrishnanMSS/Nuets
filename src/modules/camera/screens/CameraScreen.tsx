import React, { useCallback } from 'react';
import { Alert, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CameraPreview } from '../components';
import { useIsCameraActive } from '../hooks';

function CameraScreen() {
  const navigation = useNavigation();
  const isActive = useIsCameraActive();

  const handleCapture = useCallback(
    (photoPath: string) => {
      navigation.navigate('FoodResult', { photoPath });
    },
    [navigation],
  );

  const handleCaptureError = useCallback((error: Error) => {
    Alert.alert('Could not take the photo', error.message);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#000000' }}>
      <CameraPreview
        active={isActive}
        onCapture={handleCapture}
        onCaptureError={handleCaptureError}
      />
    </View>
  );
}

export default CameraScreen;
