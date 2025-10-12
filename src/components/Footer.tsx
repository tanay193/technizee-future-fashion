import { Instagram, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Logo and description */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">Technizee</h3>
            <p className="text-background/80 mb-4 max-w-md">
              Technizee is an AI-powered fashion technology startup helping brands create realistic product photos and virtual try-ons without costly photoshoots.
            </p>
            <p className="text-background/90 font-semibold mb-4 italic">
              "Bringing creativity and efficiency to fashion with AI."
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/technizee.fashion/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-background/60 hover:text-background transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="https://www.linkedin.com/company/technizee-pvt-ltd"
                target="_blank"
                rel="noopener noreferrer"
                className="text-background/60 hover:text-background transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-6 h-6" />
              </a>
              <a
                href="mailto:marketing@technizee.com"
                className="text-background/60 hover:text-background transition-colors"
                aria-label="Email"
              >
                <Mail className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#services" className="text-background/80 hover:text-background transition-colors">Services</a></li>
              <li><a href="#portfolio" className="text-background/80 hover:text-background transition-colors">Portfolio</a></li>
              <li><a href="#demo" className="text-background/80 hover:text-background transition-colors">Demo</a></li>
              <li><a href="#contact" className="text-background/80 hover:text-background transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="space-y-2 text-background/80">
              <p>marketing@technizee.com</p>
              <p>+916300524710</p>
              <a
                href="#contact"
                className="inline-block bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors mt-4"
              >
                Request Demo
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-background/20 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-background/60 text-sm">
            © 2024 Technizee. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-background/60 hover:text-background text-sm transition-colors">Terms</a>
            <a href="#" className="text-background/60 hover:text-background text-sm transition-colors">Privacy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;