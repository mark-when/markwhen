import type { VueElement } from "vue";

export interface ViewCapabilities {
  edit?: boolean
  hoveringEvent?: boolean
  mobile?: boolean
}

export interface ViewUses {
  tags?: boolean
  drawerDescription?: boolean
  sort?: boolean
}

export interface ViewSetting {
  name: string
  iconSvg: string,
  /**
   * Click handler for setting. Optionally returns new button icon if it has changed.
   */
  onClick?: () => string | undefined
}

export interface ViewProvider {
  component: any,
  name: string,
  iconSvg?: string,
  settings?: (ViewSetting | VueElement)[]
  capabilities?: ViewCapabilities
  uses?: ViewUses
}