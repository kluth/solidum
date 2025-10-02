import { createElement, useState } from '@solidum/core';
import { cn } from '@solidum/utils';

export interface Chart3DDataPoint {
  x: number;
  y: number;
  z?: number;
  label?: string;
  color?: string;
}

export interface Chart3DProps {
  data: Chart3DDataPoint[];
  type?: 'bar' | 'line' | 'scatter' | 'surface';
  width?: number;
  height?: number;
  interactive?: boolean;
  animated?: boolean;
  showGrid?: boolean;
  showAxes?: boolean;
  perspective?: number;
  rotation?: { x: number; y: number; z: number };
  className?: string;
}

export function Chart3D(props: Chart3DProps) {
  const {
    data,
    type = 'bar',
    width = 600,
    height = 400,
    interactive = true,
    animated = true,
    showGrid = true,
    perspective = 1000,
    rotation = { x: 20, y: 30, z: 0 },
    className,
  } = props;

  const currentRotation = useState(rotation);
  const isDragging = useState(false);
  const lastMouse = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: MouseEvent) => {
    if (interactive) {
      isDragging(true);
      lastMouse({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging() && interactive) {
      const dx = e.clientX - lastMouse().x;
      const dy = e.clientY - lastMouse().y;

      const rot = currentRotation();
      currentRotation({
        x: rot.x + dy * 0.5,
        y: rot.y + dx * 0.5,
        z: rot.z,
      });

      lastMouse({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    isDragging(false);
  };

  // Calculate max values for scaling
  const maxX = Math.max(...data.map(d => d.x));
  const maxY = Math.max(...data.map(d => d.y));
  const maxZ = data[0]?.z !== undefined ? Math.max(...data.map(d => d.z || 0)) : maxY;

  const scale = Math.min(width, height) / 3;

  const transform = (x: number, y: number, z: number) => {
    const rot = currentRotation();

    // Normalize coordinates
    const nx = (x / maxX - 0.5) * scale;
    const ny = (y / maxY - 0.5) * scale;
    const nz = (z / maxZ - 0.5) * scale;

    // Apply 3D rotation
    const radX = (rot.x * Math.PI) / 180;
    const radY = (rot.y * Math.PI) / 180;

    // Rotate around Y axis
    const x1 = nx * Math.cos(radY) - nz * Math.sin(radY);
    const z1 = nx * Math.sin(radY) + nz * Math.cos(radY);

    // Rotate around X axis
    const y1 = ny * Math.cos(radX) - z1 * Math.sin(radX);
    const z2 = ny * Math.sin(radX) + z1 * Math.cos(radX);

    // Apply perspective
    const perspectiveFactor = perspective / (perspective + z2);

    return {
      x: x1 * perspectiveFactor + width / 2,
      y: y1 * perspectiveFactor + height / 2,
      scale: perspectiveFactor,
    };
  };

  return createElement(
    'div',
    { className: cn('solidum-chart3d-wrapper', className) },
    createElement(
      'svg',
      {
        className: cn('solidum-chart3d', {
          'solidum-chart3d--animated': animated,
          'solidum-chart3d--interactive': interactive,
        }),
        width,
        height,
        xmlns: 'http://www.w3.org/2000/svg',
        onMouseDown: handleMouseDown,
        onMouseMove: handleMouseMove,
        onMouseUp: handleMouseUp,
        onMouseLeave: handleMouseUp,
        style: { cursor: interactive ? (isDragging() ? 'grabbing' : 'grab') : 'default' },
      },
      // Background
      createElement('rect', {
        width,
        height,
        fill: '#0a0e27',
        rx: 8,
      }),

      // Grid
      showGrid &&
        createElement(
          'g',
          { className: 'solidum-chart3d-grid', opacity: 0.2 },
          ...[...Array(10)].map((_, i) => {
            const y = (i / 10) * maxY;
            const p1 = transform(0, y, 0);
            const p2 = transform(maxX, y, 0);
            return createElement('line', {
              x1: p1.x,
              y1: p1.y,
              x2: p2.x,
              y2: p2.y,
              stroke: '#667eea',
              strokeWidth: 1,
            });
          })
        ),

      // Data points
      type === 'bar' &&
        createElement(
          'g',
          { className: 'solidum-chart3d-bars' },
          ...data.map((point, index) => {
            const base = transform(point.x, 0, point.z || 0);
            const top = transform(point.x, point.y, point.z || 0);
            const barWidth = 20 * base.scale;

            return createElement(
              'g',
              {},
              // Bar
              createElement('rect', {
                x: base.x - barWidth / 2,
                y: top.y,
                width: barWidth,
                height: Math.abs(base.y - top.y),
                fill: point.color || `hsl(${(index / data.length) * 360}, 70%, 60%)`,
                opacity: 0.8,
                rx: 4,
              }),
              // Glow effect
              createElement('rect', {
                x: base.x - barWidth / 2,
                y: top.y,
                width: barWidth,
                height: Math.abs(base.y - top.y),
                fill: 'url(#barGlow)',
                opacity: 0.3,
                rx: 4,
              })
            );
          })
        ),

      // Scatter plot
      type === 'scatter' &&
        createElement(
          'g',
          { className: 'solidum-chart3d-scatter' },
          ...data.map(point => {
            const pos = transform(point.x, point.y, point.z || 0);
            const radius = 8 * pos.scale;

            return createElement(
              'g',
              {},
              // Outer glow
              createElement('circle', {
                cx: pos.x,
                cy: pos.y,
                r: radius * 2,
                fill: point.color || '#667eea',
                opacity: 0.2,
              }),
              // Main circle
              createElement('circle', {
                cx: pos.x,
                cy: pos.y,
                r: radius,
                fill: point.color || '#667eea',
                opacity: 0.9,
              })
            );
          })
        ),

      // Gradient definitions
      createElement(
        'defs',
        {},
        createElement(
          'linearGradient',
          { id: 'barGlow', x1: '0%', y1: '0%', x2: '0%', y2: '100%' },
          createElement('stop', { offset: '0%', stopColor: '#ffffff', stopOpacity: 0.8 }),
          createElement('stop', { offset: '100%', stopColor: '#ffffff', stopOpacity: 0 })
        )
      )
    ),
    // Controls hint
    interactive && createElement('div', { className: 'solidum-chart3d-hint' }, '🔄 Drag to rotate')
  );
}
