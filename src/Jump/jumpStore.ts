import type { DisplayScale } from "@/Markwhen/utilities/dateTimeUtilities";
import type { DateRangePart } from "@markwhen/parser/lib/Types";
import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { useSearch } from "./search";

export type JumpResults = (ParseResult | lunr.Index.Result)[];

export interface ParseResult {
  dateRange: DateRangePart;
  scale?: DisplayScale;
}

export const isParseResult = (
  r: ParseResult | lunr.Index.Result
): r is ParseResult => {
  return !!(r as ParseResult).dateRange;
};

export const useJumpStore = defineStore("jump", () => {
  const selectedIndex = ref(0);
  const showingJumpDialog = ref(false);
  const jumpResult = ref<JumpResults | undefined>();
  const search = useSearch();

  watch(jumpResult, (r, prev) => {
    if (
      !r ||
      !r.length ||
      !prev ||
      !prev.length ||
      selectedIndex.value > r.length - 1
    ) {
      selectedIndex.value = 0;
    }
  });

  const setJumpResult = (j: JumpResults | undefined) => {
    jumpResult.value = j;
  };
  const setSelectedIndex = (val: number) => {
    selectedIndex.value = val;
  };
  const setShowJumpDialog = (show: boolean) => {
    showingJumpDialog.value = show;
  };
  const selectNextIndex = () => {
    if (!jumpResult.value || !jumpResult.value?.length) {
      selectedIndex.value = 0;
    } else {
      selectedIndex.value = (selectedIndex.value + 1) % jumpResult.value.length;
    }
  };
  const selectPrevIndex = () => {
    if (!jumpResult.value || !jumpResult.value?.length) {
      selectedIndex.value = 0;
    } else {
      if (selectedIndex.value === 0) {
        selectedIndex.value = jumpResult.value.length - 1;
      } else {
        selectedIndex.value =
          (selectedIndex.value - 1) % jumpResult.value.length;
      }
    }
  };

  const searchInput = (input?: string) => {
    setJumpResult(search.search(input));
  };

  return {
    selectedIndex,
    jumpResult,
    showingJumpDialog,

    setShowJumpDialog,
    setJumpResult,
    setSelectedIndex,
    search: searchInput,
    selectNextIndex,
    selectPrevIndex,
  };
});
