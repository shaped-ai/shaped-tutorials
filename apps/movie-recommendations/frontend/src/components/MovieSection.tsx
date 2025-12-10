import { Movie } from "@/types/movie";
import { MovieCard } from "./MovieCard";
import { InfoIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface MovieSectionProps {
  title: string;
  movies: Movie[];
  disableInfo?: boolean;
  infoTitle?: string;
  infoDescription?: string;
  infoCode?: string;
  width?: string;
}

export const MovieSection = ({
  title,
  movies,
  infoTitle,
  infoDescription,
  infoCode,
  disableInfo = false,
  width = "100%",
}: MovieSectionProps) => {
  return (
    <section className="mb-6 sm:mb-12 border sm:border-2 border-dashed border-gray-300 rounded-lg p-2 sm:p-4" style={{ width }}>
      <div className="flex items-center justify-between mb-2 sm:mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-primary pl-3">{title}</h2>
        {!disableInfo && (
          <Dialog>
            <Tooltip>
              <DialogTrigger asChild>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    aria-label="Section info"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <InfoIcon className="size-5" />
                  </button>
                </TooltipTrigger>
              </DialogTrigger>
              <TooltipContent side="left">More info</TooltipContent>
            </Tooltip>
            <DialogContent className="sm:max-w-2xl md:max-w-3xl">
              <DialogHeader>
                <DialogTitle>{infoTitle}</DialogTitle>
                <DialogDescription>
                  <span className="break-words text-pretty">
                    {infoDescription}
                  </span>
                </DialogDescription>
              </DialogHeader>
              {infoCode ? (
                <div className="mt-2 rounded-md bg-muted p-4 text-sm max-w-full overflow-x-auto">
                  <pre className="whitespace-pre text-left font-mono min-w-0">
                    {infoCode}
                  </pre>
                </div>
              ) : null}
            </DialogContent>
          </Dialog>
        )}
      </div>
      <div className="relative">
        <div
          className="overflow-x-auto pb-4 pl-2 scrollbar-hide w-full"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0%, black 16px, black calc(100% - 16px), transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 16px, black calc(100% - 16px), transparent 100%)",
          }}
        >
          <div className="flex gap-4 w-max min-w-0">
            {(movies || []).map((movie) => (
              <div key={movie.item_id} className="w-32 sm:w-40 lg:w-48 flex-shrink-0">
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
