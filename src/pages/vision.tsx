import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload, Image as ImageIcon, Eye } from "lucide-react";

interface AnalysisResult {
  analysis: string;
}

export default function Vision() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const analyzeImageMutation = useMutation({
    mutationFn: async (file: File): Promise<AnalysisResult> => {
      const formData = new FormData();
      formData.append("image", file);
      
      const response = await fetch("/api/vision/analyze", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error("Failed to analyze image");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setAnalysisResult(data.analysis);
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/summary"] });
      toast({
        title: "Success",
        description: "Image analyzed successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to analyze image. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Error",
          description: "Please select a valid image file.",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "File size must be less than 10MB.",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
      setAnalysisResult(null);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleAnalyze = () => {
    if (selectedFile) {
      analyzeImageMutation.mutate(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const syntheticEvent = {
        target: { files: [file] }
      } as any;
      handleFileSelect(syntheticEvent);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6" data-testid="page-vision">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>Image Analysis</CardTitle>
          <p className="text-sm text-muted-foreground">
            Upload an image to analyze it with Google Gemini Vision
          </p>
        </CardHeader>
        <CardContent>
          <div
            className="border-2 border-dashed border-border rounded-lg p-8 text-center transition-colors hover:border-primary/50"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            data-testid="dropzone-image-upload"
          >
            <Upload size={48} className="mx-auto text-muted-foreground mb-4" />
            <h4 className="text-lg font-medium text-foreground mb-2">Upload Image for Analysis</h4>
            <p className="text-muted-foreground mb-4">
              Drag and drop an image here, or click to select
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="image-upload"
              data-testid="input-image-upload"
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById("image-upload")?.click()}
              data-testid="button-choose-image"
            >
              <ImageIcon size={16} className="mr-2" />
              Choose Image
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Supported formats: JPG, PNG, GIF, WebP (max 10MB)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Image Preview and Analysis */}
      {selectedFile && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Uploaded Image</CardTitle>
              <p className="text-sm text-muted-foreground">{selectedFile.name}</p>
            </CardHeader>
            <CardContent>
              <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Upload preview"
                    className="w-full h-full object-cover"
                    data-testid="img-preview"
                  />
                )}
              </div>
              <Button
                onClick={handleAnalyze}
                disabled={analyzeImageMutation.isPending}
                className="w-full mt-4"
                data-testid="button-analyze-image"
              >
                {analyzeImageMutation.isPending ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Eye size={16} className="mr-2" />
                    Analyze with Gemini Vision
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
            </CardHeader>
            <CardContent>
              {analysisResult ? (
                <div className="space-y-4" data-testid="analysis-results">
                  <div className="bg-muted rounded-lg p-4">
                    <h5 className="font-medium text-foreground mb-2">AI Analysis</h5>
                    <p className="text-sm text-foreground whitespace-pre-wrap">
                      {analysisResult}
                    </p>
                  </div>
                </div>
              ) : analyzeImageMutation.isPending ? (
                <div className="text-center py-8">
                  <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                  <p className="text-muted-foreground">Analyzing image with AI...</p>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Eye size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Click "Analyze" to get AI insights about your image</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
