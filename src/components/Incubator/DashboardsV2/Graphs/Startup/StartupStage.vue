<template>
  <div>
    <!-- <img
      src="../../../../../assets/images/graphs/startups-by-de.svg"
      alt=""
      width="100%"
    /> -->
    <apexchart
      width="400"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </div>
</template>

<script>
import { getStartupsByDe } from "../../../../../services/graphs/startup/startupsByDe";

export default {
  data() {
    return {
      series: [44, 55, 41],
      chartOptions: {
        chart: {
          type: "pie",
        },
        labels: [],
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 250,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
        title: {
          text: "Startups by DE",
        },
        dataLabels: {
          formatter: function (val, opts) {
            return opts.w.config.series[opts.seriesIndex];
          },
        },
      },
      plotOptions: {
        pie: {
          labels: {
            show: true,
          },
        },
      },
    };
  },
  created() {
    this.initializeGraph();
  },
  methods: {
    async initializeGraph() {
      const data = await getStartupsByDe();
      this.series = Object.values(data);
      this.chartOptions = {
        ...this.chartOptions,
        ...{ labels: Object.keys(data) },
      };
    },
  },
};
</script>

<style>
</style>