import { useQuery } from "@tanstack/react-query";
import { MetricCard } from "@/components/metric-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { 
  NotebookPen, 
  Image, 
  Wand2, 
  FolderOpen, 
  MessageCircle, 
  Eye, 
  ChartLine 
} from "lucide-react";

export default function Dashboard() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["/api/analytics/summary"],
  });

  const { data: recentProjects } = useQuery({
    queryKey: ["/api/projects"],
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const recentProjectsSlice = (recentProjects || []).slice(0, 3);

  return (
    <div className="space-y-8" data-testid="page-dashboard">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Requests"
          value={(analytics as any)?.totalRequests || 0}
          change="+12%"
          changeType="positive"
          icon={NotebookPen}
          iconColor="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
        />
        <MetricCard
          title="Images Analyzed"
          value={(analytics as any)?.imagesAnalyzed || 0}
          change="+8%"
          changeType="positive"
          icon={Image}
          iconColor="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400"
        />
        <MetricCard
          title="Content Generated"
          value={(analytics as any)?.contentGenerated || 0}
          change="+15%"
          changeType="positive"
          icon={Wand2}
          iconColor="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400"
        />
        <MetricCard
          title="Active Projects"
          value={(analytics as any)?.activeProjects || 0}
          change="+3"
          changeType="positive"
          icon={FolderOpen}
          iconColor="bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400"
        />
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usage Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Usage Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="chart-container bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <ChartLine size={48} className="text-muted-foreground mb-2 mx-auto" />
                <p className="text-muted-foreground">Chart will be implemented with real data</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProjectsSlice.length > 0 ? (
                recentProjectsSlice.map((project: any) => (
                  <div
                    key={project.id}
                    className="flex items-center space-x-3 p-3 bg-muted rounded-lg"
                    data-testid={`activity-project-${project.id}`}
                  >
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <MessageCircle className="text-white" size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{project.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {project.type} - {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'Unknown'}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No projects yet</p>
                  <Link href="/projects">
                    <Button variant="outline" className="mt-2" size="sm">
                      Create your first project
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/chat">
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                data-testid="button-quick-chat"
              >
                <MessageCircle className="text-blue-600 dark:text-blue-400" size={24} />
                <div className="text-center">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100">Start Chat</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">Begin a conversation with AI</p>
                </div>
              </Button>
            </Link>
            
            <Link href="/vision">
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-green-50 dark:hover:bg-green-900/20 border-green-200 dark:border-green-800"
                data-testid="button-quick-vision"
              >
                <Eye className="text-green-600 dark:text-green-400" size={24} />
                <div className="text-center">
                  <h4 className="font-medium text-green-900 dark:text-green-100">Analyze Image</h4>
                  <p className="text-sm text-green-700 dark:text-green-300">Upload and analyze images</p>
                </div>
              </Button>
            </Link>
            
            <Link href="/content">
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-purple-50 dark:hover:bg-purple-900/20 border-purple-200 dark:border-purple-800"
                data-testid="button-quick-content"
              >
                <Wand2 className="text-purple-600 dark:text-purple-400" size={24} />
                <div className="text-center">
                  <h4 className="font-medium text-purple-900 dark:text-purple-100">Generate Content</h4>
                  <p className="text-sm text-purple-700 dark:text-purple-300">Create various content types</p>
                </div>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
