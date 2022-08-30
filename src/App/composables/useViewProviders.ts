import { useTimelineProvider } from "@/Views/Timeline/timelineViewProvider";

export const useViewProviders = () => {
  return [useTimelineProvider()];
};
