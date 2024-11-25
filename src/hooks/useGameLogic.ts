import { useState, useEffect, useCallback } from 'react';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };
type GameStatus = 'READY' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 }
];

const DIFFICULTIES = {
  EASY: 200,
  NORMAL: 150,
  HARD: 100
};

type Difficulty = keyof typeof DIFFICULTIES;

const generateFood = (snake: Position[]): Position => {
  while (true) {
    const food = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
    if (!snake.some(segment => segment.x === food.x && segment.y === food.y)) {
      return food;
    }
  }
};

export const useGameLogic = () => {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>('UP');
  const [food, setFood] = useState<Position>(() => generateFood(INITIAL_SNAKE));
  const [gameStatus, setGameStatus] = useState<GameStatus>('READY');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('snakeHighScore');
    return saved ? parseInt(saved) : 0;
  });
  const [difficulty, setDifficulty] = useState<Difficulty>('NORMAL');

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection('UP');
    setFood(generateFood(INITIAL_SNAKE));
    setScore(0);
    setGameStatus('PLAYING');
  };

  const togglePause = () => {
    if (gameStatus === 'PLAYING') {
      setGameStatus('PAUSED');
    } else if (gameStatus === 'PAUSED') {
      setGameStatus('PLAYING');
    }
  };

  const checkCollision = (head: Position, snakeBody: Position[]): boolean => {
    return snakeBody.some(
      segment => segment.x === head.x && segment.y === head.y
    );
  };

  const moveSnake = useCallback(() => {
    if (gameStatus !== 'PLAYING') return;

    setSnake(currentSnake => {
      const head = currentSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP':
          newHead.y = (head.y - 1 + GRID_SIZE) % GRID_SIZE;
          break;
        case 'DOWN':
          newHead.y = (head.y + 1) % GRID_SIZE;
          break;
        case 'LEFT':
          newHead.x = (head.x - 1 + GRID_SIZE) % GRID_SIZE;
          break;
        case 'RIGHT':
          newHead.x = (head.x + 1) % GRID_SIZE;
          break;
      }

      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood([newHead, ...currentSnake]));
        return [newHead, ...currentSnake];
      }

      if (checkCollision(newHead, currentSnake.slice(1))) {
        setGameStatus('GAME_OVER');
        return currentSnake;
      }

      return [newHead, ...currentSnake.slice(0, -1)];
    });
  }, [direction, food, gameStatus]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === ' ') {
        if (gameStatus === 'READY' || gameStatus === 'GAME_OVER') {
          resetGame();
          return;
        }
        if (gameStatus === 'PLAYING' || gameStatus === 'PAUSED') {
          togglePause();
          return;
        }
      }

      if (gameStatus !== 'PLAYING') return;

      switch (event.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, gameStatus]);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('snakeHighScore', score.toString());
    }
  }, [score, highScore]);

  useEffect(() => {
    const gameLoop = setInterval(moveSnake, DIFFICULTIES[difficulty]);
    return () => clearInterval(gameLoop);
  }, [moveSnake, difficulty]);

  return {
    snake,
    food,
    score,
    highScore,
    gameStatus,
    difficulty,
    setDifficulty,
    resetGame,
    togglePause
  };
}; 