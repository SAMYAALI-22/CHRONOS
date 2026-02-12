import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface MetricHistory {
  cpu_percent: number;
  memory_percent: number;
  timestamp: number;
}

let metricHistory: MetricHistory[] = [];
const MAX_HISTORY = 50;

function generateRealisticMetrics() {
  const now = Date.now();
  const timeOfDay = new Date().getHours();

  const baseCPU = 20 + Math.sin(now / 60000) * 10;
  const baseMemory = 40 + Math.sin(now / 120000) * 15;

  const peakHourMultiplier = (timeOfDay >= 9 && timeOfDay <= 17) ? 1.3 : 0.8;

  const cpuSpike = Math.random() > 0.85 ? Math.random() * 30 : 0;
  const memoryGrowth = Math.random() > 0.9 ? Math.random() * 20 : 0;

  const cpu = Math.min(95, Math.max(5, baseCPU * peakHourMultiplier + cpuSpike + (Math.random() * 10 - 5)));
  const memory = Math.min(95, Math.max(10, baseMemory * peakHourMultiplier + memoryGrowth + (Math.random() * 8 - 4)));

  return { cpu, memory };
}

function calculateTrend(values: number[]): number {
  if (values.length < 3) return 0;

  const n = values.length;
  const indices = Array.from({ length: n }, (_, i) => i);

  const sumX = indices.reduce((a, b) => a + b, 0);
  const sumY = values.reduce((a, b) => a + b, 0);
  const sumXY = indices.reduce((sum, x, i) => sum + x * values[i], 0);
  const sumX2 = indices.reduce((sum, x) => sum + x * x, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);

  return slope;
}

function calculateFailureRisk(cpu: number, memory: number, history: MetricHistory[]): { risk: number; reason: string } {
  let risk = 0;
  const reasons: string[] = [];

  if (cpu > 80) {
    risk += 30;
    reasons.push("Critical CPU usage detected");
  } else if (cpu > 60) {
    risk += 15;
    reasons.push("Elevated CPU usage");
  }

  if (memory > 85) {
    risk += 35;
    reasons.push("Critical memory pressure");
  } else if (memory > 70) {
    risk += 20;
    reasons.push("High memory consumption");
  }

  if (history.length >= 10) {
    const recentCPU = history.slice(-10).map(h => h.cpu_percent);
    const recentMemory = history.slice(-10).map(h => h.memory_percent);

    const cpuTrend = calculateTrend(recentCPU);
    const memoryTrend = calculateTrend(recentMemory);

    if (cpuTrend > 2) {
      risk += 20;
      reasons.push("Rapidly increasing CPU trend");
    } else if (cpuTrend > 1) {
      risk += 10;
      reasons.push("Rising CPU trend detected");
    }

    if (memoryTrend > 1.5) {
      risk += 25;
      reasons.push("Memory leak pattern detected");
    } else if (memoryTrend > 0.8) {
      risk += 12;
      reasons.push("Growing memory usage");
    }
  }

  const recentHistory = history.slice(-5);
  if (recentHistory.length >= 5) {
    const volatility = recentHistory.reduce((sum, h, i) => {
      if (i === 0) return 0;
      return sum + Math.abs(h.cpu_percent - recentHistory[i - 1].cpu_percent);
    }, 0) / (recentHistory.length - 1);

    if (volatility > 15) {
      risk += 15;
      reasons.push("High system volatility");
    }
  }

  risk = Math.min(100, Math.max(0, risk));

  const reason = reasons.length > 0 ? reasons.join("; ") : "System operating normally";

  return { risk, reason };
}

function determineSystemMood(risk: number): string {
  if (risk <= 40) return "CALM";
  if (risk <= 70) return "UNEASY";
  return "PANIC";
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { cpu, memory } = generateRealisticMetrics();

    const now = Date.now();
    metricHistory.push({
      cpu_percent: cpu,
      memory_percent: memory,
      timestamp: now
    });

    if (metricHistory.length > MAX_HISTORY) {
      metricHistory = metricHistory.slice(-MAX_HISTORY);
    }

    const { risk, reason } = calculateFailureRisk(cpu, memory, metricHistory);
    const systemMood = determineSystemMood(risk);

    await supabase.from("system_metrics").insert({
      cpu_percent: cpu,
      memory_percent: memory,
      failure_risk: risk,
      system_mood: systemMood,
      reason: reason,
      timestamp: new Date().toISOString()
    });

    const response = {
      cpu: Math.round(cpu * 10) / 10,
      memory: Math.round(memory * 10) / 10,
      failure_risk: Math.round(risk * 10) / 10,
      system_mood: systemMood,
      reason: reason,
      timestamp: now
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
