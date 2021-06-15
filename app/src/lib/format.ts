import { DateTime } from 'luxon'

export const datetime = dt => {
  const time = DateTime.fromISO(dt)
  return [
    time.toLocaleString(),
    time.toLocaleString(DateTime.TIME_24_SIMPLE)
  ].join(' ')
}