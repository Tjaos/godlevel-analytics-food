"use client";

import { usePathname } from "next/navigation";
import { Home, Inbox } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

// Menu items
const items = [
  {
    title: "Análise Geral",
    url: "/pages/analytics",
    icon: Home,
  },
  {
    title: "Vendas",
    url: "/pages/sales",
    icon: Inbox,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar
      className={cn(
        // Fundo dark com transparência e bordas suaves
        "bg-slate-950/95 border-r border-slate-800 text-slate-100",
        "backdrop-blur-md shadow-xl flex flex-col justify-between min-h-screen",
        "transition-all duration-300 ease-in-out"
      )}
    >
      <SidebarContent className="flex flex-col justify-between h-full px-3 py-4 bg-transparent">
        {/* Cabeçalho */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-center text-lg font-bold text-slate-100 border-b border-slate-800 pb-3">
            🍔 Analytics Food
          </SidebarGroupLabel>

          {/* Menu */}
          <SidebarGroupContent className="mt-4 bg-transparent">
            <SidebarMenu>
              {items.map((item) => {
                const active = pathname === item.url;
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a
                        href={item.url}
                        className={cn(
                          // Base
                          "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                          // Cores e transições
                          "hover:bg-slate-800/70 hover:text-white",
                          active
                            ? "bg-slate-800 text-blue-400 shadow-inner border border-slate-700"
                            : "text-slate-300"
                        )}
                      >
                        <Icon
                          className={cn(
                            "w-5 h-5 transition-colors",
                            active ? "text-blue-400" : "text-slate-400"
                          )}
                        />
                        <span className="font-medium text-sm">
                          {item.title}
                        </span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Rodapé */}
        <div className="mt-auto border-t border-slate-800 pt-4 text-center text-xs text-slate-500">
          v1.0.0 • Desenvolvido por Thiago
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
