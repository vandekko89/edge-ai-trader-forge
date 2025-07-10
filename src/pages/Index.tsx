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
  const [selectedBroker, setSelectedBroker] = useState("Bybit"); // Corretora selecionada

  // Mock data for demo
  const userName = "João Silva"; // Nome do usuário
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

            {/* Barra de Probabilidade */}
            <div className="bg-card rounded-lg p-4 mb-6 border border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Probabilidade Atual</span>
                <div className="flex items-center space-x-3">
                  <Badge variant="outline" className="border-primary text-primary">
                    85.7% CALL
                  </Badge>
                  <span className="text-2xl font-bold text-primary">EUR/USD</span>
                </div>
              </div>
            </div>

            {/* Equity Curve Chart - Full Width */}
            <Card className="trading-card">
              <CardContent className="p-0">
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
      <div className="h-screen bg-background flex w-full overflow-hidden">
        {/* Sidebar */}
        <AppSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col h-full">
          {/* Header - Only show when not on home page */}
          {activeTab !== "home" && (
            <header className="border-b border-border bg-card/50 backdrop-blur-sm z-50 flex-shrink-0">
              <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Brain className="h-8 w-8 text-primary" />
                      <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                        EdgeAIEngine
                      </h1>
                    </div>
                    
                    {/* Status da conexão e operação */}
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className="border-success text-success">
                        <div className="w-2 h-2 rounded-full bg-success animate-pulse mr-2" />
                        Conectado à {selectedBroker}
                      </Badge>
                      <div className="w-px h-4 bg-border" />
                      <span className="text-sm font-medium text-muted-foreground">
                        {userName}
                      </span>
                      {isTrading && (
                        <>
                          <div className="w-px h-4 bg-border" />
                          <Badge variant="outline" className="border-warning text-warning animate-pulse">
                            Operando
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {/* Métricas rápidas - apenas quando operando */}
                    {isTrading && (
                      <div className="hidden md:flex items-center space-x-6">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Banca</p>
                          <p className="text-lg font-bold text-foreground">${bancaAtual.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Profit</p>
                          <p className="text-lg font-bold profit">+${profit.toLocaleString()}</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Botão Principal em Destaque */}
                    <Button
                      onClick={() => setIsTrading(!isTrading)}
                      size="lg"
                      className={`
                        px-6 py-3 text-base font-bold transition-all duration-300 transform hover:scale-105
                        ${isTrading 
                          ? 'bg-danger hover:bg-danger/90 text-white shadow-lg shadow-danger/30' 
                          : 'bg-success hover:bg-success/90 text-white shadow-lg shadow-success/30'
                        }
                      `}
                    >
                      {isTrading ? (
                        <>
                          <AlertTriangle className="h-5 w-5 mr-2" />
                          PARAR BOT
                        </>
                      ) : (
                        <>
                          <Zap className="h-5 w-5 mr-2" />
                          INICIAR BOT
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </header>
          )}

          {/* Page Content */}
          <main className="flex-1 overflow-auto p-6">
            <div className="animate-fade-in h-full">
              {renderActiveContent()}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
