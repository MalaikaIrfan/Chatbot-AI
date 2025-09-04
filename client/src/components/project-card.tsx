import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type Project } from "@shared/schema";
import { FileText, Share2, Mail, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
}

const getProjectIcon = (type: string) => {
  switch (type) {
    case "blog":
      return { icon: FileText, color: "text-blue-600" };
    case "social":
      return { icon: Share2, color: "text-green-600" };
    case "email":
      return { icon: Mail, color: "text-purple-600" };
    default:
      return { icon: FileText, color: "text-gray-600" };
  }
};

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const { icon: Icon, color } = getProjectIcon(project.type);
  
  const getWordCount = (content: string | null) => {
    if (!content) return 0;
    return content.split(/\s+/).filter(word => word.length > 0).length;
  };

  return (
    <Card className="hover:shadow-md transition-shadow" data-testid={`card-project-${project.id}`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-2">
            <Icon className={color} size={16} />
            <span className={`text-sm font-medium ${color}`}>
              {project.type.charAt(0).toUpperCase() + project.type.slice(1)}
            </span>
          </div>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(project)}
              data-testid={`button-edit-project-${project.id}`}
            >
              <Edit size={14} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(project.id)}
              className="hover:text-destructive"
              data-testid={`button-delete-project-${project.id}`}
            >
              <Trash2 size={14} />
            </Button>
          </div>
        </div>
        <h4 className="font-semibold text-foreground mb-2" data-testid={`text-project-name-${project.id}`}>
          {project.name}
        </h4>
        <p className="text-sm text-muted-foreground mb-4" data-testid={`text-project-description-${project.id}`}>
          {project.description || "No description provided"}
        </p>
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span data-testid={`text-project-date-${project.id}`}>
            Created {project.createdAt ? format(new Date(project.createdAt), "PPP") : "Unknown"}
          </span>
          <span data-testid={`text-project-wordcount-${project.id}`}>
            {getWordCount(project.content)} words
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
