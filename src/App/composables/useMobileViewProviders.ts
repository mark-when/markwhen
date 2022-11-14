import { useEditorProvider } from "@/Editor/editorViewProvider";
import { useTimelineProvider } from "@/Views/Timeline/timelineViewProvider";

export const useMobileViewProviders = () => {
  return [useTimelineProvider(), useEditorProvider()];
};
