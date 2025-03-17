
import React from 'react';
import { Button } from '@/components/ui/button';

interface GameOverProps {
  score: number;
  highScore: number;
  onRestart: () => void;
}

const GameOver: React.FC<GameOverProps> = ({ score, highScore, onRestart }) => {
  return (
    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white/90 backdrop-blur rounded-2xl p-8 shadow-2xl max-w-xs w-full mx-4 transform animate-bounce-in">
        <h2 className="text-3xl font-semibold text-center mb-2">Game Over</h2>
        
        <div className="my-6 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Score:</span>
            <span className="text-2xl font-bold">{score}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Best:</span>
            <span className="text-xl font-semibold text-blue-600">{highScore}</span>
          </div>
        </div>

        {score > 0 && score === highScore && (
          <div className="bg-blue-50 text-blue-600 p-3 rounded-md mb-4 text-sm text-center">
            New high score!
          </div>
        )}
        
        <Button 
          onClick={onRestart} 
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl transition-all transform active:scale-95 font-medium text-lg game-button pulse-shadow"
        >
          Play Again
        </Button>
      </div>
    </div>
  );
};

export default GameOver;
