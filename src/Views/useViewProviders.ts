import type { ViewProvider } from "@/viewProvider";
import {
  useTimelineProvider,
  useTimelineRowsProvider,
} from "@/Views/Timeline/timelineViewProvider";

export const useCalendar: () => ViewProvider = () => ({
  name: "Calendar",
  component: () =>
    "https://calendar.markwhen.com",
  iconSvg: `<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z"></path></svg>`,
  settings: [],
  capabilities: { edit: true, hoveringEvent: true, jumpToEvent: true },
  uses: { tags: true, drawerDescription: true, sort: true, pages: true },
  framed: true,
});

export const useViewProviders = () => {
  return [useTimelineRowsProvider(), useTimelineProvider()] as ViewProvider[];
};
