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
  jump?: boolean
}

export interface ViewSetting {
  name: string
  iconSvg: string,
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