import { useState, useEffect } from 'react';
import { ComposedChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Square } from "lucide-react";
import { derivApi } from "@/services/derivApi";

interface CandleData {
  time: string;
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface TradeEntry {
  id: string;
  timestamp: number;
  entryPrice: number;
  exitPrice?: number;
  type: 'CALL' | 'PUT';
  symbol: string;
  amount: number;
  status: 'active' | 'won' | 'lost';
  duration: number;
}

const LiveCandlestickChart = () => {
  const [candleData, setCandleData] = useState<CandleData[]>([]);
  const [tradeEntries, setTradeEntries] = useState<TradeEntry[]>([]);
  const [currentSymbol] = useState('R_50');
  const [isLive, setIsLive] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');

  // Generate initial mock data
  useEffect(() => {
    const generateMockData = () => {
      const data: CandleData[] = [];
      const trades: TradeEntry[] = [];
      let basePrice = 100;
      
      for (let i = 0; i < 50; i++) {
        const timestamp = Date.now() - (50 - i) * 60000;
        const change = (Math.random() - 0.5) * 2;
        basePrice += change;
        
        const open = basePrice;
        const high = open + Math.random() * 1.5;
        const low = open - Math.random() * 1.5;
        const close = low + Math.random() * (high - low);
        
        data.push({
          time: new Date(timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          timestamp,
          open,
          high,
          low,
          close,
          volume: Math.floor(Math.random() * 1000) + 100
        });

        // Add some trade entries
        if (Math.random() > 0.85) {
          const tradeType = Math.random() > 0.5 ? 'CALL' : 'PUT';
          const trade: TradeEntry = {
            id: `trade-${trades.length + 1}`,
            timestamp,
            entryPrice: close,
            type: tradeType,
            symbol: currentSymbol,
            amount: 10,
            status: 'active',
            duration: 300
          };

          // Simulate trade result for older trades
          if (i < 45) {
            const futurePrice = data[i + 5]?.close || close;
            if ((tradeType === 'CALL' && futurePrice > close) || 
                (tradeType === 'PUT' && futurePrice < close)) {
              trade.status = 'won';
              trade.exitPrice = futurePrice;
            } else {
              trade.status = 'lost';
              trade.exitPrice = futurePrice;
            }
          }

          trades.push(trade);
        }
      }
      
      setCandleData(data);
      setTradeEntries(trades);
    };

    generateMockData();
  }, [currentSymbol]);

  // Live data update
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setCandleData(prev => {
        const lastCandle = prev[prev.length - 1];
        const now = Date.now();
        const timeElapsed = now - lastCandle.timestamp;
        
        if (timeElapsed > 60000) {
          // Create new candle
          const newCandle: CandleData = {
            time: new Date(now).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            timestamp: now,
            open: lastCandle.close,
            high: lastCandle.close + Math.random() * 1,
            low: lastCandle.close - Math.random() * 1,
            close: lastCandle.close + (Math.random() - 0.5) * 0.5,
            volume: Math.floor(Math.random() * 1000) + 100
          };
          
          return [...prev.slice(1), newCandle];
        } else {
          // Update last candle
          const updatedCandle = {
            ...lastCandle,
            high: Math.max(lastCandle.high, lastCandle.close + Math.random() * 0.5),
            low: Math.min(lastCandle.low, lastCandle.close - Math.random() * 0.5),
            close: lastCandle.close + (Math.random() - 0.5) * 0.2,
            volume: lastCandle.volume + Math.floor(Math.random() * 10)
          };
          
          return [...prev.slice(0, -1), updatedCandle];
        }
      });

      // Add random trade entries
      if (Math.random() > 0.95) {
        const newTrade: TradeEntry = {
          id: `trade-${Date.now()}`,
          timestamp: Date.now(),
          entryPrice: candleData[candleData.length - 1]?.close || 100,
          type: Math.random() > 0.5 ? 'CALL' : 'PUT',
          symbol: currentSymbol,
          amount: 10,
          status: 'active',
          duration: 300
        };
        
        setTradeEntries(prev => [newTrade, ...prev.slice(0, 9)]);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isLive, candleData]);

  // Custom candlestick component
  const CustomCandlestick = (props: any) => {
    const { payload, x, y, width, height } = props;
    if (!payload) return null;

    const { open, high, low, close } = payload;
    const isGreen = close > open;
    const color = isGreen ? '#22c55e' : '#ef4444';
    
    const highY = y - ((high - Math.max(open, close)) / (high - low)) * height;
    const lowY = y + height + ((Math.min(open, close) - low) / (high - low)) * height;
    const openY = y + (isGreen ? height : 0);
    const closeY = y + (isGreen ? 0 : height);

    // Find trades for this candle
    const candleTrades = tradeEntries.filter(trade => 
      Math.abs(trade.timestamp - payload.timestamp) < 30000
    );

    return (
      <g>
        {/* Wick */}
        <line
          x1={x + width / 2}
          y1={highY}
          x2={x + width / 2}
          y2={lowY}
          stroke={color}
          strokeWidth={1}
        />
        
        {/* Body */}
        <rect
          x={x + 1}
          y={Math.min(openY, closeY)}
          width={Math.max(width - 2, 1)}
          height={Math.abs(closeY - openY) || 1}
          fill={color}
          stroke={color}
        />

        {/* Trade entry markers */}
        {candleTrades.map((trade, idx) => {
          const markerY = y + height * 0.5;
          const markerColor = trade.type === 'CALL' ? '#22c55e' : '#ef4444';
          const statusColor = trade.status === 'won' ? '#22c55e' : 
                             trade.status === 'lost' ? '#ef4444' : '#f59e0b';
          
          return (
            <g key={trade.id}>
              {/* Entry arrow */}
              <polygon
                points={`${x + width/2},${markerY - 8} ${x + width/2 - 6},${markerY - 2} ${x + width/2 + 6},${markerY - 2}`}
                fill={markerColor}
                stroke="white"
                strokeWidth={1}
              />
              
              {/* Status indicator */}
              <circle
                cx={x + width/2}
                cy={markerY + 10}
                r={3}
                fill={statusColor}
                stroke="white"
                strokeWidth={1}
              />
              
              {/* Amount label */}
              <text
                x={x + width/2}
                y={markerY + 25}
                textAnchor="middle"
                fontSize={10}
                fill="#666"
              >
                ${trade.amount}
              </text>
            </g>
          );
        })}
      </g>
    );
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const candleTrades = tradeEntries.filter(trade => 
        Math.abs(trade.timestamp - data.timestamp) < 30000
      );

      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          <div className="space-y-1 text-sm">
            <p>Open: <span className="font-mono">${data.open.toFixed(2)}</span></p>
            <p>High: <span className="font-mono text-success">${data.high.toFixed(2)}</span></p>
            <p>Low: <span className="font-mono text-destructive">${data.low.toFixed(2)}</span></p>
            <p>Close: <span className="font-mono">${data.close.toFixed(2)}</span></p>
            <p>Volume: <span className="font-mono">{data.volume}</span></p>
            
            {candleTrades.length > 0 && (
              <div className="border-t pt-2 mt-2">
                <p className="font-medium">Trades:</p>
                {candleTrades.map(trade => (
                  <div key={trade.id} className="text-xs">
                    <span className={trade.type === 'CALL' ? 'text-success' : 'text-destructive'}>
                      {trade.type}
                    </span>
                    {' '}${trade.amount} - 
                    <span className={
                      trade.status === 'won' ? 'text-success' : 
                      trade.status === 'lost' ? 'text-destructive' : 'text-warning'
                    }>
                      {' '}{trade.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  const handleToggleLive = async () => {
    if (!isLive) {
      setConnectionStatus('connecting');
      try {
        if (!derivApi.connected) {
          await derivApi.connect();
        }
        setConnectionStatus('connected');
        setIsLive(true);
      } catch (error) {
        setConnectionStatus('disconnected');
        console.error('Failed to connect to Deriv API:', error);
      }
    } else {
      setIsLive(false);
      setConnectionStatus('disconnected');
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            onClick={handleToggleLive}
            variant={isLive ? "destructive" : "default"}
            size="sm"
            disabled={connectionStatus === 'connecting'}
          >
            {connectionStatus === 'connecting' ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                Conectando...
              </>
            ) : isLive ? (
              <>
                <Square className="h-4 w-4 mr-2" />
                Parar Live
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Iniciar Live
              </>
            )}
          </Button>
          
          <Badge variant={isLive ? "default" : "secondary"}>
            {isLive ? "AO VIVO" : "DEMO"}
          </Badge>
          
          <div className="text-sm text-muted-foreground">
            Símbolo: <span className="font-mono">{currentSymbol}</span>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          Status: <span className={
            connectionStatus === 'connected' ? 'text-success' :
            connectionStatus === 'connecting' ? 'text-warning' : 'text-muted-foreground'
          }>
            {connectionStatus.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={candleData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis 
              dataKey="time" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#888' }}
            />
            <YAxis 
              domain={['dataMin - 1', 'dataMax + 1']}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#888' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <CustomCandlestick />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Trades */}
      <div className="border rounded-lg p-4">
        <h3 className="text-sm font-medium mb-3">Entradas Recentes do Bot</h3>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {tradeEntries.slice(0, 5).map((trade) => (
            <div key={trade.id} className="flex items-center justify-between text-sm animate-fade-in">
              <div className="flex items-center space-x-2">
                <Badge 
                  variant={trade.type === 'CALL' ? 'default' : 'destructive'}
                  className="text-xs"
                >
                  {trade.type}
                </Badge>
                <span className="font-mono">${trade.amount}</span>
                <span className="text-muted-foreground">@{trade.entryPrice.toFixed(2)}</span>
              </div>
              <Badge 
                variant={
                  trade.status === 'won' ? 'default' : 
                  trade.status === 'lost' ? 'destructive' : 'secondary'
                }
                className="text-xs"
              >
                {trade.status === 'won' ? 'GANHOU' : 
                 trade.status === 'lost' ? 'PERDEU' : 'ATIVO'}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const EquityCurveChart = () => {
  return <LiveCandlestickChart />;
};