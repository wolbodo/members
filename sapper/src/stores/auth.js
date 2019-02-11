import fetchPonyfill from 'fetch-ponyfill';
import moment from 'moment'
import { parseToken } from 'src/lib/jwt'
import slugify from 'src/lib/slugify'
import { goto } from '../../__sapper__/client.js'

const { fetch } = fetchPonyfill();

const PERMISSIONS_MAP = {
  'member:create': ['board'],
  'member:read': ['admin', 'board', 'member', 'login'],
  'member:update': ['board'],
  'member:update_self': ['member'],
  'member_roles:create': ['board'],
  'mail:create': ['admin', 'mail'],
  'mail:read': ['admin', 'mail'],
}

export default BaseStore =>
  class Store extends BaseStore {

    constructor (init) {
      
      const lsData = {}
      if (global.localStorage) {
        const user = localStorage.getItem('user')
        if (user) {
          lsData.user = JSON.parse(user)
        }
        lsData.token = localStorage.getItem('token')
        lsData.refreshToken = localStorage.getItem('refreshToken')
      }

      super({
        role: 'member',
        ...lsData,
        ...init
      })

      this.allPermissions = PERMISSIONS_MAP

      this.on('state', ({changed, current}) => {
        if (global.localStorage) {
          if (changed.token) {
            this.checkExpiry()
            if (current.token) {
              localStorage.setItem('token', current.token)
            } else {
              localStorage.removeItem('token')
            }
          }
          if (changed.refreshToken) {
            if (current.refreshToken) {
              localStorage.setItem('refreshToken', current.refreshToken)
            } else {
              localStorage.removeItem('refreshToken')
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
        (token) => parseToken(token)
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


      this.checkExpiry()
    }

    checkExpiry () {
      // verify token expiry, trigger refresh if needed.
      const { tokenParsed } = this.get()

      if (tokenParsed) {
        const { exp } = tokenParsed

        const duration = moment.unix(exp).diff(moment())

        if (duration > 0) {
          console.log("TOKEN OK")
          return duration
        } else {
          console.log("TOKEN EXPIRED")
          return 0
        }
      }
      console.error("TOKEN INVALID")
      return 0
    }

    async refreshToken () {
      // Refreshes the token

      const { refreshToken } = this.get()

      // check refreshToken
      if (refreshToken) {
        const refresh = parseToken(refreshToken)
        const validForMS = moment.unix(refresh.exp).diff(moment())
        if (validForMS > 0) {
          // OK
          console.info("refresh token valid")
        } else {
          console.error("refresh token expired")
          return
        }
      } else {
        console.error("refresh not available")
        return
      }

      const res = await fetch('/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          refreshToken
        })
      })

      if (res.ok) {
        console.log("Refresh OK")
        const { token, user } = await res.json()

        this.set({ token, user })
      } else {
        console.log("Logging out user")
        await this.logout()
      }
    }

    watchAuth () {
      // Call checkExpiry regulary
      const handle = window.setInterval(() => {
        const exp = this.checkExpiry()
        console.log("Got exp", exp)

        if (exp == 0) {
          this.refreshToken()
            .then(() => console.log("Refresh ok"))
            .catch(e => console.error("Refresh fail:", e))
        }
      }, 2000)


      return () => window.clearInterval(handle)
    }

    roleForPermission (permission) {
      // Returns a role for which the permission should be allowed
      const { roles: userRoles } = this.get()
      const permissionRoles = this.allPermissions[permission]
      if (!permissionRoles) return

      const [allowed, ...rest] = userRoles.filter(r => permissionRoles.includes(r))
      return allowed
    }

    async logout () {
      this.set({
        token: undefined,
        user: undefined,
        refreshToken: undefined
      })
      await fetch('/auth/logout')
      goto('/', { replaceState: true })
      this.notify('success', 'Successful logout')
    }
  }