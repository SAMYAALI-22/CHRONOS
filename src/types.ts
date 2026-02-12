export interface SystemMetrics {
  cpu: number;
  memory: number;
  failure_risk: number;
  system_mood: string;
  reason: string;
  timestamp: number;
}

export interface GameState {
  player: {
    x: number;
    y: number;
    width: number;
    height: number;
    velocityY: number;
    velocityX: number;
    isJumping: boolean;
    health: number;
  };
  coins: Array<{ x: number; y: number; collected: boolean }>;
  enemies: Array<{ x: number; y: number; direction: number; speed: number }>;
  score: number;
  gameOver: boolean;
  victory: boolean;
  platforms: Array<{ x: number; y: number; width: number; height: number }>;
}
