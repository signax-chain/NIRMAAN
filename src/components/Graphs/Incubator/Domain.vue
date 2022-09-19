<template>
  <v-container>
    <fullscreen ref="fullscreen" @change="fullscreenChange">
      <graph-pie
        :width="width"
        :height="height"
        :padding-top="50"
        :padding-bottom="50"
        :padding-left="50"
        :padding-right="50"
        :values="values"
        :names="sectors"
        :active-index="[0, 2]"
        :active-event="'click'"
        :show-text-type="'outside'"
        :data-format="dataFormat"
      >
        <legends :names="sectors"></legends>
        <tooltip :names="sectors"></tooltip>
      </graph-pie>
    </fullscreen>
    <v-icon type="button" class="ml-auto d-block" @click="toggle"
      >mdi-fullscreen</v-icon
    >
  </v-container>
</template>

<script>
import { startupsRef } from "../../../config/firebase_services";

export default {
  name: "Domain",
  data() {
    return {
      values: [],
      sectors: [],
      fullscreen: false,
      // width: 400,
      // height: 400
    };
  },
  computed: {
    width: function () {
      return this.fullscreen === true ? "100vw" : 350;
    },
    height: function () {
      return this.fullscreen === true ? "100vh" : 350;
    },
  },
  async created() {
    await startupsRef.onSnapshot((snapshot) => {
      this.sectors = [];
      snapshot.forEach((document) => {
        this.sectors.push(document.data()["sector"]);
      });
      let counts = {};
      this.sectors.forEach(function (x) {
        counts[x] = (counts[x] || 0) + 1;
      });
      this.values = Object.values(counts);
    });
  },
  methods: {
    dataFormat: function (a, b) {
      if (b) return b + "%";
      return a;
    },
    toggle() {
      this.$refs["fullscreen"].toggle(); // recommended
    },
    fullscreenChange(fullscreen) {
      this.fullscreen = fullscreen;
    },
  },
};
</script>

<style scoped>
</style>