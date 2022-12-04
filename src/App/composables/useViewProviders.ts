import type { ViewProvider } from "@/viewProvider";
import { useTimelineProvider } from "@/Views/Timeline/timelineViewProvider";

export const useMapProvider = () => ({
  name: "Map",
  component: () => "http://localhost:5174",
  iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="h-5 w-5">
  <path stroke-linecap="round" stroke-linejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7">
  </path></svg>`,
  capabilities: { edit: true, hoveringEvent: true },
  uses: { tags: true, drawerDescription: true, sort: true, pages: true },
  framed: true,
});

export const useViewProviders = () => {
  return [useMapProvider(), useTimelineProvider()] as ViewProvider[];
};
