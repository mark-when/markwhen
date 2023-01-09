import type { ViewProvider } from "@/viewProvider";
import { useTimelineProvider, useTimelineRowsProvider } from "@/Views/Timeline/timelineViewProvider";

export const useMobileViewProviders = () => {
  return [useTimelineRowsProvider(), useTimelineProvider()] as ViewProvider[];
};
