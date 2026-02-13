/*
  # CHRONOS Metrics Storage Schema

  1. New Tables
    - `system_metrics`
      - `id` (uuid, primary key) - Unique identifier
      - `cpu_percent` (numeric) - CPU usage percentage
      - `memory_percent` (numeric) - Memory usage percentage
      - `failure_risk` (numeric) - Calculated failure risk (0-100)
      - `system_mood` (text) - System state (CALM, UNEASY, PANIC)
      - `reason` (text) - Explanation for the risk calculation
      - `timestamp` (timestamptz) - When the metric was recorded
      - `created_at` (timestamptz) - Record creation time

    - `game_scores`
      - `id` (uuid, primary key) - Unique identifier
      - `player_name` (text) - Player identifier
      - `score` (integer) - Final score (time shards collected)
      - `failure_risk_at_play` (numeric) - System risk during gameplay
      - `created_at` (timestamptz) - When the score was recorded

  2. Security
    - Enable RLS on both tables
    - Add policy for public read access (dashboard display)
    - Add policy for service role write access (metrics collection)

  3. Indexes
    - Index on timestamp for efficient time-series queries
    - Index on created_at for game scores
*/

CREATE TABLE IF NOT EXISTS system_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cpu_percent numeric NOT NULL DEFAULT 0,
  memory_percent numeric NOT NULL DEFAULT 0,
  failure_risk numeric NOT NULL DEFAULT 0,
  system_mood text NOT NULL DEFAULT 'CALM',
  reason text NOT NULL DEFAULT '',
  timestamp timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS game_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name text NOT NULL DEFAULT 'Guardian',
  score integer NOT NULL DEFAULT 0,
  failure_risk_at_play numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE system_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to metrics"
  ON system_metrics
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow service role to insert metrics"
  ON system_metrics
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Allow public read access to game scores"
  ON game_scores
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert of game scores"
  ON game_scores
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_system_metrics_timestamp ON system_metrics(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_game_scores_created_at ON game_scores(created_at DESC);
