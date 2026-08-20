/**
 * LottieView renders through a native fabric component that does not exist
 * under Jest. Jest picks this up automatically for the node module.
 *
 * @format
 */

const React = require('react');

module.exports = {
  __esModule: true,
  default: props => React.createElement('LottieView', props),
};
