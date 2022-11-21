import { computed } from "vue";
import lunr from "lunr";
import { usePageStore } from "@/Markwhen/pageStore";
import { useEventMapStore, type EventPaths } from "@/Markwhen/eventMapStore";
import type { DateRangePart, Event } from "@markwhen/parser/lib/Types";
import { DateTime } from "luxon";
import { useMarkersStore } from "@/Views/Timeline/Markers/markersStore";
import {
  floorDateTime,
  ceilDateTime,
  type DisplayScale,
} from "@/Views/Timeline/utilities/dateTimeUtilities";
import { parseDateRange } from "@markwhen/parser";
import type { JumpResults } from "./jumpStore";
import * as chrono from "chrono-node";

export type SearchState = "ready" | "indexing" | "uninitialized";
interface SearchDocument {
  path: string;
  dateTime: string;
  supplemental: string;
  description: string;
  tags: string;
}

export const useSearch = () => {
  const pageStore = usePageStore();
  const mapStore = useEventMapStore();

  const eventToDocument = (e: Event, path: EventPaths): SearchDocument => ({
    path: JSON.stringify(path),
    dateTime: e.ranges.date.fromDateTime.toLocaleString(DateTime.DATETIME_HUGE),
    supplemental: e.event.supplemental.map((s) => s.raw).join(" "),
    description: e.event.eventDescription,
    tags: e.event.tags.join(" "),
  });

  const eventSearchDocuments = computed(() => {
    const documents = [] as SearchDocument[];
    for (const { node } of pageStore.pageTimeline.events) {
      if (node.isEventNode()) {
        documents.push(
          eventToDocument(
            node.eventValue(),
            mapStore.getAllPaths(node.eventValue())
          )
        );
      } else {
        console.log(node.title)
        documents.push({
          path: node.rangeInText
            ? JSON.stringify(mapStore.getAllPaths(node.rangeInText?.from))
            : "",
          dateTime:
            node.range?.fromDateTime.toLocaleString(DateTime.DATETIME_HUGE) ||
            "",
          supplemental: "",
          description: node.title || "",
          tags: (node.tags || []).join(" "),
        });
      }
    }
    return documents;
  });

  const searchIndex = computed(() => {
    const index = lunr(function () {
      this.ref("path");
      this.field("supplemental");
      this.field("description");
      this.field("dateTime");
      this.field("tags");

      eventSearchDocuments.value.forEach((e) => this.add(e));
    });
    return index;
  });

  const search = (input?: string) => {
    if (!input) {
      return;
    }
    let result = [] as JumpResults;
    const markwhenParsed = parseDateRange(`${input}:`) as DateRangePart;
    if (markwhenParsed) {
      let scale = useMarkersStore().scaleOfViewportDateInterval;
      if (
        markwhenParsed.toDateTime.diff(markwhenParsed.fromDateTime).as("days") <
        1
      ) {
        markwhenParsed.fromDateTime = floorDateTime(
          markwhenParsed.fromDateTime,
          "day"
        );
        markwhenParsed.toDateTime = ceilDateTime(
          markwhenParsed.fromDateTime,
          "day"
        );
        scale = "day";
      }
      result.push({
        dateRange: markwhenParsed,
        scale,
      });
    } else {
      const [chronoParsed] = chrono.parse(input);
      if (chronoParsed) {
        const from = DateTime.fromJSDate(chronoParsed.start.date());
        result.push({
          dateRange: {
            fromDateTime: floorDateTime(from, "day"),
            toDateTime: ceilDateTime(
              chronoParsed.end
                ? DateTime.fromJSDate(chronoParsed.end.date())
                : from,
              "day"
            ),
          } as DateRangePart,
          scale: "day" as DisplayScale,
        });
      }
    }
    const searchTerm = input
      .replace(/[^a-zA-Z0-9\s]/, "")
      .replace(/[a-zA-Z]{2,}/, (substring) => `+${substring}~1`);
    return [...result, ...searchIndex.value.search(searchTerm)];
  };

  return { searchIndex, search };
};
