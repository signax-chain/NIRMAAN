<template>
  <div>
    <!-- <img
      src="../../../../../assets/images/graphs/cohort-vs-funding.svg"
      alt=""
      width="100%"
    /> -->
    <apexchart width="380" :options="chartOptions" :series="series"></apexchart>
  </div>
</template>

<script>
import { getCurrentYearFunding } from "../../../../../services/graphs/funding/currentYearFunding";

export default {
  data() {
    return {
      series: [
        {
          name: `${new Date().getFullYear()} cohort vs funding`,
          data: [],
        },
      ],
      chartOptions: {
        chart: {
          width: "100%",
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
            show: true,
          },
          axisTicks: {
            show: true,
          },
          tooltip: {
            enabled: true,
          },
        },
        yaxis: {
          axisBorder: {
            show: true,
          },
          axisTicks: {
            show: true,
          },
          labels: {
            show: true,
            formatter: function (val) {
              return val;
            },
          },
        },
        fill: {
          colors: ["#3aa959"],
        },
        title: {
          text: `${new Date().getFullYear() - 1} cohort vs funding`,
        },
      },
    };
  },
  created() {
    this.initializeGraph();
  },
  methods: {
    async initializeGraph() {
      const data = await getCurrentYearFunding();
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