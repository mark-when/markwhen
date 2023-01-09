import { usePageStore } from "@/Markwhen/pageStore";
import { useTimelineStore } from "@/Views/Timeline/timelineStore";
import { dateRangeToString } from "@/Views/Timeline/utilities/dateTimeUtilities";
import type { DateFormat } from "@markwhen/parser/lib/Types";
import type { ParseResult } from "./jumpStore";

export const useDateRangeString = () => {
  const timelineStore = useTimelineStore();
  const pageStore = usePageStore();

  return (parseResult: ParseResult) =>
    dateRangeToString(
      parseResult.dateRange,
      parseResult.scale || timelineStore.scaleOfViewportDateInterval,
      pageStore.pageTimelineMetadata.dateFormat as DateFormat
    );
};
