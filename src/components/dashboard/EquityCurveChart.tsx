import React, { useState, useEffect } from 'react';
import { ComposedChart, XAxis, YAxis, Tooltip, ResponsiveContainer, Bar } from 'recharts';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Square, TrendingUp, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

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
  amount: number;
  status: 'active' | 'won' | 'lost';
}

const LiveCandlestickChart = () => {
  const [candleData, setCandleData] = useState<CandleData[]>([]);
  const [tradeEntries, setTradeEntries] = useState<TradeEntry[]>([]);
  const [isLive, setIsLive] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [candleCount, setCandleCount] = useState(50); // Number of candles to show

  // Generate initial candlestick data
  useEffect(() => {
    const generateCandleData = () => {
      const data: CandleData[] = [];
      const trades: TradeEntry[] = [];
      let basePrice = 500.50;
      
      for (let i = 0; i < 100; i++) {
        const timestamp = Date.now() - (100 - i) * 60000; // 1 minute candles
        
        // Generate OHLC data
        const open = basePrice;
        const volatility = (Math.random() - 0.5) * 0.02; // 2% max change
        const close = open * (1 + volatility);
        const high = Math.max(open, close) * (1 + Math.random() * 0.01);
        const low = Math.min(open, close) * (1 - Math.random() * 0.01);
        
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
          volume: Math.floor(Math.random() * 1000) + 500
        });

        basePrice = close;

        // Add some trade entries
        if (Math.random() > 0.85) {
          const tradeType = Math.random() > 0.5 ? 'CALL' : 'PUT';
          const trade: TradeEntry = {
            id: `trade-${i}`,
            timestamp,
            entryPrice: close,
            type: tradeType,
            amount: Math.floor(Math.random() * 50) + 10,
            status: 'active'
          };

          // Simulate trade results for older entries
          if (i < 95) {
            const futureCandle = data[i + 5];
            if (futureCandle) {
              const result = (tradeType === 'CALL' && futureCandle.close > close) ||
                           (tradeType === 'PUT' && futureCandle.close < close);
              trade.status = result ? 'won' : 'lost';
              trade.exitPrice = futureCandle.close;
            }
          }

          trades.push(trade);
        }
      }
      
      setCandleData(data);
      setTradeEntries(trades);
    };

    generateCandleData();
  }, []);

  // Live update simulation
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setCandleData(prev => {
        const lastCandle = prev[prev.length - 1];
        const now = Date.now();
        const timeDiff = now - lastCandle.timestamp;
        
        if (timeDiff >= 60000) { // New candle every minute
          const newCandle: CandleData = {
            time: new Date(now).toLocaleTimeString('pt-BR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            }),
            timestamp: now,
            open: lastCandle.close,
            high: lastCandle.close * (1 + Math.random() * 0.01),
            low: lastCandle.close * (1 - Math.random() * 0.01),
            close: lastCandle.close * (1 + (Math.random() - 0.5) * 0.015),
            volume: Math.floor(Math.random() * 1000) + 500
          };
          
          // Keep only last 100 candles
          const newData = [...prev.slice(1), newCandle];
          
          // Add new trade entry occasionally
          if (Math.random() > 0.8) {
            const newTrade: TradeEntry = {
              id: `trade-${now}`,
              timestamp: now,
              entryPrice: newCandle.close,
              type: Math.random() > 0.5 ? 'CALL' : 'PUT',
              amount: Math.floor(Math.random() * 50) + 10,
              status: 'active'
            };
            
            setTradeEntries(prevTrades => [newTrade, ...prevTrades.slice(0, 19)]);
          }
          
          return newData;
        } else {
          // Update current candle
          const updatedCandle = { ...lastCandle };
          const priceChange = (Math.random() - 0.5) * 0.005;
          updatedCandle.close = updatedCandle.close * (1 + priceChange);
          updatedCandle.high = Math.max(updatedCandle.high, updatedCandle.close);
          updatedCandle.low = Math.min(updatedCandle.low, updatedCandle.close);
          updatedCandle.volume += Math.floor(Math.random() * 10);
          
          return [...prev.slice(0, -1), updatedCandle];
        }
      });
    }, 1500); // Update every 1.5 seconds

    return () => clearInterval(interval);
  }, [isLive]);

  // Custom Candlestick component
  const CustomCandlestick = (props: any) => {
    const { x, y, width, height, payload } = props;
    if (!payload) return null;

    const { open, high, low, close, timestamp } = payload;
    const isGreen = close >= open;
    const color = isGreen ? '#22c55e' : '#ef4444';
    
    // Calculate Y positions based on price values relative to chart area
    const priceRange = high - low;
    if (priceRange === 0) return null;
    
    // Y positions for each price level
    const highY = y;
    const lowY = y + height;
    const openY = y + ((high - open) / priceRange) * height;
    const closeY = y + ((high - close) / priceRange) * height;
    
    // Body dimensions
    const bodyTop = Math.min(openY, closeY);
    const bodyBottom = Math.max(openY, closeY);
    const bodyHeight = Math.max(bodyBottom - bodyTop, 1);
    
    const candleWidth = Math.max(width * 0.7, 3);
    const centerX = x + width / 2;
    
    // Find trades at this time
    const tradesAtTime = tradeEntries.filter(trade => 
      Math.abs(trade.timestamp - timestamp) < 30000
    );

    return (
      <g>
        {/* Upper wick (from high to top of body) */}
        <line
          x1={centerX}
          y1={highY}
          x2={centerX}
          y2={bodyTop}
          stroke={color}
          strokeWidth={1}
        />
        
        {/* Lower wick (from bottom of body to low) */}
        <line
          x1={centerX}
          y1={bodyBottom}
          x2={centerX}
          y2={lowY}
          stroke={color}
          strokeWidth={1}
        />
        
        {/* Candle body */}
        <rect
          x={centerX - candleWidth / 2}
          y={bodyTop}
          width={candleWidth}
          height={bodyHeight}
          fill={isGreen ? color : 'transparent'}
          stroke={color}
          strokeWidth={1}
        />

        {/* Trade markers */}
        {tradesAtTime.map((trade, idx) => {
          const entryPriceY = y + ((high - trade.entryPrice) / priceRange) * height;
          const entryColor = trade.type === 'CALL' ? '#10b981' : '#f59e0b';
          const statusColor = trade.status === 'won' ? '#10b981' : 
                             trade.status === 'lost' ? '#ef4444' : '#8b5cf6';
          
          return (
            <g key={trade.id}>
              {/* Entry marker */}
              <circle
                cx={centerX}
                cy={entryPriceY}
                r={3}
                fill={entryColor}
                stroke="white"
                strokeWidth={1}
              />
              
              {/* Direction arrow */}
              <polygon
                points={trade.type === 'CALL' 
                  ? `${centerX - 4},${entryPriceY + 10} ${centerX},${entryPriceY + 6} ${centerX + 4},${entryPriceY + 10}`
                  : `${centerX - 4},${entryPriceY - 10} ${centerX},${entryPriceY - 6} ${centerX + 4},${entryPriceY - 10}`
                }
                fill={entryColor}
                stroke="white"
                strokeWidth={0.5}
              />
              
              {/* Status indicator */}
              {trade.status !== 'active' && (
                <circle
                  cx={centerX + 8}
                  cy={entryPriceY}
                  r={2}
                  fill={statusColor}
                  stroke="white"
                  strokeWidth={1}
                />
              )}
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
      const change = data.close - data.open;
      const changePercent = (change / data.open) * 100;
      
      const tradesAtTime = tradeEntries.filter(trade => 
        Math.abs(trade.timestamp - data.timestamp) < 30000
      );

      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg min-w-[200px]">
          <p className="font-medium mb-2">{label}</p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Abertura:</span>
              <span className="font-mono">${data.open.toFixed(3)}</span>
            </div>
            <div className="flex justify-between">
              <span>Máxima:</span>
              <span className="font-mono text-green-600">${data.high.toFixed(3)}</span>
            </div>
            <div className="flex justify-between">
              <span>Mínima:</span>
              <span className="font-mono text-red-600">${data.low.toFixed(3)}</span>
            </div>
            <div className="flex justify-between">
              <span>Fechamento:</span>
              <span className={`font-mono ${isGreen ? 'text-green-600' : 'text-red-600'}`}>
                ${data.close.toFixed(3)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Variação:</span>
              <span className={`font-mono ${isGreen ? 'text-green-600' : 'text-red-600'}`}>
                {isGreen ? '+' : ''}{change.toFixed(3)} ({changePercent.toFixed(2)}%)
              </span>
            </div>
            <div className="flex justify-between">
              <span>Volume:</span>
              <span className="font-mono">{data.volume.toLocaleString()}</span>
            </div>
          </div>
          
          {tradesAtTime.length > 0 && (
            <div className="border-t pt-2 mt-2">
              <p className="text-xs font-medium mb-1">Entradas do Bot:</p>
              {tradesAtTime.map(trade => (
                <div key={trade.id} className="text-xs flex justify-between items-center">
                  <span className={`px-1 rounded ${trade.type === 'CALL' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                    {trade.type} ${trade.amount}
                  </span>
                  <span className={`px-1 rounded text-xs ${
                    trade.status === 'won' ? 'bg-green-100 text-green-800' :
                    trade.status === 'lost' ? 'bg-red-100 text-red-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {trade.status === 'won' ? 'GANHOU' : 
                     trade.status === 'lost' ? 'PERDEU' : 'ATIVO'}
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

  // Zoom functions
  const handleZoomIn = () => {
    if (candleCount > 10) {
      setCandleCount(prev => Math.max(10, prev - 10));
      setZoomLevel(prev => prev + 0.2);
    }
  };

  const handleZoomOut = () => {
    if (candleCount < candleData.length) {
      setCandleCount(prev => Math.min(candleData.length, prev + 10));
      setZoomLevel(prev => Math.max(0.2, prev - 0.2));
    }
  };

  const handleResetZoom = () => {
    setCandleCount(50);
    setZoomLevel(1);
  };

  // Handle mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  // Get visible candle data based on zoom
  const visibleCandleData = candleData.slice(-candleCount);
  
  // Calculate Y domain for visible data
  const visiblePrices = visibleCandleData.flatMap(candle => [candle.high, candle.low]);
  const yMin = Math.min(...visiblePrices) - 0.5;
  const yMax = Math.max(...visiblePrices) + 0.5;

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => setIsLive(!isLive)}
            variant={isLive ? "destructive" : "default"}
            size="sm"
          >
            {isLive ? (
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
            {isLive ? "AO VIVO" : "HISTÓRICO"}
          </Badge>
          
          <div className="text-sm text-muted-foreground">
            R_50 • 1M
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center space-x-2 border-l pl-4">
            <Button
              onClick={handleZoomIn}
              variant="outline"
              size="sm"
              disabled={candleCount <= 10}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleZoomOut}
              variant="outline"
              size="sm"
              disabled={candleCount >= candleData.length}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleResetZoom}
              variant="outline"
              size="sm"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <span className="text-xs text-muted-foreground">
              {candleCount} candles • {zoomLevel.toFixed(1)}x
            </span>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          {candleData.length > 0 && (
            <>
              Último: ${candleData[candleData.length - 1]?.close.toFixed(3)} 
              <span className={
                candleData[candleData.length - 1]?.close >= candleData[candleData.length - 1]?.open 
                  ? 'text-green-600 ml-2' : 'text-red-600 ml-2'
              }>
                {((candleData[candleData.length - 1]?.close - candleData[candleData.length - 1]?.open) / candleData[candleData.length - 1]?.open * 100).toFixed(2)}%
              </span>
            </>
          )}
        </div>
      </div>

      {/* Candlestick Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span>Gráfico de Candlesticks</span>
          </CardTitle>
          <CardDescription>Visualização em tempo real estilo corretora</CardDescription>
        </CardHeader>
        <CardContent>
          <div 
            className="h-[500px] w-full cursor-crosshair" 
            onWheel={handleWheel}
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={visibleCandleData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <XAxis 
                  dataKey="time"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#666' }}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  domain={['dataMin - 0.5', 'dataMax + 0.5']}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#666' }}
                  tickFormatter={(value) => `$${value.toFixed(2)}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="close" 
                  shape={<CustomCandlestick />}
                  fill="transparent"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Entries */}
      <Card>
        <CardHeader>
          <CardTitle>Entradas Recentes do Bot</CardTitle>
          <CardDescription>Últimas operações executadas automaticamente</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {tradeEntries.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Aguardando entradas do bot...
              </p>
            ) : (
              tradeEntries.slice(0, 10).map((trade) => (
                <div key={trade.id} className="flex items-center justify-between p-3 border rounded-lg bg-card/50">
                  <div className="flex items-center space-x-3">
                    <Badge 
                      variant={trade.type === 'CALL' ? 'default' : 'destructive'}
                      className="text-xs px-2"
                    >
                      {trade.type}
                    </Badge>
                    <div className="text-sm">
                      <span className="font-mono">${trade.amount}</span>
                      <span className="text-muted-foreground ml-2">
                        @${trade.entryPrice.toFixed(3)}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(trade.timestamp).toLocaleTimeString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {trade.exitPrice && (
                      <span className="text-xs font-mono text-muted-foreground">
                        → ${trade.exitPrice.toFixed(3)}
                      </span>
                    )}
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
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const EquityCurveChart = () => {
  return <LiveCandlestickChart />;
};
