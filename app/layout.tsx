import type { Metadata } from "next";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export const metadata: Metadata = {
  title: "Analytics Food",
  description:
    "Uma plataforma de gerenciamento e análises do negócio alimentício",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body
        className="
          antialiased 
          bg-slate-950 
          text-white 
          w-screen 
          min-h-screen 
          overflow-x-hidden 
          flex"
      >
        <SidebarProvider>
          <AppSidebar />
          <main
            className="
              flex-1 
              min-h-screen 
              flex 
              flex-col  
              justify-start 
              px-4 
              md:px-8 
              py-8
              overflow-x-hidden"
          >
            <SidebarTrigger />
            {children}
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}
