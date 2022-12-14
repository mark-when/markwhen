import type { ViewProvider } from "@/viewProvider";
import { useTimelineProvider } from "@/Views/Timeline/timelineViewProvider";

export const useMobileViewProviders = () => {
  return [useTimelineProvider()] as ViewProvider[];
};
