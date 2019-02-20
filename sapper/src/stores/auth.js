import fetchPonyfill from 'fetch-ponyfill'
import moment from 'moment'
import { parseToken } from 'src/lib/jwt'
import slugify from 'src/lib/slugify'
import { goto } from '../../__sapper__/client.js'

const { fetch } = fetchPonyfill()

const PERMISSIONS_MAP = {
  'member:create': ['board'],
  'member:read': ['admin', 'board', 'member', 'login'],
  'member:update': ['board'],
  'board:update_member': ['board'],
  'member:update_self': ['member'],
  'member_roles:create': ['board'],
  'mail:create': ['admin', 'mail'],
  'mail:read': ['admin', 'mail']
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
        authTimer: moment(),
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
      this.compute('tokenExpiry', ['tokenParsed', 'authTimer'],
        (tokenParsed, authTimer) => {
          if (tokenParsed && authTimer) {
            const { exp } = tokenParsed
            const duration = moment.unix(exp).diff(authTimer)
            if (duration > 0) {
              return duration
            }
          }
          return 0
        }
      )

      this.compute('roles', ['tokenParsed'],
        (token) => token && token['https://hasura.io/jwt/claims']['x-hasura-allowed-roles'] || []
      )

      this.compute('hasRoles', ['roles'], (roles) => (...checkRoles) => checkRoles.some(r => roles.includes(r)))

      // Table level 'permissions' based on roles
      this.compute('permissions', ['roles'],
        (roles) => Object.entries(this.allPermissions)
        // Every permission which contains a role
        .filter(([permission, pRoles]) => pRoles.some(r => roles.includes(r)))
        .map(([permission, pRoles]) => permission)
      )

      this.checkExpiry()
    }
    async gqlWrapper (method, ...args) {
      // Overrides graphql-store
      try {
        const exp = this.checkExpiry()
        if (exp < 100) {
          console.log('Token expired -> refreshing')
          await this.refreshToken()
        }
        return await method(...args)
      } catch (e) {
        console.error('Err in gql query, parse token??', e)
      }
    }
    async gqlQuery (...args) {
      return await this.gqlWrapper(super.gqlQuery.bind(this), ...args)
    }
    async gqlMutation (...args) {
      return await this.gqlWrapper(super.gqlMutation.bind(this), ...args)
    }
    // async gqlSubscription (...args) {
    //   return await this.gqlWrapper(super.gqlSubscription.bind(this), ...args)
    // }

    checkExpiry () {
      // verify token expiry, trigger refresh if needed.
      const { tokenParsed } = this.get()

      if (tokenParsed) {
        const { exp } = tokenParsed

        const duration = moment.unix(exp).diff(moment())

        if (duration > 0) {
          return duration
        }
      }
      return 0
    }

    async refreshToken () {
      // Refreshes the token

      const { refreshToken } = this.get()

      // check refreshToken
      if (!refreshToken) {
        console.error('refresh not available')
        await this.logout()

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
        console.log('Refresh OK')
        const { token, user } = await res.json()

        this.set({ token, user })
      } else {
        console.log('Logging out user')
        await this.logout()
      }
    }

    watchAuth () {
      // Call checkExpiry regulary
      let handle
      const timeout = 600000 // every 10 minutes
      const checkAuth = () => {
        const { token } = this.get()
        const exp = this.checkExpiry()

        if (token) {
          console.log('Got exp', exp)
          this.set({
            authTimer: moment()
          })

          if (exp == 0) {
            this.refreshToken()
              .then(() => console.log('Refresh ok'))
              .catch(e => console.error('Refresh fail:', e))
          }
        }

        handle = window.setTimeout(checkAuth, exp < timeout ? exp : timeout)
      }
      handle = window.setTimeout(checkAuth, timeout)

      return () => window.clearTimeout(handle)
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
