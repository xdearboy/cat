import { useEffect, useRef, useState } from 'react';

interface FlyingCatProps {
  imageUrl: string;
  size?: number;
  speed?: number;
  delay?: number;
}

export default function FlyingCat({
  imageUrl,
  size = 60,
  speed = 2,
  delay = 0
}: FlyingCatProps) {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [direction, setDirection] = useState({ x: 1, y: 1 });
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const timeoutRef = useRef<number>(0);

  useEffect(() => {
    const updatePosition = () => {
      setPosition(prevPos => {
        let newX = prevPos.x + (speed * direction.x);
        let newY = prevPos.y + (speed * direction.y);
        let newDirectionX = direction.x;
        let newDirectionY = direction.y;

        // Проверка столкновений с краями экрана
        if (containerRef.current) {
          const containerWidth = containerRef.current.clientWidth;
          const containerHeight = containerRef.current.clientHeight;

          if (newX <= 0 || newX >= containerWidth - size) {
            newDirectionX = -newDirectionX;
            newX = newX <= 0 ? 0 : containerWidth - size;
          }

          if (newY <= 0 || newY >= containerHeight - size) {
            newDirectionY = -newDirectionY;
            newY = newY <= 0 ? 0 : containerHeight - size;
          }
        }

        setDirection({ x: newDirectionX, y: newDirectionY });
        return { x: newX, y: newY };
      });

      animationRef.current = requestAnimationFrame(updatePosition);

      // Ожидание перед следующим кадром
      if (delay > 0) {
        timeoutRef.current = window.setTimeout(() => {
          timeoutRef.current = 0;
        }, delay);
      }
    };

    animationRef.current = requestAnimationFrame(updatePosition);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [direction, delay, speed, size]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-20"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 20
      }}
    >
      <div
        className="absolute rounded-full shadow-lg"
        style={{
          left: position.x,
          top: position.y,
          width: size,
          height: size,
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'none',
          willChange: 'transform'
        }}
      />
    </div>
  );
}
