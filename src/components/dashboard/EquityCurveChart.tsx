import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Mock data for the equity curve
const mockData = [
  { time: "09:30", value: 10000, pnl: 0 },
  { time: "10:00", value: 10150, pnl: 150 },
  { time: "10:30", value: 10280, pnl: 280 },
  { time: "11:00", value: 10350, pnl: 350 },
  { time: "11:30", value: 10420, pnl: 420 },
  { time: "12:00", value: 10680, pnl: 680 },
  { time: "12:30", value: 10590, pnl: 590 },
  { time: "13:00", value: 10750, pnl: 750 },
  { time: "13:30", value: 10850, pnl: 850 },
  { time: "14:00", value: 10920, pnl: 920 },
  { time: "14:30", value: 11100, pnl: 1100 },
  { time: "15:00", value: 11250, pnl: 1250 },
  { time: "15:30", value: 11180, pnl: 1180 },
  { time: "16:00", value: 11450, pnl: 1450 },
];

export const EquityCurveChart = () => {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={mockData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="time" 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              color: "hsl(var(--foreground))",
            }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, "Portfolio Value"]}
            labelStyle={{ color: "hsl(var(--muted-foreground))" }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="hsl(var(--primary))"
            strokeWidth={3}
            dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: "hsl(var(--primary-glow))" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};