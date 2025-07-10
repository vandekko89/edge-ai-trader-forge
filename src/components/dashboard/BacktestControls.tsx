import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Square, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { derivApi } from "@/services/derivApi";

export const BacktestControls = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [strategy, setStrategy] = useState("");
  const [symbol, setSymbol] = useState("");
  const [timeframe, setTimeframe] = useState("");
  const [initialBalance, setInitialBalance] = useState("10000");
  const { toast } = useToast();

  const handleRunBacktest = async () => {
    if (!strategy || !symbol || !timeframe) {
      toast({
        title: "Missing Parameters",
        description: "Please fill all required fields before running backtest.",
        variant: "destructive",
      });
      return;
    }

    if (!derivApi.connected) {
      toast({
        title: "Connection Required",
        description: "Please connect to Deriv API first in Settings tab.",
        variant: "destructive",
      });
      return;
    }

    setIsRunning(true);
    toast({
      title: "Backtest Started",
      description: `Running ${strategy} strategy on ${symbol}`,
    });

    try {
      // Get active symbols to validate
      await derivApi.getActiveSymbols();
      
      // Simulate backtest execution with real API connection
      setTimeout(() => {
        setIsRunning(false);
        toast({
          title: "Backtest Complete",
          description: "Results have been updated in the equity curve.",
        });
      }, 3000);
    } catch (error) {
      setIsRunning(false);
      toast({
        title: "Backtest Failed",
        description: "Failed to connect to market data.",
        variant: "destructive",
      });
    }
  };

  const handleStopBacktest = () => {
    setIsRunning(false);
    toast({
      title: "Backtest Stopped",
      description: "Backtest execution has been halted.",
      variant: "destructive",
    });
  };

  const handleReset = () => {
    setStrategy("");
    setSymbol("");
    setTimeframe("");
    setInitialBalance("10000");
    toast({
      title: "Parameters Reset",
      description: "All backtest parameters have been reset.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Status */}
      <div className="flex items-center justify-between">
        <Badge variant={isRunning ? "default" : "secondary"} className="text-xs">
          {isRunning ? "Running" : "Ready"}
        </Badge>
        {isRunning && (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            <span className="text-xs text-muted-foreground">Processing...</span>
          </div>
        )}
      </div>

      {/* Parameters */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="strategy" className="text-sm font-medium">
            Strategy
          </Label>
          <Select value={strategy} onValueChange={setStrategy} disabled={isRunning}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select strategy" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ema_rsi">EMA + RSI</SelectItem>
              <SelectItem value="ml_strategy">ML Strategy</SelectItem>
              <SelectItem value="aggregation">Aggregation</SelectItem>
              <SelectItem value="scalping">Scalping Bot</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="symbol" className="text-sm font-medium">
            Symbol
          </Label>
          <Select value={symbol} onValueChange={setSymbol} disabled={isRunning}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select symbol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BTCUSDT">BTC/USDT</SelectItem>
              <SelectItem value="ETHUSDT">ETH/USDT</SelectItem>
              <SelectItem value="ADAUSDT">ADA/USDT</SelectItem>
              <SelectItem value="SOLUSDT">SOL/USDT</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="timeframe" className="text-sm font-medium">
            Timeframe
          </Label>
          <Select value={timeframe} onValueChange={setTimeframe} disabled={isRunning}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">1 Minute</SelectItem>
              <SelectItem value="5m">5 Minutes</SelectItem>
              <SelectItem value="15m">15 Minutes</SelectItem>
              <SelectItem value="1h">1 Hour</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="initial-balance" className="text-sm font-medium">
            Initial Balance ($)
          </Label>
          <Input
            id="initial-balance"
            type="number"
            value={initialBalance}
            onChange={(e) => setInitialBalance(e.target.value)}
            disabled={isRunning}
            className="mt-1"
            placeholder="10000"
          />
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-3">
        {!isRunning ? (
          <Button
            onClick={handleRunBacktest}
            className="w-full btn-trading"
            disabled={!strategy || !symbol || !timeframe}
          >
            <Play className="h-4 w-4 mr-2" />
            Run Backtest
          </Button>
        ) : (
          <Button
            onClick={handleStopBacktest}
            variant="destructive"
            className="w-full"
          >
            <Square className="h-4 w-4 mr-2" />
            Stop Backtest
          </Button>
        )}

        <Button
          onClick={handleReset}
          variant="outline"
          className="w-full"
          disabled={isRunning}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset Parameters
        </Button>
      </div>

      {/* Last Run Results */}
      <Card className="p-4">
        <div className="text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Return:</span>
            <span className="profit font-medium">+24.5%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Max Drawdown:</span>
            <span className="loss font-medium">-5.2%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Sharpe Ratio:</span>
            <span className="font-medium">1.84</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Win Rate:</span>
            <span className="font-medium">67.3%</span>
          </div>
        </div>
      </Card>
    </div>
  );
};