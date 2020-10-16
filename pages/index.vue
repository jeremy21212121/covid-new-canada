<template>
  <div class="container">
    <span v-if="error">Sorry, error getting data. Please try again later.</span>
    <span
      v-if="ready"
      :title="'Updated ' + newCases.last_updated + ' GMT'"
    >Last updated {{ humanTime(new Date(newCases.last_updated+'Z').getTime()) }} ago</span>
    <client-only>
      <line-chart v-if="ready" :chart-data="chartdata" :styles="styles" :apiData="newCases" />
    </client-only>
  </div>
</template>

<script>
// import Logo from '~/components/Logo.vue'
import axios from "@nuxtjs/axios";
// population data for the nation and the provinces/territories
import population from "@/static/population.js";
// convert hex color string to RGB values
import hexToRgb from "@/static/hexToRgb.js";
// human-readable durations
import humanTime from "@/utils/humanTime";
import LineChart from "@/components/LineChart";

export default {
  name: "Main",
  components: {
    LineChart
  },
  data() {
    return {
      per: 1000000,
      ready: false,
      newCases: {},
      labels: [],
      datasets: [],
      chartdata: {},
      error: null,
      population: population,
      colors: [
        "#F70000",
        "#B9264F",
        "#990099",
        "#74138C",
        "#0000CE",
        "#1F88A7",
        "#4A9586",
        "#FFBE28",
        "#B96F6F",
        "#1FCB4A",
        "#59955C",
        "#01FCEF",
        "#F900F9",
        "#999999"
      ]
    };
  },
  async fetch() {
    const response = await this.$axios
      .get("https://canopy.cbc.ca/live/covid_data/api/canada/daily/new_cases")
      .catch(function(e) {
        this.error = e;
      });
    if (response.status === 200) {
      this.newCases = response.data;
      this.labels = this.generateLabels(this.newCases.data);
      this.datasets = this.generateDatasets(this.newCases.data);
      this.chartdata = {
        labels: this.labels,
        datasets: this.datasets
      };
      // render chart. Comment out to aid in debugging.
      // (chartJS seems to break vue devtools)
      this.ready = true;
    }
  },
  mounted() {
    // uncomment to following line to call $fetch client side, to aid in debugging
    // this.$fetch()

  },
  methods: {
    humanTime,
    hexToRgb,
    arrayToRgbaString(arr) {
      return `rgba(${arr.reduce((a, b) => `${a},${b}`)})`;
    },
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
      const output = [...arr]
      // Number[][]
      const consecutiveNulls = []
      // iterate over every input value, looking for nulls
      for (let i=0; i<output.length; i++) {
        // we found a null
        if (output[i] === null) {
          // this stores the consecutive nulls for this interation.
          const nulls = [i]
          // let's check for any consecutive nulls
          // starting with the next index, we will iterate until we find a non-null value
          for (let j = i+1; j < output.length; j++) {
            // keep the outer iterator in sync with the inner iterator, so we don't process any indexes twice.
            // this function could use a single loop if we kept track of if the previous value was null
            // that would possibly simplify this quite a bit. This approach made sense to me but now my brain is tired so I am not sure!
            i = j
            if (output[j] !== null) {
              // break out of inner loop
              break
            } else {
              // add index to this array of consecutive nulls
              nulls.push(j)
            }
          }
          // `nulls` is an array of consecutive null value indexes
          // add this group of consecutive nulls to our array for later processing
          consecutiveNulls.push(nulls)
        }
      }
      // Now that we have recorded all the indexes of groups of consecutive nulls, let's process them
      consecutiveNulls.forEach(nullArray => {
        const nextNonNullIndex = nullArray[nullArray.length - 1] + 1
        const valueToBeAveraged = output[nextNonNullIndex]
        const averagedValue = valueToBeAveraged / (nullArray.length + 1)
        const indexesToBeMutated = [...nullArray, nextNonNullIndex]
        indexesToBeMutated.forEach(mIndex => {
          output[mIndex] = averagedValue
        })
      })
      // return the mutated array
      return output
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
    processDataArray(arr, popObj)  {
      return arr.map((dataObj, dataIndex) => {
        // calculate the per-capita rate
        let output = dataObj.rows[popObj.initials] / (popObj.population / this.per)
        // some regions do not report on certain days. We will map those to null for now. Later we will average the next reported day over the nulls.
        const specialCases = ['BC', 'AB', 'ON', 'Canada']
        // it is difficult to differentiate between a "real" 0 value and a day for which no numbers were released.
        // the following line makes a best guess. The records start with Jan 25, and the affected regions haven't had a "real" 0 day since ~ late feb (that is where the `dataIndex > 30` comes from)
        const shouldBeNull = (dataIndex > 30) && (output === 0) && specialCases.includes(popObj.initials)
        if (shouldBeNull) {
          output = null
        }
        // I'm seeing a few -1's in SK MB and NF, which does not make sense to me. Without looking into the cause, lets just make it 0 for now
        if (typeof output === 'number' && output < 0) { output = 0 }
        return output
      })
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
    },
    formatDateString(date) {
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    }
  },
  computed: {
    styles() {
      return {
        width: "95%",
        height: "100vh",
        position: "relative"
      };
    }
  }
};
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.container span {
  z-index: 999;
  width: 100%;
  text-align: left;
  position: absolute;
  top: 0;
  left: 0;
  padding-left: 3px;
  padding-top: 2px;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
