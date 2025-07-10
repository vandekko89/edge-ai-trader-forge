import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, Shield, Bell, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const TradingPanel = () => {
  const { toast } = useToast();
  
  const [tradingSettings, setTradingSettings] = useState({
    max_position_size: 0.1,
    stop_loss_percentage: 2.0,
    take_profit_percentage: 5.0,
    max_daily_trades: 50,
    risk_per_trade: 1.0
  });

  const [riskManagement, setRiskManagement] = useState({
    max_drawdown: 10.0,
    daily_loss_limit: 5.0,
    portfolio_heat: 2.0,
    correlation_limit: 0.7
  });

  const [notifications, setNotifications] = useState({
    trade_confirmations: true,
    profit_alerts: true,
    loss_alerts: true,
    position_updates: false
  });

  const saveTradingSettings = () => {
    toast({
      title: "Trading Settings Saved",
      description: "Your trading parameters have been updated.",
    });
  };

  const saveRiskSettings = () => {
    toast({
      title: "Risk Settings Saved",
      description: "Your risk management settings have been updated.",
    });
  };

  const saveNotificationSettings = () => {
    toast({
      title: "Trading Alerts Saved",
      description: "Your trading notification preferences have been updated.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Trading Configuration</h2>
          <p className="text-muted-foreground">Configure trading parameters and risk management</p>
        </div>
      </div>

      <Tabs defaultValue="parameters" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="parameters" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Parameters</span>
          </TabsTrigger>
          <TabsTrigger value="risk" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Risk Management</span>
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Alerts</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="parameters" className="space-y-6">
          <Card className="trading-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span>Trading Parameters</span>
              </CardTitle>
              <CardDescription>
                Configure position sizing and execution settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="max-position">Max Position Size (%)</Label>
                    <Input
                      id="max-position"
                      type="number"
                      step="0.01"
                      value={tradingSettings.max_position_size}
                      onChange={(e) => setTradingSettings(prev => ({ 
                        ...prev, 
                        max_position_size: parseFloat(e.target.value) 
                      }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="stop-loss">Default Stop Loss (%)</Label>
                    <Input
                      id="stop-loss"
                      type="number"
                      step="0.1"
                      value={tradingSettings.stop_loss_percentage}
                      onChange={(e) => setTradingSettings(prev => ({ 
                        ...prev, 
                        stop_loss_percentage: parseFloat(e.target.value) 
                      }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="take-profit">Default Take Profit (%)</Label>
                    <Input
                      id="take-profit"
                      type="number"
                      step="0.1"
                      value={tradingSettings.take_profit_percentage}
                      onChange={(e) => setTradingSettings(prev => ({ 
                        ...prev, 
                        take_profit_percentage: parseFloat(e.target.value) 
                      }))}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="max-trades">Max Daily Trades</Label>
                    <Input
                      id="max-trades"
                      type="number"
                      value={tradingSettings.max_daily_trades}
                      onChange={(e) => setTradingSettings(prev => ({ 
                        ...prev, 
                        max_daily_trades: parseInt(e.target.value) 
                      }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="risk-per-trade">Risk Per Trade (%)</Label>
                    <Input
                      id="risk-per-trade"
                      type="number"
                      step="0.1"
                      value={tradingSettings.risk_per_trade}
                      onChange={(e) => setTradingSettings(prev => ({ 
                        ...prev, 
                        risk_per_trade: parseFloat(e.target.value) 
                      }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="trading-mode">Trading Mode</Label>
                    <Select defaultValue="conservative">
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="conservative">Conservative</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="aggressive">Aggressive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              <Button onClick={saveTradingSettings} className="btn-trading">
                Save Trading Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-6">
          <Card className="trading-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-primary" />
                <span>Risk Management</span>
              </CardTitle>
              <CardDescription>
                Configure risk limits and portfolio protection
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="max-drawdown">Max Drawdown (%)</Label>
                    <Input
                      id="max-drawdown"
                      type="number"
                      step="0.1"
                      value={riskManagement.max_drawdown}
                      onChange={(e) => setRiskManagement(prev => ({ 
                        ...prev, 
                        max_drawdown: parseFloat(e.target.value) 
                      }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="daily-loss">Daily Loss Limit (%)</Label>
                    <Input
                      id="daily-loss"
                      type="number"
                      step="0.1"
                      value={riskManagement.daily_loss_limit}
                      onChange={(e) => setRiskManagement(prev => ({ 
                        ...prev, 
                        daily_loss_limit: parseFloat(e.target.value) 
                      }))}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="portfolio-heat">Portfolio Heat (%)</Label>
                    <Input
                      id="portfolio-heat"
                      type="number"
                      step="0.1"
                      value={riskManagement.portfolio_heat}
                      onChange={(e) => setRiskManagement(prev => ({ 
                        ...prev, 
                        portfolio_heat: parseFloat(e.target.value) 
                      }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="correlation-limit">Correlation Limit</Label>
                    <Input
                      id="correlation-limit"
                      type="number"
                      step="0.01"
                      max="1"
                      min="0"
                      value={riskManagement.correlation_limit}
                      onChange={(e) => setRiskManagement(prev => ({ 
                        ...prev, 
                        correlation_limit: parseFloat(e.target.value) 
                      }))}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Enable Circuit Breaker</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Auto-Close on Max Drawdown</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Position Size Scaling</Label>
                  <Switch />
                </div>
              </div>

              <Separator />

              <Button onClick={saveRiskSettings} className="btn-trading">
                Save Risk Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card className="trading-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-primary" />
                <span>Trading Alerts</span>
              </CardTitle>
              <CardDescription>
                Configure trading-specific notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <Label className="capitalize">
                      {key.replace(/_/g, ' ')}
                    </Label>
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) => 
                        setNotifications(prev => ({ ...prev, [key]: checked }))
                      }
                    />
                  </div>
                ))}
              </div>

              <Separator />

              <Button onClick={saveNotificationSettings} className="btn-trading">
                Save Alert Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};