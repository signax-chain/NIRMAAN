<template>
  <!-- <img
    src="../../../../../assets/images/mentor-graph.svg"
    alt=""
    width="100%"
  /> -->
  <apexchart
    height="350"
    :options="chartOptions"
    :series="series"
    ref="apexChart"
  ></apexchart>
</template>

<script>
import { getStartupLogins } from "../../../../../services/graphs/startup/startupLogin";
export default {
    data() {
    return {
      series: [
        {
          name: "Startup Activity",
          data: [],
        },
      ],
      chartOptions: {
        chart: {
          height: 350,
          type: "area",
          zoom: {
            enabled: true,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "smooth",
          colors: ["#3aa959"],
          // show: false,
        },
        grid: {
          row: {
            colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.5,
          },
        },
        xaxis: {
          categories: [],
        },
        fill: {
          colors: ["#3aa959"]
        }
      },
    };
  },
  created() {
    this.initializeGraph();
  },
  methods: {
    async initializeGraph() {
      const data = await getStartupLogins();
      this.series[0].data = Object.values(data);
      this.chartOptions = {
        ...this.chartOptions,
        ...{ xaxis: { categories: Object.keys(data) } },
      };
    },
  },
};
</script>

<style>
</style>