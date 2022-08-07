import { useTimelineProvider } from "@/Timeline/provider";

export const useViewProviders = () => {
  return [useTimelineProvider()];
};
