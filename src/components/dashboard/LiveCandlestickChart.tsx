import React, { useState, useEffect } from 'react';
import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import derivApi from '@/services/derivApi';

interface CandleData {
  time: string;
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

interface TradeEntry {
  id: string;
  timestamp: number;
  price: number;
  type: 'CALL' | 'PUT';
  symbol: string;
  amount: number;
  status: 'active' | 'won' | 'lost';
}

const LiveCandlestickChart = () => {
  const [candleData, setCandleData] = useState<CandleData[]>([]);
  const [tradeEntries, setTradeEntries] = useState<TradeEntry[]>([]);
  const [currentSymbol, setCurrentSymbol] = useState('R_50'); // Volatility 50 Index
  const [isLive, setIsLive] = useState(false);

  // Mock data para demonstração
  useEffect(() => {
    const generateMockData = () => {
      const now = Date.now();
      const data: CandleData[] = [];
      let basePrice = 500;

      for (let i = 99; i >= 0; i--) {
        const timestamp = now - (i * 60000); // 1 minuto por vela
        const volatility = Math.random() * 0.02 - 0.01; // ±1%
        const open = basePrice;
        const high = open + Math.random() * 5;
        const low = open - Math.random() * 5;
        const close = open + (volatility * open);
        
        data.push({
          time: new Date(timestamp).toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          timestamp,
          open,
          high: Math.max(high, close),
          low: Math.min(low, close),
          close,
          volume: Math.floor(Math.random() * 1000) + 100
        });
        
        basePrice = close;
      }

      return data;
    };

    const mockData = generateMockData();
    setCandleData(mockData);

    // Mock trade entries
    const mockTrades: TradeEntry[] = [
      {
        id: '1',
        timestamp: mockData[80].timestamp,
        price: mockData[80].close,
        type: 'CALL',
        symbol: currentSymbol,
        amount: 10,
        status: 'won'
      },
      {
        id: '2', 
        timestamp: mockData[60].timestamp,
        price: mockData[60].close,
        type: 'PUT',
        symbol: currentSymbol,
        amount: 15,
        status: 'lost'
      },
      {
        id: '3',
        timestamp: mockData[40].timestamp,
        price: mockData[40].close,
        type: 'CALL',
        symbol: currentSymbol,
        amount: 20,
        status: 'active'
      }
    ];
    setTradeEntries(mockTrades);
  }, [currentSymbol]);

  // Simular atualizações em tempo real
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setCandleData(prevData => {
        const newData = [...prevData];
        const lastCandle = newData[newData.length - 1];
        const now = Date.now();
        
        // Atualizar a última vela ou criar uma nova
        if (now - lastCandle.timestamp > 60000) {
          // Nova vela
          const volatility = Math.random() * 0.02 - 0.01;
          const newCandle: CandleData = {
            time: new Date(now).toLocaleTimeString('pt-BR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            }),
            timestamp: now,
            open: lastCandle.close,
            high: lastCandle.close + Math.random() * 3,
            low: lastCandle.close - Math.random() * 3,
            close: lastCandle.close + (volatility * lastCandle.close),
            volume: Math.floor(Math.random() * 1000) + 100
          };
          
          // Manter apenas as últimas 100 velas
          newData.push(newCandle);
          if (newData.length > 100) {
            newData.shift();
          }
        } else {
          // Atualizar vela atual
          const volatility = Math.random() * 0.01 - 0.005;
          newData[newData.length - 1] = {
            ...lastCandle,
            high: Math.max(lastCandle.high, lastCandle.close + Math.random() * 2),
            low: Math.min(lastCandle.low, lastCandle.close - Math.random() * 2),
            close: lastCandle.close + (volatility * lastCandle.close)
          };
        }
        
        return newData;
      });
    }, 2000); // Atualizar a cada 2 segundos

