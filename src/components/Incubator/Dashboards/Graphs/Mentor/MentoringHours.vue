<template>
  <apexchart height="350" :options="chartOptions" :series="series"></apexchart>
</template>

<script>
import { getMentoringHours } from "../../../../../services/graphs/mentor/mentoringHours";

export default {
  name: "MentoringHours",
  data() {
    return {
      series: [
        {
          name: "Mentoring Hours",
          data: [],
        },
      ],
      chartOptions: {
        chart: {
          height: 350,
          type: "bar",
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
          text: "Mentoring hours",
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
        // tooltip: {
        //   custom: function (opts) {
        //     const hours = opts.w.globals.series[0][opts.seriesIndex];
        //     console.log(hours);
        //   },
        // },
      },
    };
  },
  created() {
    this.initializeGraph();
  },
  methods: {
    async initializeGraph() {
      const data = await getMentoringHours();
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