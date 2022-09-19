<template>
  <div>
    <!-- <img
      src="../../../../../assets/images/graphs/mentors-vs-industry.svg"
      alt=""
      width="100%"
    /> -->
    <apexchart
      type="pie"
      width="380"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </div>
</template>

<script>
import { getIndustries } from "../../../../../services/graphs/mentor/metorIndustry";

export default {
  data() {
    return {
      series: [],
      chartOptions: {
        chart: {
          width: 380,
          type: "pie",
        },
        labels: [],
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
        title: {
          text: "Mentor Vs Industry",
        },
      },
    };
  },
  created() {
    this.initializeGraph();
  },
  methods: {
    async initializeGraph() {
      const data = await getIndustries();
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