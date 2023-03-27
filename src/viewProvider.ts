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
  id: string,
  url: string | any,
  name: string,
  iconSvg?: string,
  settings?: (() => ViewSetting | any)[]
  capabilities?: ViewCapabilities
  uses?: ViewUses
  active?: boolean
  description: string
  screenshots: string[]
}