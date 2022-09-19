<template>
  <div>
    <!-- <img
      src="../../../../../assets/images/graphs/startups-per-mentor.svg"
      alt=""
      width="100%"
    /> -->
    <apexchart
      height="350"
      :options="chartOptions"
      :series="series"
      ref="apexChart"
    ></apexchart>
  </div>
</template>

<script>
import { getStartups } from "../../../../../services/graphs/mentor/startupsPerMentor";

export default {
  data() {
    return {
      series: [
        {
          name: "Avg Startups per mentor",
          data: [],
        },
      ],
      chartOptions: {
        chart: {
          height: 350,
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
          offsetY: -20,
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
          text: "Average Startups per mentor",
        },
      },
    };
  },
  created() {
    this.initializeGraph();
  },
  methods: {
    async initializeGraph() {
      const data = await getStartups();
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