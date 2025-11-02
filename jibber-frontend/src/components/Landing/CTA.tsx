import { Button } from '@/components/ui/button.tsx';
import { useNavigate } from 'react-router-dom';

export function CTA() {
  const navigate = useNavigate();

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#5e63f9] to-[#7c7fff]"></div>

      {/* Decorative shapes */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

      <div className="relative z-10 py-20 px-6 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6 p-2 rounded-full bg-white/10 backdrop-blur-sm">
            <div className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white">
              <span className="flex h-2 w-2 rounded-full bg-green-400"></span>
              <span>Join thousands of users worldwide</span>
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to chat securely?
          </h2>

          <p className="text-[#e0e1ff] text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Join thousands of people who trust Jibber for their private
            communications. Start your secure conversation today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-white text-[#5e63f9] hover:bg-gray-100 font-medium px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => navigate('/signup')}
            >
              Get Started Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-medium px-8 py-6 text-lg rounded-full cursor-pointer"
              onClick={scrollToFeatures}
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
