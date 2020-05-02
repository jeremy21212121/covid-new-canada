<template>
  <div class="container">
    <span v-if="error">
      Sorry, error getting data. Please try again later.
    </span>
    <span v-if="ready" :title="'Updated ' + newCases.last_updated + ' GMT'">Last updated {{ humanTime(new Date(newCases.last_updated+'Z').getTime()) }} ago</span>
    <client-only>
      <line-chart v-if="ready" :chart-data="chartdata" :styles="styles" :apiData="newCases" />
    </client-only>
  </div>
</template>

<script>
// import Logo from '~/components/Logo.vue'
import axios from '@nuxtjs/axios'
// population data for the nation and the provinces/territories
import population from '@/static/population.js'
// convert hex color string to RGB values
import hexToRgb from '@/static/hexToRgb.js'
// human-readable durations
import humanTime from '@/utils/humanTime'
import LineChart from '@/components/LineChart'

export default {
  name: 'Main',
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
      colors: ["#F70000","#B9264F","#990099","#74138C","#0000CE","#1F88A7","#4A9586","#FFBE28","#B96F6F","#1FCB4A","#59955C","#01FCEF","#F900F9", "#999999"]
    }
  },
  async fetch() {
    const response = await this.$axios.get('https://canopy.cbc.ca/live/covid_data/api/canada/daily/new_cases').catch(function(e) { this.error = e})
    if (response.status === 200) {
      this.newCases = response.data
    }
  },
  mounted() {
    if (this.error) { return }
    this.labels = this.generateLabels(this.newCases.data)
    this.datasets = this.generateDatasets(this.newCases.data)
    this.chartdata = {
      labels: this.labels,
      datasets: this.datasets
    }
    // generate chart
    this.ready = true
  },
  methods: {
    humanTime,
    hexToRgb,
    arrayToRgbaString(arr) {
      return `rgba(${arr.reduce((a,b)=> `${a},${b}`)})`
    },
    generateLabels(data) {
      // generate chart.js labels from the API response
      let output = []
      if (data && data.length) {
        output = data.map(obj => {
          let date = new Date(obj.date)
          // timezone offset in ms
          let msOffset = date.getTimezoneOffset() * 60 * 1000
          // correct datetime for user timezone
          return new Date(date.getTime() + msOffset)
        })
      }
      return output
    },
    generateDatasets(data) {
      // generate chart.js datasets from the API response
      let dataset = []
      if (data && data.length) {
        dataset = this.population.map((popObj, index) => {
          return {
            label: popObj.province,
            backgroundColor: this.arrayToRgbaString([...this.hexToRgb(this.colors[index]), 0.5]),
            borderColor: this.arrayToRgbaString([...this.hexToRgb(this.colors[index]), 1]),
            fill: false,
            hidden: popObj.initials !== 'Canada',
            data: data.map(dataObj => {
              // BC reports 0 cases every sunday, but that does not reflect reality. Use null instead of zero for those data points.
              // options.spanGap prevents gaps in the line
              let output = null
              if (!(popObj.initials === 'BC' && new Date(dataObj.date).getUTCDay() === 0)) {
                output = dataObj.rows[popObj.initials] / (popObj.population / this.per)
              }
              return output
            })
          }
        })
      }
      return dataset
    },
    formatDateString(date) {
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
    }
  },
  computed: {
    styles() {
      return {
        width: '95%',
        height: '100vh',
        position: 'relative'
      }
    }
  }
}
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
  padding-left: 3px;
  padding-top: 2px;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
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
