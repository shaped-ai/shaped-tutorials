"use client";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const Header = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  const handleRefresh = () => {
    window.location.reload();
  };

  if (!mounted) {
    return (
      <header className="mb-4 sm:mb-8 relative">
        {/* Logo - Default to light mode during SSR */}
        <div className="mb-6">
          <Image
            src="/Shaped-logo-horizontal-black.svg"
            alt="Shaped"
            width={120}
            height={40}
            className="h-8 w-auto"
          />
        </div>
        
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-primary">Discover your next favorite movie</h1>
            <p className="text-sm sm:text-base text-muted-foreground mb-4">Personalized movie recommendations, powered by the Shaped relevance database. Browse the catalog of 9,000 movies and 100,000 user ratings (MovieLens dataset).</p>
            
            {/* Learn How Button */}
            <Button
              className="bg-[#D96DFD] hover:bg-[#D96DFD]/90 text-white border-[#D96DFD] hover:text-white"
              onClick={() => window.open("https://www.shaped.ai/blog/how-to-build-movie-suggestion-app-no-ml", "_blank")}
            >
              Learn how
            </Button>
          </div>
          <div className="flex gap-2 ml-4 shrink-0">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              title="Refresh page"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                <path d="M3 21v-5h5" />
              </svg>
            </Button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="mb-4 sm:mb-8 relative">
      {/* Logo */}
      <div className="mb-6">
        {theme === "dark" ? (
          <Image
            src="/Shaped-logo-white.png"
            alt="Shaped"
            width={120}
            height={40}
            className="h-8 w-auto"
          />
        ) : (
          <Image
            src="/Shaped-logo-horizontal-black.svg"
            alt="Shaped"
            width={120}
            height={40}
            className="h-8 w-auto"
          />
        )}
      </div>
      
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-primary">Discover your next favorite movie</h1>
          <p className="text-sm sm:text-base text-muted-foreground mb-4">Personalized movie recommendations, powered by the Shaped relevance database. Browse the catalog of 9,000 movies and 100,000 user ratings (MovieLens dataset).</p>
          
          {/* Learn How Button */}
          <Button
            className="bg-[#D96DFD] hover:bg-[#D96DFD]/90 text-white border-[#D96DFD] hover:text-white"
            onClick={() => window.open("https://www.shaped.ai/blog/how-to-build-movie-suggestion-app-no-ml", "_blank")}
          >
            Learn how
          </Button>
        </div>
        <div className="flex gap-2 ml-4 shrink-0">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            title="Refresh page"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
              <path d="M3 21v-5h5" />
            </svg>
          </Button>
        </div>
      </div>
    </header>
  );
};
