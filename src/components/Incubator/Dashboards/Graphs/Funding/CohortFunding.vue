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
import { getCohortWiseFunding } from "../../../../../services/graphs/funding/fundingPerCohort";

export default {
  data() {
    return {
      series: [
        {
          name: "Cohort Vs Funding",
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
          text: "Funding by cohort",
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
      const data = await getCohortWiseFunding();
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