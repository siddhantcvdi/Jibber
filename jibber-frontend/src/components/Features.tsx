import { Check, Key, Fingerprint, Eye } from "lucide-react";
import { useState } from "react";

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  highlightPoints?: string[];
}

function Feature({ icon, title, description, color, highlightPoints = [] }: FeatureProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="flex flex-col p-6 bg-background dark:bg-card rounded-2xl shadow-md border border-border hover:shadow-lg transition-all duration-300 hover:translate-y-[-3px] group relative overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-3 transition-opacity duration-400 ${color}`}></div>
      
      <div className={`absolute top-0 left-0 right-0 h-1 ${color} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-400 ease-in-out`}></div>
      
      <div className="flex items-start">
        <div className={`p-4 bg-gradient-to-br from-[#eef0ff] to-[#f5f6ff] dark:from-[#2d2f6b]/70 dark:to-[#373a85]/70 rounded-2xl shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform duration-300 ${isHovered ? 'ring-1 ring-opacity-40' : ''} ring-[#5e63f9]`}>
          {icon}
        </div>
        
        <div className="ml-5">
          <h3 className="text-xl font-bold mb-2 text-foreground">{title}</h3>
          <p className="text-muted-foreground text-sm">{description}</p>
          
          {highlightPoints.length > 0 && (
            <ul className="space-y-2 mt-3">
              {highlightPoints.map((point, index) => (
                <li key={index} className="flex items-center text-xs">
                  <Check className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-muted-foreground">{point}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export function Features() {
  return (
    <div className="py-16 px-4 md:px-6 bg-gradient-to-b from-muted/50 to-background relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#5e63f9] to-transparent opacity-20"></div>
      <div className="absolute -top-40 right-20 w-64 h-64 bg-purple-50 dark:bg-purple-900/10 rounded-full blur-3xl opacity-30"></div>
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 relative z-10">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#eef0ff] dark:bg-[#2d2f6b] mb-4 cursor-pointer hover:bg-[#e9ecff] dark:hover:bg-[#34377c] transition-colors duration-300">
            <span className="animate-pulse w-2 h-2 rounded-full bg-[#5e63f9] mr-2"></span>
            <span className="text-[#5e63f9] font-medium text-sm">Advanced Cryptography</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Military-Grade Security</h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-6">
            Powered by cutting-edge cryptographic protocols that ensure your privacy and security at every level.
          </p>
          
          <div className="h-1 w-20 bg-gradient-to-r from-[#5e63f9] to-[#a5a8ff] mx-auto mb-6 rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto relative z-10">
          <Feature
            icon={<Eye className="h-8 w-8 text-[#5e63f9]" />}
            title="Zero Knowledge Auth"
            description="OPAQUE protocol ensures passwords never leave your device, even during authentication."
            color="text-blue-600"
            highlightPoints={[
              "OPAQUE protocol implementation",
              "Password-authenticated key exchange",
              "No password transmission to server"
            ]}
          />
          <Feature
            icon={<Key className="h-8 w-8 text-[#5e63f9]" />}
            title="ECDH Key Exchange"
            description="Elliptic Curve Diffie-Hellman for secure end-to-end encryption key generation."
            color="text-purple-600"
            highlightPoints={[
              "P-256 elliptic curve cryptography",
              "Perfect forward secrecy",
              "Ephemeral key generation"
            ]}
          />
          <Feature
            icon={<Fingerprint className="h-8 w-8 text-[#5e63f9]" />}
            title="Ed25519 Signatures"
            description="EdDSA digital signatures for message authenticity and integrity verification."
            color="text-indigo-600"
            highlightPoints={[
              "Edwards-curve digital signatures",
              "Message integrity verification",
              "Non-repudiation guarantee"
            ]}
          />
        </div>
       
        
        <div className="mt-14 bg-background dark:bg-card rounded-2xl shadow-md border border-border p-6 max-w-6xl mx-auto relative cursor-pointer hover:shadow-lg transition-all duration-300">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#5e63f9] to-[#7c7fff] opacity-5 rounded-2xl"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
            <div className="text-center p-3 hover:transform hover:scale-105 transition-transform duration-300">
              <div className="text-3xl font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-[#5e63f9] to-[#7c7fff]">256-bit</div>
              <p className="text-muted-foreground text-sm">AES encryption</p>
            </div>
            <div className="text-center p-3 border-t md:border-t-0 md:border-l border-border hover:transform hover:scale-105 transition-transform duration-300">
              <div className="text-3xl font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-[#5e63f9] to-[#7c7fff]">P-256</div>
              <p className="text-muted-foreground text-sm">Elliptic curve</p>
            </div>
            <div className="text-center p-3 border-t md:border-t-0 md:border-l border-border hover:transform hover:scale-105 transition-transform duration-300">
              <div className="text-3xl font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-[#5e63f9] to-[#7c7fff]">Ed25519</div>
              <p className="text-muted-foreground text-sm">Digital signatures</p>
            </div>
            <div className="text-center p-3 border-t md:border-t-0 md:border-l border-border hover:transform hover:scale-105 transition-transform duration-300">
              <div className="text-3xl font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-[#5e63f9] to-[#7c7fff]">OPAQUE</div>
              <p className="text-muted-foreground text-sm">Zero-knowledge auth</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
