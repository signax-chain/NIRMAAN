<template>
  <v-container>
    <fullscreen ref="fullscreen" @change="fullscreenChange">
      <apexchart
        type="bar"
        :width="width"
        :height="height"
        :options="chartOptions"
        :series="series"
      ></apexchart>
    </fullscreen>
    <v-icon type="button" class="ml-auto d-block" @click="toggle"
      >mdi-fullscreen</v-icon
    >
  </v-container>
</template>

<script>
import firebase from "firebase";

export default {
  name: "Stage",
  data() {
    return {
      fullscreen: false,
      series: [
        {
          data: [
            400,
            430,
            448,
            470,
            540,
            580,
            690,
            1100,
            1200,
            1380,
            400,
            430,
            448,
            470,
            540,
            580,
            690,
            1100,
            1200,
            1380,
            400,
            430,
            448,
            470,
            540,
            580,
            690,
            1100,
            1200,
            1380,
            100,
          ],
        },
      ],
      chartOptions: {
        chart: {
          type: "bar",
        },
        plotOptions: {
          bar: {
            horizontal: true,
            endingShape: "rounded",
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          width: 2,
        },
        grid: {
          row: {
            colors: ["#fff", "#f2f2f2"],
          },
        },
        xaxis: {
          labels: {
            // rotate: -45
          },
          categories: [],
          tickPlacement: "on",
          title: {
            text: "Stage",
          },
        },
        yaxis: {
          title: {
            text: "Startups",
          },
          labels: {
            rotate: -45,
          },
        },
      },
    };
  },
  computed: {
    width: function () {
      return this.fullscreen === true ? "100vw" : "350";
    },
    height: function () {
      return this.fullscreen === true ? "100vh" : "350";
    },
  },
  async created() {
    await firebase
      .firestore()
      .collection("startups")
      .onSnapshot((snapshot) => {
        this.startups = [];
        snapshot.forEach((document) => {
          this.chartOptions.xaxis.categories.push(document.data()["name"]);
        });
        // let counts = {}
        // this.sectors.forEach(function(x) { counts[x] = (counts[x] || 0)+1; });
        // this.values = Object.values(counts)
      });
  },
  methods: {
    toggle() {
      this.$refs["fullscreen"].toggle(); // recommended
    },
    fullscreenChange(fullscreen) {
      this.fullscreen = fullscreen;
    },
  },
};
</script>