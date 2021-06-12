
type Role = string;

export type PermissionSet = {
  [key:Role] : {
    edit?: string[];
    view?: string[];
  }
}

export const Permissions: PermissionSet = {
  'board': {
    edit: [
      'name', 
      'firstname', 'lastname', 'email',
      'phone', 'address', 'zipcode', 'city', 'country',
      'note', 
      'bankaccount', 'key_code', 'password',
      'roles'
    ]
  },
  'member': {
    view: [
      'name', 
      'firstname', 'lastname', 'email',
      'phone', 'address', 'zipcode', 'city', 'country',
      'note', 
      'id', 'created', 'modified',
      'roles',
    ]
  }
}

export const getQueryFields = (fields) => fields.map(field => field === 'roles' ? 'roles { name }' : field).join(' ')

export const getPermissions = (roles:Role[] = [], permissions:PermissionSet = Permissions) : { view: string[], edit: string[]} => {
  const editSet : Set<string> = new Set()
  const viewSet : Set<string> = new Set()

  for (const role of roles) {
    if (!permissions[role]) continue;

    const {view=[], edit=[]} = permissions[role]
    view.forEach(p => viewSet.add(p))
    edit.forEach(p => (editSet.add(p), viewSet.add(p)))
  }

  return {
    view: Array.from(viewSet),
    edit: Array.from(editSet),
  }
}