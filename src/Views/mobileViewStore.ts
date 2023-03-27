import { useMediaQuery } from "@vueuse/core";
import { defineStore } from "pinia";

export const useMobileViewStore = defineStore("views", () => {
  const isMobile = useMediaQuery("(max-width: 1024px)");

  // watch(
  //   isMobile,
  //   (mobile) => {
  //     const editorIndex = viewOptions.value.findIndex(
  //       (v) => v.name === "Editor" && typeof v.url !== "string"
  //     );
  //     if (mobile) {
  //       if (editorIndex >= 0) {
  //         viewOptions.value[editorIndex].active = true;
  //       } else {
  //         viewOptions.value.push(markRaw(useEditorProvider()));
  //       }
  //     } else {
  //       if (editorIndex >= 0) {
  //         viewOptions.value.splice(editorIndex, 1);
  //       }
  //     }
  //   },
  //   { immediate: true }
  // );

  return {
    isMobile,
  };
});
