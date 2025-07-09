import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, TrendingUp, Target, BarChart3, Settings, Play, Pause } from "lucide-react";
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
      id: "ml_strategy",
      name: "ML Prediction Model",
      description: "Machine learning based price prediction",
      isActive: true,
      performance: 32.1,
      risk: "High",
      icon: Brain,
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
      icon: Target,
      parameters: {
        spread_threshold: 0.05,
        max_holding_time: 2,
        profit_target: 0.2,
        stop_loss: 0.1
      }
    },
    {
      id: "aggregation",
      name: "Signal Aggregation",
      description: "Combines multiple strategy signals",
      isActive: true,
      performance: 25.7,
      risk: "Medium",
      icon: BarChart3,
      parameters: {
        ema_weight: 0.3,
        rsi_weight: 0.2,
        ml_weight: 0.4,
        volume_weight: 0.1
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
        <Badge variant="outline" className="text-sm">
          {strategies.filter(s => s.isActive).length} Active
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Strategy Overview</TabsTrigger>
          <TabsTrigger value="parameters">Parameters</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {strategies.map((strategy) => {
              const Icon = strategy.icon;
              return (
                <Card key={strategy.id} className="trading-card">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Icon className="h-6 w-6 text-primary" />
                        <div>
                          <CardTitle className="text-lg">{strategy.name}</CardTitle>
                          <CardDescription className="text-sm">
                            {strategy.description}
                          </CardDescription>
                        </div>
                      </div>
                      <Switch
                        checked={strategy.isActive}
                        onCheckedChange={() => toggleStrategy(strategy.id)}
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Performance</span>
                      <span className={`font-semibold ${strategy.performance >= 0 ? 'profit' : 'loss'}`}>
                        {strategy.performance >= 0 ? '+' : ''}{strategy.performance}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Risk Level</span>
                      <Badge variant="outline" className={getRiskColor(strategy.risk)}>
                        {strategy.risk}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <div className="flex items-center space-x-2">
                        {strategy.isActive ? (
                          <>
                            <Play className="h-3 w-3 text-success" />
                            <span className="text-xs text-success">Running</span>
                          </>
                        ) : (
                          <>
                            <Pause className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Stopped</span>
                          </>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => setSelectedStrategy(strategy)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="parameters" className="space-y-6">
          <Card className="trading-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <selectedStrategy.icon className="h-5 w-5 text-primary" />
                <span>{selectedStrategy.name} Parameters</span>
              </CardTitle>
              <CardDescription>
                Fine-tune the strategy parameters for optimal performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(selectedStrategy.parameters).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <Label className="text-sm font-medium capitalize">
                    {key.replace(/_/g, ' ')}
                  </Label>
                  {typeof value === 'number' && value <= 1 ? (
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
                  Save Parameters
                </Button>
                <Button variant="outline" className="flex-1">
                  Reset to Default
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};