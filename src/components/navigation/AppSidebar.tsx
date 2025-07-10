import { Brain, TrendingUp, Target, BarChart3, Activity, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  { 
    id: "dashboard", 
    icon: BarChart3, 
    label: "Dashboard",
    tooltip: "Visão geral e métricas"
  },
  { 
    id: "ai", 
    icon: Brain, 
    label: "IA",
    tooltip: "Análise de inteligência artificial"
  },
  { 
    id: "backtest", 
    icon: TrendingUp, 
    label: "Backtest",
    tooltip: "Teste de estratégias históricas"
  },
  { 
    id: "strategies", 
    icon: Target, 
    label: "Strategies",
    tooltip: "Gerenciamento de estratégias"
  },
  { 
    id: "logs", 
    icon: Activity, 
    label: "Logs",
    tooltip: "Logs do sistema"
  },
  { 
    id: "settings", 
    icon: Settings, 
    label: "Settings",
    tooltip: "Configurações"
  },
];

interface AppSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function AppSidebar({ activeTab, onTabChange }: AppSidebarProps) {
  const { state } = useSidebar();
  
  const isActive = (tabId: string) => activeTab === tabId;

  return (
    <Sidebar className="w-16 border-r border-border/20" collapsible="icon">
      <SidebarContent className="bg-background/95 backdrop-blur-sm">
        <SidebarGroup className="py-6">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-3">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.id);
                
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => onTabChange(item.id)}
                      className={`
                        group relative h-10 w-10 mx-auto rounded-lg transition-all duration-200 
                        hover:scale-[1.02] cursor-pointer border border-transparent
                        ${active 
                          ? 'bg-primary/10 text-primary border-primary/20 shadow-sm' 
                          : 'bg-transparent hover:bg-muted/50 text-muted-foreground hover:text-foreground hover:border-border/50'
                        }
                      `}
                      title={item.tooltip}
                    >
                      <Icon className={`h-4 w-4 transition-all duration-200 ${active ? 'scale-105' : 'group-hover:scale-105'}`} />
                      
                      {/* Active indicator */}
                      {active && (
                        <div className="absolute -right-[1px] top-1/2 -translate-y-1/2 w-0.5 h-4 bg-primary rounded-full" />
                      )}
                      
                      {/* Tooltip */}
                      <div className="absolute left-14 top-1/2 -translate-y-1/2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 border border-border/50">
                        {item.label}
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}