import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, TrendingUp, Target, BarChart3, Settings, Play, Pause, Zap, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Strategy {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  performance: number;
  risk: "Low" | "Medium" | "High";
  icon: any;
  parameters: Record<string, any>;
  type?: "traditional" | "ai";
  certainty?: number;
}

export const StrategyManager = () => {
  const { toast } = useToast();
  const [strategies, setStrategies] = useState<Strategy[]>([
    {
      id: "ema_rsi",
      name: "EMA + RSI Strategy",
      description: "Moving average crossover with RSI confirmation",
      isActive: true,
      performance: 18.5,
      risk: "Medium",
      type: "traditional",
      icon: TrendingUp,
      parameters: {
        ema_period: 20,
        rsi_period: 14,
        rsi_oversold: 30,
        rsi_overbought: 70,
        position_size: 0.1
      }
    },
    {
      id: "ai_multi_indicator",
      name: "IA Multi-Indicadores",
      description: "Análise inteligente de 10 indicadores técnicos",
      isActive: true,
      performance: 84.2,
      risk: "Medium",
      type: "ai",
      certainty: 78.5,
      icon: Brain,
      parameters: {
        confidence_threshold: 0.75,
        indicator_count: 10,
        weight_adaptation: true,
        news_impact_factor: 0.2
      }
    },
    {
      id: "ai_sentiment_news",
      name: "IA Sentimento + Notícias",
      description: "Análise de sentimento do mercado e notícias",
      isActive: false,
      performance: 71.3,
      risk: "High",
      type: "ai",
      certainty: 82.1,
      icon: Lightbulb,
      parameters: {
        news_sources: 5,
        sentiment_weight: 0.4,
        market_impact_threshold: 0.6,
        realtime_analysis: true
      }
    },
    {
      id: "ai_pattern_recognition",
      name: "IA Reconhecimento de Padrões",
      description: "Identificação de padrões gráficos com IA",
      isActive: true,
      performance: 89.7,
      risk: "Low",
      type: "ai",
      certainty: 91.2,
      icon: Zap,
      parameters: {
        pattern_types: 12,
        historical_depth: 1000,
        confidence_filter: 0.8,
        adaptation_speed: 0.15
      }
    },
    {
      id: "ml_strategy",
      name: "ML Prediction Model",
      description: "Machine learning based price prediction",
      isActive: true,
      performance: 32.1,
      risk: "High",
      type: "traditional",
      icon: BarChart3,
      parameters: {
        confidence_threshold: 0.75,
        lookback_period: 50,
        prediction_horizon: 5,
        model_retrain_frequency: 24
      }
    },
    {
      id: "scalping",
      name: "Scalping Bot",
      description: "High-frequency micro-movements capture",
      isActive: false,
      performance: 12.3,
      risk: "Low",
      type: "traditional",
      icon: Target,
      parameters: {
        spread_threshold: 0.05,
        max_holding_time: 2,
        profit_target: 0.2,
        stop_loss: 0.1
      }
    }
  ]);

  const [selectedStrategy, setSelectedStrategy] = useState<Strategy>(strategies[0]);

  const toggleStrategy = (strategyId: string) => {
    setStrategies(prev => 
      prev.map(strategy => 
        strategy.id === strategyId 
          ? { ...strategy, isActive: !strategy.isActive }
          : strategy
      )
    );
    
    const strategy = strategies.find(s => s.id === strategyId);
    toast({
      title: `Strategy ${strategy?.isActive ? 'Deactivated' : 'Activated'}`,
      description: `${strategy?.name} has been ${strategy?.isActive ? 'stopped' : 'started'}.`,
    });
  };

  const updateParameter = (key: string, value: any) => {
    setSelectedStrategy(prev => ({
      ...prev,
      parameters: {
        ...prev.parameters,
        [key]: value
      }
    }));
  };

  const saveParameters = () => {
    setStrategies(prev =>
      prev.map(strategy =>
        strategy.id === selectedStrategy.id ? selectedStrategy : strategy
      )
    );
    
    toast({
      title: "Parameters Saved",
      description: `${selectedStrategy.name} parameters have been updated.`,
    });
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low": return "text-success";
      case "Medium": return "text-warning";
      case "High": return "text-danger";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Strategy Management</h2>
          <p className="text-muted-foreground">Configure and monitor your trading strategies</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="text-sm">
            {strategies.filter(s => s.isActive).length} Active
          </Badge>
          <Badge variant="outline" className="text-sm border-primary text-primary">
            {strategies.filter(s => s.type === 'ai').length} IA Strategies
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Strategy List */}
        <div className="lg:col-span-1 space-y-3">
          <Card className="trading-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Estratégias</CardTitle>
              <CardDescription className="text-sm">
                Selecione uma estratégia
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {strategies.map((strategy) => {
                const Icon = strategy.icon;
                const isSelected = selectedStrategy.id === strategy.id;
                return (
                  <div
                    key={strategy.id}
                    onClick={() => setSelectedStrategy(strategy)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50 hover:bg-primary/2'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Icon className="h-4 w-4 text-primary" />
                        <div>
                          <p className="text-sm font-medium">{strategy.name}</p>
                          <div className="flex items-center space-x-2">
                            {strategy.type === 'ai' && (
                              <Badge variant="outline" className="text-xs border-primary text-primary">
                                IA
                              </Badge>
                            )}
                            {strategy.certainty && (
                              <Badge variant="outline" className="text-xs text-success border-success">
                                {strategy.certainty.toFixed(1)}%
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <Switch
                        checked={strategy.isActive}
                        onCheckedChange={() => toggleStrategy(strategy.id)}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Selected Strategy Details */}
          <Card className="trading-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <selectedStrategy.icon className="h-8 w-8 text-primary" />
                  <div>
                    <CardTitle className="text-xl">{selectedStrategy.name}</CardTitle>
                    <CardDescription>{selectedStrategy.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {selectedStrategy.type === 'ai' && (
                    <Badge className="bg-primary text-primary-foreground">
                      <Brain className="h-3 w-3 mr-1" />
                      IA Strategy
                    </Badge>
                  )}
                  <Switch
                    checked={selectedStrategy.isActive}
                    onCheckedChange={() => toggleStrategy(selectedStrategy.id)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg bg-card border">
                  <p className="text-sm text-muted-foreground mb-1">Performance</p>
                  <p className={`text-2xl font-bold ${selectedStrategy.performance >= 0 ? 'profit' : 'loss'}`}>
                    {selectedStrategy.performance >= 0 ? '+' : ''}{selectedStrategy.performance}%
                  </p>
                </div>
                
                {selectedStrategy.certainty && (
                  <div className="text-center p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <p className="text-sm text-muted-foreground mb-1">Certeza IA</p>
                    <p className="text-2xl font-bold text-success">
                      {selectedStrategy.certainty.toFixed(1)}%
                    </p>
                  </div>
                )}
                
                <div className="text-center p-4 rounded-lg bg-card border">
                  <p className="text-sm text-muted-foreground mb-1">Risk Level</p>
                  <Badge variant="outline" className={`text-lg px-3 py-1 ${getRiskColor(selectedStrategy.risk)}`}>
                    {selectedStrategy.risk}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Strategy Parameters */}
          <Tabs defaultValue="parameters" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="parameters">Parâmetros</TabsTrigger>
              <TabsTrigger value="analysis">
                {selectedStrategy.type === 'ai' ? 'Análise IA' : 'Análise Técnica'}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="parameters" className="space-y-6">
              <Card className="trading-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="h-5 w-5 text-primary" />
                    <span>Configurações da Estratégia</span>
                  </CardTitle>
                  <CardDescription>
                    Ajuste os parâmetros para otimizar a performance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {Object.entries(selectedStrategy.parameters).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <Label className="text-sm font-medium capitalize">
                        {key.replace(/_/g, ' ')}
                      </Label>
                      {typeof value === 'boolean' ? (
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={value}
                            onCheckedChange={(checked) => updateParameter(key, checked)}
                          />
                          <span className="text-sm text-muted-foreground">
                            {value ? 'Ativado' : 'Desativado'}
                          </span>
                        </div>
                      ) : typeof value === 'number' && value <= 1 ? (
                        <div className="space-y-2">
                          <Slider
                            value={[value]}
                            onValueChange={(vals) => updateParameter(key, vals[0])}
                            max={1}
                            min={0}
                            step={0.01}
                            className="w-full"
                          />
                          <div className="text-xs text-muted-foreground text-center">
                            {value}
                          </div>
                        </div>
                      ) : (
                        <Input
                          type="number"
                          value={value}
                          onChange={(e) => updateParameter(key, parseFloat(e.target.value) || 0)}
                          className="w-full"
                        />
                      )}
                    </div>
                  ))}
                  
                  <div className="flex space-x-3 pt-4">
                    <Button onClick={saveParameters} className="flex-1 btn-trading">
                      Salvar Parâmetros
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Restaurar Padrão
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-6">
              <Card className="trading-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    {selectedStrategy.type === 'ai' ? (
                      <Brain className="h-5 w-5 text-primary" />
                    ) : (
                      <BarChart3 className="h-5 w-5 text-primary" />
                    )}
                    <span>
                      {selectedStrategy.type === 'ai' ? 'Análise de IA' : 'Análise Técnica'}
                    </span>
                  </CardTitle>
                  <CardDescription>
                    {selectedStrategy.type === 'ai' 
                      ? 'Insights e probabilidades geradas pela inteligência artificial'
                      : 'Métricas e indicadores técnicos da estratégia'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedStrategy.type === 'ai' ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-success/5 border border-success/20">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-3 h-3 rounded-full bg-success"></div>
                            <span className="font-medium">Precisão do Modelo</span>
                          </div>
                          <p className="text-2xl font-bold text-success">{selectedStrategy.certainty?.toFixed(1)}%</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Baseado em {Math.floor(Math.random() * 1000) + 500} análises históricas
                          </p>
                        </div>
                        
                        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                          <div className="flex items-center space-x-2 mb-2">
                            <Brain className="w-3 h-3 text-primary" />
                            <span className="font-medium">Status de Aprendizado</span>
                          </div>
                          <p className="text-lg font-bold text-primary">Ativo</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Adaptando pesos dos indicadores
                          </p>
                        </div>
                      </div>
                      
                      <div className="p-4 rounded-lg bg-card border">
                        <h4 className="font-medium mb-3">Fatores de Análise:</h4>
                        <div className="space-y-2 text-sm">
                          {selectedStrategy.id === 'ai_multi_indicator' && (
                            <>
                              <div className="flex justify-between">
                                <span>• Indicadores Técnicos:</span>
                                <span className="text-success">10 ativos</span>
                              </div>
                              <div className="flex justify-between">
                                <span>• Análise de Notícias:</span>
                                <span className="text-success">Integrada</span>
                              </div>
                              <div className="flex justify-between">
                                <span>• Adaptação de Pesos:</span>
                                <span className="text-success">Automática</span>
                              </div>
                            </>
                          )}
                          {selectedStrategy.id === 'ai_sentiment_news' && (
                            <>
                              <div className="flex justify-between">
                                <span>• Fontes de Notícias:</span>
                                <span className="text-success">5 principais</span>
                              </div>
                              <div className="flex justify-between">
                                <span>• Análise de Sentimento:</span>
                                <span className="text-success">Tempo real</span>
                              </div>
                              <div className="flex justify-between">
                                <span>• Impacto no Mercado:</span>
                                <span className="text-warning">Médio-Alto</span>
                              </div>
                            </>
                          )}
                          {selectedStrategy.id === 'ai_pattern_recognition' && (
                            <>
                              <div className="flex justify-between">
                                <span>• Padrões Reconhecidos:</span>
                                <span className="text-success">12 tipos</span>
                              </div>
                              <div className="flex justify-between">
                                <span>• Precisão Média:</span>
                                <span className="text-success">91.2%</span>
                              </div>
                              <div className="flex justify-between">
                                <span>• Velocidade de Adaptação:</span>
                                <span className="text-success">Alta</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 rounded-lg bg-card border text-center">
                          <p className="text-sm text-muted-foreground mb-1">Sharpe Ratio</p>
                          <p className="text-xl font-bold">1.85</p>
                        </div>
                        <div className="p-4 rounded-lg bg-card border text-center">
                          <p className="text-sm text-muted-foreground mb-1">Max Drawdown</p>
                          <p className="text-xl font-bold text-danger">-8.2%</p>
                        </div>
                        <div className="p-4 rounded-lg bg-card border text-center">
                          <p className="text-sm text-muted-foreground mb-1">Win Rate</p>
                          <p className="text-xl font-bold text-success">68%</p>
                        </div>
                      </div>
                      
                      <div className="p-4 rounded-lg bg-card border">
                        <h4 className="font-medium mb-3">Configuração Atual:</h4>
                        <div className="space-y-2 text-sm">
                          {Object.entries(selectedStrategy.parameters).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span>• {key.replace(/_/g, ' ')}:</span>
                              <span className="font-medium">{value.toString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};