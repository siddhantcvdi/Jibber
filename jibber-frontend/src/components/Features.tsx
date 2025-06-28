import { Smartphone, Monitor, Shield, Phone} from 'lucide-react';

export function Features() {
  return (
    <div className="py-16 px-4 md:px-6 bg-muted/50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-[#5e63f9] opacity-20"></div>
      <div className="absolute -top-40 right-20 w-64 h-64 bg-purple-50 dark:bg-purple-900/10 rounded-full blur-3xl opacity-30"></div>

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16 relative z-10">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#eef0ff] dark:bg-[#2d2f6b] mb-4 cursor-pointer hover:bg-[#e9ecff] dark:hover:bg-[#34377c] transition-colors duration-300">
            <span className="animate-pulse w-2 h-2 rounded-full bg-[#5e63f9] mr-2"></span>
            <span className="text-[#5e63f9] font-medium text-sm">
              Why Choose Jibber
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Designed for Modern Communication
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-6">
            Experience seamless, secure messaging that works everywhere you do.
          </p>

          <div className="h-1 w-20 bg-[#5e63f9] mx-auto mb-6 rounded-full"></div>
        </div>

        <div className="relative rounded-2xl overflow-hidden bg-[#f8f9ff] dark:bg-[#1a1d3a] shadow-2xl">
          <div className="relative min-h-[500px] lg:min-h-[600px] flex">
            <div className="relative w-full lg:w-2/3 overflow-hidden">
              <img
                src="/desktop-app-ss.png"
                alt="Jibber Desktop App"
                className="absolute inset-0 w-full h-full object-cover object-left dark:hidden"
              />
              
              <img
                src="/desktop-app-dark-ss.png"
                alt="Jibber Desktop App Dark Mode"
                className="absolute inset-0 w-full h-full object-cover object-left hidden dark:block"
              />
            </div>

            {/* Features Overlay - Right Third */}
            <div className="absolute right-0 top-0 bottom-0 w-full lg:w-1/3 bg-background/95 lg:backdrop-blur-sm shadow-2xl lg:shadow-[-20px_0_40px_-10px_rgba(0,0,0,0.25)] ">
              <div className="h-full border-l-0 flex flex-col justify-center p-6 lg:p-8">
                <div className="space-y-6">

                  {/* Feature 1 */}
                  <div className="flex items-start space-x-4 group">
                    <div className="flex-shrink-0 p-3 bg-[#eef0ff] dark:bg-[#2d2f6b]/70 rounded-xl">
                      <Smartphone className="h-6 w-6 text-[#5e63f9]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Fluid & Modern UI</h3>
                      <p className="text-sm text-muted-foreground">Beautiful interface that feels native on every platform</p>
                    </div>
                  </div>

                  {/* Feature 2 */}
                  <div className="flex items-start space-x-4 group">
                    <div className="flex-shrink-0 p-3 bg-[#eef0ff] dark:bg-[#2d2f6b]/70 rounded-xl">
                      <Shield className="h-6 w-6 text-[#5e63f9]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Zero Server Knowledge</h3>
                      <p className="text-sm text-muted-foreground">Your raw private data never reaches our servers</p>
                    </div>
                  </div>

                  {/* Feature 3 */}
                  <div className="flex items-start space-x-4 group">
                    <div className="flex-shrink-0 p-3 bg-[#eef0ff] dark:bg-[#2d2f6b]/70 rounded-xl">
                      <Monitor className="h-6 w-6 text-[#5e63f9]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Cross-Platform Ready</h3>
                      <p className="text-sm text-muted-foreground">Built to work smoothly on mobiles and desktops</p>
                    </div>
                  </div>

                  {/* Feature 4 */}
                  <div className="flex items-start space-x-4 group">
                    <div className="flex-shrink-0 p-3 bg-[#eef0ff] dark:bg-[#2d2f6b]/70 rounded-xl">
                      <Phone className="h-6 w-6 text-[#5e63f9]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Seamless Calls</h3>
                      <p className="text-sm text-muted-foreground">End-to-end encrypted voice calls</p>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#5e63f9] mb-1">
              100%
            </div>
            <p className="text-sm text-muted-foreground">Private</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#5e63f9] mb-1">
              0ms
            </div>
            <p className="text-sm text-muted-foreground">Latency</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#5e63f9] mb-1">
              ∞
            </div>
            <p className="text-sm text-muted-foreground">Messages</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#5e63f9] mb-1">
              24/7
            </div>
            <p className="text-sm text-muted-foreground">Available</p>
          </div>
        </div>
      </div>
    </div>
  );
}
