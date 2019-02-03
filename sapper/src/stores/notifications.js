import moment from 'moment'

export default BaseStore =>
  class Store extends BaseStore {
    constructor (init) {
      super(init)

      this.on('state',
        ({ current, changed, previous }) => {
          if (changed.notifyQueue) {
            if (current.notifyQueue.size) {
              if (this.notifyTimer) {
                window.clearTimeout(this.notifyTimer)
              }
              this.notifyTimer = window.setTimeout(
                () => this.notifyCleanup(),
                100
              )
            }
          }
        }
      )

    }

    notify(type, message) {
      const { notifyQueue = new Map() } = this.get()

      notifyQueue.set(new Date(), {
        type, message
      })

      this.set({ notifyQueue })
    }

    notifyCleanup() {
      // Should be called regularly after messages appeared

      const { notifyQueue } = this.get()
      const now = moment()

      const old = Array.from(notifyQueue.keys())
        .filter(time => moment(time).add(3, 's').isBefore(now))

      old.forEach(v => notifyQueue.delete(v))

      this.set({ notifyQueue })
    }
    notifyRemove(time) {
      const { notifyQueue } = this.get()
      notifyQueue.delete(time)
      this.set({ notifyQueue })
    }
  }
