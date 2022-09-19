<template>
  <div id="chart">
    <apexchart
      height="350"
      :options="chartOptions"
      :series="series"
      ref="apexChart"
    ></apexchart>
  </div>
</template>

<script>
import { getCohorts } from "../../../../../services/graphs/startup/startupsPerCohort";

export default {
  data() {
    return {
      series: [
        {
          name: "Startups per cohort",
          data: [],
        },
      ],
      chartOptions: {
        chart: {
          type: "bar",
        },
        plotOptions: {
          bar: {
            borderRadius: 10,
            dataLabels: {
              position: "top", // top, center, bottom
            },
          },
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return val;
          },
          offsetY: 0,
          style: {
            fontSize: "12px",
            colors: ["#304758"],
          },
        },
        xaxis: {
          categories: [],
          position: "top",
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
          tooltip: {
            enabled: true,
          },
        },
        yaxis: {
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
          labels: {
            show: false,
            formatter: function (val) {
              return val;
            },
          },
        },
        fill: {
          colors: ["#3aa959"],
        },
        title: {
          // text: "Startups per cohort",
          floating: true,
          offsetY: 330,
          align: "center",
          style: {
            color: "#444",
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
      const data = await getCohorts();
      this.series[0].data = Object.values(data);
      this.chartOptions = {
        ...this.chartOptions,
        ...{ xaxis: { categories: Object.keys(data) } },
      };
    },
  },
};
</script>

<style scoped>
</style>