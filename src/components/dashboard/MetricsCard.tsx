import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface MetricsCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: LucideIcon;
}

export const MetricsCard = ({ title, value, change, trend, icon: Icon }: MetricsCardProps) => {
  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "profit";
      case "down":
        return "loss";
      default:
        return "text-muted-foreground";
    }
  };

  const getBadgeVariant = () => {
    switch (trend) {
      case "up":
        return "default";
      case "down":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <Card className="trading-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-1">{value}</div>
        <Badge variant={getBadgeVariant()} className={`text-xs ${getTrendColor()}`}>
          {change}
        </Badge>
      </CardContent>
    </Card>
  );
};