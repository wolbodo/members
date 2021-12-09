import { DateTime, Settings } from 'luxon';

Settings.defaultLocale = 'nl';

export const formatDate = date => DateTime.fromISO(date).toLocaleString()
