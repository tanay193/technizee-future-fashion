import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PoCSection = () => {
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        name: "",
        brandName: "",
        email: "",
        service: "",
        message: ""
    });
    const [files, setFiles] = useState<File[]>([]);
    const [submitted, setSubmitted] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files).slice(0, 3);
            setFiles(selectedFiles);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate files
        if (files.length === 0) {
            toast({
                title: "Please upload at least one image",
                variant: "destructive"
            });
            return;
        }

        // Here you would typically send to an API endpoint
        console.log("PoC Request:", formData, files);

        setSubmitted(true);
        toast({
            title: "Request Submitted!",
            description: "Our team will process your request and get back within 24 hours."
        });

        // Reset form after 3 seconds
        setTimeout(() => {
            setSubmitted(false);
            setFormData({
                name: "",
                brandName: "",
                email: "",
                service: "",
                message: ""
            });
            setFiles([]);
        }, 3000);
    };

    return (
        <section id="poc" className="py-20 bg-background">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16 animate-fade-up">
                    <h2 className="heading-section mb-6">
                        Request a Proof of Concept
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        Want to see how your brand's clothing looks in AI Photoshoots or Virtual Try-On? Upload a few product images, and we'll generate sample outputs for you.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto">
                    {submitted ? (
                        <div className="card-feature text-center py-12 animate-scale-in">
                            <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
                            <h3 className="text-2xl font-semibold mb-3">Thank You!</h3>
                            <p className="text-muted-foreground text-lg">
                                Our team will process your request and get back within 24 hours.
                            </p>
                        </div>
                    ) : (
                        <div className="card-feature">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <Label htmlFor="poc-name">Name *</Label>
                                        <Input
                                            id="poc-name"
                                            value={formData.name}
                                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="poc-brand">Brand Name *</Label>
                                        <Input
                                            id="poc-brand"
                                            value={formData.brandName}
                                            onChange={(e) => setFormData(prev => ({ ...prev, brandName: e.target.value }))}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="poc-email">Email *</Label>
                                    <Input
                                        id="poc-email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="poc-service">Choose Service *</Label>
                                    <Select value={formData.service} onValueChange={(value) => setFormData(prev => ({ ...prev, service: value }))}>
                                        <SelectTrigger id="poc-service">
                                            <SelectValue placeholder="Select a service" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ai-photoshoot">AI Photoshoot</SelectItem>
                                            <SelectItem value="virtual-tryon">Virtual Try-On</SelectItem>
                                            <SelectItem value="both">Both Services</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="poc-upload">Upload Product Images (up to 3) *</Label>
                                    <div className="mt-2">
                                        <label htmlFor="poc-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                                                <p className="text-sm text-muted-foreground">
                                                    {files.length > 0 ? `${files.length} file(s) selected` : "Click to upload or drag and drop"}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB each</p>
                                            </div>
                                            <input
                                                id="poc-upload"
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                multiple
                                                onChange={handleFileChange}
                                                required
                                            />
                                        </label>
                                        {files.length > 0 && (
                                            <div className="mt-3 space-y-1">
                                                {files.map((file, index) => (
                                                    <p key={index} className="text-sm text-muted-foreground">
                                                        {index + 1}. {file.name}
                                                    </p>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        Uploaded images will be processed securely and deleted automatically after preview generation.
                                    </p>
                                </div>

                                <div>
                                    <Label htmlFor="poc-message">Message / Notes</Label>
                                    <Textarea
                                        id="poc-message"
                                        rows={4}
                                        value={formData.message}
                                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                                        placeholder="Tell us about your requirements, product types, or any specific requests..."
                                    />
                                </div>

                                <Button type="submit" className="btn-primary w-full">
                                    Submit PoC Request
                                </Button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default PoCSection;