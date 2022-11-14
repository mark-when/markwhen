import { useTimelineProvider } from "@/Views/Timeline/timelineViewProvider";

export const useMobileViewProviders = () => {
  return [useTimelineProvider()];
};
