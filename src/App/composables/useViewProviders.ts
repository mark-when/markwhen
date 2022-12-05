import type { ViewProvider } from "@/viewProvider";
import { useTimelineProvider } from "@/Views/Timeline/timelineViewProvider";

export const useViewProviders = () => {
  return [useTimelineProvider()] as ViewProvider[];
};
