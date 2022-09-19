<template>
  <div>
    <v-select
      :items="sectors"
      outlined
      dense
      v-model="sectorValue"
      item-text="text"
      item-value="value"
      label="Select"
      @change="handleTopSectors"
      return-object
    ></v-select>
    <apexchart
      width="100%"
      :options="chartOptions"
      :series="series"
      ref="apexChart"
    ></apexchart>
  </div>
</template>

<script>
import { getSectors } from "../../../../../services/graphs/startup/startupsPerSector";

export default {
  data() {
    return {
      series: [
        {
          name: "",
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
      },
      sectors: [
        {
          text: "Top 3 Sectors",
          value: 3,
        },
        {
          text: "Top 5 Sectors",
          value: 5,
        },
        {
          text: "Top 10 Sectors",
          value: 10,
        },
      ],
      sectorValue: {
        text: "Top 3 Sectors",
        value: 3,
      },
    };
  },
  created() {
    this.initializeGraph();
  },
  methods: {
    async initializeGraph() {
      const data = await getSectors(this.sectorValue);
      this.series[0].data = Object.values(data);
      this.chartOptions = {
        ...this.chartOptions,
        ...{ xaxis: { categories: Object.keys(data) } },
      };
    },
    async handleTopSectors() {
      await this.initializeGraph();
    },
  },
};
</script>

<style>
</style>