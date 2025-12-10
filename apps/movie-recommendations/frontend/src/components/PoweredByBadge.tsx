import Image from "next/image";

export const PoweredByBadge: React.FC = () => {
  return (
    <div className="shadow-lg hover:shadow-xl transition-all bottom-4 right-4 z-50 bg-white/90 border border-gray-200 rounded-lg px-3 py-2">
      <a 
        href="https://shaped.ai" 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
      >
        <span>Powered by</span>
        <Image 
          src="https://docs.shaped.ai/img/shaped-icon.svg" 
          alt="Shaped"
          width={20}
          height={20}
          className="h-5 w-auto"
        />
      </a>
    </div>
  );
};
