import fetchPonyfill from 'fetch-ponyfill';
import * as jwt from 'src/lib/jwt'
import slugify from 'src/lib/slugify'
import { goto } from '../../__sapper__/client.js'

const { fetch } = fetchPonyfill();

const PERMISSIONS_MAP = {
  'member:create': ['admin', 'board'],
  'member:read': ['admin', 'board', 'user'],
  'member:update': ['admin', 'board'],
  'member_roles:create': ['board', 'admin'],
  'mail:create': ['admin'],
  'mail:read': ['admin'],
}

export default BaseStore =>
  class Store extends BaseStore {

    constructor (init) {
      this.allPermissions = PERMISSIONS_MAP
      
      const lsData = {}
      if (global.localStorage) {
        const user = localStorage.getItem('user')
        if (user) {
          lsData.user = JSON.parse(user)
        }
        lsData.token = localStorage.getItem('token')
      }

      super({
        role: 'user',
        ...lsData,
        ...init
      })

      this.on('state', ({changed, current}) => {
        if (global.localStorage) {
          if (changed.token) {
            if (current.token) {
              localStorage.setItem('token', current.token)
            } else {
              localStorage.removeItem('token')
            }
          }
          if (changed.user) {
            if (current.user) {
              localStorage.setItem('user', JSON.stringify(current.user))
            } else {
              localStorage.removeItem('user')
            }
          }
        }
      })

      this.compute('loggedIn', ['token'], token => !!token)
      this.compute('userSlug', ['tokenParsed'],
        (tokenParsed) => tokenParsed && slugify(tokenParsed.name)
      )
      this.compute('tokenParsed', ['token'],
        (token) => jwt.parse(token)
      )

      this.compute('roles', ['tokenParsed'],
        (token) => token && token['https://hasura.io/jwt/claims']['x-hasura-allowed-roles'] || []
      )

      this.compute('hasRoles', ['roles'], (roles) => ((...checkRoles) => checkRoles.some(r => roles.includes(r))))

      // Table level 'permissions' based on roles
      this.compute('permissions', ['roles'],
        (roles) => Object.entries(this.allPermissions)
        // Every permission which contains a role
        .filter(([permission, pRoles]) => pRoles.some(r => roles.includes(r)))
        .map(([permission, pRoles]) => permission)
      )
    }

    roleForPermission (permission) {
      // Returns a role for which the permission should be allowed
      const { roles: userRoles } = this.get()
      const permissionRoles = this.allPermissions[permission]

      console.log("Has permissions:", permissionRoles, userRoles)
    }

    async logout () {
      this.set({
        token: undefined,
        user: undefined
      })
      await fetch('/auth/logout')
      goto('/', { replaceState: true })
      this.notify('success', 'Successful logout')
    }
  }