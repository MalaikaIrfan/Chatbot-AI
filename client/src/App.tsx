import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProviderWrapper } from "@/components/layout/theme-provider";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

// Pages
import Dashboard from "@/pages/dashboard";
import Chat from "@/pages/chat";
import Vision from "@/pages/vision";
import Content from "@/pages/content";
import Projects from "@/pages/projects";
import Analytics from "@/pages/analytics";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";

const pageInfo = {
  "/": { title: "Dashboard", subtitle: "Overview of your AI assistant usage" },
  "/chat": { title: "AI Chat", subtitle: "Conversation with Google Gemini" },
  "/vision": { title: "Image Analysis", subtitle: "Analyze images with AI vision" },
  "/content": { title: "Content Generation", subtitle: "Create various types of content" },
  "/projects": { title: "My Projects", subtitle: "Manage your saved content" },
  "/analytics": { title: "Analytics", subtitle: "Detailed usage statistics" },
  "/settings": { title: "Settings", subtitle: "Configure your preferences" },
};

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/chat" component={Chat} />
      <Route path="/vision" component={Vision} />
      <Route path="/content" component={Content} />
      <Route path="/projects" component={Projects} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProviderWrapper>
        <TooltipProvider>
          <Toaster />
          <div className="flex h-screen">
            {/* Sidebar */}
            <Sidebar 
              className={cn(
                "fixed inset-y-0 left-0 z-50 md:relative md:translate-x-0 transition-transform",
                !sidebarOpen && isMobile && "-translate-x-full"
              )}
            />
            
            {/* Mobile overlay */}
            {sidebarOpen && isMobile && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}
            
            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <Header
                title="Dashboard"
                subtitle="Overview of your AI assistant usage"
                onMenuClick={() => setSidebarOpen(!sidebarOpen)}
              />
              <main className="flex-1 overflow-y-auto p-6">
                <div className="fade-in">
                  <Router />
                </div>
              </main>
            </div>
          </div>
        </TooltipProvider>
      </ThemeProviderWrapper>
    </QueryClientProvider>
  );
}

export default App;
