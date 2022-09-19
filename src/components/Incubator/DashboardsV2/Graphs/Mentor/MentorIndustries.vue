<template>
  <div>
    <v-select
      :items="mentors"
      outlined
      dense
      v-model="mentorValue"
      item-text="text"
      item-value="value"
      label="Select"
      @change="handleTopMentors"
      return-object
    ></v-select>
    <apexchart
      height="350"
      :options="chartOptions"
      :series="series"
      ref="chart"
    ></apexchart>
  </div>
</template>

<script>
import { getIndustries } from "../../../../../services/graphs/mentor/metorIndustry";

export default {
  data() {
    return {
      series: [6,6,5],
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
          text: "Most represented specializations",
        },
        dataLabels: {
          formatter: function (val, opts) {
            return opts.w.config.series[opts.seriesIndex];
          },
        },
      },
      mentors: [
        {
          text: "Top 3",
          value: 3,
        },
        {
          text: "Top 5",
          value: 5,
        },
        {
          text: "Top 10",
          value: 10,
        },
      ],
      mentorValue: {
        text: "Top 3",
        value: 3,
      },
    };
  },
  created() {
    this.initializeGraph();
  },
  methods: {
    async initializeGraph() {
      const data = await getIndustries(this.mentorValue);
      this.$refs.chart.series = Object.values(data);
      this.chartOptions = {
        ...this.chartOptions,
        ...{ labels: Object.keys(data) },
      };
    },
    async handleTopMentors() {
      await this.initializeGraph();
    },
  },
};
</script>

<style>
</style>