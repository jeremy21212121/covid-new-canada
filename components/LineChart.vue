<script>
import population from '@/static/population.js'
import { Line, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  name: 'LineChart',
  extends: Line,
  mixins: [reactiveProp],
  props: ['apiData'],
  data() {
    return {
      options: {
        responsive: true,
        maintainAspectRatio: false,
        spanGaps: true,
        title: {
          display: false,
					text: 'Daily New Cases of COVID-19 Per Capita'
        },
        legend: {
          position: 'bottom'
        },
        tooltips: {
          callbacks: {
            label(ttItem, data) {
              const visibleDatasets = data.datasets
              if (visibleDatasets.length > ttItem.datasetIndex) {
                const name = visibleDatasets[ttItem.datasetIndex].label || ''
                const { population: pop } = population.find(popObj => popObj.province === name)
                // const originalData = this.apiData.data[ttItem.index].rows[initials]
                const absolute = Math.round((pop / 1000000) * parseFloat(ttItem.value))
                return `${name} total: ${absolute}`
              } else {
                console.log(ttItem.datasetIndex, visibleDatasets.length)
              }

            }
          }
        },
				scales: {
					xAxes: [{
						type: 'time',
						time: {
							parser: 'MM/DD/YYYY HH:mm',
							round: 'day',
							tooltipFormat: 'll'
						},
						scaleLabel: {
							display: true,
							labelString: 'Date'
						}
					}],
					yAxes: [{
						scaleLabel: {
							display: true,
							labelString: 'New cases per million people'
						}
					}]
				}
      }
    }
  },
  mounted () {
    // this.chartData is created in the mixin.
    // If you want to pass options please create a local options object
    this.renderChart(this.chartData, this.options)
  }
}
</script>

