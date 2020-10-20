/**
 * Contains functions for processing the API response data into a format suitable for Chart.js
 */

export default {
  methods: {
    generateLabels(data) {
      // generate chart.js labels from the API response
      let output = [];
      if (data && data.length) {
        output = data.map(obj => {
          // i dont really remember why I'm doing this. It made sense at the time... Maybe because the prod server timezone is GMT? Ugh I dunno. Coding while tired is dangerous :P
          let date = new Date(obj.date);
          // timezone offset in ms
          let msOffset = date.getTimezoneOffset() * 60 * 1000;
          // correct datetime for user timezone
          return new Date(date.getTime() + msOffset);
        });
      }
      return output;
    },
    /**
     * Finds consecutive null's and averages the next non-null value over itself and the preceeding nulls
     * This is used to handle days for which no numbers are reported (sundays, holidays, it varies by province)
     * This avoids misleading spikes in the chart and gives a more accurate visualization
     * @param {Array<number|null>} arr - Array of values or null for unreported days
     * @returns {Array<number>} - Array of processed values
     *
     */
    averageNulls(arr) {
      // Number[]
      const output = [...arr];
      // Number[][]
      const consecutiveNulls = [];
      // iterate over every input value, looking for nulls
      for (let i = 0; i < output.length; i++) {
        // we found a null
        if (output[i] === null) {
          // this stores the consecutive nulls for this interation.
          const nulls = [i];
          // let's check for any consecutive nulls
          // starting with the next index, we will iterate until we find a non-null value
          for (let j = i + 1; j < output.length; j++) {
            // keep the outer iterator in sync with the inner iterator, so we don't process any indexes twice.
            // this function could use a single loop if we kept track of if the previous value was null
            // that would possibly simplify this quite a bit. This approach made sense to me but now my brain is tired so I am not sure!
            i = j;
            if (output[j] !== null) {
              // break out of inner loop
              break;
            } else {
              // add index to this array of consecutive nulls
              nulls.push(j);
            }
          }
          // `nulls` is an array of consecutive null value indexes
          // add this group of consecutive nulls to our array for later processing
          consecutiveNulls.push(nulls);
        }
      }
      // Now that we have recorded all the indexes of groups of consecutive nulls, let's process them
      consecutiveNulls.forEach(nullArray => {
        const nextNonNullIndex = nullArray[nullArray.length - 1] + 1;
        const valueToBeAveraged = output[nextNonNullIndex];
        const averagedValue = valueToBeAveraged / (nullArray.length + 1);
        const indexesToBeMutated = [...nullArray, nextNonNullIndex];
        indexesToBeMutated.forEach(mIndex => {
          output[mIndex] = averagedValue;
        });
      });
      // return the mutated array
      return output;
    },
    /**
     * Maps data values to be per-capita rather than absolute
     * Non-reported days are set to `null`, for the most part.
     * @param {number[]} arr - Array of absolute new case values
     * @param {object} popObj - Population object
     * @param {number} popObj.population - Population of province/region
     * @param {string} popObj.initials - Identifier for province/region
     * @returns {number[]}
     */
    processDataArray(arr, popObj) {
      return arr.map((dataObj, dataIndex) => {
        // calculate the per-capita rate
        let output =
          dataObj.rows[popObj.initials] / (popObj.population / this.per);
        // some regions do not report on certain days. We will map those to null for now. Later we will average the next reported day over the nulls.
        const specialCases = ["BC", "AB", "ON", "Canada"];
        // it is difficult to differentiate between a "real" 0 value and a day for which no numbers were released.
        // the following line makes a best guess. The records start with Jan 25, and the affected regions haven't had a "real" 0 day since ~ late feb (that is where the `dataIndex > 30` comes from)
        const shouldBeNull =
          dataIndex > 30 &&
          output === 0 &&
          specialCases.includes(popObj.initials);
        if (shouldBeNull) {
          output = null;
        }
        // I'm seeing a few -1's in SK MB and NF, which does not make sense to me. Without looking into the cause, lets just make it 0 for now
        if (typeof output === "number" && output < 0) {
          output = 0;
        }
        return output;
      });
    },
    generateDatasets(data) {
      // generate chart.js datasets from the API response
      let dataset = [];
      if (data && data.length) {
        dataset = this.population.map((popObj, index) => {
          return {
            label: popObj.province,
            backgroundColor: this.arrayToRgbaString([
              ...this.hexToRgb(this.colors[index]),
              0.5
            ]),
            borderColor: this.arrayToRgbaString([
              ...this.hexToRgb(this.colors[index]),
              1
            ]),
            fill: false,
            hidden: popObj.initials !== "Canada",
            // Convert values to "per capita" and average the values for unreported days
            data: this.averageNulls(this.processDataArray(data, popObj))
          };
        });
      }
      return dataset;
    }
  }
};
