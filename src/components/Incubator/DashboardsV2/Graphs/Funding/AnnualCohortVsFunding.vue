<template>
  <div>
    <!-- <img
      src="../../../../../assets/images/graphs/annual-cohort-vs-funding.svg"
      alt=""
      width="100%"
    /> -->
    <apexchart :options="chartOptions" :series="series"></apexchart>
  </div>
</template>

<script>
import { getAnnualCohortFunding } from "../../../../../services/graphs/funding/annualCohortFunding";

export default {
  data() {
    return {
      series: [
        {
          name: "Funding by year",
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
          enabled: true,
        },
        stroke: {
          curve: "straight",
          colors: ["#3aa959"],
          // show: false,
        },
        title: {
          text: "Funding by year",
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
          colors: ["#3aa959"],
        },
      },
    };
  },
  created() {
    this.initializeGraph();
  },
  methods: {
    async initializeGraph() {
      const data = await getAnnualCohortFunding();
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