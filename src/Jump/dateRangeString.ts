import { usePageStore } from "@/Markwhen/pageStore";
import { dateRangeToString } from "@/Markwhen/utilities/dateTimeUtilities";
import type { DateFormat } from "@markwhen/parser/lib/Types";
import type { ParseResult } from "./jumpStore";

export const useDateRangeString = () => {
  const pageStore = usePageStore();

  return (parseResult: ParseResult) =>
    dateRangeToString(
      parseResult.dateRange,
      parseResult.scale || "day",
      pageStore.header.dateFormat as DateFormat
    );
};
