/**
 * Reanimated initialises native shareables at import time, which no TurboModule
 * backs under Jest — and on this nightly the package's own `mock.js` re-imports
 * the real entry point, so it cannot stand in either. This covers the surface
 * the app uses: animated values resolve to their target immediately, so a
 * rendered tree shows the end state of every animation.
 *
 * Jest picks this up automatically for the node module.
 *
 * @format
 */

const React = require('react');
const { Text, View } = require('react-native');

const passThrough = toValue => toValue;

const Animated = {
  View: React.forwardRef((props, ref) =>
    React.createElement(View, { ...props, ref }),
  ),
  Text: React.forwardRef((props, ref) =>
    React.createElement(Text, { ...props, ref }),
  ),
};

module.exports = {
  __esModule: true,
  default: Animated,
  useSharedValue: initial => ({ value: initial }),
  useAnimatedStyle: factory => factory(),
  useDerivedValue: factory => ({ value: factory() }),
  withSpring: passThrough,
  withTiming: (toValue, _config, callback) => {
    callback?.(true);
    return toValue;
  },
  withDelay: (_delay, animation) => animation,
  withSequence: (...animations) => animations[animations.length - 1],
  withRepeat: passThrough,
  runOnJS: fn => fn,
  runOnUI: fn => fn,
  Easing: {
    linear: passThrough,
    ease: passThrough,
    out: passThrough,
    inOut: passThrough,
  },
};
