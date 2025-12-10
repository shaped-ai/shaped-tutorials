import { PoweredByBadge } from "./PoweredByBadge";

export const FloatingButtons = () => {
  return (
    <div className="fixed bottom-6 right-6 flex flex-row gap-3 z-50">
      <PoweredByBadge />
    </div>
  );
};
