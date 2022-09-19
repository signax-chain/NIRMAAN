<template>
  <div>
    <!-- <img src="../../../../../assets/images/graphs/gender-founders.svg" alt="" width="100%" /> -->
    <apexchart :options="chartOptions" :series="series" width="400"></apexchart>
  </div>
</template>

<script>
import { getFounders } from "../../../../../services/graphs/startup/genderFounder";

export default {
  data() {
    return {
      series: [44, 55],
      chartOptions: {
        chart: {
          type: "donut",
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
          text: "Gender vs Founder",
        },
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
            },
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
      const data = await getFounders();
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