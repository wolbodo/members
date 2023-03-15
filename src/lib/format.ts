import { DateTime, Settings } from 'luxon';

Settings.defaultLocale = 'nl';

export const datetime = (dt: string) => {
  const time = DateTime.fromISO(dt)
  return [
    time.toLocaleString(),
    time.toLocaleString(DateTime.TIME_24_SIMPLE)
  ].join(' ')
}


export const formatDate = (date: string) => DateTime.fromISO(date).toLocaleString()
