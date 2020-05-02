# COVID-19 New Cases per Capita in Canada

CBC has some good charts for exploring COVID-19 data. Unfortunately, comparing absolute numbers across provinces with very different populations does not allow for easy comparison.

Fortunately, CBCs APIs are publically accessible. So I built this chart of new cases per million people. This makes the chart more interesting, to me at least.

# Method

I took the latest population figures for Canada and the provinces from StatsCan, and corrected the figures from CBC's API to be per million in population.

BC does not announce numbers on Sundays. Most charts just show a zero for that day, which I believe to be deceptive. As such, I simply don't include a data point for BC for Sundays, and I use Chart.js's ```spanGaps``` option to avoid a break in the line.

# Use

By default, only the line for Canada is shown. By clicking on the desired province in the legend, you can compare new cases between the provinces and the national average.

Absolute numbers can be seen by hovering over individual data points.

# Stack

Server-side rendered with Nuxt.js/Vue.js, proxied by NGINX on my personal web server.

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
