<template>
  <footer id="more-info">
    <div>
      <img
        :src="require('@/assets/chart-icon-small.png')"
        alt="Chart icon"
        aria-hidden="true"
      />
      <h2>About this chart</h2>
    </div>
    <p>
      This chart shows daily new cases of COVID-19, per million population,
      across Canada and it's provinces. By normalizing the number of cases per
      capita, it allows direct comparisons between provinces and/or the nation
      as a whole.
    </p>
    <p>
      Keep in mind that these numbers don't tell the whole story. The protocols
      around testing vary by province, so these rates only allow a rough
      comparison between regions.
    </p>
    <h3>
      How to use this chart
    </h3>
    <p>
      Click on a region in the legend below the chart to enable/disable it. This allows you to compare rates between various provinces, territories, or the country as a whole. Hover your mouse over an individual datapoint to see it's absolute number of cases.
    </p>
    <h3>Data sources</h3>
    <p>
      The COVID-19 new cases data comes from the CBC. They operate a public API
      that is updated regularily.
    </p>
    <p>
      The population data, used for calculating the per capita rates, comes from
      Statistics Canada.
    </p>
    <h3>
      Normalization of data
    </h3>
    <p>
      Apart from calculating the per capita rates, a small amount of other
      normalization has been performed.
    </p>
    <p>
      Specifically, some provinces do not release new case numbers every day. In
      these cases, we see zero cases reported until the next reported day. That
      next reported day is artificially inflated, because it also represents
      test results from the previous unreported days. This causes misleading,
      extreme peaks and valleys in the chart. To address this problem, the
      unreported days are averaged with the next reported day.
    </p>
    <p>
      For example, if there were two consecutive unreported days, then the
      subsequent day reported 300 new cases, all three days would be normalized
      to 100 each.
    </p>
    <p>
      I feel this makes the chart more legible and also closer to reality. After
      all, there weren't really zero new cases of COVID-19 on those days.
      Currently this normalization is only applied to provinces with significant
      numbers of COVID-19 cases and recurring unreported days (Alberta, BC,
      Ontario).
    </p>
    <h3>Source code</h3>
    <p>
      You can view the source code for this project
      <a
        href="https://github.com/jeremy21212121/covid-new-canada"
        target="_blank"
        rel="noopener noreferer"
        >on GitHub</a
      >. It is MIT licensed, please feel free to use it as you see fit.
    </p>
    <a class="back button--grey ripple" href="#main-chart">Back to the chart</a>
  </footer>
</template>

<style scoped>
footer {
  min-height: 98vh;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 95%;
  margin-top: 1%;
  margin-bottom: 1%;
  padding: 1%;
  color: rgba(0, 0, 0, 0.8);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.08),
    0 5px 26px 0 rgba(67, 94, 131, 0.15);
}
div {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
}
h2,
h3 {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 2em;
  margin-left: 18px;
  color: #35495e;
}
h2 {
  margin: 0 auto;
}
h3 {
  text-align: left;
  font-size: 1.6em;
  margin-left: 18px;
  margin-top: 6px;
}
p {
  text-align: left;
  padding: 0 18px;
  line-height: 1.5;
  margin-top: 6px;
}
img {
  width: 32px;
  height: 32px;
}
a.back {
  display: block;
  margin: 0 auto;
  margin-top: 12px;
}
.ripple {
  background-position: center;
  transition: background 50ms;
  border-color: rgba(0, 0, 0, 0.8);
  color: rgba(0, 0, 0, 0.8);
}
.ripple:hover {
  background: rgba(71, 167, 245, 0.05)
    radial-gradient(circle, transparent 1%, rgba(71, 167, 245, 0.1) 1%)
    center/15000%;
    /* color: #35495e; */
    color: rgba(0, 0, 0, 0.8);
    transition: background 500ms;
}
.ripple:active {
  background-color: rgba(110, 185, 247, 0.2);
  background-size: 100%;
  transition: background 0s;
}
</style>
