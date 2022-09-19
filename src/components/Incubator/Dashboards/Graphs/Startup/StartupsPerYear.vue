<template>
  <div>
    <apexchart
      height="350"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </div>
</template>

<script>
import { getStartupsByYear } from "../../../../../services/graphs/startup/startupsPerYear";

export default {
  data() {
    return {
      series: [
        {
          name: "Startups per year",
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
          colors: ["#3aa959"],
        },
        stroke: {
          curve: "smooth",
          colors: ["#3aa959"],
        },
        title: {
          text: "Startups per year",
          align: "left",
        },
        grid: {
          row: {
            colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.5,
          },
        },
        fill: {
          colors: ["#3aa959"],
        },
        xaxis: {
          categories: [],
        },
      },
    };
  },
  created() {
    this.initializeGraph();
  },
  methods: {
    async initializeGraph() {
      const data = await getStartupsByYear();
      console.log(data);
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