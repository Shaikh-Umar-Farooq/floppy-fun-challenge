
import { useState, useEffect, useRef, useCallback } from 'react';

// Constants for game settings
const GRAVITY = 0.5;
const JUMP_FORCE = -10;
const PIPE_WIDTH = 80;
const PIPE_GAP = 170;
const PIPE_SPACING = 220;
const BIRD_WIDTH = 40;
const BIRD_HEIGHT = 30;
const GROUND_HEIGHT = 100;

// Interface for game types
interface GameState {
  birdPosition: { x: number; y: number };
  birdVelocity: number;
  pipes: Array<{
    id: number;
    x: number;
    topHeight: number;
  }>;
  gameStarted: boolean;
  gameOver: boolean;
  score: number;
  highScore: number;
}

interface GameSize {
  width: number;
  height: number;
}

export const useGameLogic = () => {
  const [gameSize, setGameSize] = useState<GameSize>({ width: 0, height: 0 });
  const gameContainerRef = useRef<HTMLDivElement>(null);
  
  const [state, setState] = useState<GameState>({
    birdPosition: { x: 0, y: 0 },
    birdVelocity: 0,
    pipes: [],
    gameStarted: false,
    gameOver: false,
    score: 0,
    highScore: 0,
  });
  
  const requestRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const pipeIdRef = useRef<number>(0);

  // Initialize game dimensions and bird position
  useEffect(() => {
    const updateSize = () => {
      if (gameContainerRef.current) {
        const width = gameContainerRef.current.clientWidth;
        const height = gameContainerRef.current.clientHeight;
        
        setGameSize({ width, height });
        
        setState(prevState => ({
          ...prevState,
          birdPosition: {
            x: width * 0.2,
            y: height * 0.5
          }
        }));
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    
    // Load high score from localStorage
    const savedHighScore = localStorage.getItem('floppyBirdHighScore');
    if (savedHighScore) {
      setState(prev => ({ ...prev, highScore: parseInt(savedHighScore, 10) }));
    }
    
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Handle game loop with requestAnimationFrame
  const gameLoop = useCallback((timestamp: number) => {
    if (!lastTimeRef.current) {
      lastTimeRef.current = timestamp;
    }
    
    const deltaTime = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;
    
    if (state.gameStarted && !state.gameOver) {
      setState(prevState => {
        // Bird physics
        const newBirdVelocity = prevState.birdVelocity + GRAVITY;
        const newBirdY = prevState.birdPosition.y + newBirdVelocity;
        
        // Move pipes
        const pipeMoveSpeed = 3;
        let updatedPipes = prevState.pipes.map(pipe => ({
          ...pipe,
          x: pipe.x - pipeMoveSpeed
        }));
        
        // Remove pipes that are off-screen
        updatedPipes = updatedPipes.filter(pipe => pipe.x > -PIPE_WIDTH);
        
        // Add new pipe if needed
        if (updatedPipes.length === 0 || 
            updatedPipes[updatedPipes.length - 1].x < gameSize.width - PIPE_SPACING) {
          const topHeight = Math.random() * (gameSize.height - GROUND_HEIGHT - PIPE_GAP - 100) + 50;
          
          updatedPipes.push({
            id: pipeIdRef.current++,
            x: gameSize.width,
            topHeight
          });
        }
        
        // Calculate score
        let newScore = prevState.score;
        updatedPipes.forEach(pipe => {
          if (pipe.x + PIPE_WIDTH < prevState.birdPosition.x && 
              pipe.x + PIPE_WIDTH + pipeMoveSpeed >= prevState.birdPosition.x) {
            newScore += 1;
          }
        });
        
        // Check for collisions
        const birdRect = {
          left: prevState.birdPosition.x - BIRD_WIDTH / 2,
          right: prevState.birdPosition.x + BIRD_WIDTH / 2,
          top: newBirdY - BIRD_HEIGHT / 2,
          bottom: newBirdY + BIRD_HEIGHT / 2
        };
        
        // Ground collision
        const groundCollision = birdRect.bottom > gameSize.height - GROUND_HEIGHT;
        
        // Ceiling collision
        const ceilingCollision = birdRect.top < 0;
        
        // Pipe collision
        let pipeCollision = false;
        updatedPipes.forEach(pipe => {
          if (
            birdRect.right > pipe.x &&
            birdRect.left < pipe.x + PIPE_WIDTH
          ) {
            // Check collision with top pipe
            if (birdRect.top < pipe.topHeight) {
              pipeCollision = true;
            }
            
            // Check collision with bottom pipe
            if (birdRect.bottom > pipe.topHeight + PIPE_GAP) {
              pipeCollision = true;
            }
          }
        });
        
        // Handle game over
        const gameOver = groundCollision || ceilingCollision || pipeCollision;
        
        // Handle high score update
        let highScore = prevState.highScore;
        if (gameOver && newScore > prevState.highScore) {
          highScore = newScore;
          localStorage.setItem('floppyBirdHighScore', highScore.toString());
        }
        
        return {
          ...prevState,
          birdVelocity: gameOver ? 0 : newBirdVelocity,
          birdPosition: {
            ...prevState.birdPosition,
            y: gameOver 
              ? prevState.birdPosition.y 
              : Math.max(
                  0 + BIRD_HEIGHT / 2, 
                  Math.min(
                    gameSize.height - GROUND_HEIGHT - BIRD_HEIGHT / 2,
                    newBirdY
                  )
                )
          },
          pipes: updatedPipes,
          score: newScore,
          highScore,
          gameOver
        };
      });
    }
    
    requestRef.current = requestAnimationFrame(gameLoop);
  }, [state.gameStarted, state.gameOver, gameSize.width, gameSize.height]);
  
  // Set up and clean up animation frame
  useEffect(() => {
    requestRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [gameLoop]);
  
  // Handle jump action
  const jump = () => {
    if (state.gameOver) return;
    
    setState(prevState => ({
      ...prevState,
      gameStarted: true,
      birdVelocity: JUMP_FORCE
    }));
  };
  
  // Handle restart game
  const restartGame = () => {
    setState(prevState => ({
      birdPosition: { x: gameSize.width * 0.2, y: gameSize.height * 0.5 },
      birdVelocity: 0,
      pipes: [],
      gameStarted: false,
      gameOver: false,
      score: 0,
      highScore: prevState.highScore
    }));
    
    lastTimeRef.current = 0;
    pipeIdRef.current = 0;
  };
  
  return {
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
  };
};
