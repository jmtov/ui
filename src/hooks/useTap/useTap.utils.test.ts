import { describe, expect, test } from 'bun:test';
import { isEchoOfTap, isTap } from './useTap.utils';

const point = (x: number, y: number, time: number) => ({ x, y, time });

describe('isTap', () => {
  test('un toque corto sin movimiento', () => {
    expect(isTap(point(100, 100, 0), point(102, 101, 120))).toBe(true);
  });

  test('un arrastre no es un toque', () => {
    expect(isTap(point(100, 100, 0), point(100, 160, 120))).toBe(false);
  });

  test('quedarse apoyado mucho rato tampoco', () => {
    expect(isTap(point(100, 100, 0), point(100, 100, 900))).toBe(false);
  });
});

describe('isEchoOfTap', () => {
  test('un click justo después de un toque es su eco', () => {
    expect(isEchoOfTap(1000, 1050)).toBe(true);
  });

  test('un click mucho después es otra acción (mouse, teclado, otro toque)', () => {
    expect(isEchoOfTap(1000, 2500)).toBe(false);
  });

  test('sin toques previos no es eco', () => {
    expect(isEchoOfTap(0, 5000)).toBe(false);
  });
});
