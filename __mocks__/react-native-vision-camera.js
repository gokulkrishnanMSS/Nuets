/**
 * VisionCamera reaches for its native TurboModule at import time, which does
 * not exist under Jest. Jest picks this up automatically for the node module.
 *
 * @format
 */

const React = require('react');

module.exports = {
  Camera: props => React.createElement('Camera', props),
  useCameraDevice: () => undefined,
  useCameraPermission: () => ({
    hasPermission: false,
    requestPermission: jest.fn(async () => false),
  }),
  usePhotoOutput: () => ({
    capturePhoto: jest.fn(),
    capturePhotoToFile: jest.fn(async () => ({ filePath: '/tmp/photo.jpg' })),
    prepareSettings: jest.fn(),
  }),
  usePreviewOutput: () => ({}),
  useCameraFormat: () => undefined,
  useCameraDevices: () => [],
  CommonResolutions: {
    VGA_4_3: { width: 480, height: 640 },
    HD_4_3: { width: 768, height: 1024 },
    UHD_4_3: { width: 3024, height: 4032 },
  },
};
