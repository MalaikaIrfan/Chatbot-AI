import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Copy, Download, Save, FileText, Share2, Mail } from "lucide-react";

interface ContentRequest {
  topic: string;
  tone: string;
  length: string;
  type: string;
  instructions: string;
}

interface ContentResponse {
  content: string;
}

const contentTypes = [
  { id: "blog", name: "Blog Post", icon: FileText, color: "text-blue-600" },
  { id: "social", name: "Social Media", icon: Share2, color: "text-green-600" },
  { id: "email", name: "Email Campaign", icon: Mail, color: "text-purple-600" },
];

export default function Content() {
  const [selectedType, setSelectedType] = useState("blog");
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { register, handleSubmit, watch, setValue } = useForm<ContentRequest>({
    defaultValues: {
      topic: "",
      tone: "professional",
      length: "medium",
      type: "blog",
      instructions: "",
    },
  });

  const generateContentMutation = useMutation({
    mutationFn: async (data: ContentRequest): Promise<ContentResponse> => {
      const response = await apiRequest("POST", "/api/content/generate", data);
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedContent(data.content);
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/summary"] });
      toast({
        title: "Success",
        description: "Content generated successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    },
  });

  const saveContentMutation = useMutation({
    mutationFn: async (content: string) => {
      const topicValue = watch("topic");
      const typeValue = watch("type");
      
      const projectData = {
        name: topicValue || "Generated Content",
        type: typeValue,
        description: `Generated ${typeValue} content about ${topicValue}`,
        content: content,
      };
      
      const response = await apiRequest("POST", "/api/projects", projectData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Success",
        description: "Content saved to projects!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save content. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContentRequest) => {
    generateContentMutation.mutate({ ...data, type: selectedType });
  };

  const handleCopyContent = () => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent);
      toast({
        title: "Copied",
        description: "Content copied to clipboard!",
      });
    }
  };

  const handleSaveContent = () => {
    if (generatedContent) {
      saveContentMutation.mutate(generatedContent);
    }
  };

  const handleExportContent = () => {
    if (generatedContent) {
      const blob = new Blob([generatedContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${watch("topic") || "content"}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({
        title: "Exported",
        description: "Content exported successfully!",
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6" data-testid="page-content">
      {/* Content Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Content Generation</CardTitle>
          <p className="text-sm text-muted-foreground">
            Generate various types of content using AI
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {contentTypes.map((type) => {
              const Icon = type.icon;
              return (
                <Button
                  key={type.id}
                  variant={selectedType === type.id ? "default" : "outline"}
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                  onClick={() => {
                    setSelectedType(type.id);
                    setValue("type", type.id);
                  }}
                  data-testid={`button-content-type-${type.id}`}
                >
                  <Icon className={selectedType === type.id ? "text-current" : type.color} size={24} />
                  <div className="text-center">
                    <h4 className="font-medium">{type.name}</h4>
                    <p className="text-sm opacity-70">
                      Generate {type.name.toLowerCase()} content
                    </p>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Content Generation Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Content Parameters</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Topic
                </label>
                <Input
                  {...register("topic", { required: true })}
                  placeholder="Enter your topic..."
                  data-testid="input-content-topic"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Tone
                </label>
                <Select 
                  value={watch("tone")} 
                  onValueChange={(value) => setValue("tone", value)}
                >
                  <SelectTrigger data-testid="select-content-tone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="formal">Formal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Length
                </label>
                <Select 
                  value={watch("length")} 
                  onValueChange={(value) => setValue("length", value)}
                >
                  <SelectTrigger data-testid="select-content-length">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short (100-300 words)</SelectItem>
                    <SelectItem value="medium">Medium (300-600 words)</SelectItem>
                    <SelectItem value="long">Long (600+ words)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Additional Instructions
                </label>
                <Textarea
                  {...register("instructions")}
                  placeholder="Any specific requirements..."
                  className="h-24"
                  data-testid="textarea-content-instructions"
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={generateContentMutation.isPending}
                data-testid="button-generate-content"
              >
                {generateContentMutation.isPending ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                    Generating...
                  </>
                ) : (
                  "Generate Content"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Generated Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted rounded-lg p-4 h-64 overflow-y-auto mb-4">
              {generatedContent ? (
                <div className="text-sm text-foreground whitespace-pre-wrap" data-testid="text-generated-content">
                  {generatedContent}
                </div>
              ) : generateContentMutation.isPending ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-muted-foreground">Generating content...</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <p>Generated content will appear here</p>
                </div>
              )}
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={handleCopyContent}
                disabled={!generatedContent}
                className="flex-1"
                data-testid="button-copy-content"
              >
                <Copy size={16} className="mr-2" />
                Copy
              </Button>
              <Button
                variant="outline"
                onClick={handleExportContent}
                disabled={!generatedContent}
                className="flex-1"
                data-testid="button-export-content"
              >
                <Download size={16} className="mr-2" />
                Export
              </Button>
              <Button
                variant="outline"
                onClick={handleSaveContent}
                disabled={!generatedContent || saveContentMutation.isPending}
                className="flex-1"
                data-testid="button-save-content"
              >
                <Save size={16} className="mr-2" />
                {saveContentMutation.isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
