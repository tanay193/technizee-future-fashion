import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Upload, 
  Download, 
  ArrowLeft, 
  Wand2,
  Camera,
  Shirt,
  User
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const AIPhotoshoot = () => {
  const { toast } = useToast();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedModelType, setSelectedModelType] = useState<string>("");
  const [selectedBackground, setSelectedBackground] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);

  const modelTypes = [
    { value: "indian-female", label: "Indian Female" },
    { value: "indian-male", label: "Indian Male" }
  ];

  const backgroundStyles = [
    { value: "nature", label: "Nature" },
    { value: "urban", label: "Urban" },
    { value: "studio", label: "Studio" }
  ];

  // Function to get model image path based on selection
  const getModelImagePath = (modelType: string, background: string) => {
    if (!modelType || !background) return null;
    return `${modelType}-${background}.jpg`;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      toast({
        title: "Image uploaded successfully!",
        description: "Ready for AI processing",
      });
    }
  };

  const handleGeneratePhotoshoot = async () => {
    const TRYON_API_URL = ""; // TODO: Paste your Azure ML endpoint URL here (same as Virtual Try-On)
    
    if (!TRYON_API_URL) {
      toast({
        title: "API not configured", 
        description: "Please provide the Try-On API URL to enable photoshoot generation.",
        variant: "destructive",
      });
      return;
    }

    if (!uploadedImage) {
      toast({
        title: "No image uploaded",
        description: "Please upload a garment image first.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedModelType || !selectedBackground) {
      toast({
        title: "Selection incomplete",
        description: "Please select both model type and background style.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Get model image path based on selections
      const modelImagePath = getModelImagePath(selectedModelType, selectedBackground);
      if (!modelImagePath) throw new Error("Invalid model selection");

      // Determine category based on garment (simplified logic for now)
      const category = "upper_body"; // You can enhance this logic later

      const requestBody = {
        model_image_path: modelImagePath,
        garment_image: uploadedImage, // Already base64 from file upload
        category: category,
        has_sleeves: null // Let model auto-detect
      };

      const apiResponse = await fetch(TRYON_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!apiResponse.ok) {
        throw new Error(`API request failed (${apiResponse.status})`);
      }

      const data = await apiResponse.json();
      
      if (data.success && data.result_image) {
        setGeneratedImages([data.result_image]);
        toast({
          title: "AI Photoshoot Complete!",
          description: `Successfully generated photoshoot image. Detected: ${data.detected_sleeves} sleeves.`,
        });
      } else {
        throw new Error(data.error || "Unknown error occurred");
      }

    } catch (error: any) {
      console.error("Photoshoot generation error:", error);
      toast({
        title: "Generation failed",
        description: error?.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/virtual-tryon" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <img 
                src="/lovable-uploads/676f11a3-0467-482a-bd66-aaf29c1ea20d.png" 
                alt="Technizee Logo" 
                className="h-8 w-auto"
              />
            </Link>
            <Link to="/virtual-tryon">
              <Button variant="outline">Virtual Try-On Store</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            AI Product Photoshoot
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Transform your garment images into professional model photoshoots. 
            Upload a garment image and select a model to see how it looks.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Upload & Settings */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <Shirt className="h-5 w-5 mr-2" />
              Upload Your Product
            </h2>

            {/* Image Upload */}
            <div className="space-y-4 mb-6">
              <Label>Product Image</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                {uploadedImage ? (
                  <img 
                    src={uploadedImage} 
                    alt="Uploaded product" 
                    className="max-w-full h-48 object-contain mx-auto mb-4"
                  />
                ) : (
                  <div className="space-y-4">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="text-muted-foreground">Drop your garment image here</p>
                  </div>
                )}
                
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="product-upload"
                />
                <label htmlFor="product-upload">
                  <Button variant="outline" className="mt-4" asChild>
                    <span className="cursor-pointer">
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Image
                    </span>
                  </Button>
                </label>
              </div>
            </div>

            {/* Model Type Selection */}
            <div className="space-y-4">
              <Label>Model Type</Label>
              <Select value={selectedModelType} onValueChange={setSelectedModelType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select model type" />
                </SelectTrigger>
                <SelectContent>
                  {modelTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Background Style Selection */}
            <div className="space-y-4">
              <Label>Background Style</Label>
              <Select value={selectedBackground} onValueChange={setSelectedBackground}>
                <SelectTrigger>
                  <SelectValue placeholder="Select background style" />
                </SelectTrigger>
                <SelectContent>
                  {backgroundStyles.map((style) => (
                    <SelectItem key={style.value} value={style.value}>
                      {style.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Note: Background selection removed since we're using the model's background */}

            <Button 
              className="w-full btn-primary mt-6"
              onClick={handleGeneratePhotoshoot}
              disabled={!uploadedImage || !selectedModelType || !selectedBackground || isProcessing}
            >
              {isProcessing ? (
                <>
                  <Wand2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Generate AI Photoshoot
                </>
              )}
            </Button>
          </Card>

          {/* Results */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <User className="h-5 w-5 mr-2" />
              AI Generated Results
            </h2>

            <div className="border border-border rounded-lg p-8 text-center bg-muted/30 min-h-[20rem] flex items-center justify-center">
              {isProcessing ? (
                <div className="space-y-4">
                  <Wand2 className="h-12 w-12 mx-auto text-primary animate-spin" />
                  <p className="text-muted-foreground">Creating your AI photoshoot...</p>
                  <div className="w-48 bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full w-1/2 animate-pulse"></div>
                  </div>
                </div>
              ) : generatedImages.length > 0 ? (
                <div className="w-full">
                  <div className="space-y-4">
                    {generatedImages.map((img, idx) => (
                      <div key={idx} className="space-y-2">
                        <img
                          src={img}
                          alt={`AI generated model ${idx + 1}`}
                          className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                          loading="lazy"
                        />
                        <Button variant="outline" className="w-full" asChild>
                          <a href={img} download={`ai-photoshoot-${idx + 1}.jpg`}>
                            <Download className="h-4 w-4 mr-2" />
                            Download Result
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button className="btn-primary w-full mt-4" onClick={handleGeneratePhotoshoot}>
                    <Wand2 className="h-4 w-4 mr-2" />
                    Generate New
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Camera className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Your AI-generated model photoshoot will appear here
                  </p>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <h3 className="font-semibold text-sm mb-2">Tips for best results:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Use high-resolution garment images</li>
                <li>• Ensure good lighting and clear details</li>
                <li>• Choose appropriate model for the garment type</li>
                <li>• Flat lay images often work better</li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIPhotoshoot;