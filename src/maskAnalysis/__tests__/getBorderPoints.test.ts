import { expect, test } from 'vitest';

import { Mask } from '../../Mask.ts';

test('3x3 mask', () => {
  const mask = testUtils.createMask([
    [0, 1, 0],
    [1, 1, 1],
    [0, 1, 0],
  ]);

  const points = mask.getBorderPoints();

  const bordersMask = Mask.fromPoints(mask.width, mask.height, points);

  expect(bordersMask).toMatchMaskData([
    [0, 1, 0],
    [1, 0, 1],
    [0, 1, 0],
  ]);
});

test('5x6 mask with hole, no inner borders', () => {
  const mask = testUtils.createMask([
    [0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
    [0, 1, 0, 1, 0],
    [0, 1, 1, 1, 0],
    [0, 1, 1, 1, 1],
    [0, 0, 0, 0, 0],
  ]);
  const points = mask.getBorderPoints({ innerBorders: false });

  const bordersMask = Mask.fromPoints(mask.width, mask.height, points);

  expect(bordersMask).toMatchMaskData([
    [0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
    [0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0],
    [0, 1, 1, 1, 1],
    [0, 0, 0, 0, 0],
  ]);
});

test('5x5 mask with hole, inner borders, allow corners', () => {
  const mask = testUtils.createMask([
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
  ]);

  const points = mask.getBorderPoints({
    innerBorders: true,
    allowCorners: true,
  });
  const bordersMask = Mask.fromPoints(mask.width, mask.height, points);

  expect(bordersMask).toMatchMask(mask);
});

test('5x6 mask with hole, inner borders', () => {
  const mask = testUtils.createMask([
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 0],
    [1, 0, 1, 1, 0],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 0],
  ]);
  const points = mask.getBorderPoints({ innerBorders: true });

  const bordersMask = Mask.fromPoints(mask.width, mask.height, points);

  expect(bordersMask).toMatchMaskData([
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
    [1, 1, 0, 1, 0],
    [1, 0, 1, 1, 0],
    [1, 1, 0, 0, 1],
    [1, 1, 1, 1, 0],
  ]);
});

test('solid 3x3 mask, each border point appears once', () => {
  const mask = testUtils.createMask([
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1],
  ]);

  expect(mask.getBorderPoints()).toStrictEqual([
    { column: 0, row: 0 },
    { column: 0, row: 2 },
    { column: 1, row: 0 },
    { column: 1, row: 2 },
    { column: 2, row: 0 },
    { column: 2, row: 2 },
    { column: 0, row: 1 },
    { column: 2, row: 1 },
  ]);
});

test('single row mask, each border point appears once', () => {
  const mask = testUtils.createMask([[1, 1, 1]]);

  expect(mask.getBorderPoints()).toStrictEqual([
    { column: 0, row: 0 },
    { column: 1, row: 0 },
    { column: 2, row: 0 },
  ]);
});

test('single column mask, each border point appears once', () => {
  const mask = testUtils.createMask([[1], [1], [1]]);

  expect(mask.getBorderPoints()).toStrictEqual([
    { column: 0, row: 0 },
    { column: 0, row: 2 },
    { column: 0, row: 1 },
  ]);
});

test('cross mask', () => {
  const mask = testUtils.createMask([
    [0, 1, 0],
    [1, 1, 1],
    [0, 1, 0],
  ]);

  expect(mask.getBorderPoints()).toStrictEqual([
    { column: 1, row: 0 },
    { column: 1, row: 2 },
    { column: 0, row: 1 },
    { column: 2, row: 1 },
  ]);
});

test('diagonal neighbours on empty corners, allow corners', () => {
  const mask = testUtils.createMask([
    [0, 1, 1],
    [1, 1, 0],
    [1, 1, 1],
  ]);

  expect(mask.getBorderPoints({ allowCorners: true })).toStrictEqual([
    { column: 0, row: 2 },
    { column: 1, row: 0 },
    { column: 1, row: 2 },
    { column: 2, row: 0 },
    { column: 2, row: 2 },
    { column: 0, row: 1 },
    { column: 1, row: 1 },
  ]);
});

test('diagonal neighbours on empty corners, filled, allow corners', () => {
  const mask = testUtils.createMask([
    [0, 1, 1],
    [1, 1, 1],
    [1, 1, 1],
  ]);

  expect(mask.getBorderPoints({ allowCorners: true })).toStrictEqual([
    { column: 0, row: 2 },
    { column: 1, row: 0 },
    { column: 1, row: 2 },
    { column: 2, row: 0 },
    { column: 2, row: 2 },
    { column: 0, row: 1 },
    { column: 2, row: 1 },
    { column: 1, row: 1 },
  ]);
});

test('diagonal neighbours on empty corners, filled, no corners', () => {
  const mask = testUtils.createMask([
    [0, 1, 1],
    [1, 1, 1],
    [1, 1, 1],
  ]);

  expect(mask.getBorderPoints()).toStrictEqual([
    { column: 0, row: 2 },
    { column: 1, row: 0 },
    { column: 1, row: 2 },
    { column: 2, row: 0 },
    { column: 2, row: 2 },
    { column: 0, row: 1 },
    { column: 2, row: 1 },
  ]);
});

test('7x7 solid square with a hole, inner borders', () => {
  const mask = testUtils.createMask([
    [0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 0, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ]);

  expect(mask.getBorderPoints({ innerBorders: true })).toStrictEqual([
    { column: 1, row: 1 },
    { column: 2, row: 1 },
    { column: 3, row: 1 },
    { column: 4, row: 1 },
    { column: 5, row: 1 },
    { column: 1, row: 2 },
    { column: 3, row: 2 },
    { column: 5, row: 2 },
    { column: 1, row: 3 },
    { column: 2, row: 3 },
    { column: 4, row: 3 },
    { column: 5, row: 3 },
    { column: 1, row: 4 },
    { column: 3, row: 4 },
    { column: 5, row: 4 },
    { column: 1, row: 5 },
    { column: 2, row: 5 },
    { column: 3, row: 5 },
    { column: 4, row: 5 },
    { column: 5, row: 5 },
  ]);
});

test('7x7 solid square, hole filled, inner borders', () => {
  const mask = testUtils.createMask([
    [0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ]);

  expect(mask.getBorderPoints({ innerBorders: true })).toStrictEqual([
    { column: 1, row: 1 },
    { column: 2, row: 1 },
    { column: 3, row: 1 },
    { column: 4, row: 1 },
    { column: 5, row: 1 },
    { column: 1, row: 2 },
    { column: 5, row: 2 },
    { column: 1, row: 3 },
    { column: 5, row: 3 },
    { column: 1, row: 4 },
    { column: 5, row: 4 },
    { column: 1, row: 5 },
    { column: 2, row: 5 },
    { column: 3, row: 5 },
    { column: 4, row: 5 },
    { column: 5, row: 5 },
  ]);
});
