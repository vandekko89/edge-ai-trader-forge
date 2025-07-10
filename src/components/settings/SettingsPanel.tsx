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
import { Key, Globe } from "lucide-react";
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

  const saveApiSettings = () => {
    toast({
      title: "API Settings Saved",
      description: "Your API configuration has been updated successfully.",
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

      <Tabs defaultValue="deriv" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="deriv" className="flex items-center space-x-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Deriv</span>
          </TabsTrigger>
          <TabsTrigger value="brokers" className="flex items-center space-x-2">
            <Key className="h-4 w-4" />
            <span className="hidden sm:inline">Brokers</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="deriv" className="space-y-6">
          <DerivConnection />
        </TabsContent>

        <TabsContent value="brokers" className="space-y-6">
          <Card className="trading-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Key className="h-5 w-5 text-primary" />
                <span>Broker Selection</span>
              </CardTitle>
              <CardDescription>
                Choose your broker and configure API credentials
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="broker-select">Select Broker</Label>
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
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {brokerSettings.selected_broker === "bybit" && (
                <div className="space-y-4">
                  <h4 className="font-medium">Bybit Credentials</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="bybit-key">API Key</Label>
                      <Input
                        id="bybit-key"
                        type="password"
                        value={brokerSettings.bybit_api_key}
                        onChange={(e) => setBrokerSettings(prev => ({ ...prev, bybit_api_key: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bybit-secret">Secret</Label>
                      <Input
                        id="bybit-secret"
                        type="password"
                        value={brokerSettings.bybit_secret}
                        onChange={(e) => setBrokerSettings(prev => ({ ...prev, bybit_secret: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="bybit-testnet">Testnet Mode</Label>
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
                  <h4 className="font-medium">Binance Credentials</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="binance-key">API Key</Label>
                      <Input
                        id="binance-key"
                        type="password"
                        value={brokerSettings.binance_api_key}
                        onChange={(e) => setBrokerSettings(prev => ({ ...prev, binance_api_key: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="binance-secret">Secret Key</Label>
                      <Input
                        id="binance-secret"
                        type="password"
                        value={brokerSettings.binance_secret}
                        onChange={(e) => setBrokerSettings(prev => ({ ...prev, binance_secret: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              )}

              {brokerSettings.selected_broker === "deriv" && (
                <div className="space-y-4">
                  <h4 className="font-medium">Deriv Credentials</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="deriv-app">App ID</Label>
                      <Input
                        id="deriv-app"
                        type="password"
                        value={brokerSettings.deriv_app_id}
                        onChange={(e) => setBrokerSettings(prev => ({ ...prev, deriv_app_id: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="deriv-token">API Token</Label>
                      <Input
                        id="deriv-token"
                        type="password"
                        value={brokerSettings.deriv_token}
                        onChange={(e) => setBrokerSettings(prev => ({ ...prev, deriv_token: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              )}

              <Separator />

              <div className="flex space-x-3">
                <Button onClick={saveBrokerSettings} className="btn-trading">
                  Save Broker Settings
                </Button>
                <Button variant="outline" onClick={testConnection}>
                  Test Connection
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};