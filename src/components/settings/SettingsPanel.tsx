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
import { Key, Database, Bell, Shield, Globe, Cog } from "lucide-react";
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

  const [tradingSettings, setTradingSettings] = useState({
    max_position_size: 0.1,
    stop_loss_percentage: 2.0,
    take_profit_percentage: 5.0,
    max_daily_trades: 50,
    risk_per_trade: 1.0
  });

  const [notifications, setNotifications] = useState({
    email_alerts: true,
    trade_confirmations: true,
    error_notifications: true,
    performance_reports: false,
    daily_summary: true
  });

  const saveApiSettings = () => {
    toast({
      title: "API Settings Saved",
      description: "Your API configuration has been updated successfully.",
    });
  };

  const saveTradingSettings = () => {
    toast({
      title: "Trading Settings Saved",
      description: "Your trading parameters have been updated.",
    });
  };

  const saveNotificationSettings = () => {
    toast({
      title: "Notification Settings Saved",
      description: "Your notification preferences have been updated.",
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
          <h2 className="text-2xl font-bold">Settings</h2>
          <p className="text-muted-foreground">Configure your trading environment and preferences</p>
        </div>
        <Badge variant={isConnected ? "default" : "destructive"} className="text-sm">
          {isConnected ? "Connected" : "Disconnected"}
        </Badge>
      </div>

      <Tabs defaultValue="api" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="deriv" className="flex items-center space-x-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Deriv</span>
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center space-x-2">
            <Key className="h-4 w-4" />
            <span className="hidden sm:inline">API</span>
          </TabsTrigger>
          <TabsTrigger value="trading" className="flex items-center space-x-2">
            <Cog className="h-4 w-4" />
            <span className="hidden sm:inline">Trading</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Alerts</span>
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Advanced</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="deriv" className="space-y-6">
          <DerivConnection />
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card className="trading-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Key className="h-5 w-5 text-primary" />
                <span>API Configuration</span>
              </CardTitle>
              <CardDescription>
                Configure your exchange API credentials and connection settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="api-key">Bybit API Key</Label>
                    <Input
                      id="api-key"
                      type="password"
                      value={apiSettings.bybit_api_key}
                      onChange={(e) => setApiSettings(prev => ({ ...prev, bybit_api_key: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="api-secret">Bybit Secret</Label>
                    <Input
                      id="api-secret"
                      type="password"
                      value={apiSettings.bybit_secret}
                      onChange={(e) => setApiSettings(prev => ({ ...prev, bybit_secret: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="testnet">Testnet Mode</Label>
                    <Switch
                      id="testnet"
                      checked={apiSettings.testnet_mode}
                      onCheckedChange={(checked) => 
                        setApiSettings(prev => ({ ...prev, testnet_mode: checked }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="max-retries">Max Retries</Label>
                    <Input
                      id="max-retries"
                      type="number"
                      value={apiSettings.max_retries}
                      onChange={(e) => setApiSettings(prev => ({ ...prev, max_retries: parseInt(e.target.value) }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="timeout">Timeout (seconds)</Label>
                    <Input
                      id="timeout"
                      type="number"
                      value={apiSettings.timeout}
                      onChange={(e) => setApiSettings(prev => ({ ...prev, timeout: parseInt(e.target.value) }))}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex space-x-3">
                <Button onClick={saveApiSettings} className="btn-trading">
                  Save API Settings
                </Button>
                <Button variant="outline" onClick={testConnection}>
                  Test Connection
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trading" className="space-y-6">
          <Card className="trading-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Cog className="h-5 w-5 text-primary" />
                <span>Trading Parameters</span>
              </CardTitle>
              <CardDescription>
                Configure risk management and trading execution settings
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
                </div>
              </div>

              <Separator />

              <Button onClick={saveTradingSettings} className="btn-trading">
                Save Trading Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="trading-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-primary" />
                <span>Notification Settings</span>
              </CardTitle>
              <CardDescription>
                Configure alerts and notification preferences
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
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card className="trading-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-primary" />
                <span>Advanced Settings</span>
              </CardTitle>
              <CardDescription>
                Advanced configuration and system settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="log-level">Log Level</Label>
                  <Select defaultValue="info">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="debug">Debug</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="data-source">Data Source</Label>
                  <Select defaultValue="ccxt">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ccxt">CCXT (Live)</SelectItem>
                      <SelectItem value="csv">CSV Files</SelectItem>
                      <SelectItem value="polygon">Polygon.io</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label>Enable Paper Trading</Label>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Circuit Breaker</Label>
                  <Switch defaultChecked />
                </div>
              </div>

              <Separator />

              <div className="flex space-x-3">
                <Button variant="outline" className="btn-danger">
                  Reset All Settings
                </Button>
                <Button variant="outline">
                  Export Configuration
                </Button>
                <Button variant="outline">
                  Import Configuration
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};