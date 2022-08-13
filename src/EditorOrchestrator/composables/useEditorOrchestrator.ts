
export const ADD_PAGE =     'edit:pages:add'
export const MOVE_PAGES =   'edit:pages:move'
export const DELETE_PAGE =  'edit:pages:delete'

export type UpdateMethod = typeof ADD_PAGE | typeof MOVE_PAGES | typeof DELETE_PAGE

export const useEditorOrchestrator = () => {

  const update = (updateMethod: UpdateMethod, arg?: any) => {
    console.log(updateMethod, arg)
  }

  return {
    update
  }
}
