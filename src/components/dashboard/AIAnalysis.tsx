import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, TrendingUp, TrendingDown, Minus, Target, Newspaper, BarChart3, Clock, Zap, Lightbulb } from "lucide-react";

interface Indicator {
  name: string;
  value: number;
  weight: number;
  signal: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  timeframe: string;
}

interface NewsAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral';
  impact: number;
  summary: string;
  source: string;
}

interface AISignal {
  action: 'BUY' | 'SELL' | 'WAIT';
  confidence: number;
  timeframe: string;
  reasoning: string;
  indicators: Indicator[];
  newsAnalysis: NewsAnalysis[];
}

export const AIAnalysis = () => {
  const [currentSignal, setCurrentSignal] = useState<AISignal | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [learningStats, setLearningStats] = useState({
    totalAnalyzes: 1247,
    accuracy: 78.5,
    bestIndicator: 'RSI + Bollinger',
    worstIndicator: 'MACD'
  });

  // Mock indicators with different weights and signals
  const mockIndicators: Indicator[] = [
    { name: 'RSI', value: 65, weight: 0.15, signal: 'BUY', confidence: 82, timeframe: '1H' },
    { name: 'MACD', value: 0.002, weight: 0.12, signal: 'BUY', confidence: 76, timeframe: '4H' },
    { name: 'Bollinger Bands', value: 0.8, weight: 0.18, signal: 'SELL', confidence: 88, timeframe: '1H' },
    { name: 'Stochastic', value: 78, weight: 0.10, signal: 'BUY', confidence: 71, timeframe: '1H' },
    { name: 'Volume Profile', value: 125, weight: 0.14, signal: 'HOLD', confidence: 65, timeframe: '4H' },
    { name: 'Support/Resistance', value: 0.92, weight: 0.16, signal: 'BUY', confidence: 90, timeframe: '1D' },
    { name: 'Fibonacci', value: 0.618, weight: 0.08, signal: 'HOLD', confidence: 60, timeframe: '4H' },
    { name: 'Moving Averages', value: 1.02, weight: 0.13, signal: 'BUY', confidence: 85, timeframe: '1H' },
    { name: 'Ichimoku', value: 0.75, weight: 0.11, signal: 'BUY', confidence: 79, timeframe: '4H' },
    { name: 'Price Action', value: 0.85, weight: 0.17, signal: 'BUY', confidence: 92, timeframe: '1H' }
  ];

  const mockNews: NewsAnalysis[] = [
    {
      sentiment: 'positive',
      impact: 7.5,
      summary: 'Federal Reserve mantém taxas de juros estáveis, mercado reage positivamente',
      source: 'Reuters'
    },
    {
      sentiment: 'negative',
      impact: 3.2,
      summary: 'Tensões geopolíticas aumentam incerteza nos mercados',
      source: 'Bloomberg'
    },
    {
      sentiment: 'positive',
      impact: 5.8,
      summary: 'Dados de emprego americano superam expectativas',
      source: 'Wall Street Journal'
    }
  ];

  const generateSignal = () => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      // Calculate overall signal based on indicators and weights
      const buySignals = mockIndicators.filter(i => i.signal === 'BUY');
      const sellSignals = mockIndicators.filter(i => i.signal === 'SELL');
      
      const buyWeight = buySignals.reduce((sum, i) => sum + i.weight * (i.confidence / 100), 0);
      const sellWeight = sellSignals.reduce((sum, i) => sum + i.weight * (i.confidence / 100), 0);
      
      // News sentiment impact
      const newsImpact = mockNews.reduce((sum, news) => {
        const multiplier = news.sentiment === 'positive' ? 1 : news.sentiment === 'negative' ? -1 : 0;
        return sum + (news.impact * multiplier);
      }, 0);
      
      const totalBuyScore = buyWeight + (newsImpact > 0 ? newsImpact * 0.1 : 0);
      const totalSellScore = sellWeight + (newsImpact < 0 ? Math.abs(newsImpact) * 0.1 : 0);
      
      let action: 'BUY' | 'SELL' | 'WAIT';
      let confidence: number;
      let reasoning: string;
      
      if (totalBuyScore > totalSellScore * 1.2) {
        action = 'BUY';
        confidence = Math.min(95, totalBuyScore * 100);
        reasoning = 'Múltiplos indicadores técnicos apontam para tendência de alta, com confirmação de análise de notícias positivas.';
      } else if (totalSellScore > totalBuyScore * 1.2) {
        action = 'SELL';
        confidence = Math.min(95, totalSellScore * 100);
        reasoning = 'Sinais de venda predominantes nos indicadores técnicos, com possível reversão de tendência.';
      } else {
        action = 'WAIT';
        confidence = 65;
        reasoning = 'Mercado em consolidação. Indicadores mistos sugerem aguardar definição de tendência.';
      }

      setCurrentSignal({
        action,
        confidence,
        timeframe: '1H - 4H',
        reasoning,
        indicators: mockIndicators,
        newsAnalysis: mockNews
      });
      
      setIsAnalyzing(false);
    }, 3000);
  };

  useEffect(() => {
    // Auto-generate signal on component mount
    generateSignal();
  }, []);

  const getSignalColor = (action: string) => {
    switch (action) {
      case 'BUY': return 'text-success';
      case 'SELL': return 'text-danger';
      default: return 'text-warning';
    }
  };

  const getSignalIcon = (action: string) => {
    switch (action) {
      case 'BUY': return <TrendingUp className="h-5 w-5" />;
      case 'SELL': return <TrendingDown className="h-5 w-5" />;
      default: return <Minus className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Main AI Signal */}
      <Card className="trading-card border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-primary" />
              <span>AI Signal Engine</span>
            </div>
            <Button 
              onClick={generateSignal} 
              disabled={isAnalyzing}
              variant="outline"
              size="sm"
            >
              {isAnalyzing ? (
                <>
                  <Zap className="h-4 w-4 mr-2 animate-pulse" />
                  Analisando...
                </>
              ) : (
                <>
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Nova Análise
                </>
              )}
            </Button>
          </CardTitle>
          <CardDescription>
            Análise baseada em 10 indicadores técnicos + notícias do mercado
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isAnalyzing ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="text-sm text-muted-foreground">Processando indicadores e notícias...</p>
            </div>
          ) : currentSignal ? (
            <div className="space-y-6">
              {/* Signal Display */}
              <div className="text-center p-6 rounded-lg bg-gradient-to-br from-primary/5 to-primary-glow/5 border border-primary/20">
                <div className={`flex items-center justify-center space-x-2 mb-4 ${getSignalColor(currentSignal.action)}`}>
                  {getSignalIcon(currentSignal.action)}
                  <span className="text-3xl font-bold">{currentSignal.action}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-4">
                    <Badge variant="outline" className="text-sm">
                      Confiança: {currentSignal.confidence.toFixed(1)}%
                    </Badge>
                    <Badge variant="outline" className="text-sm">
                      Timeframe: {currentSignal.timeframe}
                    </Badge>
                  </div>
                  <Progress value={currentSignal.confidence} className="w-full max-w-xs mx-auto" />
                </div>
              </div>

              {/* Reasoning */}
              <div className="p-4 rounded-lg bg-card border">
                <h4 className="font-semibold mb-2 flex items-center space-x-2">
                  <Target className="h-4 w-4" />
                  <span>Análise</span>
                </h4>
                <p className="text-sm text-muted-foreground">{currentSignal.reasoning}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Clique em "Nova Análise" para gerar um sinal</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detailed Analysis Tabs */}
      {currentSignal && (
        <Card className="trading-card">
          <CardHeader>
            <CardTitle>Análise Detalhada</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="indicators" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="indicators">Indicadores</TabsTrigger>
                <TabsTrigger value="news">Notícias</TabsTrigger>
                <TabsTrigger value="learning">Aprendizado</TabsTrigger>
              </TabsList>

              <TabsContent value="indicators" className="space-y-4">
                <div className="grid gap-3">
                  {currentSignal.indicators.map((indicator, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-card border">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          indicator.signal === 'BUY' ? 'bg-success' : 
                          indicator.signal === 'SELL' ? 'bg-danger' : 'bg-warning'
                        }`}></div>
                        <div>
                          <span className="font-medium">{indicator.name}</span>
                          <div className="text-xs text-muted-foreground">
                            Peso: {(indicator.weight * 100).toFixed(0)}% | {indicator.timeframe}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className={`text-xs ${getSignalColor(indicator.signal)}`}>
                          {indicator.signal}
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-1">
                          {indicator.confidence}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="news" className="space-y-4">
                <div className="space-y-3">
                  {currentSignal.newsAnalysis.map((news, index) => (
                    <div key={index} className="p-4 rounded-lg bg-card border">
                      <div className="flex items-start justify-between mb-2">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            news.sentiment === 'positive' ? 'text-success border-success' :
                            news.sentiment === 'negative' ? 'text-danger border-danger' :
                            'text-warning border-warning'
                          }`}
                        >
                          {news.sentiment.toUpperCase()}
                        </Badge>
                        <div className="text-xs text-muted-foreground">
                          Impacto: {news.impact}/10
                        </div>
                      </div>
                      <p className="text-sm mb-2">{news.summary}</p>
                      <div className="text-xs text-muted-foreground flex items-center space-x-1">
                        <Newspaper className="h-3 w-3" />
                        <span>{news.source}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="learning" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-card border">
                    <div className="flex items-center space-x-2 mb-2">
                      <BarChart3 className="h-4 w-4 text-primary" />
                      <span className="font-medium">Estatísticas de Aprendizado</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Total de Análises:</span>
                        <span className="font-medium">{learningStats.totalAnalyzes}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Precisão Média:</span>
                        <span className="font-medium text-success">{learningStats.accuracy}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-card border">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="h-4 w-4 text-primary" />
                      <span className="font-medium">Performance dos Indicadores</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Melhor:</span>
                        <span className="font-medium text-success">{learningStats.bestIndicator}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pior:</span>
                        <span className="font-medium text-danger">{learningStats.worstIndicator}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <Brain className="h-4 w-4 text-primary" />
                    <span className="font-medium">Adaptação da IA</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    A IA está continuamente aprendendo e ajustando os pesos dos indicadores baseado na performance histórica. 
                    Indicadores com maior precisão recebem pesos maiores automaticamente.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};