<template>
  <div>
    <!-- <img
      src="../../../../../assets/images/graphs/startups-vs-sectors.svg"
      alt=""
      width="100%"
    /> -->
    <v-select
      label="Select top sectors"
      outlined
      dense
      v-model="sector"
      :items="options"
      @change="handleSectors"
    ></v-select>
    <apexchart
      width="550"
      :options="chartOptions"
      :series="series"
      ref="apexChart"
    ></apexchart>
  </div>
</template>

<script>
import { getSectorWiseFunding } from "../../../../../services/graphs/funding/sectorWiseStartupsFunded";

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
              legend: {
                position: "bottom",
              },
            },
          },
        ],
        title: {
          text: "Most funded sectors",
        },
        dataLabels: {
          formatter: function (val, opts) {
            return opts.w.config.series[opts.seriesIndex];
          },
        },
      },
      sector: "Top 3 sectors",
      options: ["Top 3 sectors", "Top 5 sectors", "Top 10 sectors"],
    };
  },
  created() {
    this.initializeGraph();
  },
  methods: {
    async initializeGraph() {
      const data = await getSectorWiseFunding(this.sector.split(" ")[1]);
      this.series = Object.values(data);
      this.chartOptions = {
        ...this.chartOptions,
        ...{ labels: Object.keys(data) },
      };
    },
    handleSectors() {
      this.initializeGraph();
    },
  },
};
</script>

<style>
</style>