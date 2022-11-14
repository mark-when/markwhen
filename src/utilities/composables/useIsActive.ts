import { onActivated, onDeactivated, ref } from "vue"

export const useIsActive = () => {
  const isActive = ref(false)

  onDeactivated(() => {
    isActive.value = false
  })

  onActivated(() => {
    isActive.value = true
  })

  return { isActive }
}
