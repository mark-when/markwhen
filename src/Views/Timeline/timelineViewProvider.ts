import type { ViewProvider } from "@/viewProvider";
import Timeline from "./Timeline.vue";
import TimelineScale from "./Settings/TimelineScale.vue";
import ToggleNowLine from "./Settings/ToggleNowLine.vue";
import Jump from "./Settings/Jump.vue";

export const useTimelineProvider: () => ViewProvider = () => ({
  name: "Timeline",
  component: () => Timeline,
  iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="h-5 w-5">
      <path 
        fill="currentColor" 
        d="m 13 13 h -5 c -0.55 0 -1 -0.45 -1 -1 s 0.45 -1 1 -1 h 5 c 0.55 0 1 0.45 1 1 s -0.45 1 -1 1 z m -1 -4 h -7 c -0.55 0 -1 -0.45 -1 -1 s 0.45 -1 1 -1 h 7 c 0.55 0 1 0.45 1 1 s -0.45 1 -1 1 z m -9 -4 h 0 c -0.55 0 -1 -0.45 -1 -1 s 0.45 -1 1 -1 h 2 c 0.55 0 1 0.45 1 1 s -0.45 1 -1 1 z">
      </path>
    </svg>`,
  settings: [() => Jump, () => ToggleNowLine, () => TimelineScale],
  capabilities: { edit: true, hoveringEvent: true, jumpToEvent: true },
  uses: { tags: true, drawerDescription: true, sort: true, pages: true },
  framed: false
});
