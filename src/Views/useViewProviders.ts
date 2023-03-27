import type { ViewProvider } from "@/viewProvider";

export const useTimelineExternalProvider = () => ({
  id: "markwhen.timeline",
  name: "Timeline",
  url: "https://timeline.markwhen.com",
  iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="h-full w-full"><path 
  fill="currentColor" 
  d="m 13 13 h -5 c -0.55 0 -1 -0.45 -1 -1 s 0.45 -1 1 -1 h 5 c 0.55 0 1 0.45 1 1 s -0.45 1 -1 1 z m -1 -4 h -7 c -0.55 0 -1 -0.45 -1 -1 s 0.45 -1 1 -1 h 7 c 0.55 0 1 0.45 1 1 s -0.45 1 -1 1 z m -9 -4 h 0 c -0.55 0 -1 -0.45 -1 -1 s 0.45 -1 1 -1 h 2 c 0.55 0 1 0.45 1 1 s -0.45 1 -1 1 z">
</path></svg>`,
  settings: [],
  capabilities: { edit: true, hoveringEvent: true },
  uses: {
    tags: true,
    drawerDescription: true,
    sort: true,
    pages: true,
    jump: true,
  },
  active: true,
  description:
    "A graph-like representation of events in a cascading timeline. Optionally view as a gantt chart as well.",
  screenshots: ["/images/timeline.png"],
});

export const useViewProviders: () => ViewProvider[] = () => {
  return [useTimelineExternalProvider()];
};
