<template>
  <div>
    <!-- <img
      src="../../../../../assets/images/graphs/Industry-wise-funded.svg"
      alt=""
      width="100%"
    /> -->
    <apexchart width="380" :options="chartOptions" :series="series"></apexchart>
  </div>
</template>

<script>
import { getSectorWiseFunding } from "../../../../../services/graphs/funding/sectorWiseStartupsFunded";

export default {
  data() {
    return {
      series: [
        {
          name: "Sector wise startups funded",
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
          text: "Sector wise funded startups",
        },
      },
    };
  },
  created() {
    this.initializeGraph();
  },
  methods: {
    async initializeGraph() {
      const data = await getSectorWiseFunding();
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