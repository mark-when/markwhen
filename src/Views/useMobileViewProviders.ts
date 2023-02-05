import { useEditorProvider } from "@/Editor/editorViewProvider";
import {
  useMapProvider,
  useCalendarProvider,
  useTimelineExternalProvider,
} from "./useViewProviders";

export const useMobileViewProviders = () => {
  return [
    useMapProvider(),
    useCalendarProvider(),
    useTimelineExternalProvider(),
    useEditorProvider(),
  ];
};
