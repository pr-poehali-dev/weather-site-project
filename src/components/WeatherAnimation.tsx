import { useEffect, useState } from 'react';

interface WeatherAnimationProps {
  weatherCode: number;
}

const WeatherAnimation = ({ weatherCode }: WeatherAnimationProps) => {
  const [particles, setParticles] = useState<Array<{ id: number; left: number; delay: number; duration: number }>>([]);

  useEffect(() => {
    const particleCount = weatherCode >= 71 && weatherCode <= 86 ? 50 : 
                         weatherCode >= 51 && weatherCode <= 82 ? 80 : 0;
    
    if (particleCount > 0) {
      const newParticles = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 2,
      }));
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [weatherCode]);

  const isSnow = weatherCode >= 71 && weatherCode <= 86;
  const isRain = weatherCode >= 51 && weatherCode <= 67;
  const isSunny = weatherCode === 0;

  if (isSunny) {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 bg-gradient-to-b from-yellow-200/40 to-transparent"
            style={{
              left: `${Math.random() * 100}%`,
              top: '-10%',
              height: `${100 + Math.random() * 200}px`,
              transform: `rotate(${-45 + Math.random() * 20}deg)`,
              animation: `sunRay ${3 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    );
  }

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute ${isSnow ? 'w-2 h-2 bg-white rounded-full' : 'w-0.5 h-8 bg-blue-300/60'}`}
          style={{
            left: `${particle.left}%`,
            top: '-5%',
            animation: `fall ${particle.duration}s linear infinite`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          to {
            transform: translateY(105vh) ${isSnow ? 'translateX(50px)' : ''};
          }
        }
        @keyframes sunRay {
          0%, 100% {
            opacity: 0.2;
            transform: translateY(0) rotate(-45deg);
          }
          50% {
            opacity: 0.6;
            transform: translateY(30px) rotate(-45deg);
          }
        }
      `}</style>
    </div>
  );
};

export default WeatherAnimation;
