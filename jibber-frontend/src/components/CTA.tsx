import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <div className="bg-[#6366c7] py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex items-center justify-center mb-6">
          <img src="/lovable-uploads/4f87853d-f43a-489f-8e35-c44bdba29e44.png" alt="Jibber Logo" className="h-10 w-10 invert" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">
          Ready to chat securely?
        </h2>
        <p className="text-[#e0e1ff] text-lg mb-8 max-w-2xl mx-auto">
          Join thousands of people who trust Jibber for their private communications
        </p>
        <Button size="lg" variant="secondary" className="font-medium px-8 py-6 text-lg rounded-full">
          Continue to Jibber
        </Button>
      </div>
    </div>
  );
}
