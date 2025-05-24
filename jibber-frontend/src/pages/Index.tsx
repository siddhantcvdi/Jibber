import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { CTA } from "@/components/CTA";
import { Button } from "@/components/ui/button";
import { Lock, Shield, Menu } from "lucide-react";
import jibber from "../assets/jibber-new.png"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


const Index = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string>('hero');


  // Smooth scroll function
  const smoothScroll = (e: React.MouseEvent<HTMLAnchorElement> | React.MouseEvent<HTMLDivElement>, targetId: string) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center'});
    }
  };

  // Add smooth scrolling to all anchor links with hash
  useEffect(() => {
    // This adds smooth scrolling globally to the document
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Intersection Observer to track active section
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { 
        rootMargin: '-20% 0px -80% 0px',
        threshold: 0.1
      }
    );

    // Observe sections
    const sections = ['hero', 'features', 'security', 'about'];
    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
      }
    });
    
    return () => {
      // Clean up when component unmounts
      document.documentElement.style.scrollBehavior = '';
      observer.disconnect();
    };
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col font-[Poppins] bg-background">
      {/* Header */}
      <header className="py-4 px-6 md:px-10 flex items-center justify-between border-b border-white/10 sticky top-0 z-50 glassmorphism-header">
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-[#5e63f9] to-[#7c7fff] p-2 rounded-lg">
            <img src={jibber} alt="Jibber Logo" className="h-6 w-6" />
          </div>
          <span className="font-bold text-xl ml-2 text-foreground">Jibber</span>
        </div>
        
        {/* Desktop navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <nav className="flex items-center space-x-6 mr-6">
            <a 
              href="#features" 
              onClick={(e) => smoothScroll(e, 'features')}
              className={`text-sm font-medium transition-colors duration-200 ${
                activeSection === 'features' 
                  ? 'text-[#5e63f9] font-semibold' 
                  : 'text-muted-foreground hover:text-[#5e63f9]'
              }`}
            >
              Features
            </a>
            <a 
              href="#security" 
              onClick={(e) => smoothScroll(e, 'security')}
              className={`text-sm font-medium transition-colors duration-200 ${
                activeSection === 'security' 
                  ? 'text-[#5e63f9] font-semibold' 
                  : 'text-muted-foreground hover:text-[#5e63f9]'
              }`}
            >
              Security
            </a>
            <a 
              href="#about" 
              onClick={(e) => smoothScroll(e, 'about')}
              className={`text-sm font-medium transition-colors duration-200 ${
                activeSection === 'about' 
                  ? 'text-[#5e63f9] font-semibold' 
                  : 'text-muted-foreground hover:text-[#5e63f9]'
              }`}
            >
              About
            </a>
          </nav>
          
          <ThemeToggle />

          <Button variant="ghost" className="mr-2 cursor-pointer" onClick={() => navigate('/login')}>
            Sign In
          </Button>
          <Button className="bg-gradient-to-r from-[#5e63f9] to-[#7c7fff] cursor-pointer hover:from-[#4f53e6] hover:to-[#6c70e8] text-white" onClick={() => navigate('/signup')}>
            Sign Up
          </Button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="p-2">
                <Menu className="h-6 w-6 text-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 glassmorphism-dropdown">
              <DropdownMenuItem onClick={(e) => smoothScroll(e, 'features')}>
                Features
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => smoothScroll(e, 'security')}>
                Security
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => smoothScroll(e, 'about')}>
                About
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => navigate('/login')}
                className="text-muted-foreground hover:text-foreground hover:bg-muted/50 font-medium"
              >
                Sign In
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => navigate('/signup')}
                className="bg-gradient-to-r from-[#5e63f9] to-[#7c7fff] text-white hover:from-[#4f53e6] hover:to-[#6c70e8] font-semibold border-0 focus:bg-gradient-to-r focus:from-[#4f53e6] focus:to-[#6c70e8] focus:text-white"
              >
                Sign Up
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section id="hero" className="bg-background">
          <div className="max-w-7xl mx-auto">
            <Hero />
          </div>
        </section>

        {/* Feature Section */}
        <section id="features">
          <div className="max-w-7xl mx-auto">
            <Features />
          </div>
        </section>

        {/* Mobile Preview Section */}
        <section id="security" className="py-20 px-4 md:px-6 bg-muted/30 overflow-hidden">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative">
            {/* Decorative elements */}
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-100 dark:bg-blue-900/20 rounded-full opacity-20 blur-3xl"></div>
            
            <div className="md:w-1/2 max-md:text-center relative z-10">
              <span className="inline-block px-4 py-2 rounded-full bg-[#eef0ff] dark:bg-[#2d2f6b] text-[#5e63f9] font-medium text-sm mb-4">Advanced Security</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">Privacy at your fingertips</h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Jibber puts you in control of your digital conversations.
                With our intuitive interface and powerful encryption, your messages
                stay between you and your recipients.
              </p>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="rounded-full p-2 bg-[#eef0ff] dark:bg-[#2d2f6b]">
                      <Shield className="h-5 w-5 text-[#5e63f9]" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium text-foreground">End-to-end encryption</h3>
                    <p className="text-sm text-muted-foreground">Messages cannot be intercepted or read by third parties</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="rounded-full p-2 bg-[#eef0ff] dark:bg-[#2d2f6b]">
                      <Lock className="h-5 w-5 text-[#5e63f9]" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium text-foreground">Enhanced Privacy Controls</h3>
                    <p className="text-sm text-muted-foreground">Customizable privacy settings to protect your conversations</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="rounded-full p-2 bg-[#eef0ff] dark:bg-[#2d2f6b]">
                      <Shield className="h-5 w-5 text-[#5e63f9]" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium text-foreground">No data mining</h3>
                    <p className="text-sm text-muted-foreground">No data mining or advertising based on your messages</p>
                  </div>
                </div>
              </div>
              
              <Button
                className="bg-gradient-to-r from-[#5e63f9] to-[#7c7fff] hover:from-[#4f53e6] hover:to-[#6c70e8] text-white font-medium px-8 py-6 text-lg rounded-full shadow-lg transition-all cursor-pointer"
                onClick={() => navigate('/signup')}
              >
                Get Started
              </Button>
            </div>

            {/* Phone preview - keeping the UI intact */}
            <div className="md:w-1/2 flex justify-center relative z-10">
              {/* Phone frame with shadow and highlights */}
              <div className="relative">
                {/* Floating decorative elements */}
                <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-[#eef0ff] dark:bg-[#2d2f6b] rounded-full blur-2xl opacity-80 z-0"></div>
                <div className="absolute -top-6 -left-6 w-16 h-16 bg-[#eef0ff] dark:bg-[#2d2f6b] rounded-full blur-2xl opacity-80 z-0"></div>
                
                <div className="relative w-[280px] h-[560px] bg-gradient-to-br from-gray-800 to-gray-900 rounded-[54px] p-1.5 shadow-2xl border-[3.5px] border-gray-800 z-10">
                  {/* Notch */}
                  <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-1/3 h-6 bg-gray-900 rounded-xl z-20"></div>
                  
                  {/* Screen content */}
                  <div className="w-full h-full bg-white dark:bg-gray-900 rounded-[48px] overflow-hidden relative z-10">
                    {/* Header */}
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 pt-8 pb-2 flex items-center">
                      <div className="w-8 h-8 rounded-full bg-[#eef0ff] dark:bg-[#2d2f6b] flex items-center justify-center">
                        <span className="text-[#5e63f9] font-bold text-xs">JA</span>
                      </div>
                      <div className="ml-8">
                        <p className="font-medium dark:text-gray-100 text-sm">Jibber Admin</p>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="p-5 h-[395px] overflow-y-auto flex flex-col space-y-5 text-sm">
                      <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-2xl rounded-tl-sm max-w-[80%] self-start dark:text-gray-200 shadow-sm">
                        <p>Hello, how are you?</p>
                        <p className="text-[10px] text-gray-400 mt-1.5">10:30 AM</p>
                      </div>

                      <div className="bg-[#5e63f9] p-3 rounded-2xl rounded-tr-sm max-w-[80%] self-end text-white shadow-sm">
                        <p>I'm good, thanks! How about you?</p>
                        <p className="text-[10px] text-[#e0e1ff] mt-1.5">10:32 AM</p>
                      </div>

                      <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-2xl rounded-tl-sm max-w-[80%] self-start dark:text-gray-200 shadow-sm">
                        <p>I'm doing well too!</p>
                        <p className="text-[10px] text-gray-400 mt-1.5">10:33 AM</p>
                      </div>
                    </div>

                    {/* Input field */}
                    <div className="p-3 dark:border-gray-700 px-4">
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-full flex items-center p-1.5 pl-5 pr-2">
                        <input
                          type="text"
                          placeholder="Type a message..."
                          className="bg-transparent outline-none w-full flex-1 text-sm dark:text-gray-300"
                          readOnly
                        />
                        <button className="bg-[#5e63f9] h-9 w-9 rounded-full flex items-center justify-center ml-1.5 shadow-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                            <path d="M22 2L11 13"></path>
                            <path d="M22 2L15 22L11 13L2 9L22 2Z"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Reflection effect */}
                <div className="absolute inset-0 rounded-[54px] bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-20 pointer-events-none"></div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="about">
          <CTA />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-[#5e63f9] to-[#7c7fff] p-2 rounded-lg">
                  <img src={jibber} alt="Jibber Logo" className="h-6 w-6" />
                </div>
                <span className="font-bold text-xl ml-2">Jibber</span>
              </div>
              <p className="text-gray-400 text-sm mb-6">
                Secure, private and end-to-end encrypted messaging for everyone.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Product</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">Security</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">Privacy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">Roadmap</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Support</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">Status</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Legal</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">Cookie Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">GDPR</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Jibber. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <select className="bg-gray-800 text-gray-400 text-sm py-1 px-2 rounded border border-gray-700">
                <option>English (US)</option>
                <option>Español</option>
                <option>Français</option>
              </select>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;