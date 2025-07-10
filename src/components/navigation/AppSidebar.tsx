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
    <Sidebar className="w-12" collapsible="icon">
      <SidebarContent className="bg-background">
        <SidebarGroup className="py-4 px-1">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.id);
                
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => onTabChange(item.id)}
                      className={`
                        group relative h-8 w-8 mx-auto rounded-md transition-all duration-200 
                        hover:scale-[1.05] cursor-pointer
                        ${active 
                          ? 'bg-primary/15 text-primary' 
                          : 'bg-transparent hover:bg-muted/30 text-muted-foreground hover:text-foreground'
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
                       <div className="absolute left-10 top-1/2 -translate-y-1/2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 border border-border/50">
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