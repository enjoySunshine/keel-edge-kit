import type { Mask } from '../Mask.ts';
import type { Point } from '../utils/geometry/points.ts';

import type { GetBorderPointsOptions } from './maskAnalysis.types.ts';

// TODO: This function could be optimised by following the contour instead of scanning all pixels.
/**
 * Return an array with the coordinates of the pixels that are on the border of the mask.
 * Each border point appears exactly once, in the order in which it is first encountered.
 * The reference is the top-left corner of the ROI.
 * @param mask - Mask to process.
 * @param options - Get border points options.
 * @returns The array of border pixels.
 */
export function getBorderPoints(
  mask: Mask,
  options: GetBorderPointsOptions = {},
): Point[] {
  const { innerBorders = false, allowCorners = false } = options;

  if (!innerBorders) {
    mask = mask.solidFill();
  }

  const borders: Point[] = [];
  // Frame pixels are visited twice (once per axis) and interior pixels may match
  // both the orthogonal and the corner test, so we keep track of what was already
  // added to return each border point exactly once, in first-seen order.
  const seen = new Set<number>();
  const addBorder = (column: number, row: number) => {
    const index = row * mask.width + column;
    if (!seen.has(index)) {
      seen.add(index);
      borders.push({ column, row });
    }
  };

  // first process frame pixels
  for (let column = 0; column < mask.width; column++) {
    if (mask.getBit(column, 0)) {
      addBorder(column, 0);
    }
    if (mask.getBit(column, mask.height - 1)) {
      addBorder(column, mask.height - 1);
    }
  }
  for (let row = 0; row < mask.height; row++) {
    if (mask.getBit(0, row)) {
      addBorder(0, row);
    }
    if (mask.getBit(mask.width - 1, row)) {
      addBorder(mask.width - 1, row);
    }
  }

  for (let row = 1; row < mask.height - 1; row++) {
    for (let column = 1; column < mask.width - 1; column++) {
      if (mask.getBit(column, row)) {
        if (
          mask.getBit(column - 1, row) === 0 ||
          mask.getBit(column, row - 1) === 0 ||
          mask.getBit(column + 1, row) === 0 ||
          mask.getBit(column, row + 1) === 0
        ) {
          addBorder(column, row);
        }

        if (
          allowCorners &&
          (mask.getBit(column - 1, row - 1) === 0 ||
            mask.getBit(column - 1, row + 1) === 0 ||
            mask.getBit(column + 1, row - 1) === 0 ||
            mask.getBit(column + 1, row + 1) === 0)
        ) {
          addBorder(column, row);
        }
      }
    }
  }

  return borders;
}
