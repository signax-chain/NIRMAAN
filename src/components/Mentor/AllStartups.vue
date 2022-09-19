<template>
  <div class="wrapper">
    <startups></startups>
    <div class="list">
      <h3 class="heading">All Startups</h3>
      <v-row>
        <v-col cols="12" md="5">
          <v-text-field
            outlined
            placeholder="Search for startups"
            dense
            append-icon="mdi-magnify"
          ></v-text-field>
        </v-col>
      </v-row>
      <list :mentorId="currentUser.docId"></list>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import List from "@/components/Incubator/Startups";
import Startups from "../../views/Mentor/Startups.vue";

export default {
  name: "AllStartups",
  components: {
    List,
    Startups,
  },
  computed: {
    ...mapState({ currentUser: (state) => state.user.currentUser }),
  },
};
</script>

<style scoped>
.list {
  background-color: #fff;
  border-radius: 5px;
  padding: 1rem 1rem 3rem 1rem;
  margin: 1rem 2rem 2rem 2rem;
}
.heading {
  color: #4d4d4d;
  margin: 0 1rem 1rem 0rem;
  font-weight: 500;
}
</style>