import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wifi, WifiOff, Key, Activity, DollarSign, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import derivApi from '@/services/derivApi';

const DerivConnection = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [appId, setAppId] = useState('1089');
  const [apiToken, setApiToken] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [accountInfo, setAccountInfo] = useState<any>(null);
  const [balance, setBalance] = useState<any>(null);
  const [autoConnect, setAutoConnect] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved settings
    const savedAppId = localStorage.getItem('deriv_app_id');
    const savedToken = localStorage.getItem('deriv_api_token');
    const savedAutoConnect = localStorage.getItem('deriv_auto_connect') === 'true';

    if (savedAppId) setAppId(savedAppId);
    if (savedToken) setApiToken(savedToken);
    setAutoConnect(savedAutoConnect);

    // Auto-connect if enabled
    if (savedAutoConnect && savedAppId) {
      handleConnect();
    }

    // Listen for API logs
    const handleApiLog = (event: CustomEvent) => {
      const log = event.detail;
      if (log.type === 'error' && log.category === 'system') {
        setIsConnected(false);
        setIsAuthorized(false);
      }
    };

    window.addEventListener('derivApiLog', handleApiLog as EventListener);
    return () => window.removeEventListener('derivApiLog', handleApiLog as EventListener);
  }, []);

  const handleConnect = async () => {
    if (!appId) {
      toast({
        title: "App ID Required",
        description: "Please enter a valid Deriv App ID",
        variant: "destructive"
      });
      return;
    }

    setIsConnecting(true);
    try {
      await derivApi.connect(parseInt(appId));
      setIsConnected(true);
      
      // Save settings
      localStorage.setItem('deriv_app_id', appId);
      localStorage.setItem('deriv_auto_connect', autoConnect.toString());

      toast({
        title: "Connected Successfully",
        description: "Connected to Deriv API",
      });

      // Auto-authorize if token is provided
      if (apiToken) {
        await handleAuthorize();
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect to Deriv API",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    derivApi.disconnect();
    setIsConnected(false);
    setIsAuthorized(false);
    setAccountInfo(null);
    setBalance(null);
    
    toast({
      title: "Disconnected",
      description: "Disconnected from Deriv API",
    });
  };

  const handleAuthorize = async () => {
    if (!apiToken) {
      toast({
        title: "API Token Required",
        description: "Please enter your Deriv API token",
        variant: "destructive"
      });
      return;
    }

    try {
      const authResponse = await derivApi.authorize(apiToken);
      setIsAuthorized(true);
      setAccountInfo(authResponse.authorize);
      
      // Save token
      localStorage.setItem('deriv_api_token', apiToken);

      // Get balance
      const balanceResponse = await derivApi.getAccountBalance();
      setBalance(balanceResponse.balance);

      toast({
        title: "Authorized Successfully",
        description: `Welcome, ${authResponse.authorize?.fullname}`,
      });
    } catch (error) {
      toast({
        title: "Authorization Failed",
        description: error instanceof Error ? error.message : "Failed to authorize",
        variant: "destructive"
      });
    }
  };

  const testConnection = async () => {
    if (!isConnected) {
      toast({
        title: "Not Connected",
        description: "Please connect to Deriv API first",
        variant: "destructive"
      });
      return;
    }

    try {
      const serverStatus = await derivApi.getServerStatus();
      toast({
        title: "Connection Test Successful",
        description: `Server time: ${new Date(serverStatus.website_status?.server_time * 1000).toLocaleString()}`,
      });
    } catch (error) {
      toast({
        title: "Connection Test Failed",
        description: error instanceof Error ? error.message : "Connection test failed",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isConnected ? (
              <Wifi className="h-5 w-5 text-green-500" />
            ) : (
              <WifiOff className="h-5 w-5 text-gray-500" />
            )}
            Deriv API Connection
          </CardTitle>
          <CardDescription>
            Connect to Deriv trading platform for live trading
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Badge variant={isConnected ? "default" : "secondary"}>
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
            {isAuthorized && (
              <Badge variant="outline">
                <Key className="h-3 w-3 mr-1" />
                Authorized
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="appId">App ID</Label>
              <Input
                id="appId"
                value={appId}
                onChange={(e) => setAppId(e.target.value)}
                placeholder="Enter Deriv App ID"
                disabled={isConnected}
              />
              <p className="text-xs text-muted-foreground">
                Use 1089 for testing or your registered app ID
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="apiToken">API Token (Optional)</Label>
              <Input
                id="apiToken"
                type="password"
                value={apiToken}
                onChange={(e) => setApiToken(e.target.value)}
                placeholder="Enter API Token for authorization"
              />
              <p className="text-xs text-muted-foreground">
                Required for live trading operations
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="autoConnect"
              checked={autoConnect}
              onCheckedChange={setAutoConnect}
            />
            <Label htmlFor="autoConnect">Auto-connect on startup</Label>
          </div>

          <Separator />

          <div className="flex flex-wrap gap-2">
            {!isConnected ? (
              <Button 
                onClick={handleConnect} 
                disabled={isConnecting}
                className="flex items-center gap-2"
              >
                <Wifi className="h-4 w-4" />
                {isConnecting ? "Connecting..." : "Connect"}
              </Button>
            ) : (
              <>
                <Button 
                  onClick={handleDisconnect}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <WifiOff className="h-4 w-4" />
                  Disconnect
                </Button>
                
                <Button 
                  onClick={testConnection}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Activity className="h-4 w-4" />
                  Test Connection
                </Button>

                {!isAuthorized && apiToken && (
                  <Button 
                    onClick={handleAuthorize}
                    className="flex items-center gap-2"
                  >
                    <Key className="h-4 w-4" />
                    Authorize
                  </Button>
                )}
              </>
            )}
          </div>

          {!isConnected && (
            <Alert>
              <AlertDescription>
                To get started, register your app at{' '}
                <a 
                  href="https://developers.deriv.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  developers.deriv.com
                </a>
                {' '}to get your App ID and API Token.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Account Information */}
      {isAuthorized && accountInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground">Account ID</Label>
                <p className="font-mono">{accountInfo.loginid}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Full Name</Label>
                <p>{accountInfo.fullname}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Email</Label>
                <p>{accountInfo.email}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Country</Label>
                <p>{accountInfo.country}</p>
              </div>
            </div>

            {balance && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4" />
                  <Label className="font-semibold">Account Balance</Label>
                </div>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-2xl font-bold">
                      {balance.balance} {balance.currency}
                    </p>
                  </div>
                  <Button
                    onClick={async () => {
                      try {
                        const balanceResponse = await derivApi.getAccountBalance();
                        setBalance(balanceResponse.balance);
                        toast({
                          title: "Balance Updated",
                          description: "Account balance refreshed successfully",
                        });
                      } catch (error) {
                        toast({
                          title: "Update Failed",
                          description: "Failed to refresh balance",
                          variant: "destructive"
                        });
                      }
                    }}
                    variant="outline"
                    size="sm"
                  >
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Refresh
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DerivConnection;