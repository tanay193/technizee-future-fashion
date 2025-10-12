import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, CheckCircle, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CombinedActionSection = () => {
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        name: "",
        brandName: "",
        email: "",
        service: "",
        type: "",
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate files for PoC
        if (formData.type === "poc" && files.length === 0) {
            toast({
                title: "Please upload at least one image for PoC",
                variant: "destructive"
            });
            return;
        }

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("access_key", "65032b0b-8be6-4563-8376-87b6373c3a37");
            formDataToSend.append("name", formData.name);
            formDataToSend.append("brand_name", formData.brandName);
            formDataToSend.append("email", formData.email);
            formDataToSend.append("service", formData.service);
            formDataToSend.append("type", formData.type);
            formDataToSend.append("message", formData.message);

            // Add files
            files.forEach((file, index) => {
                formDataToSend.append(`attachment_${index + 1}`, file);
            });

            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formDataToSend
            });

            const data = await response.json();

            if (data.success) {
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
                        type: "",
                        message: ""
                    });
                    setFiles([]);
                }, 3000);
            } else {
                throw new Error("Submission failed");
            }
        } catch (error) {
            console.error("Form submission error:", error);
            toast({
                title: "Submission Failed",
                description: "There was an error submitting your request. Please try again.",
                variant: "destructive"
            });
        }
    };

    return (
        <section id="contact" className="py-20 bg-muted/30">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16 animate-fade-up">
                    <h2 className="heading-section mb-6">
                        See Technizee in Action
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-4">
                        Ready to transform your fashion brand? Choose how you'd like to get started:
                    </p>
                    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-8 text-left">
                        <div className="card-feature p-6">
                            <h3 className="text-xl font-semibold mb-3">Request a Demo</h3>
                            <p className="text-muted-foreground">
                                See our technology in action with a live walkthrough of AI Photoshoots and Virtual Try-On capabilities.
                            </p>
                        </div>
                        <div className="card-feature p-6">
                            <h3 className="text-xl font-semibold mb-3">Request a Proof of Concept</h3>
                            <p className="text-muted-foreground">
                                Upload your product images and we'll generate sample AI photoshoots or try-on results for your brand.
                            </p>
                        </div>
                    </div>
                    <p className="text-lg text-primary font-semibold mt-6">
                        We respond within 24 hours
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
                                        <Label htmlFor="action-name">Name *</Label>
                                        <Input
                                            id="action-name"
                                            value={formData.name}
                                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="action-brand">Brand Name *</Label>
                                        <Input
                                            id="action-brand"
                                            value={formData.brandName}
                                            onChange={(e) => setFormData(prev => ({ ...prev, brandName: e.target.value }))}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="action-email">Email *</Label>
                                    <Input
                                        id="action-email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                        required
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <Label htmlFor="action-service">Choose Service *</Label>
                                        <Select value={formData.service} onValueChange={(value) => setFormData(prev => ({ ...prev, service: value }))}>
                                            <SelectTrigger id="action-service">
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
                                        <Label htmlFor="action-type">Choose Type *</Label>
                                        <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                                            <SelectTrigger id="action-type">
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="demo">Demo</SelectItem>
                                                <SelectItem value="poc">Proof of Concept</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="action-upload">
                                        Upload Product Images (up to 3) {formData.type === "poc" && "*"}
                                    </Label>
                                    <div className="mt-2">
                                        <label htmlFor="action-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                                                <p className="text-sm text-muted-foreground">
                                                    {files.length > 0 ? `${files.length} file(s) selected` : "Click to upload or drag and drop"}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB each</p>
                                            </div>
                                            <input
                                                id="action-upload"
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                multiple
                                                onChange={handleFileChange}
                                                required={formData.type === "poc"}
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
                                    <Label htmlFor="action-message">Message / Notes</Label>
                                    <Textarea
                                        id="action-message"
                                        rows={4}
                                        value={formData.message}
                                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                                        placeholder="Tell us about your requirements, product types, or any specific requests..."
                                    />
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Button type="submit" className="btn-primary flex-1">
                                        Submit Request
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="btn-outline flex-1"
                                        onClick={() => window.open('https://wa.me/1234567890', '_blank')}
                                    >
                                        <MessageSquare className="mr-2 h-4 w-4" />
                                        WhatsApp
                                    </Button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default CombinedActionSection;