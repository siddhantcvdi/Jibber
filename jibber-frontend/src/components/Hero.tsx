import { Button } from "@/components/ui/button";


export function Hero() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 md:px-6 lg:py-24 text-center">
      <div className="flex items-center justify-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold">Jibber</h1>
      </div>
      <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
        Private conversations.
        <span className="text-[#5e63f9]"> End-to-end encrypted.</span>
      </h2>
      <p className="text-xl text-muted-foreground max-w-3xl mb-8">
        Send messages with confidence. Your conversations are protected with military-grade encryption
        that keeps your data private and secure.
      </p>
      <Button size="lg" className="bg-[#5e63f9] cursor-pointer hover:bg-[rgb(83,88,247)] text-white font-medium px-8 py-6 text-lg rounded-full">
        Continue
      </Button>
    </div>
  );
}
