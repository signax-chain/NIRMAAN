<template>
  <div class="grid-container">
    <div class="item1">
      <incubators-per-region></incubators-per-region>
    </div>
    <div class="item2">
      <top-performing-incubator></top-performing-incubator>
    </div>
    <div class="item3">
      <least-performing-incubator></least-performing-incubator>
    </div>
  </div>
</template>

<script>
import IncubatorsPerRegion from "../Graphs/Incubators/IncubatorsPerRegion.vue";
import LeastPerformingIncubator from "../Graphs/Incubators/LeastPerformingIncubator.vue";
import TopPerformingIncubator from "../Graphs/Incubators/TopPerformingIncubator.vue";
export default {
  components: {
    IncubatorsPerRegion,
    TopPerformingIncubator,
    LeastPerformingIncubator,
  },
  name: "IncubatorActivity",
};
</script>

<style scoped>
.item1 {
  grid-area: left;
}
.item2 {
  grid-area: top;
}
.item3 {
  grid-area: bottom;
}

.grid-container {
  display: grid;
  grid-template-areas:
    "left top top top top top"
    "left bottom bottom bottom bottom bottom";
  grid-gap: 30px;
  padding: 10px;
}
</style>