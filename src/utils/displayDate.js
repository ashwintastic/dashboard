import moment from 'moment';

export function displayLocalDate(dateObj, displayFormat) {
  return moment(dateObj).format(displayFormat)
}

export function displayUtcDate(dateObj, displayFormat) {
  return moment.utc(dateObj).format(displayFormat)
}

export function displayTimeZoneDate(dateObj, displayFormat, timeZoneOffset) {
  return moment.utc(dateObj).add(timeZoneOffset, 'minutes').format(displayFormat)
}

