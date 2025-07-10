import React, { useState, useEffect } from 'react';
import { ComposedChart, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import DerivAPI from '@deriv/deriv-api';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Play, Square, TrendingUp, ZoomIn, ZoomOut, RotateCcw, Settings, Link, AlertCircle } from "lucide-react";

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
  profit?: number;
}

interface TradingAccount {
  balance: number;
  initialBalance: number;
  totalProfit: number;
  totalLoss: number;
  winRate: number;
  totalTrades: number;
}

const LiveCandlestickChart = () => {
  const [candleData, setCandleData] = useState<CandleData[]>([]);
  const [tradeEntries, setTradeEntries] = useState<TradeEntry[]>([]);
  const [isLive, setIsLive] = useState(true); // Start in live mode for real testing
  const [zoomLevel, setZoomLevel] = useState(1);
  const [candleCount, setCandleCount] = useState(50);
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());
  const [syncStatus, setSyncStatus] = useState<'synced' | 'updating' | 'delayed'>('synced');
  
  // Deriv API Integration - LOCAL STORAGE
  const [derivToken, setDerivToken] = useState<string>(localStorage.getItem('deriv_token') || '');
  const [derivConnection, setDerivConnection] = useState<DerivAPI | null>(null);
  const [realAccountData, setRealAccountData] = useState<any>(null);
  const [isConnectedToReal, setIsConnectedToReal] = useState(false);
  const [connectionError, setConnectionError] = useState<string>('');
  
  // Trading Account State - Can switch between MOCK and REAL
  const [account, setAccount] = useState<TradingAccount>({
    balance: 1000.00,        // Saldo inicial de $1000 (mock)
    initialBalance: 1000.00, // Balanço inicial para cálculos
    totalProfit: 0,
    totalLoss: 0,
    winRate: 0,
    totalTrades: 0
  });

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

  // Função para calcular lucro de trade
  const calculateTradeProfit = (trade: TradeEntry, currentPrice: number): number => {
    if (!trade.exitPrice) return 0;
    
    const payout = 0.85; // 85% payout para trades vencedores
    const isWinningTrade = 
      (trade.type === 'CALL' && trade.exitPrice > trade.entryPrice) ||
      (trade.type === 'PUT' && trade.exitPrice < trade.entryPrice);
    
    return isWinningTrade ? trade.amount * payout : -trade.amount;
  };

  // Atualizar banca quando trades são resolvidos
  useEffect(() => {
    const resolvedTrades = tradeEntries.filter(t => t.status !== 'active' && t.profit === undefined);
    
    if (resolvedTrades.length > 0) {
      let totalProfitChange = 0;
      let totalLossChange = 0;
      let winCount = 0;
      
      resolvedTrades.forEach(trade => {
        const profit = calculateTradeProfit(trade, trade.exitPrice || 0);
        
        if (profit > 0) {
          totalProfitChange += profit;
          winCount++;
        } else {
          totalLossChange += Math.abs(profit);
        }
        
        // Mark trade as processed
        trade.profit = profit;
      });
      
      setAccount(prev => {
        const newBalance = prev.balance + totalProfitChange - totalLossChange;
        const newTotalTrades = prev.totalTrades + resolvedTrades.length;
        const newTotalProfit = prev.totalProfit + totalProfitChange;
        const newTotalLoss = prev.totalLoss + totalLossChange;
        const newWinRate = newTotalTrades > 0 ? (newTotalProfit / (newTotalProfit + newTotalLoss)) * 100 : 0;
        
        console.log('💰 Banca Atualizada:', {
          saldoAnterior: prev.balance.toFixed(2),
          novoSaldo: newBalance.toFixed(2),
          lucro: totalProfitChange.toFixed(2),
          perda: totalLossChange.toFixed(2),
          trades: resolvedTrades.length,
          winRate: newWinRate.toFixed(1) + '%'
        });
        
        return {
          ...prev,
          balance: newBalance,
          totalProfit: newTotalProfit,
          totalLoss: newTotalLoss,
          winRate: newWinRate,
          totalTrades: newTotalTrades
        };
      });
    }
  }, [tradeEntries]);

  // Deriv API Connection Functions
  const connectToDerivAPI = async (token: string) => {
    try {
      setConnectionError('');
      setSyncStatus('updating');
      
      // Validate token format
      if (!token || token.length < 10) {
        throw new Error('Token inválido. O token deve ter pelo menos 10 caracteres.');
      }
      
      if (!token.match(/^[a-zA-Z0-9_-]+$/)) {
        throw new Error('Token contém caracteres inválidos. Use apenas letras, números, - e _');
      }
      
      console.log('🔄 Iniciando conexão com Deriv API...');
      
      const connection = new DerivAPI({ app_id: 1089 });
      
      // Authorize with token directly (no ping needed)
      console.log('🔐 Autorizando token...');
      const authResponse = await connection.authorize(token);
      console.log('🔗 Resposta da autorização:', authResponse);
      
      if (authResponse.error) {
        const errorMsg = authResponse.error.message;
        if (errorMsg.includes('InvalidToken')) {
          throw new Error('Token inválido ou expirado. Verifique se o token está correto.');
        } else if (errorMsg.includes('restricted')) {
          throw new Error('Token com permissões insuficientes. Use um token com permissão de leitura.');
        } else {
          throw new Error(`Erro de autorização: ${errorMsg}`);
        }
      }
      
      if (!authResponse.authorize) {
        throw new Error('Falha na autorização. Resposta inválida da API.');
      }
      
      // Get account balance
      console.log('💰 Obtendo saldo da conta...');
      const balanceResponse = await connection.balance();
      console.log('💰 Resposta do saldo:', balanceResponse);
      
      if (balanceResponse.error) {
        throw new Error(`Erro ao obter saldo: ${balanceResponse.error.message}`);
      }
      
      if (!balanceResponse.balance) {
        throw new Error('Não foi possível obter o saldo da conta.');
      }
      
      setDerivConnection(connection);
      setRealAccountData(authResponse.authorize);
      setIsConnectedToReal(true);
      
      // Update account with real data
      setAccount(prev => ({
        ...prev,
        balance: parseFloat(balanceResponse.balance.balance),
        initialBalance: parseFloat(balanceResponse.balance.balance)
      }));
      
      // Save token to localStorage
      localStorage.setItem('deriv_token', token);
      setDerivToken(token);
      
      setSyncStatus('synced');
      console.log('✅ Conectado à conta real da Deriv com sucesso!');
      
    } catch (error: any) {
      let errorMessage = 'Erro desconhecido ao conectar com Deriv';
      
      if (error.name === 'NetworkError' || error.message.includes('fetch')) {
        errorMessage = 'Erro de rede. Verifique sua conexão com a internet.';
      } else if (error.message.includes('WebSocket')) {
        errorMessage = 'Erro de WebSocket. Tente novamente em alguns segundos.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setConnectionError(errorMessage);
      setSyncStatus('delayed');
      console.error('❌ Erro de conexão detalhado:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
    }
  };

  const disconnectFromDerivAPI = () => {
    if (derivConnection) {
      derivConnection.disconnect();
    }
    setDerivConnection(null);
    setRealAccountData(null);
    setIsConnectedToReal(false);
    localStorage.removeItem('deriv_token');
    setDerivToken('');
    setConnectionError('');
    console.log('🔌 Desconectado da Deriv');
  };

  // Auto-connect on load if token exists
  useEffect(() => {
    const savedToken = localStorage.getItem('deriv_token');
    if (savedToken && savedToken.length > 0) {
      connectToDerivAPI(savedToken);
    }
  }, []);

  // Real Deriv balance updates
  useEffect(() => {
    if (!derivConnection || !isConnectedToReal) return;
    
    const interval = setInterval(async () => {
      try {
        const balanceResponse = await derivConnection.balance();
        setAccount(prev => ({
          ...prev,
          balance: parseFloat(balanceResponse.balance.balance)
        }));
      } catch (error) {
        console.error('Erro ao atualizar saldo:', error);
      }
    }, 5000); // Update balance every 5 seconds
    
    return () => clearInterval(interval);
  }, [derivConnection, isConnectedToReal]);


  // Real-time synchronized live updates
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const updateStart = Date.now();
      setSyncStatus('updating');
      
      setCandleData(prev => {
        const lastCandle = prev[prev.length - 1];
        const now = Date.now();
        const timeDiff = now - lastCandle.timestamp;
        
        // Real-time price simulation with higher volatility for testing
        if (timeDiff >= 60000) {
          // New candle every minute
          const volatility = (Math.random() - 0.5) * 0.12; // 12% max volatility for testing
          const newCandle: CandleData = {
            time: new Date(now).toLocaleTimeString('pt-BR', { 
              hour: '2-digit', 
              minute: '2-digit',
              second: '2-digit'
            }),
            timestamp: now,
            open: lastCandle.close,
            high: lastCandle.close * (1 + Math.max(0, volatility) + Math.random() * 0.02),
            low: lastCandle.close * (1 + Math.min(0, volatility) - Math.random() * 0.02),
            close: lastCandle.close * (1 + volatility),
            volume: Math.floor(Math.random() * 2000) + 800
          };
          
          console.log('🕐 New Candle:', {
            time: newCandle.time,
            price: newCandle.close.toFixed(3),
            change: ((newCandle.close - newCandle.open) / newCandle.open * 100).toFixed(2) + '%',
            syncTime: Date.now() - updateStart + 'ms'
          });

          const newData = [...prev.slice(1), newCandle];
          
          // Generate trade entries with higher frequency for testing
          if (Math.random() > 0.7) {
            const newTrade: TradeEntry = {
              id: `trade-${now}`,
              timestamp: now,
              entryPrice: newCandle.close,
              type: Math.random() > 0.5 ? 'CALL' : 'PUT',
              amount: Math.floor(Math.random() * 100) + 20,
              status: 'active'
            };
            
            console.log('🎯 New Trade:', {
              type: newTrade.type,
              price: newTrade.entryPrice.toFixed(3),
              amount: newTrade.amount
            });
            
            setTradeEntries(prevTrades => [newTrade, ...prevTrades.slice(0, 19)]);
          }

          // Resolve active trades (simulate 1-minute expiry)
          setTradeEntries(prevTrades => 
            prevTrades.map(trade => {
              if (trade.status === 'active' && (now - trade.timestamp) >= 60000) {
                const isWinner = 
                  (trade.type === 'CALL' && newCandle.close > trade.entryPrice) ||
                  (trade.type === 'PUT' && newCandle.close < trade.entryPrice);
                
                const updatedTrade = {
                  ...trade,
                  status: isWinner ? 'won' as const : 'lost' as const,
                  exitPrice: newCandle.close
                };
                
                console.log('✅ Trade Resolved:', {
                  id: trade.id,
                  type: trade.type,
                  result: updatedTrade.status,
                  entry: trade.entryPrice.toFixed(3),
                  exit: newCandle.close.toFixed(3),
                  profit: isWinner ? (trade.amount * 0.85).toFixed(2) : `-${trade.amount.toFixed(2)}`
                });
                
                return updatedTrade;
              }
              return trade;
            })
          );
          
          setLastUpdateTime(now);
          setSyncStatus('synced');
          return newData;
        } else {
          // Update current candle in real-time
          const updatedCandle = { ...lastCandle };
          const microChange = (Math.random() - 0.5) * 0.008; // Smaller micro movements
          const newClose = updatedCandle.close * (1 + microChange);
          
          updatedCandle.close = newClose;
          updatedCandle.high = Math.max(updatedCandle.high, newClose);
          updatedCandle.low = Math.min(updatedCandle.low, newClose);
          updatedCandle.volume += Math.floor(Math.random() * 15);
          
          // Update timestamp for current candle
          updatedCandle.time = new Date(now).toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
          });
          
          setLastUpdateTime(now);
          setSyncStatus('synced');
          return [...prev.slice(0, -1), updatedCandle];
        }
      });

      // Check for sync delays
      setTimeout(() => {
        const syncTime = Date.now() - updateStart;
        if (syncTime > 100) {
          setSyncStatus('delayed');
          console.warn('⚠️ Sync delay detected:', syncTime + 'ms');
        }
      }, 50);
      
    }, 600); // Ultra-fast 0.6 second updates for real testing

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
      {/* Trading Account Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Saldo Atual</p>
                <p className={`text-2xl font-bold ${account.balance >= account.initialBalance ? 'text-green-600' : 'text-red-600'}`}>
                  ${account.balance.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {account.balance >= account.initialBalance ? '+' : ''}
                  ${(account.balance - account.initialBalance).toFixed(2)}
                </p>
              </div>
              <div className={`w-3 h-3 rounded-full ${account.balance >= account.initialBalance ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">Lucro Total</p>
              <p className="text-xl font-bold text-green-600">${account.totalProfit.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">Ganhos acumulados</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">Perda Total</p>
              <p className="text-xl font-bold text-red-600">${account.totalLoss.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">Perdas acumuladas</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">Win Rate</p>
              <p className={`text-xl font-bold ${account.winRate >= 50 ? 'text-green-600' : 'text-red-600'}`}>
                {account.winRate.toFixed(1)}%
              </p>
              <p className="text-xs text-muted-foreground">{account.totalTrades} trades</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">ROI</p>
              <p className={`text-xl font-bold ${account.balance >= account.initialBalance ? 'text-green-600' : 'text-red-600'}`}>
                {(((account.balance - account.initialBalance) / account.initialBalance) * 100).toFixed(1)}%
              </p>
              <p className="text-xs text-muted-foreground">Retorno sobre investimento</p>
            </div>
          </CardContent>
        </Card>
      </div>
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
                Parar
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Iniciar
              </>
            )}
          </Button>
          
          <Badge variant={isLive ? "default" : "secondary"} className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${
              syncStatus === 'synced' ? 'bg-green-500 animate-pulse' :
              syncStatus === 'updating' ? 'bg-yellow-500 animate-spin' :
              'bg-red-500'
            }`} />
            <span>{isLive ? "ATIVO" : "HISTÓRICO"}</span>
          </Badge>
          
          <div className="text-sm text-muted-foreground flex items-center space-x-2">
            <span>R_50 • 1M</span>
            {isLive && (
              <>
                <span>•</span>
                <span className="text-xs">
                  Sync: {syncStatus === 'synced' ? '✓' : syncStatus === 'updating' ? '⟳' : '⚠'}
                </span>
                <span>•</span>
                <span className="text-xs">
                  {Math.round((Date.now() - lastUpdateTime) / 1000)}s
                </span>
              </>
            )}
          </div>

        </div>

        <div className="flex items-center space-x-4">
          {/* Deriv Connection Status */}
          <div className="flex items-center space-x-2">
            <Badge variant={isConnectedToReal ? "default" : "secondary"} className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${isConnectedToReal ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
              <span>{isConnectedToReal ? 'DERIV REAL' : 'MODO DEMO'}</span>
            </Badge>
            
            {/* Deriv Settings Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Conexão
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2">
                    <Link className="h-5 w-5" />
                    <span>Conectar à Deriv Real</span>
                  </DialogTitle>
                  <DialogDescription>
                    Conecte sua conta real da Deriv para monitoramento da banca em tempo real.
                    Seu token é armazenado localmente no navegador.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  {connectionError && (
                    <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm text-red-600">{connectionError}</span>
                    </div>
                  )}
                  
                  {isConnectedToReal && realAccountData && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="text-sm">
                        <p className="font-medium text-green-800">✅ Conectado à Deriv</p>
                        <p className="text-green-600">Conta: {realAccountData.loginid}</p>
                        <p className="text-green-600">Email: {realAccountData.email}</p>
                        <p className="text-green-600">Moeda: {realAccountData.currency}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="deriv-token">Token de Conexão</Label>
                    <Input
                      id="deriv-token"
                      type="password"
                      placeholder="Cole seu token da Deriv API aqui..."
                      value={derivToken}
                      onChange={(e) => setDerivToken(e.target.value)}
                      disabled={isConnectedToReal}
                    />
                    <p className="text-xs text-muted-foreground">
                      Obtenha seu token em: Deriv → Settings → API Token
                    </p>
                  </div>
                  
                  <div className="flex space-x-2">
                    {!isConnectedToReal ? (
                      <Button 
                        onClick={() => connectToDerivAPI(derivToken)}
                        disabled={!derivToken || syncStatus === 'updating'}
                        className="flex-1"
                      >
                        {syncStatus === 'updating' ? 'Conectando...' : 'Conectar'}
                      </Button>
                    ) : (
                      <Button 
                        onClick={disconnectFromDerivAPI}
                        variant="destructive"
                        className="flex-1"
                      >
                        Desconectar
                      </Button>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

        </div>
      </div>

      {/* Candlestick Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span>Gráfico de Candles</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>•</span>
                <span className="font-medium">EUR/USD</span>
                <span>•</span>
                <span>M1</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleZoomIn}
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleZoomOut}
                title="Zoom Out"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleResetZoom}
                title="Reset Zoom"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
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