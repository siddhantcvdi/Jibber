import { Button } from "@/components/ui/button";
export function CTA() {
  return (
    <div className="bg-[#5e63f9] py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex items-center justify-center mb-6">
          <h1 className="text-3xl font-bold text-white">Jibber</h1>
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
