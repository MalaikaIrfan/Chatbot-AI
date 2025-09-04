import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor: string;
}

export function MetricCard({ 
  title, 
  value, 
  change, 
  changeType = "neutral", 
  icon: Icon, 
  iconColor 
}: MetricCardProps) {
  const changeColorClass = {
    positive: "text-green-600",
    negative: "text-red-600",
    neutral: "text-muted-foreground",
  }[changeType];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground" data-testid={`text-${title.toLowerCase().replace(/\s+/g, '-')}-label`}>
              {title}
            </p>
            <p className="text-2xl font-bold text-foreground" data-testid={`text-${title.toLowerCase().replace(/\s+/g, '-')}-value`}>
              {value}
            </p>
          </div>
          <div className={`w-10 h-10 ${iconColor} rounded-full flex items-center justify-center`}>
            <Icon size={20} className="text-current" />
          </div>
        </div>
        {change && (
          <div className="mt-4 flex items-center">
            <span className={`text-sm font-medium ${changeColorClass}`} data-testid={`text-${title.toLowerCase().replace(/\s+/g, '-')}-change`}>
              {change}
            </span>
            <span className="text-muted-foreground text-sm ml-2">from last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
