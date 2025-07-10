import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Square, TrendingUp, Activity } from "lucide-react";

interface CandleData {
  time: string;
  timestamp: number;
  price: number;
  volume: number;
}

interface TradeEntry {
  id: string;
  timestamp: number;
  price: number;
  type: 'CALL' | 'PUT';
  amount: number;
  status: 'active' | 'won' | 'lost';
}

const LiveChart = () => {
  const [candleData, setCandleData] = useState<CandleData[]>([]);
  const [tradeEntries, setTradeEntries] = useState<TradeEntry[]>([]);
  const [isLive, setIsLive] = useState(false);

  // Generate initial data
  useEffect(() => {
    const generateData = () => {
      const data: CandleData[] = [];
      const trades: TradeEntry[] = [];
      let basePrice = 100;
      
      for (let i = 0; i < 30; i++) {
        const timestamp = Date.now() - (30 - i) * 60000;
        basePrice += (Math.random() - 0.5) * 2;
        
        data.push({
          time: new Date(timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          timestamp,
          price: basePrice,
          volume: Math.floor(Math.random() * 1000) + 100
        });

        // Add trade entries
        if (Math.random() > 0.8) {
          const tradeType = Math.random() > 0.5 ? 'CALL' : 'PUT';
          trades.push({
            id: `trade-${i}`,
            timestamp,
            price: basePrice,
            type: tradeType,
            amount: 10,
            status: Math.random() > 0.6 ? 'won' : 'lost'
          });
        }
      }
      
      setCandleData(data);
      setTradeEntries(trades);
    };

    generateData();
  }, []);

  // Live update
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setCandleData(prev => {
        const lastPoint = prev[prev.length - 1];
        const newPrice = lastPoint.price + (Math.random() - 0.5) * 1;
        
        const newPoint: CandleData = {
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          timestamp: Date.now(),
          price: newPrice,
          volume: Math.floor(Math.random() * 1000) + 100
        };
        
        const newData = [...prev.slice(1), newPoint];
        
        // Add random trade
        if (Math.random() > 0.9) {
          const newTrade: TradeEntry = {
            id: `trade-${Date.now()}`,
            timestamp: Date.now(),
            price: newPrice,
            type: Math.random() > 0.5 ? 'CALL' : 'PUT',
            amount: 10,
            status: 'active'
          };
          
          setTradeEntries(prevTrades => [newTrade, ...prevTrades.slice(0, 9)]);
        }
        
        return newData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isLive]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const relatedTrades = tradeEntries.filter(trade => 
        Math.abs(trade.timestamp - data.timestamp) < 120000
      );

      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-sm">Preço: <span className="font-mono">${data.price.toFixed(2)}</span></p>
          <p className="text-sm">Volume: <span className="font-mono">{data.volume}</span></p>
          
          {relatedTrades.length > 0 && (
            <div className="border-t pt-2 mt-2">
              <p className="text-xs font-medium">Trades:</p>
              {relatedTrades.map(trade => (
                <div key={trade.id} className="text-xs flex justify-between">
                  <span className={trade.type === 'CALL' ? 'text-green-500' : 'text-red-500'}>
                    {trade.type} ${trade.amount}
                  </span>
                  <span className={
                    trade.status === 'won' ? 'text-green-500' :
                    trade.status === 'lost' ? 'text-red-500' : 'text-yellow-500'
                  }>
                    {trade.status.toUpperCase()}
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
            {isLive ? "AO VIVO" : "DEMO"}
          </Badge>
        </div>

        <div className="text-sm text-muted-foreground">
          Último preço: ${candleData[candleData.length - 1]?.price.toFixed(2) || '0.00'}
        </div>
      </div>

      {/* Price Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span>Gráfico de Preços</span>
          </CardTitle>
          <CardDescription>Movimento de preços em tempo real</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={candleData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  domain={['dataMin - 2', 'dataMax + 2']}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Volume Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-primary" />
            <span>Volume</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[150px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={candleData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Bar 
                  dataKey="volume" 
                  fill="hsl(var(--muted-foreground))" 
                  opacity={0.6}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Trade Entries */}
      <Card>
        <CardHeader>
          <CardTitle>Entradas do Bot</CardTitle>
          <CardDescription>Últimas entradas executadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {tradeEntries.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Nenhuma entrada registrada
              </p>
            ) : (
              tradeEntries.map((trade) => (
                <div key={trade.id} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={trade.type === 'CALL' ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      {trade.type}
                    </Badge>
                    <span className="font-mono text-sm">${trade.amount}</span>
                    <span className="text-muted-foreground text-sm">
                      @${trade.price.toFixed(2)}
                    </span>
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
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const EquityCurveChart = () => {
  return <LiveChart />;
};