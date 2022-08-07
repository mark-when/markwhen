import type { ViewSetting } from "@/viewProvider";
import { useTimelineStore } from "../timelineStore";

export const useTimelineSettings: () => ViewSetting[] = () => {
  const timelineStore = useTimelineStore();

  return [];
};
