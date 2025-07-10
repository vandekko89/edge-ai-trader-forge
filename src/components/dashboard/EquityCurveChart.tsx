import React, { useState, useEffect } from 'react';
import { ResponsiveContainer } from 'recharts';
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
  const [candleCount, setCandleCount] = useState(50);

  // Generate initial candlestick data
  useEffect(() => {
    const generateCandleData = () => {
      const data: CandleData[] = [];
      const trades: TradeEntry[] = [];
      let basePrice = 500.50;
      
      for (let i = 0; i < 100; i++) {
        const timestamp = Date.now() - (100 - i) * 60000;
        
        // Generate OHLC data with realistic variations
        const open = basePrice;
        const volatility = (Math.random() - 0.5) * 0.08;
        const close = open * (1 + volatility);
        
        // Create realistic high/low with proper ranges
        const highVariation = Math.random() * 0.03;
        const lowVariation = Math.random() * 0.03;
        const high = Math.max(open, close) * (1 + highVariation);
        const low = Math.min(open, close) * (1 - lowVariation);
        
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
        
        if (timeDiff >= 60000) {
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
          
          const newData = [...prev.slice(1), newCandle];
          
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
          const updatedCandle = { ...lastCandle };
          const priceChange = (Math.random() - 0.5) * 0.005;
          updatedCandle.close = updatedCandle.close * (1 + priceChange);
          updatedCandle.high = Math.max(updatedCandle.high, updatedCandle.close);
          updatedCandle.low = Math.min(updatedCandle.low, updatedCandle.close);
          updatedCandle.volume += Math.floor(Math.random() * 10);
          
          return [...prev.slice(0, -1), updatedCandle];
        }
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [isLive]);

  // Custom SVG Candlestick Chart
  const CustomCandlestickChart = ({ data, width, height }: { data: CandleData[], width: number, height: number }) => {
    if (!data.length) return null;

    // Calculate price range
    const allPrices = data.flatMap(candle => [candle.high, candle.low]);
    const minPrice = Math.min(...allPrices);
    const maxPrice = Math.max(...allPrices);
    const priceRange = maxPrice - minPrice;
    const padding = priceRange * 0.1;
    const chartMin = minPrice - padding;
    const chartMax = maxPrice + padding;
    const chartRange = chartMax - chartMin;

    const candleWidth = Math.max((width - 60) / data.length * 0.8, 3);
    const candleSpacing = (width - 60) / data.length;

    console.log('Chart data:', {
      dataLength: data.length,
      minPrice: minPrice.toFixed(3),
      maxPrice: maxPrice.toFixed(3),
      chartMin: chartMin.toFixed(3),
      chartMax: chartMax.toFixed(3)
    });

    return (
      <svg width={width} height={height} className="bg-background">
        {/* Y-axis labels */}
        {Array.from({ length: 6 }, (_, i) => {
          const price = chartMax - (i * chartRange / 5);
          const y = 20 + (i * (height - 60) / 5);
          return (
            <g key={i}>
              <line x1={45} y1={y} x2={width - 20} y2={y} stroke="#333" strokeWidth={0.5} opacity={0.3} />
              <text x={40} y={y + 4} textAnchor="end" className="text-xs fill-muted-foreground">
                ${price.toFixed(2)}
              </text>
            </g>
          );
        })}

        {/* X-axis labels */}
        {data.map((candle, index) => {
          if (index % Math.max(1, Math.floor(data.length / 8)) === 0) {
            const x = 50 + index * candleSpacing + candleSpacing / 2;
            return (
              <text key={index} x={x} y={height - 5} textAnchor="middle" className="text-xs fill-muted-foreground">
                {candle.time}
              </text>
            );
          }
          return null;
        })}

        {/* Candlesticks */}
        {data.map((candle, index) => {
          const x = 50 + index * candleSpacing + candleSpacing / 2;
          
          // Calculate Y positions
          const highY = 20 + ((chartMax - candle.high) / chartRange) * (height - 60);
          const lowY = 20 + ((chartMax - candle.low) / chartRange) * (height - 60);
          const openY = 20 + ((chartMax - candle.open) / chartRange) * (height - 60);
          const closeY = 20 + ((chartMax - candle.close) / chartRange) * (height - 60);

          const isGreen = candle.close >= candle.open;
          const bodyTop = Math.min(openY, closeY);
          const bodyBottom = Math.max(openY, closeY);
          const bodyHeight = Math.max(bodyBottom - bodyTop, 1);

          const greenColor = '#00c851';
          const redColor = '#ff3547';
          const color = isGreen ? greenColor : redColor;

          // Find trades for this candle
          const tradesAtTime = tradeEntries.filter(trade => 
            Math.abs(trade.timestamp - candle.timestamp) < 30000
          );

          return (
            <g key={candle.timestamp}>
              {/* Upper wick */}
              <line
                x1={x}
                y1={highY}
                x2={x}
                y2={bodyTop}
                stroke={color}
                strokeWidth={1.5}
              />
              
              {/* Lower wick */}
              <line
                x1={x}
                y1={bodyBottom}
                x2={x}
                y2={lowY}
                stroke={color}
                strokeWidth={1.5}
              />
              
              {/* Candle body */}
              <rect
                x={x - candleWidth / 2}
                y={bodyTop}
                width={candleWidth}
                height={bodyHeight}
                fill={isGreen ? color : '#1a1a1a'}
                stroke={color}
                strokeWidth={isGreen ? 0 : 2}
              />

              {/* Trade markers */}
              {tradesAtTime.map((trade) => {
                const entryY = 20 + ((chartMax - trade.entryPrice) / chartRange) * (height - 60);
                const entryColor = trade.type === 'CALL' ? '#10b981' : '#f59e0b';
                
                return (
                  <g key={trade.id}>
                    <circle
                      cx={x}
                      cy={entryY}
                      r={3}
                      fill={entryColor}
                      stroke="white"
                      strokeWidth={1}
                    />
                    <polygon
                      points={trade.type === 'CALL' 
                        ? `${x - 3},${entryY + 8} ${x},${entryY + 5} ${x + 3},${entryY + 8}`
                        : `${x - 3},${entryY - 8} ${x},${entryY - 5} ${x + 3},${entryY - 8}`
                      }
                      fill={entryColor}
                    />
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>
    );
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

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  const visibleCandleData = candleData.slice(-candleCount);

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
          <div className="h-[500px] w-full cursor-crosshair" onWheel={handleWheel}>
            <ResponsiveContainer width="100%" height="100%">
              <CustomCandlestickChart data={visibleCandleData} width={800} height={500} />
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