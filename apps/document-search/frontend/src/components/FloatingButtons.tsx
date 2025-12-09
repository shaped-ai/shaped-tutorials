import Image from "next/image";
import { PoweredByBadge } from "./PoweredByBadge";

const GitHubButton = () => {
  return (
    <a
      href="https://github.com/yuhgto/shaped-demos/document-search"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center w-10 h-10 bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded-lg transition-colors"
    >
      <Image
        src="/github-mark-white.svg"
        alt="GitHub"
        width={20}
        height={20}
        className="h-5 w-5"
      />
    </a>
  );
};

export const FloatingButtons = () => {
  return (
    <div className="fixed bottom-6 right-6 flex flex-row items-center gap-3 z-50">
      <GitHubButton />
      <PoweredByBadge />
    </div>
  );
};

