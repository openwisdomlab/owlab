"use client";

import { useEffect, useRef, useState } from 'react';
import { brandColors, withAlpha } from '@/lib/brand/colors';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
}

interface Connection {
  p1: Particle;
  p2: Particle;
  alpha: number;
}

interface ParticleFieldProps {
  count?: number;
  connectionThreshold?: number;
  maxConnections?: number;
  speed?: number;
  mouseInfluence?: boolean;
  className?: string;
}

export function ParticleField({
  count = 80,
  connectionThreshold = 150,
  maxConnections = 20,
  speed = 0.3,
  mouseInfluence = true,
  className = ''
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | null>(null);

  // Initialize particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateDimensions = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
      setDimensions({ width, height });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Create particles
  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;

    const colors = [brandColors.neonPink, brandColors.blue, brandColors.neonCyan];

    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * dimensions.width,
      y: Math.random() * dimensions.height,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      radius: Math.random() * 2 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.5 + 0.3,
    }));
  }, [dimensions, count, speed]);

  // Mouse tracking
  useEffect(() => {
    if (!mouseInfluence) return;

    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseInfluence]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      const particles = particlesRef.current;
      const connections: Connection[] = [];

      // Update and draw particles
      particles.forEach((particle) => {
        // Brownian motion
        particle.vx += (Math.random() - 0.5) * 0.1;
        particle.vy += (Math.random() - 0.5) * 0.1;

        // Mouse influence
        if (mouseInfluence) {
          const dx = mouseRef.current.x - particle.x;
          const dy = mouseRef.current.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            const force = (150 - distance) / 150;
            particle.vx += dx * force * 0.003;
            particle.vy += dy * force * 0.003;
          }
        }

        // Velocity damping
        particle.vx *= 0.98;
        particle.vy *= 0.98;

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = dimensions.width;
        if (particle.x > dimensions.width) particle.x = 0;
        if (particle.y < 0) particle.y = dimensions.height;
        if (particle.y > dimensions.height) particle.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = withAlpha(particle.color, particle.alpha);
        ctx.fill();
      });

      // Find connections
      for (let i = 0; i < particles.length && connections.length < maxConnections; i++) {
        for (let j = i + 1; j < particles.length && connections.length < maxConnections; j++) {
          const p1 = particles[i];
          const p2 = particles[j];

          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionThreshold) {
            const alpha = (1 - distance / connectionThreshold) * 0.3;
            connections.push({ p1, p2, alpha });
          }
        }
      }

      // Draw connections
      connections.forEach(({ p1, p2, alpha }) => {
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = withAlpha(brandColors.violet, alpha);
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [dimensions, connectionThreshold, maxConnections, mouseInfluence]);

  return (
    <canvas
      ref={canvasRef}
      className={`${className}`}
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
      }}
    />
  );
}
