import { Button } from "@/components/ui/button";
import jibber from '../assets/jibber.png'

export function Hero() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 md:px-6 lg:py-24 text-center">
      <div className="flex items-center justify-center mb-6">
        <img src={jibber} alt="" className="h-10 w-10"/>
        <h1 className="text-3xl md:text-4xl font-bold">Jibber</h1>
      </div>
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
        Private conversations.
        <h2 className="text-[#5e63f9] text-3xl md:text-4xl"> End-to-end encrypted.</h2>
      </h2>
      <p className=" md:text-xl text-muted-foreground max-w-3xl mb-8 ">
        Send messages with confidence. Your conversations are protected with military-grade encryption
        that keeps your data private and secure.
      </p>
      <Button size="lg" className="bg-[#5e63f9] cursor-pointer hover:bg-[rgb(83,88,247)] text-white font-medium px-8 py-6 text-lg rounded-full">
        Continue
      </Button>
    </div>
  );
}
