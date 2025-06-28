import { Hero } from '@/components/Hero';
import { Features } from '@/components/Features';
import { CTA } from '@/components/CTA';
import { Button } from '@/components/ui/button';
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
import { Menu } from 'lucide-react';
import Security from '@/components/Security';
import Footer from '@/components/Footer';

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
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };  // Navigation function for keyboard
  const navigateToSection = (sectionId: string) => {
    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
          <div className=" mx-auto">
            <Hero />
          </div>
        </section>

        {/* Feature Section */}
        <section id="features">
          <div className=" mx-auto">
            <Features />
          </div>
        </section>

        {/* Security Section */}
        <section id="security" className="py-12 md:py-20 px-4 md:px-6 bg-muted/30 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <Security/>
          </div>
        </section>

        <section id="about">
          <CTA />
        </section>
      </main>
              
      <Footer/> 
    </div>
  );
};

export default Index;
