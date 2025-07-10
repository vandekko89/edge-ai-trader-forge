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
    <Sidebar className="w-20 border-r border-border/50" collapsible="icon">
      <SidebarContent className="bg-card/30 backdrop-blur-sm">
        <SidebarGroup className="py-4">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.id);
                
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => onTabChange(item.id)}
                      className={`
                        group relative h-12 w-12 mx-auto rounded-xl transition-all duration-300 
                        hover:scale-105 hover:shadow-lg cursor-pointer
                        ${active 
                          ? 'bg-primary text-primary-foreground shadow-primary/25 shadow-lg scale-105' 
                          : 'bg-card/50 hover:bg-primary/10 text-muted-foreground hover:text-foreground'
                        }
                      `}
                      title={item.tooltip}
                    >
                      <Icon className={`h-5 w-5 transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-110'}`} />
                      
                      {/* Active indicator */}
                      {active && (
                        <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-glow rounded-full animate-pulse" />
                      )}
                      
                      {/* Tooltip */}
                      <div className="absolute left-16 top-1/2 -translate-y-1/2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                        {item.label}
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {/* Gradient overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-card/30 to-transparent pointer-events-none" />
      </SidebarContent>
    </Sidebar>
  );
}