/**
*  humanTime takes a unix timestamp from the past and returns a human-readable approximate duration.
*  This is useful for giving users an approximate idea of how old something is.
 */

 // number of seconds in each key
const periodDict = {
  sec: 1,
  min: 60,
  hour: 3600,
  day: 86400,
  week: 604800,
  month: 2592000,
  year: 31536000,
  max: Number.MAX_SAFE_INTEGER // this is necessary for handling years in determinePeriodName
};

// ['sec', 'min', 'hour', 'day', 'week', 'month', 'year', 'max']
const periodKeys = Object.keys(periodDict);

/**
 * @param  {Number} seconds
 * @returns {String} - Name of appropriate time period
 */
const determinePeriodName = (seconds) => {
  let periodName = '';
  for (let i = 0; i < (periodKeys.length - 1); i++) {
    const lessThanNext = seconds < periodDict[periodKeys[i+1]];
    if (lessThanNext) {
      periodName = periodKeys[i];
      break;
    }
  }
  return periodName;
}

/**
 * @param  {Number} seconds
 * @returns {String} - Human-readable duration
 */
const buildOutput = (seconds) => {
  // debugger;
  // sec, min, hour, day, week, month or year
  const periodName = determinePeriodName(seconds);
  // number of seconds in periodName
  const periodDivisor = periodDict[periodName];
  const periodQuantity = Math.round(seconds/periodDivisor) || 1;
  const suffix = (periodQuantity > 1) ? 's' : '';
  return `${periodQuantity} ${periodName}${suffix}`;
}

/**
*  Takes a unix timestamp from the past and returns a human-readable approximate duration.
*  This is useful for giving users an approximate idea of how old something is.
 * @param  {Number} unixMs - Unix timestamp in ms
 * @returns {String} - Human-readable approximate duration
 */
const humanTime = (unixMs) => {
    // ensure unixMs is a positive integer
    if (typeof unixMs !== 'number' || unixMs < 0 || Math.round(unixMs) !== unixMs) return;
    // time between unixMs and now, in seconds
    const secs = (Date.now() - unixMs) / 1000;

    return buildOutput(secs);
}

export default humanTime;
