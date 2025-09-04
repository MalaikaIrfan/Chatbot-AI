import { Link, useLocation } from "wouter";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  ChartLine, 
  MessageCircle, 
  Eye, 
  FileText, 
  Folder, 
  BarChart3, 
  Settings, 
  Moon, 
  Sun, 
  User, 
  Bot 
} from "lucide-react";

const navigationItems = [
  { href: "/", icon: ChartLine, label: "Dashboard" },
  { href: "/chat", icon: MessageCircle, label: "AI Chat" },
  { href: "/vision", icon: Eye, label: "Image Analysis" },
  { href: "/content", icon: FileText, label: "Content Generation" },
  { href: "/projects", icon: Folder, label: "My Projects" },
  { href: "/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className={cn("sidebar-transition w-64 bg-sidebar border-r border-sidebar-border flex flex-col", className)}>
      {/* Logo and Header */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
            <Bot className="text-sidebar-primary-foreground" size={16} />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-sidebar-foreground">AI Assistant</h1>
            <p className="text-xs text-muted-foreground">Gemini Integration</p>
          </div>
        </div>
      </div>
      
      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
          
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start space-x-3",
                  isActive 
                    ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90" 
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
                data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Button>
            </Link>
          );
        })}
      </nav>
      
      {/* Theme Toggle and User Info */}
      <div className="p-4 border-t border-sidebar-border space-y-3">
        <Button
          variant="ghost"
          onClick={toggleTheme}
          className="w-full justify-start space-x-3 text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          data-testid="button-theme-toggle"
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
        </Button>
        <div className="flex items-center space-x-3 px-3 py-2">
          <div className="w-8 h-8 bg-sidebar-primary rounded-full flex items-center justify-center">
            <User className="text-sidebar-primary-foreground" size={14} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">Malaika Irfan</p>
            <p className="text-xs text-muted-foreground truncate">malaika@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
