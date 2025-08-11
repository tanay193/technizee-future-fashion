import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedBackground, setSelectedBackground] = useState("");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setUploadedImage(previewUrl);
      toast({
        title: "Image uploaded successfully!",
        description: "Ready for AI processing",
      });
    }
  };

  const handleGeneratePhotoshoot = async () => {
    const TRYON_API_URL = ""; // TODO: set your Virtual Try-On API endpoint
    if (!uploadedFile || !selectedModel || !selectedBackground) {
      toast({
        title: "Missing information",
        description: "Please upload a garment image and select model and background",
        variant: "destructive"
      });
      return;
    }

    if (!TRYON_API_URL) {
      toast({
        title: "API not configured",
        description: "Please provide the Virtual Try-On API URL to enable generation.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);
      setGeneratedImages([]);

      const form = new FormData();
      form.append("garment", uploadedFile);
      form.append("model_type", selectedModel);
      form.append("background", selectedBackground);
      form.append("count", String(6));

      const res = await fetch(TRYON_API_URL, {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        throw new Error(`Request failed (${res.status})`);
      }

      const data = await res.json();
      const arr = (data?.images || data?.results || data?.output || []) as string[];
      if (!Array.isArray(arr) || arr.length === 0) {
        throw new Error("No images returned by API");
      }

      const normalized = arr.map((img) => {
        if (typeof img !== "string") return "";
        if (img.startsWith("http") || img.startsWith("data:")) return img;
        return `data:image/png;base64,${img}`;
      }).filter(Boolean) as string[];

      setGeneratedImages(normalized);
      toast({
        title: "Photoshoot ready!",
        description: `Received ${normalized.length} images.`,
      });
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Generation failed",
        description: error?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const modelOptions = [
    { value: "indian_female", label: "Indian Female" },
    { value: "indian_male", label: "Indian Male" },
  ];

  const backgroundOptions = [
    { value: "nature", label: "Nature" },
    { value: "urban", label: "Urban" },
    { value: "studio", label: "Studio" },
  ];


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
            Transform your flat lay or mannequin images into professional model photoshoots. 
            No photographers, no models, just AI magic.
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
              <Label>Product Image (Flat lay or Mannequin)</Label>
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
                    <p className="text-muted-foreground">Drop your product image here</p>
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

            {/* AI Settings */}
            <div className="space-y-4">
              <div>
                <Label>Model Type</Label>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select model type" />
                  </SelectTrigger>
                  <SelectContent>
                    {modelOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Background Style</Label>
                <Select value={selectedBackground} onValueChange={setSelectedBackground}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select background" />
                  </SelectTrigger>
                  <SelectContent>
                    {backgroundOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>


              <Button 
                className="w-full btn-primary mt-6"
                onClick={handleGeneratePhotoshoot}
                disabled={isProcessing || !uploadedFile}
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
            </div>
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
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {generatedImages.map((img, idx) => (
                        <div key={idx} className="space-y-2">
                          <img
                            src={img}
                            alt={`AI generated model ${idx + 1}`}
                            className="w-full h-48 object-cover rounded"
                            loading="lazy"
                          />
                          <Button variant="outline" className="w-full" asChild>
                            <a href={img} download={`ai-photoshoot-${idx + 1}.png`}>
                              <Download className="h-4 w-4 mr-2" />
                              Download
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
                <li>• Use high-resolution product images</li>
                <li>• Ensure good lighting and clear details</li>
                <li>• Flat lay images work better than mannequin shots</li>
                <li>• Choose appropriate model and background combinations</li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIPhotoshoot;