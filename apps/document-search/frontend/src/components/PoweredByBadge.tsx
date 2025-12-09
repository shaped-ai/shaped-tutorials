import Image from "next/image";

export const PoweredByBadge: React.FC = () => {
  return (
    <div className="z-50 bg-transparent sm:bg-white sm:border sm:border-gray-200 rounded-lg px-0 py-0 sm:px-3 sm:py-2 sm:animate-glow">
      <style jsx>{`
        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 5px rgba(147, 51, 234, 0.3), 0 0 10px rgba(147, 51, 234, 0.2), 0 0 20px rgba(147, 51, 234, 0.1);
          }
          50% {
            box-shadow: 0 0 10px rgba(147, 51, 234, 0.5), 0 0 20px rgba(147, 51, 234, 0.3), 0 0 30px rgba(147, 51, 234, 0.2);
          }
        }
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
      `}</style>
      <a 
        href="https://shaped.ai" 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-300 sm:text-gray-700 hover:text-white sm:hover:text-gray-900 active:text-white sm:active:text-gray-900 transition-colors touch-manipulation"
      >
        <span className="hidden sm:inline">Powered by</span>
        <Image 
          src="https://docs.shaped.ai/img/shaped-icon.svg" 
          alt="Shaped"
          width={20}
          height={20}
          className="h-5 w-auto brightness-0 invert sm:brightness-100 sm:invert-0"
        />
      </a>
    </div>
  );
};

