/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CameraPreview from '../src/modules/camera/components/CameraPreview';
import { RootNavigator } from '../src/navigation';

const metrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

const textOf = (node: unknown): string[] => {
  if (typeof node === 'string') {
    return [node];
  }
  if (Array.isArray(node)) {
    return node.flatMap(textOf);
  }
  if (node && typeof node === 'object' && 'children' in node) {
    return textOf((node as { children: unknown }).children);
  }
  return [];
};

const render = async (element: React.ReactElement) => {
  let tree: ReactTestRenderer.ReactTestRenderer | null = null;
  // Async act so the metrics promise settles before we read the tree.
  await ReactTestRenderer.act(async () => {
    tree = ReactTestRenderer.create(element);
  });
  const text = textOf(tree!.toJSON()).join(' ');
  await ReactTestRenderer.act(async () => {
    tree!.unmount();
  });
  return text;
};

test('home screen renders the daily summary and camera entry point', async () => {
  const text = await render(
    <SafeAreaProvider initialMetrics={metrics}>
      <RootNavigator />
    </SafeAreaProvider>,
  );

  expect(text).toContain('Nuets');
  expect(text).toContain('TODAY');
  expect(text).toContain('Health Score');
  expect(text).toContain('7.4');
  expect(text).toContain('1,840');
  expect(text).toContain('Protein');
  expect(text).toContain('RECENT MEALS');
  expect(text).toContain('Avocado toast');
  expect(text).toContain('Scan a meal');
});

test('camera preview asks for permission when it has none', async () => {
  const text = await render(<CameraPreview />);

  expect(text).toContain('Camera permission is needed to show the preview.');
  expect(text).toContain('Grant permission');
});
