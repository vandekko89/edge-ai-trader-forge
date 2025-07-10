import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity, TrendingUp, Brain, Settings, BarChart3, Zap, Target, AlertTriangle } from "lucide-react";
import { EquityCurveChart } from "@/components/dashboard/EquityCurveChart";
import { BacktestControls } from "@/components/dashboard/BacktestControls";
import { MetricsCard } from "@/components/dashboard/MetricsCard";
import { AIAnalysis } from "@/components/dashboard/AIAnalysis";
import { StrategyManager } from "@/components/strategies/StrategyManager";

import { SettingsPanel } from "@/components/settings/SettingsPanel";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isTrading, setIsTrading] = useState(false);

  // Mock data for demo
  const portfolioValue = 12450.30;
  const dailyPnL = 1250.45;
  const totalReturn = 24.5;
  const activeStrategies = 3;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Brain className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                  EdgeAIEngine
                </h1>
              </div>
              <Badge variant="outline" className="border-success text-success">
                Live Trading
              </Badge>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-6">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Portfolio Value</p>
                  <p className="text-lg font-bold text-foreground">${portfolioValue.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Daily P&L</p>
                  <p className={`text-lg font-bold ${dailyPnL >= 0 ? 'profit' : 'loss'}`}>
                    {dailyPnL >= 0 ? '+' : ''}${dailyPnL.toLocaleString()}
                  </p>
                </div>
              </div>
              
              <Button
                onClick={() => setIsTrading(!isTrading)}
                className={`btn-trading ${isTrading ? 'bg-danger' : ''}`}
              >
                {isTrading ? (
                  <>
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Stop Trading
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Start Trading
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 lg:w-[600px] mb-8">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center space-x-2">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">IA</span>
            </TabsTrigger>
            <TabsTrigger value="backtest" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Backtest</span>
            </TabsTrigger>
            <TabsTrigger value="strategies" className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Strategies</span>
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Logs</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <MetricsCard
                title="Portfolio Value"
                value={`$${portfolioValue.toLocaleString()}`}
                change={`+${totalReturn}%`}
                trend="up"
                icon={TrendingUp}
              />
              <MetricsCard
                title="Daily P&L"
                value={`$${Math.abs(dailyPnL).toLocaleString()}`}
                change={dailyPnL >= 0 ? "Profit" : "Loss"}
                trend={dailyPnL >= 0 ? "up" : "down"}
                icon={BarChart3}
              />
              <MetricsCard
                title="Active Strategies"
                value={activeStrategies.toString()}
                change="Running"
                trend="neutral"
                icon={Target}
              />
              <MetricsCard
                title="AI Confidence"
                value="94.2%"
                change="High"
                trend="up"
                icon={Brain}
              />
            </div>

            {/* Equity Curve Chart - Full Width */}
            <Card className="trading-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span>Equity Curve</span>
                </CardTitle>
                <CardDescription>
                  Portfolio performance over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EquityCurveChart />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai">
            <AIAnalysis />
          </TabsContent>

          <TabsContent value="backtest">
            <Card className="trading-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-primary" />
                  <span>Backtest Engine</span>
                </CardTitle>
                <CardDescription>
                  Test strategies with historical data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BacktestControls />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="strategies">
            <StrategyManager />
          </TabsContent>

          <TabsContent value="logs">
            <div className="text-center py-8 text-muted-foreground">
              Logs em desenvolvimento
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <SettingsPanel />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
