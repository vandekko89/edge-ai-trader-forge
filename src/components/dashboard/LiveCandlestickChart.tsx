import React, { useState, useEffect, useRef } from 'react';
import { ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { derivApi } from "@/services/derivApi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Square, Wifi, WifiOff } from "lucide-react";

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
  entryPrice: number;
  exitPrice?: number;
  type: 'CALL' | 'PUT';
  symbol: string;
  amount: number;
  status: 'active' | 'won' | 'lost';
  duration: number; // em minutos
}

const LiveCandlestickChart = () => {
  const [candleData, setCandleData] = useState<CandleData[]>([]);
  const [tradeEntries, setTradeEntries] = useState<TradeEntry[]>([]);
  const [currentSymbol, setCurrentSymbol] = useState('R_50');
  const [isLive, setIsLive] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const chartRef = useRef<any>(null);

  // Gerar dados mock
  useEffect(() => {
    const generateMockData = () => {
      const now = Date.now();
      const data: CandleData[] = [];
      let basePrice = 500;

      for (let i = 99; i >= 0; i--) {
        const timestamp = now - (i * 60000);
        const volatility = Math.random() * 0.02 - 0.01;
        const open = basePrice;
        const change = volatility * open;
        const close = open + change;
        const high = Math.max(open, close) + Math.random() * 3;
        const low = Math.min(open, close) - Math.random() * 3;
        
        data.push({
          time: new Date(timestamp).toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          timestamp,
          open,
          high,
          low,
          close,
          volume: Math.floor(Math.random() * 1000) + 100
        });
        
        basePrice = close;
      }

      return data;
    };

    const mockData = generateMockData();
    setCandleData(mockData);

    // Gerar trades mock com pontos exatos
    const mockTrades: TradeEntry[] = [
      {
        id: '1',
        timestamp: mockData[85].timestamp,
        entryPrice: mockData[85].close,
        exitPrice: mockData[90].close,
        type: 'CALL',
        symbol: currentSymbol,
        amount: 10,
        status: 'won',
        duration: 5
      },
      {
        id: '2', 
        timestamp: mockData[70].timestamp,
        entryPrice: mockData[70].close,
        exitPrice: mockData[75].close,
        type: 'PUT',
        symbol: currentSymbol,
        amount: 15,
        status: 'lost',
        duration: 5
      },
      {
        id: '3',
        timestamp: mockData[95].timestamp,
        entryPrice: mockData[95].close,
        type: 'CALL',
        symbol: currentSymbol,
        amount: 20,
        status: 'active',
        duration: 5
      }
    ];
    setTradeEntries(mockTrades);
  }, [currentSymbol]);

  // Atualização em tempo real
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setCandleData(prevData => {
        const newData = [...prevData];
        const lastCandle = newData[newData.length - 1];
        const now = Date.now();
        
        if (now - lastCandle.timestamp > 60000) {
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
          
          newData.push(newCandle);
          if (newData.length > 100) {
            newData.shift();
          }
        } else {
          const volatility = Math.random() * 0.01 - 0.005;
          const updatedCandle = { ...lastCandle };
          updatedCandle.close = lastCandle.close + (volatility * lastCandle.close);
          updatedCandle.high = Math.max(updatedCandle.high, updatedCandle.close);
          updatedCandle.low = Math.min(updatedCandle.low, updatedCandle.close);
          newData[newData.length - 1] = updatedCandle;
        }
        
        return newData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isLive]);

  // Componente customizado para renderizar velas
  const CustomCandlestick = (props: any) => {
    const { payload, x, y, width, height } = props;
    if (!payload) return null;

    const { open, high, low, close, timestamp } = payload;
    const isGreen = close >= open;
    const color = isGreen ? '#22c55e' : '#ef4444';
    const candleWidth = Math.max(width * 0.7, 3);
    const wickX = x + width / 2;

    // Calcular posições Y baseadas nos valores
    const range = high - low;
    const openY = y + height - ((open - low) / range * height);
    const closeY = y + height - ((close - low) / range * height);
    const highY = y + height - ((high - low) / range * height);
    const lowY = y + height - ((low - low) / range * height);

    // Encontrar trades neste timestamp
    const tradesAtTime = tradeEntries.filter(trade => {
      const timeDiff = Math.abs(trade.timestamp - timestamp);
      return timeDiff < 30000; // 30 segundos de tolerância
    });

    return (
      <g>
        {/* Pavio (wick) */}
        <line
          x1={wickX}
          y1={highY}
          x2={wickX}
          y2={lowY}
          stroke={color}
          strokeWidth={1}
        />
        
        {/* Corpo da vela */}
        <rect
          x={x + (width - candleWidth) / 2}
          y={Math.min(openY, closeY)}
          width={candleWidth}
          height={Math.abs(closeY - openY) || 1}
          fill={isGreen ? color : 'transparent'}
          stroke={color}
          strokeWidth={isGreen ? 0 : 1}
        />

        {/* Marcadores de entrada */}
        {tradesAtTime.map((trade, index) => {
          const entryY = y + height - ((trade.entryPrice - low) / range * height);
          const entryColor = trade.type === 'CALL' ? '#10b981' : '#f59e0b';
          const statusColor = trade.status === 'won' ? '#10b981' : 
                             trade.status === 'lost' ? '#ef4444' : '#8b5cf6';

          return (
            <g key={`entry-${trade.id}`}>
              {/* Marcador de entrada */}
              <circle
                cx={wickX}
                cy={entryY}
                r={4}
                fill={entryColor}
                stroke="white"
                strokeWidth={2}
              />
              
              {/* Seta indicando direção */}
              <polygon
                points={trade.type === 'CALL' 
                  ? `${wickX-3},${entryY+6} ${wickX},${entryY+3} ${wickX+3},${entryY+6}`
                  : `${wickX-3},${entryY-6} ${wickX},${entryY-3} ${wickX+3},${entryY-6}`
                }
                fill={entryColor}
                stroke="white"
                strokeWidth={1}
              />

              {/* Linha até saída (se houver) */}
              {trade.exitPrice && (
                <>
                  {(() => {
                    // Encontrar candle de saída
                    const exitCandleIndex = candleData.findIndex(candle => 
                      Math.abs(candle.timestamp - (trade.timestamp + trade.duration * 60000)) < 30000
                    );
                    
                    if (exitCandleIndex > -1) {
                      const exitCandle = candleData[exitCandleIndex];
                      const exitX = x + (exitCandleIndex - candleData.findIndex(c => c.timestamp === timestamp)) * width;
                      const exitY = y + height - ((trade.exitPrice - low) / range * height);
                      
                      return (
                        <g>
                          {/* Linha de conexão */}
                          <line
                            x1={wickX}
                            y1={entryY}
                            x2={exitX + width/2}
                            y2={exitY}
                            stroke={statusColor}
                            strokeWidth={2}
                            strokeDasharray="3,3"
                            opacity={0.7}
                          />
                          
                          {/* Marcador de saída */}
                          <rect
                            x={exitX + width/2 - 4}
                            y={exitY - 4}
                            width={8}
                            height={8}
                            fill={statusColor}
                            stroke="white"
                            strokeWidth={2}
                            transform={`rotate(45 ${exitX + width/2} ${exitY})`}
                          />
                        </g>
                      );
                    }
                    return null;
                  })()}
                </>
              )}

              {/* Label do trade */}
              <text
                x={wickX}
                y={entryY - 15}
                textAnchor="middle"
                fontSize="10"
                fill={entryColor}
                fontWeight="bold"
              >
                {trade.type} ${trade.amount}
              </text>
            </g>
          );
        })}
      </g>
    );
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isGreen = data.close >= data.open;
      
      // Encontrar trades neste horário
      const tradesAtTime = tradeEntries.filter(trade => {
        const timeDiff = Math.abs(trade.timestamp - data.timestamp);
        return timeDiff < 30000;
      });
      
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
          
          {tradesAtTime.length > 0 && (
            <div className="mt-2 pt-2 border-t">
              <p className="text-xs font-medium text-muted-foreground">Trades:</p>
              {tradesAtTime.map(trade => (
                <div key={trade.id} className="text-xs flex justify-between">
                  <span className={trade.type === 'CALL' ? 'text-green-500' : 'text-orange-500'}>
                    {trade.type} ${trade.amount}
                  </span>
                  <span className={
                    trade.status === 'won' ? 'text-green-500' :
                    trade.status === 'lost' ? 'text-red-500' : 'text-purple-500'
                  }>
                    {trade.status}
                  </span>
                </div>
              ))}
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
        <div className="flex items-center gap-2">
          <Badge variant={connectionStatus === 'connected' ? 'default' : 'secondary'}>
            <div className="flex items-center gap-1">
              {connectionStatus === 'connected' ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
              {connectionStatus.toUpperCase()}
            </div>
          </Badge>
          
          <Button
            onClick={async () => {
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
                  console.error('Falha ao conectar com Deriv API:', error);
                }
              } else {
                setIsLive(false);
                setConnectionStatus(derivApi.connected ? 'connected' : 'disconnected');
              }
            }}
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
        </div>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart 
          data={candleData} 
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          ref={chartRef}
        >
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
          
          {/* Renderizar velas customizadas */}
          {candleData.map((candle, index) => (
            <CustomCandlestick
              key={`candle-${index}`}
              payload={candle}
              x={index * (100 / candleData.length) + '%'}
              y={0}
              width={100 / candleData.length + '%'}
              height="100%"
            />
          ))}
        </ComposedChart>
      </ResponsiveContainer>

      {/* Legenda */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full" />
          <span>Entrada CALL</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-orange-500 rounded-full" />
          <span>Entrada PUT</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-purple-500 rotate-45" />
          <span>Saída</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-0.5 bg-green-500" style={{ borderStyle: 'dashed' }} />
          <span>Ganhou</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-0.5 bg-red-500" style={{ borderStyle: 'dashed' }} />
          <span>Perdeu</span>
        </div>
      </div>

      {/* Trades recentes */}
      <div className="mt-4">
        <h4 className="text-sm font-medium mb-2">Entradas do Bot</h4>
        <div className="space-y-2">
          {tradeEntries.slice().reverse().map((trade) => (
            <div key={trade.id} className="flex items-center justify-between text-xs bg-muted/50 rounded p-2">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  trade.type === 'CALL' ? 'bg-green-500' : 'bg-orange-500'
                }`} />
                <span>{trade.type}</span>
                <span className="text-muted-foreground">
                  {new Date(trade.timestamp).toLocaleTimeString('pt-BR')}
                </span>
                <span className="font-mono">{trade.entryPrice.toFixed(3)}</span>
                {trade.exitPrice && (
                  <>
                    <span>→</span>
                    <span className="font-mono">{trade.exitPrice.toFixed(3)}</span>
                  </>
                )}
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