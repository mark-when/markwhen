export interface ViewCapabilities {
  edit?: boolean
  hoveringEvent?: boolean
  mobile?: boolean
  jumpToEvent?: boolean
}

export interface ViewUses {
  tags?: boolean
  drawerDescription?: boolean
  sort?: boolean
  pages?: boolean
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
  component: () => any,
  framed: boolean
  name: string,
  iconSvg?: string,
  settings?: (() => ViewSetting | any)[]
  capabilities?: ViewCapabilities
  uses?: ViewUses
}