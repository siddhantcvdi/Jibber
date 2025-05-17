import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 md:px-6 lg:py-24 text-center">
      <div className="flex items-center justify-center mb-6">
        <img src="/lovable-uploads/4f87853d-f43a-489f-8e35-c44bdba29e44.png" alt="Jibber Logo" className="h-16 w-16" />
        <h1 className="text-3xl md:text-4xl font-bold ml-2">Jibber</h1>
      </div>
      <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
        Private conversations.
        <span className="text-[#6366c7]"> End-to-end encrypted.</span>
      </h2>
      <p className="text-xl text-muted-foreground max-w-3xl mb-8">
        Send messages with confidence. Your conversations are protected with military-grade encryption
        that keeps your data private and secure.
      </p>
      <Button size="lg" className="bg-[#6366c7] hover:bg-[#5355ab] text-white font-medium px-8 py-6 text-lg rounded-full">
        Continue
      </Button>
    </div>
  );
}
