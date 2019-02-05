import moment from 'moment';

export function status({ validity }) {
  // Returns member status
  // - future
  // - current
  // - retired
  // - aspiring
  const [all, startC, startTime, endTime, endC] = validity.match(/([\[\(])(.*?),(.*)([\]\)])/)

  const start = startTime && moment(startTime.slice(1, -1))
  const end = endTime && moment(endTime.slice(1, -1))

  let status
  if (start) {
    if (start.isAfter(moment())) {
      status = 'future'
    } else {
      status = 'current'
    }

    if (end) {
      if (end.isBefore(moment())) {
        status = 'retired'
      }
    }
  } else {

    if (end) {
      if (end.isBefore(moment())) {
        status = 'aspiring'
      }
    } else {
      status = 'always'
    }

  }


  return {
    start,
    end,
    status
  }
}