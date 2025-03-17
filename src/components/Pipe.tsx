
import React from 'react';

interface PipeProps {
  x: number;
  topHeight: number;
  pipeWidth: number;
  pipeGap: number;
  gameHeight: number;
  groundHeight: number;
}

const Pipe: React.FC<PipeProps> = ({ 
  x, 
  topHeight, 
  pipeWidth, 
  pipeGap, 
  gameHeight,
  groundHeight
}) => {
  const bottomPipeHeight = gameHeight - topHeight - pipeGap - groundHeight;
  
  return (
    <>
      {/* Top pipe */}
      <div 
        className="absolute bg-game-pipe pipe rounded-b-lg shadow-lg"
        style={{
          left: `${x}px`,
          top: 0,
          width: `${pipeWidth}px`,
          height: `${topHeight}px`,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}
      >
        <div className="absolute bottom-0 left-0 w-full h-[20px] bg-game-pipe rounded-b-lg shadow-inner border-t border-emerald-600" style={{ filter: 'brightness(1.05)' }}>
          <div className="absolute bottom-0 left-[-10px] w-[calc(100%+20px)] h-[15px] bg-game-pipe rounded-b-lg shadow-md" style={{ filter: 'brightness(1.1)' }}></div>
        </div>
      </div>
      
      {/* Bottom pipe */}
      <div 
        className="absolute bg-game-pipe pipe rounded-t-lg shadow-lg"
        style={{
          left: `${x}px`,
          top: `${topHeight + pipeGap}px`,
          width: `${pipeWidth}px`,
          height: `${bottomPipeHeight}px`,
          boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}
      >
        <div className="absolute top-0 left-0 w-full h-[20px] bg-game-pipe rounded-t-lg shadow-inner border-b border-emerald-600" style={{ filter: 'brightness(1.05)' }}>
          <div className="absolute top-0 left-[-10px] w-[calc(100%+20px)] h-[15px] bg-game-pipe rounded-t-lg shadow-md" style={{ filter: 'brightness(1.1)' }}></div>
        </div>
      </div>
    </>
  );
};

export default Pipe;
