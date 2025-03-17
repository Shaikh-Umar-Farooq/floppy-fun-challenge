
import React from 'react';

interface BirdProps {
  position: {
    x: number;
    y: number;
  };
  velocity: number;
  width: number;
  height: number;
  gameOver: boolean;
}

const Bird: React.FC<BirdProps> = ({ position, velocity, width, height, gameOver }) => {
  // Calculate the rotation based on velocity
  const rotation = gameOver 
    ? 90 // Point down when game over
    : Math.max(-20, Math.min(30, velocity * 2)); // Between -20 and 30 degrees
  
  return (
    <div 
      className={`absolute bird ${gameOver ? 'animate-fall' : ''}`} 
      style={{
        left: position.x - width / 2,
        top: position.y - height / 2,
        width: `${width}px`,
        height: `${height}px`,
        transform: `rotate(${rotation}deg)`,
        willChange: 'transform, top',
        transition: 'transform 0.2s ease-out'
      }}
    >
      <div 
        className="w-full h-full rounded-full bg-game-bird relative overflow-hidden shadow-md"
        style={{ 
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' 
        }}
      >
        <div className="absolute w-1/2 h-1/2 rounded-full bg-white top-1/4 left-1/4 opacity-70"></div>
        <div className="absolute w-1/5 h-1/5 rounded-full bg-black right-1/4 top-1/3"></div>
        <div className="absolute w-1/3 h-[10%] bg-yellow-500 right-0 top-[45%] -rotate-6 rounded-l-lg" style={{ zIndex: 2 }}></div>
      </div>
    </div>
  );
};

export default Bird;
