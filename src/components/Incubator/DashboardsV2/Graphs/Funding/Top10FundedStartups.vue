<template>
  <div>
    <!-- <img
      src="../../../../../assets/images/graphs/top10-funded.svg"
      alt=""
      width="100%"
    /> -->
    <apexchart
      height="350"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </div>
</template>

<script>
import { getTop10FundedStartups } from "../../../../../services/graphs/funding/top10Funded";

export default {
  data() {
    return {
      series: [
        {
          name: "Funding",
          data: [],
        },
      ],
      chartOptions: {
        chart: {
          type: "bar",
          height: 350,
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            horizontal: true,
          },
        },
        dataLabels: {
          enabled: false,
        },
        // tooltip: {
        //   y: {
        //     formatter: function (val) {
        //       return val.loLocaleString();
        //     },
        //   },
        // },
        xaxis: {
          categories: [],
        },
        fill: {
          colors: ["#3aa959"],
        },
        title: {
          text: "Top 10 funded startups",
        },
      },
    };
  },
  created() {
    this.initializeGraph();
  },
  methods: {
    async initializeGraph() {
      const data = await getTop10FundedStartups();
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