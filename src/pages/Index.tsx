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
import { TradingHistory } from "@/components/dashboard/TradingHistory";
import { AIAnalysis } from "@/components/dashboard/AIAnalysis";
import { StrategyManager } from "@/components/strategies/StrategyManager";
import { TradingPanel } from "@/components/trading/TradingPanel";
import { SettingsPanel } from "@/components/settings/SettingsPanel";
import { HomePage } from "@/components/home/HomePage";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [isTrading, setIsTrading] = useState(false);

  // Mock data for demo
  const bancaAtual = 12450.30;
  const profit = 3250.45;
  const wins = 127;
  const losses = 43;
  const taxaAcerto = ((wins / (wins + losses)) * 100).toFixed(1);

  const renderActiveContent = () => {
    switch (activeTab) {
      case "home":
        return <HomePage />;
      case "dashboard":
        return (
          <div className="space-y-6">
            {/* Main Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricsCard
                title="Banca Atual"
                value={`$${bancaAtual.toLocaleString()}`}
                icon={Activity}
                trend="up"
                change="2.5%"
              />
              <MetricsCard
                title="Profit Total"
                value={`$${profit.toLocaleString()}`}
                icon={TrendingUp}
                trend="up"
                change="15.2%"
              />
              <MetricsCard
                title="Win/Loss"
                value={`${wins}/${losses}`}
                icon={Target}
                trend="up"
                change="8 trades hoje"
              />
              <MetricsCard
                title="Taxa de Acerto"
                value={`${taxaAcerto}%`}
                icon={Zap}
                trend="up"
                change="3.2% esta semana"
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
      case "trading":
        return <TradingPanel />;
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
          {/* Header - Only show when not on home page */}
          {activeTab !== "home" && (
            <>
              {/* Bot Control Center - Centralizado e em destaque */}
              <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-b border-primary/20">
                <div className="container mx-auto px-6 py-6">
                  <div className="flex flex-col items-center space-y-4">
                    {/* Status da Conexão */}
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
                        <span className="text-sm font-medium text-success">Conectado</span>
                      </div>
                      <div className="w-px h-4 bg-border" />
                      <div className="flex items-center space-x-2">
                        <Brain className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">EdgeAIEngine</span>
                      </div>
                    </div>
                    
                    {/* Botão Principal de Controle */}
                    <Button
                      onClick={() => setIsTrading(!isTrading)}
                      size="lg"
                      className={`
                        px-8 py-4 text-lg font-bold transition-all duration-300 transform hover:scale-105
                        ${isTrading 
                          ? 'bg-danger hover:bg-danger/90 text-white shadow-lg shadow-danger/30' 
                          : 'bg-success hover:bg-success/90 text-white shadow-lg shadow-success/30'
                        }
                      `}
                    >
                      {isTrading ? (
                        <>
                          <AlertTriangle className="h-5 w-5 mr-3" />
                          PARAR BOT
                        </>
                      ) : (
                        <>
                          <Zap className="h-5 w-5 mr-3" />
                          INICIAR BOT
                        </>
                      )}
                    </Button>
                    
                    {/* Status de Operação */}
                    {isTrading && (
                      <div className="flex items-center space-x-2 animate-fade-in">
                        <Badge variant="outline" className="border-warning text-warning animate-pulse">
                          Bot Operando
                        </Badge>
                        <div className="hidden md:flex items-center space-x-4 text-sm">
                          <span className="text-muted-foreground">Banca: <strong className="text-foreground">${bancaAtual.toLocaleString()}</strong></span>
                          <span className="text-muted-foreground">Profit: <strong className="profit">+${profit.toLocaleString()}</strong></span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Header Secundário */}
              <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-6 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Brain className="h-6 w-6 text-primary" />
                      <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                        {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                      </h1>
                    </div>
                  </div>
                </div>
              </header>
            </>
          )}

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
