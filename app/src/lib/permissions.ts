
export type PermissionSet = {
  [key:string] : {
    edit?: string[];
    view?: string[];
  }
}

export const Permissions: PermissionSet = {
  'board': {
    edit: [
      'name', 
      'firstname', 'lastname', 'email',
      'phone', 'address', 'city', 'country',
      'note', 
      'bankaccount', 'key_code', 'password'
    ]
  },
  'member': {
    view: [
      'name', 
      'firstname', 'lastname', 'email',
      'phone', 'address', 'city', 'country',
      'note', 
      'id', 'created', 'modified',
    ]
  }
}

export const getPermissions = (roles:string[], permissions:PermissionSet = Permissions) : { view: string[], edit: string[]} => {
  const editSet : Set<string> = new Set()
  const viewSet : Set<string> = new Set()

  for (const role of roles) {
    const {view=[], edit=[]} = permissions[role]
    view.forEach(p => viewSet.add(p))
    edit.forEach(p => (editSet.add(p), viewSet.add(p)))
  }
  console.log(editSet, viewSet)

  return {
    view: Array.from(viewSet),
    edit: Array.from(editSet),
  }
}