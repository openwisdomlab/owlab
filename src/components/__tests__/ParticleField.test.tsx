import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { ParticleField } from '../brand/ParticleField';

// Mock getBoundingClientRect for the canvas element
HTMLCanvasElement.prototype.getBoundingClientRect = vi.fn(() => ({
  width: 800,
  height: 600,
  top: 0,
  left: 0,
  right: 800,
  bottom: 600,
  x: 0,
  y: 0,
  toJSON: () => {},
}));

// Mock canvas getContext to return a minimal 2d context stub
HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
  clearRect: vi.fn(),
  beginPath: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  stroke: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  fillStyle: '',
  strokeStyle: '',
  lineWidth: 1,
  shadowBlur: 0,
  shadowColor: '',
})) as unknown as typeof HTMLCanvasElement.prototype.getContext;

describe('ParticleField', () => {
  it('renders a canvas element', () => {
    const { container } = render(<ParticleField />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<ParticleField className="my-field" />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toHaveClass('my-field');
  });

  it('sets inline styles for full-size display', () => {
    const { container } = render(<ParticleField />);
    const canvas = container.querySelector('canvas') as HTMLCanvasElement;
    expect(canvas.style.display).toBe('block');
    expect(canvas.style.width).toBe('100%');
    expect(canvas.style.height).toBe('100%');
  });
});
