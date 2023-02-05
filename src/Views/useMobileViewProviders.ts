import { useTimelineExternalProvider } from "./useViewProviders";

export const useMobileViewProviders = () => {
  return [useTimelineExternalProvider()];
};
