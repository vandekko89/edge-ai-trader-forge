import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Key, Globe, TrendingUp, Newspaper, Brain, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DerivConnection from "@/components/deriv/DerivConnection";

export const SettingsPanel = () => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(true);
  const [apiSettings, setApiSettings] = useState({
    bybit_api_key: "••••••••••••••••",
    bybit_secret: "••••••••••••••••",
    testnet_mode: true,
    max_retries: 3,
    timeout: 30
  });

  const [brokerSettings, setBrokerSettings] = useState({
    selected_broker: "bybit",
    bybit_api_key: "••••••••••••••••",
    bybit_secret: "••••••••••••••••", 
    binance_api_key: "••••••••••••••••",
    binance_secret: "••••••••••••••••",
    deriv_app_id: "••••••••••••••••",
    deriv_token: "••••••••••••••••"
  });

  const [indicatorSettings, setIndicatorSettings] = useState({
    rsi_momentum: true,
    macd_divergence: true,
    bollinger_bands: false,
    fibonacci_levels: true,
    volume_flow: true,
    support_resistance: true,
    trend_channels: false,
    pivot_points: true
  });

  const [newsSettings, setNewsSettings] = useState({
    economic_calendar: true,
    market_sentiment: true,
    crypto_news: false,
    forex_updates: true,
    earnings_reports: false
  });

  const [aiSettings, setAiSettings] = useState({
    neural_predictor: true,
    sentiment_analyzer: false,
    pattern_recognition: true,
    risk_optimizer: true,
    smart_alerts: true
  });

  const [superframeSettings, setSuperframeSettings] = useState({
    multi_timeframe: true,
    correlation_matrix: false,
    volatility_scanner: true,
    opportunity_detector: true
  });

  const saveApiSettings = () => {
    toast({
      title: "API Settings Saved",
      description: "Your API configuration has been updated successfully.",
    });
  };

  const saveIndicatorSettings = () => {
    toast({
      title: "Indicator Settings Saved",
      description: "Your indicator preferences have been updated.",
    });
  };

  const saveNewsSettings = () => {
    toast({
      title: "News Settings Saved", 
      description: "Your news feed preferences have been updated.",
    });
  };

  const saveAiSettings = () => {
    toast({
      title: "AI Settings Saved",
      description: "Your AI module preferences have been updated.", 
    });
  };

  const saveSuperframeSettings = () => {
    toast({
      title: "Superframe Settings Saved",
      description: "Your superframe analysis preferences have been updated.",
    });
  };

  const saveBrokerSettings = () => {
    toast({
      title: "Broker Settings Saved", 
      description: "Your broker configuration has been updated successfully.",
    });
  };

  const testConnection = () => {
    toast({
      title: "Testing Connection",
      description: "Verifying API connectivity...",
    });
    
    setTimeout(() => {
      toast({
        title: "Connection Successful",
        description: "API connection is working properly.",
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">API Settings</h2>
          <p className="text-muted-foreground">Configure broker connections and API credentials</p>
        </div>
        <Badge variant={isConnected ? "default" : "destructive"} className="text-sm">
          {isConnected ? "Connected" : "Disconnected"}
        </Badge>
      </div>

      <Tabs defaultValue="corretora" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="corretora" className="flex items-center space-x-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Corretora</span>
          </TabsTrigger>
          <TabsTrigger value="indicators" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Indicators</span>
          </TabsTrigger>
          <TabsTrigger value="news" className="flex items-center space-x-2">
            <Newspaper className="h-4 w-4" />
            <span className="hidden sm:inline">News</span>
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center space-x-2">
            <Brain className="h-4 w-4" />
            <span className="hidden sm:inline">AI & Analysis</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="corretora" className="space-y-6">
          <Card className="trading-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-primary" />
                <span>Seleção de Corretora</span>
              </CardTitle>
              <CardDescription>
                Escolha sua corretora e configure as credenciais de acesso
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="corretora-select">Selecionar Corretora</Label>
                <Select value={brokerSettings.selected_broker} onValueChange={(value) => 
                  setBrokerSettings(prev => ({ ...prev, selected_broker: value }))
                }>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bybit">Bybit</SelectItem>
                    <SelectItem value="binance">Binance</SelectItem>
                    <SelectItem value="deriv">Deriv</SelectItem>
                    <SelectItem value="iqoption">IQ Option</SelectItem>
                    <SelectItem value="metatrader">MetaTrader</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {brokerSettings.selected_broker === "bybit" && (
                <div className="space-y-4">
                  <h4 className="font-medium">Credenciais Bybit</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="bybit-key">Chave API</Label>
                      <Input
                        id="bybit-key"
                        type="password"
                        value={brokerSettings.bybit_api_key}
                        onChange={(e) => setBrokerSettings(prev => ({ ...prev, bybit_api_key: e.target.value }))}
                        className="mt-1"
                        placeholder="Digite sua chave API"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bybit-secret">Chave Secreta</Label>
                      <Input
                        id="bybit-secret"
                        type="password"
                        value={brokerSettings.bybit_secret}
                        onChange={(e) => setBrokerSettings(prev => ({ ...prev, bybit_secret: e.target.value }))}
                        className="mt-1"
                        placeholder="Digite sua chave secreta"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="bybit-testnet">Modo de Teste (Testnet)</Label>
                    <Switch
                      id="bybit-testnet"
                      checked={apiSettings.testnet_mode}
                      onCheckedChange={(checked) => 
                        setApiSettings(prev => ({ ...prev, testnet_mode: checked }))
                      }
                    />
                  </div>
                </div>
              )}

              {brokerSettings.selected_broker === "binance" && (
                <div className="space-y-4">
                  <h4 className="font-medium">Credenciais Binance</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="binance-key">Chave API</Label>
                      <Input
                        id="binance-key"
                        type="password"
                        value={brokerSettings.binance_api_key}
                        onChange={(e) => setBrokerSettings(prev => ({ ...prev, binance_api_key: e.target.value }))}
                        className="mt-1"
                        placeholder="Digite sua chave API"
                      />
                    </div>
                    <div>
                      <Label htmlFor="binance-secret">Chave Secreta</Label>
                      <Input
                        id="binance-secret"
                        type="password"
                        value={brokerSettings.binance_secret}
                        onChange={(e) => setBrokerSettings(prev => ({ ...prev, binance_secret: e.target.value }))}
                        className="mt-1"
                        placeholder="Digite sua chave secreta"
                      />
                    </div>
                  </div>
                </div>
              )}

              {brokerSettings.selected_broker === "deriv" && (
                <div className="space-y-4">
                  <h4 className="font-medium">Credenciais Deriv</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="deriv-app">ID do App</Label>
                      <Input
                        id="deriv-app"
                        type="password"
                        value={brokerSettings.deriv_app_id}
                        onChange={(e) => setBrokerSettings(prev => ({ ...prev, deriv_app_id: e.target.value }))}
                        className="mt-1"
                        placeholder="Digite seu App ID"
                      />
                    </div>
                    <div>
                      <Label htmlFor="deriv-token">Token API</Label>
                      <Input
                        id="deriv-token"
                        type="password"
                        value={brokerSettings.deriv_token}
                        onChange={(e) => setBrokerSettings(prev => ({ ...prev, deriv_token: e.target.value }))}
                        className="mt-1"
                        placeholder="Digite seu token API"
                      />
                    </div>
                  </div>
                </div>
              )}

              {brokerSettings.selected_broker === "iqoption" && (
                <div className="space-y-4">
                  <h4 className="font-medium">Credenciais IQ Option</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="iq-email">Email</Label>
                      <Input
                        id="iq-email"
                        type="email"
                        className="mt-1"
                        placeholder="Digite seu email"
                      />
                    </div>
                    <div>
                      <Label htmlFor="iq-password">Senha</Label>
                      <Input
                        id="iq-password"
                        type="password"
                        className="mt-1"
                        placeholder="Digite sua senha"
                      />
                    </div>
                  </div>
                </div>
              )}

              {brokerSettings.selected_broker === "metatrader" && (
                <div className="space-y-4">
                  <h4 className="font-medium">Credenciais MetaTrader</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="mt-login">Login</Label>
                      <Input
                        id="mt-login"
                        type="text"
                        className="mt-1"
                        placeholder="Digite seu login"
                      />
                    </div>
                    <div>
                      <Label htmlFor="mt-password">Senha</Label>
                      <Input
                        id="mt-password"
                        type="password"
                        className="mt-1"
                        placeholder="Digite sua senha"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="mt-server">Servidor</Label>
                    <Input
                      id="mt-server"
                      type="text"
                      className="mt-1"
                      placeholder="Ex: MetaQuotes-Demo"
                    />
                  </div>
                </div>
              )}

              <Separator />

              <div className="flex space-x-3">
                <Button onClick={saveBrokerSettings} className="btn-trading">
                  Salvar Configurações
                </Button>
                <Button variant="outline" onClick={testConnection}>
                  Testar Conexão
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="indicators" className="space-y-6">
          <Card className="trading-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span>Technical Indicators</span>
              </CardTitle>
              <CardDescription>
                Enable or disable technical analysis indicators
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Momentum Indicators</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>RSI Momentum Scanner</Label>
                      <Switch
                        checked={indicatorSettings.rsi_momentum}
                        onCheckedChange={(checked) => 
                          setIndicatorSettings(prev => ({ ...prev, rsi_momentum: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>MACD Divergence Detector</Label>
                      <Switch
                        checked={indicatorSettings.macd_divergence}
                        onCheckedChange={(checked) => 
                          setIndicatorSettings(prev => ({ ...prev, macd_divergence: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Volume Flow Analysis</Label>
                      <Switch
                        checked={indicatorSettings.volume_flow}
                        onCheckedChange={(checked) => 
                          setIndicatorSettings(prev => ({ ...prev, volume_flow: checked }))
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Price Action Tools</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Bollinger Band Squeeze</Label>
                      <Switch
                        checked={indicatorSettings.bollinger_bands}
                        onCheckedChange={(checked) => 
                          setIndicatorSettings(prev => ({ ...prev, bollinger_bands: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Fibonacci Auto-Levels</Label>
                      <Switch
                        checked={indicatorSettings.fibonacci_levels}
                        onCheckedChange={(checked) => 
                          setIndicatorSettings(prev => ({ ...prev, fibonacci_levels: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Support & Resistance Zones</Label>
                      <Switch
                        checked={indicatorSettings.support_resistance}
                        onCheckedChange={(checked) => 
                          setIndicatorSettings(prev => ({ ...prev, support_resistance: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Trend Channel Detection</Label>
                      <Switch
                        checked={indicatorSettings.trend_channels}
                        onCheckedChange={(checked) => 
                          setIndicatorSettings(prev => ({ ...prev, trend_channels: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Daily Pivot Points</Label>
                      <Switch
                        checked={indicatorSettings.pivot_points}
                        onCheckedChange={(checked) => 
                          setIndicatorSettings(prev => ({ ...prev, pivot_points: checked }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <Button onClick={saveIndicatorSettings} className="btn-trading">
                Save Indicator Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="news" className="space-y-6">
          <Card className="trading-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Newspaper className="h-5 w-5 text-primary" />
                <span>News & Market Data</span>
              </CardTitle>
              <CardDescription>
                Configure news feeds and market information sources
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium text-foreground">News Sources</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Economic Calendar Events</Label>
                    <Switch
                      checked={newsSettings.economic_calendar}
                      onCheckedChange={(checked) => 
                        setNewsSettings(prev => ({ ...prev, economic_calendar: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Market Sentiment Feed</Label>
                    <Switch
                      checked={newsSettings.market_sentiment}
                      onCheckedChange={(checked) => 
                        setNewsSettings(prev => ({ ...prev, market_sentiment: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Crypto News Updates</Label>
                    <Switch
                      checked={newsSettings.crypto_news}
                      onCheckedChange={(checked) => 
                        setNewsSettings(prev => ({ ...prev, crypto_news: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Forex Market Updates</Label>
                    <Switch
                      checked={newsSettings.forex_updates}
                      onCheckedChange={(checked) => 
                        setNewsSettings(prev => ({ ...prev, forex_updates: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Earnings Reports Alert</Label>
                    <Switch
                      checked={newsSettings.earnings_reports}
                      onCheckedChange={(checked) => 
                        setNewsSettings(prev => ({ ...prev, earnings_reports: checked }))
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <Button onClick={saveNewsSettings} className="btn-trading">
                Save News Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="space-y-6">
          <Card className="trading-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-primary" />
                <span>AI & Advanced Analysis</span>
              </CardTitle>
              <CardDescription>
                Configure AI modules and superframe analysis tools
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">AI Modules</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Neural Price Predictor</Label>
                      <Switch
                        checked={aiSettings.neural_predictor}
                        onCheckedChange={(checked) => 
                          setAiSettings(prev => ({ ...prev, neural_predictor: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Sentiment Analyzer AI</Label>
                      <Switch
                        checked={aiSettings.sentiment_analyzer}
                        onCheckedChange={(checked) => 
                          setAiSettings(prev => ({ ...prev, sentiment_analyzer: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Pattern Recognition AI</Label>
                      <Switch
                        checked={aiSettings.pattern_recognition}
                        onCheckedChange={(checked) => 
                          setAiSettings(prev => ({ ...prev, pattern_recognition: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Risk Optimizer Engine</Label>
                      <Switch
                        checked={aiSettings.risk_optimizer}
                        onCheckedChange={(checked) => 
                          setAiSettings(prev => ({ ...prev, risk_optimizer: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Smart Alert System</Label>
                      <Switch
                        checked={aiSettings.smart_alerts}
                        onCheckedChange={(checked) => 
                          setAiSettings(prev => ({ ...prev, smart_alerts: checked }))
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Superframe Analysis</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Multi-Timeframe Sync</Label>
                      <Switch
                        checked={superframeSettings.multi_timeframe}
                        onCheckedChange={(checked) => 
                          setSuperframeSettings(prev => ({ ...prev, multi_timeframe: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Correlation Matrix View</Label>
                      <Switch
                        checked={superframeSettings.correlation_matrix}
                        onCheckedChange={(checked) => 
                          setSuperframeSettings(prev => ({ ...prev, correlation_matrix: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Volatility Scanner Pro</Label>
                      <Switch
                        checked={superframeSettings.volatility_scanner}
                        onCheckedChange={(checked) => 
                          setSuperframeSettings(prev => ({ ...prev, volatility_scanner: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Opportunity Detector</Label>
                      <Switch
                        checked={superframeSettings.opportunity_detector}
                        onCheckedChange={(checked) => 
                          setSuperframeSettings(prev => ({ ...prev, opportunity_detector: checked }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex space-x-3">
                <Button onClick={saveAiSettings} className="btn-trading">
                  Save AI Settings
                </Button>
                <Button onClick={saveSuperframeSettings} variant="outline">
                  Save Superframe Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};