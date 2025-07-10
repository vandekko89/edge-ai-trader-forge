import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity, TrendingUp, Brain, Settings, BarChart3, Zap, Target, AlertTriangle } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";
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

  const renderActiveContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
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
          </div>
        );
      case "ai":
        return <AIAnalysis />;
      case "backtest":
        return (
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
        );
      case "strategies":
        return <StrategyManager />;
      case "logs":
        return (
          <div className="text-center py-8 text-muted-foreground">
            Logs em desenvolvimento
          </div>
        );
      case "settings":
        return <SettingsPanel />;
      default:
        return null;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background flex w-full">
        {/* Sidebar */}
        <AppSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
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

          {/* Page Content */}
          <main className="flex-1 container mx-auto px-4 py-6">
            <div className="animate-fade-in">
              {renderActiveContent()}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
