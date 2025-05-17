import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { CTA } from "@/components/CTA";
import { Button } from "@/components/ui/button";
import { Lock, MessageCircle } from "lucide-react";

const Index = () => {
  const handleContinue = () => {
    // Handle navigation or sign-up here
    console.log("Continue button clicked");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="py-4 px-6 flex items-center justify-between border-b">
        <div className="flex items-center">
          <img src="/lovable-uploads/4f87853d-f43a-489f-8e35-c44bdba29e44.png" alt="Jibber Logo" className="h-8 w-8" />
          <span className="font-bold text-xl ml-2">Jibber</span>
        </div>
        <div>
          <Button variant="ghost" className="mr-2">Sign In</Button>
          <Button className="bg-[#6366c7] hover:bg-[#5355ab] text-white">Sign Up</Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-7xl mx-auto">
            <Hero />
          </div>
        </section>

        {/* Feature Section */}
        <section>
          <div className="max-w-7xl mx-auto">
            <Features />
          </div>
        </section>

        {/* Mobile Preview Section */}
        <section className="py-16 px-4 md:px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-4">Privacy at your fingertips</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Jibber puts you in control of your digital conversations. 
                With our intuitive interface and powerful encryption, your messages 
                stay between you and your recipients.
              </p>
              <div className="flex items-center mb-4">
                <Lock className="h-5 w-5 text-[#6366c7] mr-2" />
                <span>Messages cannot be intercepted or read by third parties</span>
              </div>
              <div className="flex items-center mb-4">
                <Lock className="h-5 w-5 text-[#6366c7] mr-2" />
                <span>Automated deletion options for sensitive conversations</span>
              </div>
              <div className="flex items-center mb-4">
                <Lock className="h-5 w-5 text-[#6366c7] mr-2" />
                <span>No data mining or advertising based on your messages</span>
              </div>
              <Button 
                className="mt-4 bg-[#6366c7] hover:bg-[#5355ab] text-white rounded-full px-8"
                onClick={handleContinue}
              >
                Continue
              </Button>
            </div>
            <div className="md:w-1/2 flex justify-center mt-8 md:mt-0">
              <div className="relative w-[280px] h-[560px] bg-gray-900 rounded-[36px] p-3 shadow-xl border-4 border-gray-800">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-6 bg-gray-800 rounded-b-xl"></div>
                <div className="w-full h-full bg-white rounded-[28px] overflow-hidden">
                  {/* Header */}
                  <div className="bg-gray-100 p-4 flex items-center">
                    <div className="w-8 h-8 rounded-full bg-[#eef0ff] flex items-center justify-center">
                      <span className="text-[#6366c7] font-bold">DD</span>
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">Donald Duck</p>
                    </div>
                  </div>
                  
                  {/* Messages */}
                  <div className="p-4 h-[460px] overflow-y-auto flex flex-col space-y-4">
                    <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-none max-w-[80%] self-start">
                      <p>Hello, how are you?</p>
                      <p className="text-xs text-gray-400 mt-1">10:30 AM</p>
                    </div>
                    
                    <div className="bg-[#6366c7] p-3 rounded-2xl rounded-tr-none max-w-[80%] self-end text-white">
                      <p>I'm good, thanks! How about you?</p>
                      <p className="text-xs text-[#e0e1ff] mt-1">10:32 AM</p>
                    </div>
                    
                    <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-none max-w-[80%] self-start">
                      <p>I'm doing well too!</p>
                      <p className="text-xs text-gray-400 mt-1">10:33 AM</p>
                    </div>
                  </div>
                  
                  {/* Input field */}
                  <div className="p-4 border-t">
                    <div className="bg-gray-100 rounded-full flex items-center p-1 pl-4">
                      <input 
                        type="text" 
                        placeholder="Type a message..." 
                        className="bg-transparent outline-none flex-1 text-sm"
                        readOnly
                      />
                      <button className="bg-[#6366c7] h-8 w-8 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                          <path d="M22 2L11 13"></path>
                          <path d="M22 2L15 22L11 13L2 9L22 2Z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section>
          <CTA />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <img src="/lovable-uploads/4f87853d-f43a-489f-8e35-c44bdba29e44.png" alt="Jibber Logo" className="h-6 w-6 invert" />
            <span className="font-bold text-xl ml-2">Jibber</span>
          </div>
          <div className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Jibber. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;