/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import ScanModeToggle from '../src/modules/camera/components/ScanModeToggle';
import { SCAN_MODES } from '../src/modules/food/constants';

const findPressable = (
  tree: ReactTestRenderer.ReactTestRenderer,
  label: string,
) =>
  tree.root
    .findAll(node => node.props.accessibilityLabel === label)
    .find(node => typeof node.props.onPress === 'function')!;

describe('ScanModeToggle', () => {
  it('offers both modes and reports the one that was tapped', async () => {
    const onChange = jest.fn();

    let tree: ReactTestRenderer.ReactTestRenderer | null = null;
    await ReactTestRenderer.act(async () => {
      tree = ReactTestRenderer.create(
        <ScanModeToggle value="normal" onChange={onChange} />,
      );
    });

    const json = JSON.stringify(tree!.toJSON());
    expect(json).toContain('Normal');
    expect(json).toContain('Pro');
    // The caption follows the selected mode.
    expect(json).toContain(SCAN_MODES.normal.caption);

    await ReactTestRenderer.act(async () => {
      findPressable(tree!, 'Pro scan mode').props.onPress();
    });

    expect(onChange).toHaveBeenCalledWith('pro');

    await ReactTestRenderer.act(async () => {
      tree!.unmount();
    });
  });
});