    return () => clearInterval(interval);
  }, [isLive]);

  const CustomCandlestick = (props: any) => {
    const { payload, x, y, width, height } = props;
    if (!payload) return null;

    const { open, high, low, close } = payload;
    const isGreen = close >= open;
    const color = isGreen ? '#22c55e' : '#ef4444';
    const candleWidth = Math.max(width * 0.6, 2);
    const wickX = x + width / 2;

    return (
      <g>
        {/* Pavio */}
        <line
          x1={wickX}
          y1={y}
          x2={wickX}
          y2={y + height}
          stroke={color}
          strokeWidth={1}
        />
        {/* Corpo da vela */}
        <rect
          x={x + (width - candleWidth) / 2}
          y={isGreen ? y + height * (1 - (close - low) / (high - low)) : y + height * (1 - (open - low) / (high - low))}
          width={candleWidth}
          height={Math.abs(height * (close - open) / (high - low))}
          fill={color}
          stroke={color}
        />
      </g>
    );
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isGreen = data.close >= data.open;
      
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Open: <span className="font-mono">{data.open.toFixed(3)}</span></div>
            <div>High: <span className="font-mono">{data.high.toFixed(3)}</span></div>
            <div>Low: <span className="font-mono">{data.low.toFixed(3)}</span></div>
            <div className={isGreen ? 'text-green-500' : 'text-red-500'}>
              Close: <span className="font-mono">{data.close.toFixed(3)}</span>
            </div>
          </div>
          {data.volume && (
            <div className="text-xs text-muted-foreground mt-1">
              Volume: {data.volume}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-96 relative">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold">{currentSymbol}</h3>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            <span className="text-sm text-muted-foreground">
              {isLive ? 'Ao Vivo' : 'Parado'}
            </span>
          </div>
        </div>
        <button
          onClick={() => setIsLive(!isLive)}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            isLive 
              ? 'bg-red-500 text-white hover:bg-red-600' 
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
        >
          {isLive ? 'Parar' : 'Iniciar'} Live
        </button>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={candleData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis 
            dataKey="time" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            domain={['dataMin - 5', 'dataMax + 5']}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
            width={60}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {/* Linha de preço atual */}
          {candleData.length > 0 && (
            <ReferenceLine 
              y={candleData[candleData.length - 1]?.close} 
              stroke="#8b5cf6" 
              strokeDasharray="5 5"
              strokeWidth={2}
            />
          )}

          {/* Marcadores de entrada do bot */}
          {tradeEntries.map((trade) => {
            const color = trade.type === 'CALL' ? '#22c55e' : '#ef4444';
            const statusColor = trade.status === 'won' ? '#22c55e' : 
                               trade.status === 'lost' ? '#ef4444' : '#8b5cf6';
            
            return (
              <ReferenceLine
                key={trade.id}
                x={new Date(trade.timestamp).toLocaleTimeString('pt-BR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
                stroke={statusColor}
                strokeWidth={3}
                strokeOpacity={0.8}
              />
            );
          })}

          {/* Linha customizada para simular velas */}
          <Line
            type="monotone"
            dataKey="close"
            stroke="transparent"
            dot={false}
            activeDot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Legenda de entradas */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded" />
          <span>Entrada CALL</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded" />
          <span>Entrada PUT</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-purple-500" />
          <span>Preço Atual</span>
        </div>
      </div>

      {/* Lista de trades recentes */}
      <div className="mt-4">
        <h4 className="text-sm font-medium mb-2">Entradas Recentes do Bot</h4>
        <div className="space-y-2">
          {tradeEntries.slice().reverse().map((trade) => (
            <div key={trade.id} className="flex items-center justify-between text-xs bg-muted/50 rounded p-2">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  trade.type === 'CALL' ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <span>{trade.type}</span>
                <span className="text-muted-foreground">
                  {new Date(trade.timestamp).toLocaleTimeString('pt-BR')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono">${trade.amount}</span>
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  trade.status === 'won' ? 'bg-green-100 text-green-800' :
                  trade.status === 'lost' ? 'bg-red-100 text-red-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {trade.status === 'won' ? 'Ganhou' : 
                   trade.status === 'lost' ? 'Perdeu' : 'Ativo'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveCandlestickChart;