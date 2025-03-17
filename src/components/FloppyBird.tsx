
import React from 'react';
import Bird from './Bird';
import Pipe from './Pipe';
import GameOver from './GameOver';
import { useGameLogic } from '@/hooks/useGameLogic';

const FloppyBird = () => {
  const { 
    state, 
    gameSize, 
    gameContainerRef, 
    jump, 
    restartGame, 
    GROUND_HEIGHT,
    BIRD_WIDTH,
    BIRD_HEIGHT,
    PIPE_WIDTH,
    PIPE_GAP
  } = useGameLogic();

  const handleInteraction = (e: React.MouseEvent | React.TouchEvent | React.KeyboardEvent) => {
    e.preventDefault();
    jump();
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        jump();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [jump]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div 
        ref={gameContainerRef}
        className="relative w-full max-w-md h-[600px] bg-gradient-to-b from-blue-300 to-blue-500 overflow-hidden game-container rounded-lg shadow-xl"
        onClick={handleInteraction}
        onTouchStart={handleInteraction}
      >
        {/* Score display */}
        <div className="absolute top-4 right-4 z-30">
          <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
            <span className="text-2xl font-bold">{state.score}</span>
          </div>
        </div>
        
        {/* Bird */}
        <Bird 
          position={state.birdPosition} 
          velocity={state.birdVelocity} 
          width={BIRD_WIDTH} 
          height={BIRD_HEIGHT}
          gameOver={state.gameOver}
        />
        
        {/* Pipes */}
        {state.pipes.map(pipe => (
          <Pipe 
            key={pipe.id}
            x={pipe.x}
            topHeight={pipe.topHeight}
            pipeWidth={PIPE_WIDTH}
            pipeGap={PIPE_GAP}
            gameHeight={gameSize.height}
            groundHeight={GROUND_HEIGHT}
          />
        ))}
        
        {/* Ground */}
        <div 
          className="absolute bottom-0 w-full bg-gradient-to-t from-amber-800 to-amber-600"
          style={{
            height: `${GROUND_HEIGHT}px`,
            backgroundSize: '20px 20px',
            backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.1) 50%, transparent 50%)`,
          }}
        >
          <div className="absolute top-0 w-full h-[5px] bg-green-700"></div>
          <div className="absolute top-[5px] w-full h-[15px] bg-green-500"></div>
        </div>
        
        {/* Game over screen */}
        {state.gameOver && (
          <GameOver 
            score={state.score} 
            highScore={state.highScore}
            onRestart={restartGame}
          />
        )}
        
        {/* Start instructions */}
        {!state.gameStarted && !state.gameOver && (
          <div className="absolute inset-0 flex items-center justify-center text-white text-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 drop-shadow-md">Floppy Bird</h2>
              <p className="text-xl mb-4 drop-shadow-md">Tap, click or press space to fly</p>
              <div className="animate-bounce">👆</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FloppyBird;
