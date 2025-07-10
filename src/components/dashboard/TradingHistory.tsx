import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { History, TrendingUp, TrendingDown } from "lucide-react";

interface DailyData {
  date: string;
  portfolioValue: number;
  dailyPnL: number;
  totalReturn: number;
  trades: number;
  winRate: number;
  status: "profit" | "loss" | "neutral";
}

export const TradingHistory = () => {
  // Mock data for demo - últimos 10 dias de trading
  const tradingHistory: DailyData[] = [
    {
      date: "2024-01-15",
      portfolioValue: 12450.30,
      dailyPnL: 1250.45,
      totalReturn: 24.5,
      trades: 8,
      winRate: 87.5,
      status: "profit"
    },
    {
      date: "2024-01-14", 
      portfolioValue: 11199.85,
      dailyPnL: -425.20,
      totalReturn: 21.8,
      trades: 5,
      winRate: 60.0,
      status: "loss"
    },
    {
      date: "2024-01-13",
      portfolioValue: 11625.05,
      dailyPnL: 875.30,
      totalReturn: 23.2,
      trades: 12,
      winRate: 91.7,
      status: "profit"
    },
    {
      date: "2024-01-12",
      portfolioValue: 10749.75,
      dailyPnL: 320.15,
      totalReturn: 19.5,
      trades: 6,
      winRate: 83.3,
      status: "profit"
    },
    {
      date: "2024-01-11",
      portfolioValue: 10429.60,
      dailyPnL: -180.50,
      totalReturn: 16.2,
      trades: 4,
      winRate: 50.0,
      status: "loss"
    },
    {
      date: "2024-01-10",
      portfolioValue: 10610.10,
      dailyPnL: 1125.80,
      totalReturn: 18.1,
      trades: 15,
      winRate: 93.3,
      status: "profit"
    },
    {
      date: "2024-01-09",
      portfolioValue: 9484.30,
      dailyPnL: 685.45,
      totalReturn: 12.3,
      trades: 9,
      winRate: 77.8,
      status: "profit"
    },
    {
      date: "2024-01-08",
      portfolioValue: 8798.85,
      dailyPnL: -95.75,
      totalReturn: 8.1,
      trades: 3,
      winRate: 66.7,
      status: "loss"
    },
    {
      date: "2024-01-07",
      portfolioValue: 8894.60,
      dailyPnL: 445.20,
      totalReturn: 9.3,
      trades: 7,
      winRate: 85.7,
      status: "profit"
    },
    {
      date: "2024-01-06",
      portfolioValue: 8449.40,
      dailyPnL: 325.90,
      totalReturn: 5.8,
      trades: 5,
      winRate: 80.0,
      status: "profit"
    }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getPnLTrend = (pnl: number) => {
    if (pnl > 0) return <TrendingUp className="h-4 w-4 text-success" />;
    if (pnl < 0) return <TrendingDown className="h-4 w-4 text-danger" />;
    return null;
  };

  const getStatusBadge = (status: "profit" | "loss" | "neutral") => {
    const variants = {
      profit: "default",
      loss: "destructive", 
      neutral: "secondary"
    } as const;
    
    const labels = {
      profit: "Lucro",
      loss: "Perda",
      neutral: "Neutro"
    };

    return (
      <Badge variant={variants[status]} className="text-xs">
        {labels[status]}
      </Badge>
    );
  };

  return (
    <Card className="trading-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <History className="h-5 w-5 text-primary" />
          <span>Histórico de Trading</span>
        </CardTitle>
        <CardDescription>
          Histórico detalhado de performance diária dos últimos 10 dias
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50">
                <TableHead className="text-muted-foreground font-medium">Data</TableHead>
                <TableHead className="text-muted-foreground font-medium text-right">Portfolio</TableHead>
                <TableHead className="text-muted-foreground font-medium text-right">P&L Diário</TableHead>
                <TableHead className="text-muted-foreground font-medium text-right">Retorno Total</TableHead>
                <TableHead className="text-muted-foreground font-medium text-center">Trades</TableHead>
                <TableHead className="text-muted-foreground font-medium text-center">Win Rate</TableHead>
                <TableHead className="text-muted-foreground font-medium text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tradingHistory.map((day) => (
                <TableRow 
                  key={day.date} 
                  className="border-border/30 hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="font-medium text-foreground">
                    {formatDate(day.date)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-foreground">
                    {formatCurrency(day.portfolioValue)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-1">
                      {getPnLTrend(day.dailyPnL)}
                      <span className={`font-mono ${day.dailyPnL >= 0 ? 'profit' : 'loss'}`}>
                        {day.dailyPnL >= 0 ? '+' : ''}{formatCurrency(day.dailyPnL)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono profit">
                    +{day.totalReturn.toFixed(1)}%
                  </TableCell>
                  <TableCell className="text-center font-medium text-foreground">
                    {day.trades}
                  </TableCell>
                  <TableCell className="text-center font-mono text-foreground">
                    {day.winRate.toFixed(1)}%
                  </TableCell>
                  <TableCell className="text-center">
                    {getStatusBadge(day.status)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Summary Stats */}
        <div className="mt-6 pt-4 border-t border-border/30">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <p className="text-muted-foreground">Total Trades</p>
              <p className="text-lg font-bold text-foreground">
                {tradingHistory.reduce((sum, day) => sum + day.trades, 0)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-muted-foreground">Média Win Rate</p>
              <p className="text-lg font-bold profit">
                {(tradingHistory.reduce((sum, day) => sum + day.winRate, 0) / tradingHistory.length).toFixed(1)}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-muted-foreground">Dias Lucrativos</p>
              <p className="text-lg font-bold profit">
                {tradingHistory.filter(day => day.status === 'profit').length}
              </p>
            </div>
            <div className="text-center">
              <p className="text-muted-foreground">P&L Total</p>
              <p className="text-lg font-bold profit">
                {formatCurrency(tradingHistory.reduce((sum, day) => sum + day.dailyPnL, 0))}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};