import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  Text,
  View,
} from 'react-native';
import {
  Camera,
  CommonResolutions,
  useCameraDevice,
  useCameraPermission,
  usePhotoOutput,
} from 'react-native-vision-camera';
import { colors, radius, spacing } from '../../../common/constants';

type CameraPreviewProps = {
  /** Pause the preview (e.g. when the screen loses focus). */
  active?: boolean;
  position?: 'back' | 'front';
  /** Receives the filesystem path of the captured photo (no `file://`). */
  onCapture?: (filePath: string) => void;
  onCaptureError?: (error: Error) => void;
};

function CameraPreview({
  active = true,
  position = 'back',
  onCapture,
  onCaptureError,
}: CameraPreviewProps) {
  const { hasPermission, requestPermission } = useCameraPermission();

  // Check the device ourselves: rendering <Camera> with a null device throws
  // and takes the tree down, e.g. on emulators without a camera.
  const device = useCameraDevice(position);

  // JPEG so the multipart upload can honestly declare image/jpeg — the default
  // ('native') yields HEIC on iOS. 768x1024 is plenty for recognition and
  // keeps the upload small.
  const photoOutput = usePhotoOutput({
    containerFormat: 'jpeg',
    targetResolution: CommonResolutions.HD_4_3,
  });

  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  const handleCapture = useCallback(async () => {
    if (isCapturing) {
      return;
    }
    setIsCapturing(true);
    try {
      // capturePhotoToFile writes to the app's temporary directory only — the
      // photo is never copied into the photo library or app storage.
      const photo = await photoOutput.capturePhotoToFile(
        { flashMode: 'off' },
        {},
      );
      onCapture?.(photo.filePath);
    } catch (caught) {
      onCaptureError?.(
        caught instanceof Error ? caught : new Error(String(caught)),
      );
    } finally {
      setIsCapturing(false);
    }
  }, [isCapturing, onCapture, onCaptureError, photoOutput]);

  if (!hasPermission) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: spacing.lg,
          backgroundColor: colors.background,
        }}
      >
        <Text
          style={{
            color: colors.textPrimary,
            fontSize: 14,
            textAlign: 'center',
            marginBottom: spacing.md,
          }}
        >
          Camera permission is needed to show the preview.
        </Text>
        <Pressable
          onPress={requestPermission}
          style={{
            backgroundColor: colors.positive,
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: radius.md,
          }}
        >
          <Text style={{ color: colors.surface, fontWeight: '600' }}>
            Grant permission
          </Text>
        </Pressable>
        <Pressable
          onPress={() => Linking.openSettings()}
          style={{ marginTop: spacing.md, padding: spacing.xs }}
        >
          <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
            Open Settings
          </Text>
        </Pressable>
      </View>
    );
  }

  if (device == null) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: spacing.lg,
          backgroundColor: colors.background,
        }}
      >
        <Text
          style={{ color: colors.textSecondary, fontSize: 14, textAlign: 'center' }}
        >
          No camera device available. Try on a real device.
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#000000', overflow: 'hidden' }}>
      <Camera
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        device={device}
        outputs={[photoOutput]}
        isActive={active}
      />

      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          alignItems: 'center',
          paddingBottom: spacing.xl + spacing.md,
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Capture photo"
          onPress={handleCapture}
          disabled={isCapturing}
          style={{
            width: 76,
            height: 76,
            borderRadius: 38,
            borderWidth: 4,
            borderColor: 'rgba(255,255,255,0.6)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: isCapturing ? colors.textSecondary : '#FFFFFF',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isCapturing && <ActivityIndicator color={colors.surface} />}
          </View>
        </Pressable>
      </View>
    </View>
  );
}

export default CameraPreview;
