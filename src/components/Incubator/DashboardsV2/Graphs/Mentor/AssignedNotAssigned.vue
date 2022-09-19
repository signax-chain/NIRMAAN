<template>
  <div>
    <!-- <img
      src="../../../../../assets/images/graphs/assigned-vs-not-assigned.svg"
      alt=""
      width="100%"
    /> -->
    <apexchart :options="chartOptions" :series="series" width="350"></apexchart>
  </div>
</template>

<script>
import { getAssignedAndNotAssignedStartups } from "../../../../../services/graphs/mentor/assignedNotAssigned";

export default {
  data() {
    return {
      series: [44, 55, 41, 17, 15],
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
                width: 500,
                height: 300,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
        title: {
          text: "Assigned vs Not Assigned",
        }
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
      const data = await getAssignedAndNotAssignedStartups();
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