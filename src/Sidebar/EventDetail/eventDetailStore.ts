import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useSidebarStore } from "../sidebarStore";

export const useEventDetailStore = defineStore('eventDetail', () => {

  const sidebarStore = useSidebarStore()

  const width = ref(450);
  const visible = ref(false)

  const setWidth = (w: number) => {
    width.value = w
  }

  const toggle = () => {
    visible.value = !visible.value
  }

  const isLeft = computed(() => !sidebarStore.isLeft)

  return {
    // state
    visible,
    width,

    // actions
    setWidth,

    // getters
    isLeft
  }

})
