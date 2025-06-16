import { Hero } from '@/components/Hero';
import { Features } from '@/components/Features';
import { CTA } from '@/components/CTA';
import { Button } from '@/components/ui/button';
import { Lock, Shield, Menu, Eye, Key, Fingerprint, Send } from 'lucide-react';
import jibber from '../assets/jibber-new.png';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Index = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string>('hero');

  // Smooth scroll function
  const smoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement> | React.MouseEvent<HTMLDivElement>,
    targetId: string
  ) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };  // Navigation function for keyboard
  const navigateToSection = (sectionId: string) => {
    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setActiveSection(sectionId);
    }
  };

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';

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
        threshold: 0.1,
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

    // Keyboard navigation
    const handleKeyDown = (event: KeyboardEvent) => {
      const sections = ['hero', 'features', 'security', 'about'];
      const currentIndex = sections.indexOf(activeSection);
      
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        const nextIndex = currentIndex < sections.length - 1 ? currentIndex + 1 : 0;
        navigateToSection(sections[nextIndex]);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : sections.length - 1;
        navigateToSection(sections[prevIndex]);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      // Clean up when component unmounts
      document.documentElement.style.scrollBehavior = '';
      observer.disconnect();
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeSection]);
  return (
    <div className="min-h-screen flex flex-col font-[Poppins] bg-background">
      {/* Header */}
      <header className="py-4 glassmorphism-header px-6 md:px-10 flex items-center justify-between border-b border-border sticky top-0 z-50 bg-background/95 backdrop-blur-sm">
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
              className={`text-sm font-medium transition-colors duration-200 cursor-pointer ${
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
              className={`text-sm font-medium transition-colors duration-200 cursor-pointer ${
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
              className={`text-sm font-medium transition-colors duration-200 cursor-pointer ${
                activeSection === 'about'
                  ? 'text-[#5e63f9] font-semibold'
                  : 'text-muted-foreground hover:text-[#5e63f9]'
              }`}
            >
              About
            </a>
          </nav>

          <ThemeToggle />

          <Button
            variant="ghost"
            className="mr-2 cursor-pointer"
            onClick={() => navigate('/login')}
          >
            Sign In
          </Button>
          <Button
            className="bg-gradient-to-r from-[#5e63f9] to-[#7c7fff] cursor-pointer hover:from-[#4f53e6] hover:to-[#6c70e8] text-white"
            onClick={() => navigate('/signup')}
          >
            Sign Up
          </Button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="p-2 cursor-pointer">
                <Menu className="h-6 w-6 text-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 p-2">
              <DropdownMenuItem
                onClick={(e) => smoothScroll(e, 'features')}
                className="p-2 cursor-pointer"
              >
                Features
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => smoothScroll(e, 'security')}
                className="p-2 cursor-pointer"
              >
                Security
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => smoothScroll(e, 'about')}
                className="p-2 cursor-pointer"
              >
                About
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigate('/login')}
                className="text-muted-foreground p-2 hover:text-foreground hover:bg-muted/50 font-medium cursor-pointer"
              >
                Sign In
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate('/signup')}
                className="bg-gradient-to-r from-[#5e63f9] p-2 to-[#7c7fff] text-white hover:from-[#4f53e6] hover:to-[#6c70e8] font-semibold border-0 focus:bg-gradient-to-r focus:from-[#4f53e6] focus:to-[#6c70e8] focus:text-white cursor-pointer"
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

        {/* Security Section */}
        <section
          id="security"
          className="py-12 md:py-20 px-4 md:px-6 bg-muted/30 overflow-hidden"
        >
          <div className="max-w-7xl mx-auto">
            {/* Decorative elements */}
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-100 dark:bg-blue-900/20 rounded-full opacity-20 blur-3xl"></div>

            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 relative">
              <div className="w-full lg:w-1/2 text-center lg:text-left relative z-10">
                <span className="inline-block px-3 py-1.5 rounded-full bg-[#eef0ff] dark:bg-[#2d2f6b] text-[#5e63f9] font-medium text-xs sm:text-sm mb-4">
                  Military-Grade Security
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 lg:mb-6 text-foreground">
                  Advanced Cryptography
                </h2>
                <p className="text-muted-foreground mb-6 lg:mb-8 text-sm sm:text-base lg:text-lg max-w-lg mx-auto lg:mx-0">
                  Enterprise-grade security with zero-knowledge authentication
                  and end-to-end encryption.
                </p>

                {/* Compact Security Features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 mb-6 lg:mb-8">
                  <div className="flex items-center p-3 bg-background/50 dark:bg-card/50 rounded-xl border border-border/50">
                    <div className="flex-shrink-0 p-2 bg-gradient-to-r from-[#eef0ff] to-[#f0f2ff] dark:from-[#2d2f6b] dark:to-[#373a85] rounded-lg mr-3">
                      <Eye className="h-4 w-4 text-[#5e63f9]" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-foreground text-sm">
                        Zero-Knowledge Auth
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        OPAQUE protocol
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center p-3 bg-background/50 dark:bg-card/50 rounded-xl border border-border/50">
                    <div className="flex-shrink-0 p-2 bg-gradient-to-r from-[#eef0ff] to-[#f0f2ff] dark:from-[#2d2f6b] dark:to-[#373a85] rounded-lg mr-3">
                      <Key className="h-4 w-4 text-[#5e63f9]" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-foreground text-sm">
                        ECDH P-256
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Perfect forward secrecy
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center p-3 bg-background/50 dark:bg-card/50 rounded-xl border border-border/50">
                    <div className="flex-shrink-0 p-2 bg-gradient-to-r from-[#eef0ff] to-[#f0f2ff] dark:from-[#2d2f6b] dark:to-[#373a85] rounded-lg mr-3">
                      <Fingerprint className="h-4 w-4 text-[#5e63f9]" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-foreground text-sm">
                        Ed25519 Signatures
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Message verification
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center p-3 bg-background/50 dark:bg-card/50 rounded-xl border border-border/50">
                    <div className="flex-shrink-0 p-2 bg-gradient-to-r from-[#eef0ff] to-[#f0f2ff] dark:from-[#2d2f6b] dark:to-[#373a85] rounded-lg mr-3">
                      <Shield className="h-4 w-4 text-[#5e63f9]" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-foreground text-sm">
                        AES-256-GCM
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Authenticated encryption
                      </p>
                    </div>
                  </div>
                </div>

                {/* Compact Specs */}
                <div className="bg-gradient-to-r from-[#f8f9ff] to-[#f0f2ff] dark:from-[#1a1b2e] dark:to-[#1e1f3a] rounded-xl p-4 mb-6 lg:mb-8 border border-[#e0e3ff] dark:border-[#2d2f6b]">
                  <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                    <div className="text-center">
                      <div className="font-mono text-[#5e63f9] font-bold">
                        256-bit
                      </div>
                      <span className="text-muted-foreground">Encryption</span>
                    </div>
                    <div className="text-center">
                      <div className="font-mono text-[#5e63f9] font-bold">
                        Ed25519
                      </div>
                      <span className="text-muted-foreground">Signatures</span>
                    </div>
                    <div className="text-center">
                      <div className="font-mono text-[#5e63f9] font-bold">
                        P-256
                      </div>
                      <span className="text-muted-foreground">ECDH</span>
                    </div>
                    <div className="text-center">
                      <div className="font-mono text-[#5e63f9] font-bold">
                        OPAQUE
                      </div>
                      <span className="text-muted-foreground">Zero-KN</span>
                    </div>
                  </div>
                </div>

                <Button
                  className="bg-gradient-to-r from-[#5e63f9] to-[#7c7fff] hover:from-[#4f53e6] hover:to-[#6c70e8] text-white font-medium px-6 py-3 text-sm sm:text-base rounded-full shadow-lg transition-all cursor-pointer w-full sm:w-auto"
                  onClick={() => navigate('/signup')}
                >
                  Try Secure Messaging
                </Button>
              </div>

              {/* Enhanced Mobile Visualization */}
              <div className="w-full lg:w-1/2 flex justify-center relative z-10 mt-8 lg:mt-0">
                <div className="relative">
                  {/* Responsive Phone Frame */}
                  <div className="relative w-[240px] sm:w-[280px] h-[480px] sm:h-[560px] bg-gradient-to-br from-gray-800 to-gray-900 rounded-[45px] sm:rounded-[54px] p-1.5 shadow-2xl border-[3px] sm:border-[3.5px] border-gray-800 z-10">
                    {/* Notch */}
                    <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-1/3 h-5 sm:h-6 bg-gray-900 rounded-xl z-20"></div>

                    {/* Screen content */}
                    <div className="w-full h-full bg-white dark:bg-gray-900 rounded-[40px] sm:rounded-[48px] overflow-hidden relative z-10">
                      {/* Header with security indicator */}
                      <div className="bg-gray-100 dark:bg-gray-800 p-3 sm:p-3 pt-8 sm:pt-9   pb-2 flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-[#eef0ff] to-[#f0f2ff] dark:from-[#2d2f6b] dark:to-[#373a85] flex items-center justify-center">
                            <span className="text-[#5e63f9] font-bold text-xs">
                              JA
                            </span>
                          </div>
                          <div className="ml-2 sm:ml-3">
                            <p className="font-medium dark:text-gray-100 text-xs sm:text-sm">
                              Jibber Admin
                            </p>
                            <div className="flex items-center">
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500 mr-1"></div>
                              <span className="text-[10px] text-green-600 dark:text-green-400">
                                E2E Encrypted
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-[#5e63f9]" />
                          <Lock className="h-3 w-3 sm:h-4 sm:w-4 text-[#5e63f9]" />
                        </div>
                      </div>

                      {/* Messages with crypto indicators */}
                      <div className="p-3 sm:p-5 h-[340px] sm:h-[380px] overflow-y-auto flex flex-col space-y-3 sm:space-y-5 text-xs sm:text-sm">
                        <div className="bg-gray-100 dark:bg-gray-800 p-2 sm:p-3 rounded-xl sm:rounded-2xl rounded-tl-sm max-w-[85%] self-start dark:text-gray-200 shadow-sm">
                          <p>Hello, how are you?</p>
                          <div className="flex items-center justify-between mt-1 sm:mt-2">
                            <p className="text-[9px] sm:text-[10px] text-gray-400">
                              10:30 AM
                            </p>
                            <div className="flex items-center space-x-1">
                              <div className="w-1 h-1 rounded-full bg-green-500"></div>
                              <span className="text-[8px] sm:text-[9px] text-green-600">
                                Verified
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-[#5e63f9] p-2 sm:p-3 rounded-xl sm:rounded-2xl rounded-tr-sm max-w-[85%] self-end text-white shadow-sm">
                          <p>I'm good, thanks!</p>
                          <div className="flex items-center justify-between mt-1 sm:mt-2">
                            <p className="text-[9px] sm:text-[10px] text-[#e0e1ff]">
                              10:32 AM
                            </p>
                            <div className="flex items-center space-x-1">
                              <Fingerprint className="h-1.5 w-1.5 sm:h-2 sm:w-2 text-[#e0e1ff]" />
                              <span className="text-[8px] sm:text-[9px] text-[#e0e1ff]">
                                Signed
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-100 dark:bg-gray-800 p-2 sm:p-3 rounded-xl sm:rounded-2xl rounded-tl-sm max-w-[85%] self-start dark:text-gray-200 shadow-sm">
                          <p>Encryption working perfectly!</p>
                          <div className="flex items-center justify-between mt-1 sm:mt-2">
                            <p className="text-[9px] sm:text-[10px] text-gray-400">
                              10:33 AM
                            </p>
                            <div className="flex items-center space-x-1">
                              <Key className="h-1.5 w-1.5 sm:h-2 sm:w-2 text-green-600" />
                              <span className="text-[8px] sm:text-[9px] text-green-600">
                                ECDH
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-2 sm:p-3 px-3 sm:px-4">
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-full flex items-center p-1 sm:p-1.5 pl-3 sm:pl-5 pr-1 sm:pr-2 border border-[#5e63f9]/20">
                          <input
                            type="text"
                            placeholder=""
                            className="bg-transparent outline-none w-full flex-1 text-xs sm:text-sm text-gray-600 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500"
                            readOnly
                          />

                          <button className="bg-gradient-to-r from-[#5e63f9] to-[#7c7fff] hover:from-[#4f53e6] hover:to-[#6c70e8] h-7 w-7 sm:h-9 sm:w-9 rounded-full flex items-center justify-center shadow-sm transition-all duration-200">
                            <Send className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced reflection effect */}
                  <div className="absolute inset-0 rounded-[45px] sm:rounded-[54px] bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-20 pointer-events-none"></div>
                </div>
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
                <a
                  href="#"
                  className="text-gray-400 hover:text-white cursor-pointer"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white cursor-pointer"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white cursor-pointer"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
                Product
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm cursor-pointer"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm cursor-pointer"
                  >
                    Security
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm cursor-pointer"
                  >
                    Privacy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm cursor-pointer"
                  >
                    Roadmap
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
                Support
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm cursor-pointer"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm cursor-pointer"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm cursor-pointer"
                  >
                    Status
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm cursor-pointer"
                  >
                    Documentation
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
                Legal
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm cursor-pointer"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm cursor-pointer"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm cursor-pointer"
                  >
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm cursor-pointer"
                  >
                    GDPR
                  </a>
                </li>
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
