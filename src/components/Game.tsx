import { useEffect, useRef, useState } from 'react';
import { GameState } from '../types';
import { Gamepad2, Trophy, Skull } from 'lucide-react';

interface GameProps {
  failureRisk: number;
}

export default function Game({ failureRisk }: GameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const gameLoopRef = useRef<number>();
  const keysRef = useRef<Set<string>>(new Set());

  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 400;
  const GRAVITY = 0.6;
  const JUMP_STRENGTH = -12;
  const MOVE_SPEED = 5;

  const initGame = () => {
    const platforms = [
      { x: 0, y: 350, width: 800, height: 50 },
      { x: 200, y: 280, width: 120, height: 20 },
      { x: 400, y: 220, width: 120, height: 20 },
      { x: 600, y: 160, width: 120, height: 20 },
      { x: 150, y: 100, width: 100, height: 20 },
    ];

    const coins = [
      { x: 250, y: 240, collected: false },
      { x: 450, y: 180, collected: false },
      { x: 650, y: 120, collected: false },
      { x: 200, y: 60, collected: false },
      { x: 500, y: 300, collected: false },
      { x: 700, y: 300, collected: false },
    ];

    const baseEnemySpeed = 1 + (failureRisk / 100) * 2;
    const enemies = [
      { x: 220, y: 260, direction: 1, speed: baseEnemySpeed },
      { x: 420, y: 200, direction: -1, speed: baseEnemySpeed * 1.2 },
      { x: 620, y: 140, direction: 1, speed: baseEnemySpeed * 1.1 },
    ];

    return {
      player: {
        x: 50,
        y: 300,
        width: 30,
        height: 30,
        velocityY: 0,
        velocityX: 0,
        isJumping: false,
        health: 3,
      },
      coins,
      enemies,
      score: 0,
      gameOver: false,
      victory: false,
      platforms,
    };
  };

  const startGame = () => {
    setGameState(initGame());
    setIsPlaying(true);
  };

  const checkCollision = (rect1: any, rect2: any) => {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key);
      if ((e.key === ' ' || e.key === 'ArrowUp') && gameState && !gameState.player.isJumping) {
        gameState.player.velocityY = JUMP_STRENGTH;
        gameState.player.isJumping = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);

  useEffect(() => {
    if (!isPlaying || !gameState || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gameLoop = () => {
      if (gameState.gameOver || gameState.victory) {
        setIsPlaying(false);
        return;
      }

      if (keysRef.current.has('ArrowLeft')) {
        gameState.player.velocityX = -MOVE_SPEED;
      } else if (keysRef.current.has('ArrowRight')) {
        gameState.player.velocityX = MOVE_SPEED;
      } else {
        gameState.player.velocityX = 0;
      }

      gameState.player.x += gameState.player.velocityX;
      gameState.player.velocityY += GRAVITY;
      gameState.player.y += gameState.player.velocityY;

      gameState.player.x = Math.max(0, Math.min(CANVAS_WIDTH - gameState.player.width, gameState.player.x));

      let onPlatform = false;
      gameState.platforms.forEach((platform) => {
        if (
          gameState.player.velocityY > 0 &&
          gameState.player.x + gameState.player.width > platform.x &&
          gameState.player.x < platform.x + platform.width &&
          gameState.player.y + gameState.player.height > platform.y &&
          gameState.player.y + gameState.player.height < platform.y + 20
        ) {
          gameState.player.y = platform.y - gameState.player.height;
          gameState.player.velocityY = 0;
          gameState.player.isJumping = false;
          onPlatform = true;
        }
      });

      if (gameState.player.y > CANVAS_HEIGHT) {
        gameState.gameOver = true;
      }

      gameState.coins.forEach((coin) => {
        if (!coin.collected && checkCollision(gameState.player, { ...coin, width: 20, height: 20 })) {
          coin.collected = true;
          gameState.score += 100;
        }
      });

      gameState.enemies.forEach((enemy) => {
        enemy.x += enemy.direction * enemy.speed;

        const onEnemyPlatform = gameState.platforms.find(
          (p) =>
            enemy.x + 20 > p.x &&
            enemy.x < p.x + p.width &&
            enemy.y + 20 >= p.y &&
            enemy.y + 20 <= p.y + 20
        );

        if (onEnemyPlatform) {
          if (enemy.x <= onEnemyPlatform.x || enemy.x + 20 >= onEnemyPlatform.x + onEnemyPlatform.width) {
            enemy.direction *= -1;
          }
        }

        if (checkCollision(gameState.player, { ...enemy, width: 20, height: 20 })) {
          gameState.player.health -= 1;
          gameState.player.x -= enemy.direction * 50;
          if (gameState.player.health <= 0) {
            gameState.gameOver = true;
          }
        }
      });

      const allCoinsCollected = gameState.coins.every((c) => c.collected);
      if (allCoinsCollected && !gameState.victory) {
        gameState.victory = true;
      }

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
      gradient.addColorStop(0, '#1e293b');
      gradient.addColorStop(1, '#0f172a');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      ctx.fillStyle = '#334155';
      gameState.platforms.forEach((platform) => {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2;
        ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
      });

      gameState.coins.forEach((coin) => {
        if (!coin.collected) {
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.arc(coin.x + 10, coin.y + 10, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });

      gameState.enemies.forEach((enemy) => {
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(enemy.x, enemy.y, 20, 20);
        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 2;
        ctx.strokeRect(enemy.x, enemy.y, 20, 20);

        ctx.fillStyle = '#fff';
        ctx.fillRect(enemy.x + 5, enemy.y + 5, 4, 4);
        ctx.fillRect(enemy.x + 11, enemy.y + 5, 4, 4);
      });

      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(gameState.player.x, gameState.player.y, gameState.player.width, gameState.player.height);
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 2;
      ctx.strokeRect(gameState.player.x, gameState.player.y, gameState.player.width, gameState.player.height);

      ctx.fillStyle = '#fff';
      ctx.font = '16px sans-serif';
      ctx.fillText(`Score: ${gameState.score}`, 10, 30);
      ctx.fillText(`Health: ${'❤️'.repeat(gameState.player.health)}`, 10, 60);
      ctx.fillText(`Risk Level: ${failureRisk.toFixed(0)}%`, CANVAS_WIDTH - 150, 30);

      setGameState({ ...gameState });
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [isPlaying, gameState, failureRisk]);

  return (
    <section className="min-h-screen bg-gradient-to-b from-slate-800 to-slate-950 py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-white mb-4 tracking-wide flex items-center justify-center gap-4">
            <Gamepad2 className="w-12 h-12 text-amber-400" />
            Rift of <span className="text-amber-400">Olympus</span>
          </h2>
          <p className="text-slate-400 text-lg mb-4">
            Navigate the chaos realm where system instability breeds danger
          </p>
          <p className="text-sm text-amber-400">
            Game difficulty scales with real-time failure risk: {failureRisk.toFixed(0)}%
          </p>
        </div>

        <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-2xl">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="mx-auto border-2 border-slate-600 rounded-lg"
          />

          <div className="mt-6 text-center">
            {!isPlaying ? (
              <div>
                {gameState?.victory && (
                  <div className="mb-4 p-4 bg-green-900/50 border border-green-500 rounded-lg">
                    <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-2" />
                    <p className="text-green-400 text-xl font-bold">VICTORY!</p>
                    <p className="text-slate-300">Final Score: {gameState.score}</p>
                  </div>
                )}
                {gameState?.gameOver && (
                  <div className="mb-4 p-4 bg-red-900/50 border border-red-500 rounded-lg">
                    <Skull className="w-12 h-12 text-red-400 mx-auto mb-2" />
                    <p className="text-red-400 text-xl font-bold">GAME OVER</p>
                    <p className="text-slate-300">Final Score: {gameState.score}</p>
                  </div>
                )}
                <button
                  onClick={startGame}
                  className="px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-500 text-white font-bold rounded-lg hover:from-amber-500 hover:to-amber-400 transition-all duration-300 shadow-lg hover:shadow-amber-500/50"
                >
                  {gameState ? 'Play Again' : 'Start Game'}
                </button>
              </div>
            ) : (
              <div className="text-slate-400 text-sm">
                <p>Arrow Keys: Move • Space/Up Arrow: Jump</p>
                <p className="mt-2">Collect Time Shards (coins) • Avoid Chaos Wraiths (enemies)</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <h4 className="text-amber-400 font-semibold mb-2">Time Shards</h4>
            <p className="text-slate-400">Collect golden coins to increase your score. Each shard is worth 100 points.</p>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <h4 className="text-red-400 font-semibold mb-2">Chaos Wraiths</h4>
            <p className="text-slate-400">Red enemies that move faster as system risk increases. Avoid contact or lose health.</p>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <h4 className="text-blue-400 font-semibold mb-2">Risk Scaling</h4>
            <p className="text-slate-400">Higher cloud failure risk = faster enemies. Your skills vs system chaos.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
