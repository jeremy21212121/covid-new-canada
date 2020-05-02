/*
    Converts a hex color string to an RGB array. Accepts strings with or without # prefix.
    Implemented with map/filter.

    Don't call this thousands of times as the performance is probably terrible
*/

const hexToRgb = (hexStr) =>
  hexStr.split('')
  .filter(ch => ch !== '#')
  .map((ch, i, arr) => // group characters into pairs
    (i % 2 === 0) ? // if even index
      ch + arr[i+1] // concat with next char
      : ''	    // if odd index, return empty string
  )
  .filter(ch => ch !== '') // clean up empty strings from pairing
  .map(ch => parseInt(ch, 16)); // parse into an integer

export default hexToRgb;
