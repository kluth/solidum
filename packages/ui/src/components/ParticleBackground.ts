import { createElement, cn, useState, effect, onCleanup } from '@solidum/core';

export interface ParticleBackgroundProps {
  count?: number;
  color?: string;
  speed?: number;
  size?: number;
  interactive?: boolean;
  opacity?: number;
  className?: string;
}

export function ParticleBackground(props: ParticleBackgroundProps) {
  const {
    count = 50,
    color = '#667eea',
    speed = 1,
    size = 3,
    interactive = true,
    opacity = 0.6,
    className,
  } = props;

  const canvasRef = useState<HTMLCanvasElement | null>(null);
  const mousePos = useState({ x: 0, y: 0 });

  interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
  }

  let particles: Particle[] = [];
  let animationFrame: number;

  const initParticles = (width: number, height: number) => {
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      size: Math.random() * size + 1,
    }));
  };

  const animate = () => {
    const canvas = canvasRef();
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Update and draw particles
    particles.forEach((particle, i) => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Bounce off walls
      if (particle.x < 0 || particle.x > width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > height) particle.vy *= -1;

      // Interactive: attract to mouse
      if (interactive) {
        const dx = mousePos().x - particle.x;
        const dy = mousePos().y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
          particle.vx += dx * 0.0001;
          particle.vy += dy * 0.0001;
        }
      }

      // Draw particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.globalAlpha = opacity;
      ctx.fill();

      // Draw connections
      particles.slice(i + 1).forEach(other => {
        const dx = particle.x - other.x;
        const dy = particle.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(other.x, other.y);
          ctx.strokeStyle = color;
          ctx.globalAlpha = opacity * (1 - distance / 100);
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
    });

    animationFrame = requestAnimationFrame(animate);
  };

  // Setup canvas on mount
  effect(() => {
    const canvas = canvasRef();
    if (!canvas) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    initParticles(canvas.width, canvas.height);
    animate();

    onCleanup(() => {
      cancelAnimationFrame(animationFrame);
    });
  });

  const handleMouseMove = (e: MouseEvent) => {
    if (!interactive) return;
    const canvas = canvasRef();
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return createElement('canvas', {
    ref: (el: HTMLCanvasElement) => canvasRef(el),
    className: cn('solidum-particle-background', className),
    onMouseMove: handleMouseMove,
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: interactive ? 'auto' : 'none',
    },
  });
}
