import { useEffect, useRef } from 'react';
import { useGameLogic } from '../hooks/useGameLogic';

const GRID_SIZE = 20;
const CELL_SIZE = 20;

// 移除 const GameBoard = () => {
export default function GameBoard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { 
    snake, 
    food, 
    score, 
    highScore,
    gameStatus, 
    difficulty,
    setDifficulty
  } = useGameLogic();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 清空画布
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, GRID_SIZE * CELL_SIZE, GRID_SIZE * CELL_SIZE);

    // 绘制网格
    ctx.strokeStyle = '#ddd';
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, GRID_SIZE * CELL_SIZE);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(GRID_SIZE * CELL_SIZE, i * CELL_SIZE);
      ctx.stroke();
    }

    // 绘制蛇
    ctx.fillStyle = '#4CAF50';
    snake.forEach(segment => {
      ctx.fillRect(
        segment.x * CELL_SIZE,
        segment.y * CELL_SIZE,
        CELL_SIZE - 1,
        CELL_SIZE - 1
      );
    });

    // 绘制食物
    ctx.fillStyle = 'red';
    ctx.fillRect(
      food.x * CELL_SIZE,
      food.y * CELL_SIZE,
      CELL_SIZE - 1,
      CELL_SIZE - 1
    );

    // 绘制游戏状态
    if (gameStatus !== 'PLAYING') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, GRID_SIZE * CELL_SIZE, GRID_SIZE * CELL_SIZE);
      
      ctx.fillStyle = 'white';
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      
      let message = '';
      switch (gameStatus) {
        case 'READY':
          message = '按空格开始';
          break;
        case 'PAUSED':
          message = '游戏暂停，按空格继续';
          break;
        case 'GAME_OVER':
          message = '游戏结束，按空格重新开始';
          break;
      }
      
      ctx.fillText(
        message,
        (GRID_SIZE * CELL_SIZE) / 2,
        (GRID_SIZE * CELL_SIZE) / 2
      );
    }
  }, [snake, food, gameStatus]);

  return (
    <div className="game-board">
      <div className="score-container">
        <div className="score">分数: {score}</div>
        <div className="high-score">最高分: {highScore}</div>
      </div>
      <div className="difficulty-selector">
        <select 
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as any)}
          disabled={gameStatus === 'PLAYING'}
        >
          <option value="EASY">简单</option>
          <option value="NORMAL">普通</option>
          <option value="HARD">困难</option>
        </select>
      </div>
      <canvas
        ref={canvasRef}
        width={GRID_SIZE * CELL_SIZE}
        height={GRID_SIZE * CELL_SIZE}
        style={{ border: '1px solid black' }}
      />
    </div>
  );
} 