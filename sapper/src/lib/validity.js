import moment from 'moment';

export default function parseValidity(validity) {
  const [all, startC, startTime, endTime, endC] = validity.match(/([\[\(])(.*?),(.*)([\]\)])/)

  const start = startTime && moment(startTime.slice(1, -1))
  const end = endTime && moment(endTime.slice(1, -1))
  return {
    start,
    end
  }
}