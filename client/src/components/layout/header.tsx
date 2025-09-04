import { Button } from "@/components/ui/button";
import { Bell, Search, Menu } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle: string;
  onMenuClick?: () => void;
}

export function Header({ title, subtitle, onMenuClick }: HeaderProps) {
  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="md:hidden"
            data-testid="button-menu-toggle"
          >
            <Menu size={18} />
          </Button>
          <div>
            <h2 className="text-xl font-semibold text-foreground" data-testid="text-page-title">{title}</h2>
            <p className="text-sm text-muted-foreground" data-testid="text-page-subtitle">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" data-testid="button-notifications">
            <Bell size={18} />
          </Button>
          <Button variant="ghost" size="sm" data-testid="button-search">
            <Search size={18} />
          </Button>
        </div>
      </div>
    </header>
  );
}
