'use client';

import { Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/messages.json';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white selection:bg-indigo-500/30">
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] rounded-full bg-purple-500/10 blur-[120px]" />
      </div>

      <main className="relative grow flex flex-col items-center justify-center px-6 md:px-24 py-20">
        
        <section className="text-center z-10 max-w-4xl mx-auto mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
            Dive into the World of <br className="hidden md:block" /> Anonymous Feedback
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            True Feedback is the bridge between honesty and privacy. 
            Share your thoughts, leave an impact, and keep your identity a secret.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 transition-all duration-300 shadow-lg shadow-indigo-500/20">
              Get Started
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-slate-800 bg-slate-900/50 hover:bg-slate-800 hover:text-white transition-all duration-300 backdrop-blur-sm"
            >
              Learn More
            </Button>
          </div>
        </section>

        <div className="w-full max-w-2xl z-10">
          <Carousel
            plugins={[Autoplay({ delay: 3000 })]}
            className="w-full"
          >
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index} className="p-2">
                  <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-md hover:border-indigo-500/50 transition-colors duration-500">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-indigo-400 text-lg md:text-xl font-semibold">
                        {message.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-start space-x-4">
                      <div className="p-2 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                        <Mail className="w-5 h-5 text-indigo-400 shrink-0" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-slate-300 leading-relaxed italic">
                          &quot;{message.content}&quot;
                        </p>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Received: {message.received}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </main>

      <footer className="relative z-10 text-center py-8 border-t border-slate-900 text-slate-500 text-sm">
        <p>© 2024 True Feedback. Crafted for honest conversations.</p>
      </footer>
    </div>
  );
}