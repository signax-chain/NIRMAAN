<template>
  <div class="wrapper">
    <v-row>
      <v-col
        cols="12"
        md="3"
        v-for="(startup, index) in startups"
        :key="index"
        class="d-flex align-center"
        @click="goto(startup.docId)"
      >
        <img :src="startup.photoURL" alt="" />
        <h4 class="ml-3">{{ startup.name }}</h4>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { getStartupsDataByIncubatorId } from "../../../../services/dynamics";
export default {
  data() {
    return {
      startups: [],
    };
  },
  created() {
    this.getStartups();
  },
  methods: {
    async getStartups() {
      this.startups = await getStartupsDataByIncubatorId(
        this.$store.state.incubator.currentIncubator.docId
      );
      this.startups = this.startups.slice(0, 4);
    },
    goto(id) {
      this.$router.push(`/startup/${id}`);
    },
  },
};
</script>

<style scoped>
.wrapper {
  background-color: #3aa959;
  border-radius: 5px;
  padding: 1rem;
  color: #fff;
}

img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
</style>