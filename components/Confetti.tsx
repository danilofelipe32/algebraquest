import React, { useEffect, useRef } from 'react';

const Confetti: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particles: Particle[] = [];
    const particleCount = 200;
    const colors = ['#06b6d4', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444'];

    class Particle {
      x: number;
      y: number;
      radius: number;
      color: string;
      vx: number;
      vy: number;
      opacity: number;
      gravity: number = 0.05;
      
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height - height;
        this.radius = Math.random() * 4 + 1;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.vx = Math.random() * 6 - 3;
        this.vy = Math.random() * 2 + 1;
        this.opacity = 1;
      }

      draw() {
        ctx!.globalAlpha = this.opacity;
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx!.fillStyle = this.color;
        ctx!.fill();
        ctx!.closePath();
      }

      update() {
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.opacity -= 0.005;
        this.draw();
      }
    }

    const createParticles = () => {
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    let animationFrameId: number;

    const animate = () => {
      ctx!.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        if (particles[i].opacity > 0) {
            particles[i].update();
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    createParticles();
    animate();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-50" />;
};

export default Confetti;