import { useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ShoppingCart, 
  Camera, 
  Upload, 
  Star, 
  ArrowLeft,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { products } from "@/data/products";

const ProductDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [showTryOnModal, setShowTryOnModal] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [tryOnResult, setTryOnResult] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Backend proxy endpoint
  const TRYON_API_URL = "http://localhost:5000/api/virtual-tryon";

  // Find product by route id
  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border">
          <div className="container mx-auto px-6 py-4">
            <Link to="/virtual-tryon" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Store</span>
            </Link>
          </div>
        </header>
        <div className="container mx-auto px-6 py-12">
          Product not found.
        </div>
      </div>
    );
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const urlToBase64 = async (url: string): Promise<string> => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const userImageBase64 = await fileToBase64(file);
    setUploadedImage(userImageBase64);
    setTryOnResult(null);
    setIsProcessing(true);

    try {
      toast({
        title: "Processing virtual try-on...",
        description: "Please wait while we generate your try-on result.",
      });

      const garmentImageBase64 = await urlToBase64(product.images[0]);

      const response = await fetch(TRYON_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_image: userImageBase64,
          garment_image: garmentImageBase64,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Set the result image
      if (result.result_image) {
        setTryOnResult(result.result_image);
      }
      
      setIsProcessing(false);
      
      toast({
        title: "Virtual try-on completed!",
        description: "Your try-on result is ready.",
      });

    } catch (error) {
      console.error("Virtual try-on error:", error);
      setIsProcessing(false);
      toast({
        title: "Try-on failed",
        description: "Please check your connection and try again.",
        variant: "destructive",
      });
    }
  };

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsWebcamActive(true);
      }
    } catch (error) {
      toast({
        title: "Webcam Error",
        description: "Unable to access webcam. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsWebcamActive(false);
    }
  };

  const captureFromWebcam = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      // Ensure video is loaded and has dimensions
      if (context && video.videoWidth > 0 && video.videoHeight > 0) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);

        canvas.toBlob(async (blob) => {
          if (blob) {
            const file = new File([blob], 'webcam-capture.jpg', { type: 'image/jpeg' });
            const capturedImageBase64 = await fileToBase64(file);
            setUploadedImage(capturedImageBase64);
            setTryOnResult(null);
            setIsProcessing(true);
            stopWebcam();

            // Automatically process try-on with captured image
            try {
              toast({
                title: "Processing virtual try-on...",
                description: "Please wait while we generate your try-on result.",
              });

              const garmentImageBase64 = await urlToBase64(product.images[0]);

              const response = await fetch(TRYON_API_URL, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  user_image: capturedImageBase64,
                  garment_image: garmentImageBase64,
                }),
              });

              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }

              const result = await response.json();
              
              if (result.result_image) {
                setTryOnResult(result.result_image);
              }
              
              setIsProcessing(false);
              
              toast({
                title: "Virtual try-on completed!",
                description: "Your try-on result is ready.",
              });

            } catch (error) {
              console.error("Virtual try-on error:", error);
              setIsProcessing(false);
              toast({
                title: "Try-on failed",
                description: "Please check your connection and try again.",
                variant: "destructive",
              });
            }
          }
        }, 'image/jpeg', 0.8);
      } else {
        toast({
          title: "Capture failed",
          description: "Please wait for camera to fully load",
          variant: "destructive",
        });
      }
    }
  };

  const VirtualTryOnModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Virtual Try-On</h2>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setShowTryOnModal(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold">Upload Your Photo</h3>
            <p className="text-sm text-muted-foreground">
              For best results, use a clear full-body photo with plain background
            </p>
            
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              {uploadedImage ? (
                <img 
                  src={uploadedImage} 
                  alt="Uploaded" 
                  className="max-w-full h-40 object-contain mx-auto mb-4"
                />
              ) : (
                <div className="space-y-4">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground">Drop your image here or click to upload</p>
                </div>
              )}
              
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload">
                <Button variant="outline" className="mt-4" asChild>
                  <span className="cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Image
                  </span>
                </Button>
              </label>
              
              <div className="mt-4 space-y-2">
                {!isWebcamActive ? (
                  <Button onClick={startWebcam} className="btn-primary">
                    <Camera className="h-4 w-4 mr-2" />
                    Use Camera
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <Button onClick={captureFromWebcam} className="btn-primary">
                      <Camera className="h-4 w-4 mr-2" />
                      Capture Photo
                    </Button>
                    <Button onClick={stopWebcam} variant="outline">
                      Stop Camera
                    </Button>
                  </div>
                )}
              </div>

              {/* Webcam Video */}
              {isWebcamActive && (
                <div className="mt-4">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    muted 
                    playsInline
                    className="w-full rounded-lg"
                    style={{ transform: 'scaleX(-1)' }}
                  />
                  <canvas ref={canvasRef} className="hidden" />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Try-On Result</h3>
            <div className="border border-border rounded-lg p-8 text-center bg-muted/30">
              {!uploadedImage ? (
                <div className="h-40 flex items-center justify-center">
                  <p className="text-muted-foreground">Upload an image to see virtual try-on</p>
                </div>
              ) : tryOnResult ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Your try-on result:
                  </p>
                  <img 
                    src={tryOnResult} 
                    alt="Virtual try-on result" 
                    className="max-w-full h-40 object-contain mx-auto rounded"
                  />
                </div>
              ) : isProcessing ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Processing your virtual try-on...
                  </p>
                  <div className="h-40 bg-muted rounded flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Click "Choose Image" to start virtual try-on
                  </p>
                  <div className="h-40 bg-muted rounded flex items-center justify-center">
                    <p className="text-muted-foreground">Ready to process</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <Button variant="outline" onClick={() => setShowTryOnModal(false)}>
            Close
          </Button>
          <Button className="btn-primary">
            Save & Add to Cart
          </Button>
        </div>
      </Card>
    </div>
  );

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
            <div className="flex items-center space-x-4">
              <Button variant="outline">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart (0)
              </Button>
              <Link to="/ai-photoshoot">
                <Button className="btn-primary">AI Photoshoot</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden">
              <img 
                src={product.images[0]} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {product.images.slice(1).map((image, index) => (
                <div key={index} className="aspect-square bg-muted rounded overflow-hidden">
                  <img 
                    src={image} 
                    alt={`${product.name} ${index + 2}`}
                    className="w-full h-full object-cover cursor-pointer hover:opacity-80"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-muted-foreground ml-1">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
                <Badge variant="secondary">Best Seller</Badge>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-foreground">{product.price}</span>
                <span className="text-lg text-muted-foreground line-through">
                  {product.originalPrice}
                </span>
                <Badge className="bg-green-100 text-green-800">Best Price</Badge>
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="font-semibold mb-3">Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    className={selectedSize === size ? "btn-primary" : ""}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="font-semibold mb-3">Color</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <Button
                    key={color}
                    variant={selectedColor === color ? "default" : "outline"}
                    className={selectedColor === color ? "btn-primary" : ""}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </Button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                className="w-full btn-primary text-lg py-6"
                onClick={() => setShowTryOnModal(true)}
              >
                <Camera className="h-5 w-5 mr-2" />
                Virtual Try-On
              </Button>
              <Button variant="outline" className="w-full text-lg py-6">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
            </div>

            {/* Product Description */}
            <div>
              <h3 className="font-semibold mb-3">Description</h3>
              <p className="text-muted-foreground mb-4">High-quality product with perfect fit and comfort.</p>
              <ul className="space-y-2">
                {["Premium Fabric", "Pre-shrunk", "Machine Washable", "Eco-friendly"].map((feature, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {showTryOnModal && <VirtualTryOnModal />}
    </div>
  );
};

export default ProductDetail;