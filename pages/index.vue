<template>
  <div class="container" id="main-chart">
    <h1 class="title">Daily new cases of COVID-19 in Canada</h1>
    <span v-if="error">Sorry, error getting data. Please try again later.</span>
    <info-widget v-if="ready && !error" :updated="newCases.last_updated" />
    <client-only>
      <line-chart
        v-if="ready"
        :chart-data="chartdata"
        :styles="styles"
        :apiData="newCases"
      />
    </client-only>
    <more-info />
  </div>
</template>

<script>
// import Logo from '~/components/Logo.vue'
import axios from "@nuxtjs/axios";
// population data for the nation and the provinces/territories
import population from "@/static/population.js";
// converts hex color string to RGB values
import hexToRgb from "@/static/hexToRgb.js";
import LineChart from "@/components/LineChart";
import InfoWidget from "@/components/InfoWidget.vue";
import MoreInfo from "@/components/MoreInfo.vue";
// functions used for processing data from API
import DataMixin from "@/mixins/dataProcessing.js";

export default {
  name: "Main",
  components: {
    LineChart,
    InfoWidget,
    MoreInfo
  },
  mixins: [
    DataMixin
  ],
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
      colors: ["#F70000","#B9264F","#990099","#74138C","#0000CE","#1F88A7","#4A9586","#FFBE28","#B96F6F","#1FCB4A","#59955C","#01FCEF","#F900F9","#999999"]
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
    // humanTime,
    hexToRgb,
    arrayToRgbaString(arr) {
      return `rgba(${arr.reduce((a, b) => `${a},${b}`)})`;
    },
    formatDateString(date) {
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    }
  },
  computed: {
    styles() {
      return {
        width: "95%",
        height: "90vh",
        position: "relative",
        boxShadow:
          "0 1px 3px 0 rgba(0,0,0,.08), 0 5px 26px 0 rgba(67,94,131,.15)",
        marginTop: "1%"
      };
    }
  }
};
</script>

<style scoped>
.container {
  margin: 0 auto;
  /* min-height: 100vh; */
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
  font-size: 2em;
  color: #35495e;
  letter-spacing: 1px;
  text-transform: capitalize;
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
