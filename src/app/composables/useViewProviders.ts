import { useTimelineProvider } from "@/Views/Timeline/provider";

export const useViewProviders = () => {
  return [useTimelineProvider()];
};
