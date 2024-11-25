import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Props = {
  onComplete?: () => void;
};

export default function RadarAnimation({ onComplete }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [timeLeft, setTimeLeft] = useState(10);
  const [particles, setParticles] = useState<Array<{x: number, y: number, speed: number, angle: number}>>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 600;
    canvas.height = 600;

    // Initialize particles
    const initialParticles = Array.from({ length: 50 }, () => ({
      x: canvas.width / 2,
      y: canvas.height / 2,
      speed: Math.random() * 2 + 1,
      angle: Math.random() * Math.PI * 2
    }));
    setParticles(initialParticles);

    let radarAngle = 0;
    let animationFrameId: number;

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw radar circle with pulse effect
      ctx.beginPath();
      ctx.strokeStyle = '#2563EB';
      ctx.lineWidth = 2;
      const radius = 200 + Math.sin(Date.now() * 0.003) * 10;
      ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Draw scanning line with gradient
      const gradient = ctx.createLinearGradient(
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2 + Math.cos(radarAngle) * 200,
        canvas.height / 2 + Math.sin(radarAngle) * 200
      );
      gradient.addColorStop(0, 'rgba(37, 99, 235, 0.8)');
      gradient.addColorStop(1, 'rgba(37, 99, 235, 0)');
      
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, canvas.height / 2);
      ctx.lineTo(
        canvas.width / 2 + Math.cos(radarAngle) * 200,
        canvas.height / 2 + Math.sin(radarAngle) * 200
      );
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 4;
      ctx.stroke();

      // Update and draw particles with trail effect
      setParticles(prevParticles => 
        prevParticles.map(particle => {
          const newX = particle.x + Math.cos(particle.angle) * particle.speed;
          const newY = particle.y + Math.sin(particle.angle) * particle.speed;

          // Draw particle with glow effect
          ctx.beginPath();
          const particleGradient = ctx.createRadialGradient(
            newX, newY, 0,
            newX, newY, 4
          );
          particleGradient.addColorStop(0, 'rgba(96, 165, 250, 1)');
          particleGradient.addColorStop(1, 'rgba(96, 165, 250, 0)');
          ctx.fillStyle = particleGradient;
          ctx.arc(newX, newY, 4, 0, Math.PI * 2);
          ctx.fill();

          // Reset particle if it goes out of bounds
          if (newX < 0 || newX > canvas.width || newY < 0 || newY > canvas.height) {
            return {
              x: canvas.width / 2,
              y: canvas.height / 2,
              speed: Math.random() * 2 + 1,
              angle: Math.random() * Math.PI * 2
            };
          }

          return {
            ...particle,
            x: newX,
            y: newY
          };
        })
      );

      radarAngle += 0.02;
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          cancelAnimationFrame(animationFrameId);
          
          // Create flash effect container
          const flash = document.createElement('div');
          flash.className = 'fixed inset-0 bg-white z-[60] transition-opacity duration-500';
          document.body.appendChild(flash);
          
          // Navigate to dashboard with fade effect
          setTimeout(() => {
            if (onComplete) onComplete();
            flash.style.opacity = '0';
            navigate('/dashboard');
            setTimeout(() => flash.remove(), 500);
          }, 500);
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      cancelAnimationFrame(animationFrameId);
    };
  }, [navigate, onComplete]);

  // Handle mouse interaction
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Add new interactive particles at mouse position
    setParticles(prev => [
      ...prev.slice(-45), // Keep last 45 particles
      {
        x,
        y,
        speed: Math.random() * 2 + 1,
        angle: Math.random() * Math.PI * 2
      },
      {
        x,
        y,
        speed: Math.random() * 2 + 1,
        angle: Math.random() * Math.PI * 2
      },
      {
        x,
        y,
        speed: Math.random() * 2 + 1,
        angle: Math.random() * Math.PI * 2
      },
      {
        x,
        y,
        speed: Math.random() * 2 + 1,
        angle: Math.random() * Math.PI * 2
      },
      {
        x,
        y,
        speed: Math.random() * 2 + 1,
        angle: Math.random() * Math.PI * 2
      }
    ]);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="text-center">
        <canvas
          ref={canvasRef}
          className="mx-auto cursor-crosshair animate-fade-in"
          onMouseMove={handleMouseMove}
        />
        <div className="mt-8 text-white animate-fade-in">
          <h2 className="text-3xl font-bold mb-4">Scanning Domain</h2>
          <div className="text-6xl font-bold text-blue-500 mb-4">{timeLeft}s</div>
          <p className="text-lg text-gray-300">
            Analyzing website performance and PPC metrics...
          </p>
        </div>
      </div>
    </div>
  );
}
