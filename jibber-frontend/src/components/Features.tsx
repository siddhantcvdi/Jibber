import jibber from "../assets/jibber.png"
import { MessageCircle, Lock } from "lucide-react";

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function Feature({ icon, title, description }: FeatureProps) {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-3 bg-[#eef0ff] rounded-full mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

export function Features() {
  return (
    <div className="py-16 px-4 md:px-6 bg-gray-50">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Why Choose Jibber?</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Our platform is built with your privacy as the top priority
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <Feature
          icon={<img src={jibber} alt="Jibber Icon" className="h-6 w-6 text-[#6366c7]" />}
          title="End-to-End Encryption"
          description="Your messages are encrypted on your device and can only be decrypted by the recipient."
        />
        <Feature
          icon={<Lock className="h-6 w-6 text-[#6366c7]" />}
          title="Zero Access"
          description="We can't read your messages even if we wanted to. Your keys never leave your device."
        />
        <Feature
          icon={<MessageCircle className="h-6 w-6 text-[#6366c7]" />}
          title="Seamless Experience"
          description="Enjoy all the features you expect from a modern messaging app, but with added security."
        />
      </div>
    </div>
  );
}
