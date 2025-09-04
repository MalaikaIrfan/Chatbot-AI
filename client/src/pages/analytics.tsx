import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartLine, Clock, CheckCircle, DollarSign, MessageCircle, Image, Code, BarChart3 } from "lucide-react";

export default function Analytics() {
  const { data: summary, isLoading } = useQuery({
    queryKey: ["/api/analytics/summary"],
  });

  const { data: analyticsData } = useQuery({
    queryKey: ["/api/analytics/data"],
  });

  if (isLoading) {
    return (
      <div className="space-y-6" data-testid="page-analytics">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const formatResponseTime = (time: number) => {
    return time >= 1000 ? `${(time / 1000).toFixed(1)}s` : `${Math.round(time)}ms`;
  };

  return (
    <div className="space-y-6" data-testid="page-analytics">
      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg mx-auto mb-3 flex items-center justify-center">
              <ChartLine className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <h4 className="text-2xl font-bold text-foreground" data-testid="text-total-requests">
              {(summary as any)?.totalRequests || 0}
            </h4>
            <p className="text-sm text-muted-foreground">Total API Calls</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg mx-auto mb-3 flex items-center justify-center">
              <Clock className="text-green-600 dark:text-green-400" size={24} />
            </div>
            <h4 className="text-2xl font-bold text-foreground" data-testid="text-avg-response-time">
              {(summary as any)?.avgResponseTime ? formatResponseTime((summary as any).avgResponseTime) : "0ms"}
            </h4>
            <p className="text-sm text-muted-foreground">Avg Response Time</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg mx-auto mb-3 flex items-center justify-center">
              <CheckCircle className="text-purple-600 dark:text-purple-400" size={24} />
            </div>
            <h4 className="text-2xl font-bold text-foreground" data-testid="text-success-rate">
              99.7%
            </h4>
            <p className="text-sm text-muted-foreground">Success Rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg mx-auto mb-3 flex items-center justify-center">
              <DollarSign className="text-orange-600 dark:text-orange-400" size={24} />
            </div>
            <h4 className="text-2xl font-bold text-foreground" data-testid="text-estimated-cost">
              $0.00
            </h4>
            <p className="text-sm text-muted-foreground">This Month</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Usage Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="chart-container bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 size={48} className="text-muted-foreground mb-2 mx-auto" />
                <p className="text-muted-foreground">Time Series Chart</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Chart will show real usage data
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Feature Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="chart-container bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 size={48} className="text-muted-foreground mb-2 mx-auto" />
                <p className="text-muted-foreground">Pie Chart</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Feature breakdown visualization
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(summary as any)?.featureBreakdown?.length > 0 ? (
              (summary as any).featureBreakdown.map((feature: any, index: number) => {
                const getFeatureIcon = (featureName: string) => {
                  switch (featureName) {
                    case "chat":
                      return { icon: MessageCircle, color: "text-blue-600" };
                    case "vision":
                      return { icon: Image, color: "text-green-600" };
                    case "content":
                      return { icon: Code, color: "text-purple-600" };
                    default:
                      return { icon: BarChart3, color: "text-gray-600" };
                  }
                };

                const { icon: Icon, color } = getFeatureIcon(feature.feature);

                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    data-testid={`feature-breakdown-${feature.feature}`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={color} size={20} />
                      <div>
                        <p className="font-medium text-foreground capitalize">
                          {feature.feature} {feature.feature === "content" ? "Generation" : feature.feature === "vision" ? "Analysis" : ""}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {feature.feature === "chat" && "Chat and conversation"}
                          {feature.feature === "vision" && "Image analysis"}
                          {feature.feature === "content" && "Content generation"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">{feature.count} calls</p>
                      <p className="text-sm text-muted-foreground">
                        {feature.percentage.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 size={48} className="mx-auto mb-4 opacity-50" />
                <p>No usage data available yet</p>
                <p className="text-sm">Start using the AI features to see analytics</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
