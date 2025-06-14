import { Button } from '@/components/ui/button';
import jibberold from '../assets/jibber.png';

import { useNavigate } from 'react-router-dom';

export function Hero() {
  const navigate = useNavigate();

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="relative overflow-hidden flex flex-col items-center justify-center py-20 px-4 md:px-6 lg:py-32 text-center">
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-100 dark:bg-blue-900/20 rounded-full opacity-30 blur-3xl"></div>
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-100 dark:bg-purple-900/20 rounded-full opacity-30 blur-3xl"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-center mb-6 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-lg flex items-center">
            <img src={jibberold} alt="" className="h-10 w-10" />
            <h1 className="text-3xl md:text-4xl font-bold ml-2 text-foreground">
              Jibber
            </h1>
          </div>
        </div>

        <div className="space-y-6 max-w-4xl">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 leading-tight text-foreground">
            Private conversations.
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#5e63f9] to-[#a5a8ff] block mt-2">
              End-to-end encrypted.
            </span>
          </h2>

          <p className="md:text-xl text-muted-foreground max-w-3xl mb-8 mx-auto">
            Send messages with confidence. Your conversations are protected with
            military-grade encryption that keeps your data private and secure.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-[#5e63f9] to-[#7c80fa] hover:from-[#4f53e6] hover:to-[#6c70e8] text-white font-medium px-8 py-6 text-lg rounded-full shadow-lg transition-all duration-300 hover:shadow-xl cursor-pointer"
              onClick={() => navigate('/signup')}
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="font-medium px-8 py-6 text-lg rounded-full border-2 hover:bg-accent cursor-pointer"
              onClick={scrollToFeatures}
            >
              Learn More
            </Button>
          </div>

          <div className="pt-6 text-sm text-muted-foreground flex items-center justify-center gap-2 mt-4">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
              <span className="w-2 h-2 mr-1 bg-green-500 rounded-full"></span>
              Secure
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
              <span className="w-2 h-2 mr-1 bg-blue-500 rounded-full"></span>
              Private
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
              <span className="w-2 h-2 mr-1 bg-purple-500 rounded-full"></span>
              Fast
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
