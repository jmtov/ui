import { describe, expect, test } from 'bun:test';
import { shiftToFit } from './TooltipHost.utils';

describe('shiftToFit', () => {
  test('0 si cabe', () => {
    expect(shiftToFit(20, 120, 400, 8)).toBe(0);
  });

  test('lo corre a la derecha si se sale por la izquierda', () => {
    expect(shiftToFit(-5, 80, 400, 8)).toBe(13);
  });

  test('lo corre a la izquierda si se sale por la derecha', () => {
    expect(shiftToFit(320, 410, 400, 8)).toBe(-18);
  });
});
