<template>
  <div>
    <v-breadcrumbs :items="crumbs"></v-breadcrumbs>
    <h3 class="heading">Settings</h3>
    <div class="wrapper mx-5">
      <sectors :incubatorId="incubatorId"></sectors>
    </div>
  </div>
</template>

<script>
import Sectors from "../../components/Incubator/Settings/Sectors.vue";
export default {
  components: { Sectors },
  name: "IncubatorSettings",
  data() {
    return {
      crumbs: [
        {
          text: "Settings",
          disabled: true,
        },
        {
          text: "Configure",
          disabled: true,
        },
      ],
      incubatorId: null,
    };
  },
  created() {
    this.incubatorId = this.$store.state.incubator.currentIncubator.docId;
  },
};
</script>

<style scoped>
.wrapper {
  background-color: #fff;
  border: 1px solid #dbdbdb;
  border-radius: 5px;
  padding: 1rem 1rem 3rem 1rem;
}

.heading {
  color: #4d4d4d;
  margin: 0 1rem 1rem 1.5rem;
  font-weight: 500;
}
</style>