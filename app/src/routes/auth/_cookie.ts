import { Temporal, Intl } from 'proposal-temporal'

const history = Temporal.PlainDateTime.from({ year: 1900, day: 1, month: 1 })

const UTCFormat = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  day: 'numeric',
  month: 'short', 
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  timeZone: 'GMT',
  timeZoneName: 'short',
  hour12: false,
})
export const cookie = (token='', expires=history) =>
  `token=${token}; Path=/; expires=${UTCFormat.format(expires)}; HttpOnly`