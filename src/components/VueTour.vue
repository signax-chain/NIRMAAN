<template>
  <v-tour name="myTour" :steps="steps"></v-tour>
</template>

<script>
import Vue from "vue";
import VueTour from "vue-tour";
require("vue-tour/dist/vue-tour.css");

Vue.use(VueTour);

export default {
  name: "VueTour",
  data() {
    return {
      steps: [
        {
          target: "#v-step-0", // We're using document.querySelector() under the hood
          header: {
            title: `Hello ${this.$store.state.incubator.currentIncubator.name}! `,
          },
          content: `Welcome to The Startupreneur <strong>Traktor</strong>! platfrom. Let's take a quick tour on the feature available.`,
        },
        {
          target: "#v-step-1",
          content:
            "Here you can find all the startups associated with your incubation cell.",
          params: {
            placement: "left", // Any valid Popper.js placement. See https://popper.js.org/popper-documentation.html#Popper.placements
          },
        },
        {
          target: "#v-step-3",
          content:
            "Try it, you'll love it!<br>You can put HTML in the steps and completely customize the DOM to suit your needs.",
          params: {
            placement: "top", // Any valid Popper.js placement. See https://popper.js.org/popper-documentation.html#Popper.placements
          },
        },
      ],
    };
  },
  mounted: function () {
    this.$tours["myTour"].start();
  },
};
</script>

<style scoped>
.v-step-button {
  background: #3aa959 !important;
}
</style>