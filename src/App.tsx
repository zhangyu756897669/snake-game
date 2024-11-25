import GameBoard from './components/GameBoard';

// 确保使用 export default
export default function App() {
  return (
    <div className="game-container">
      <h1>贪吃蛇游戏</h1>
      <GameBoard />
    </div>
  );
} 