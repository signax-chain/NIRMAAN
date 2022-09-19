<template>
  <div>
    <div class="d-flex justify-space-between align-center mb-5">
      <h3 class="heading">All Steps</h3>
      <v-btn color="traktor" outlined v-if="currentUser.role === 'incubator'">
        <v-icon dark>mdi-plus-circle</v-icon>
        Add</v-btn
      >
    </div>
    <v-expansion-panels accordion>
      <v-expansion-panel
        v-for="(step, sIndex) in modules[index].steps"
        :key="sIndex"
      >
        <v-expansion-panel-header>
          <template v-slot:default>
            <v-row>
              <v-col cols="12" md="12">
                <div>{{ step }}</div>
              </v-col>
              <v-col cols="12" md="12">
                <v-progress-linear
                  v-model="power"
                  color="traktor"
                  height="15"
                  dark
                >
                  <strong>{{ power }}%</strong>
                </v-progress-linear>
              </v-col>
            </v-row>
          </template>
          <template v-slot:actions>
            <v-btn color="traktor" dark class="ml-3 mt-5">Complete</v-btn>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <h3 class="heading mb-5">Worksheets</h3>
          <work-sheets
            :modules="modules"
            :index="index"
            class="mb-10"
          ></work-sheets>
          <h3 class="heading mb-5">Presentations</h3>
          <presentations
            :modules="modules"
            :index="index"
            class="mb-10"
          ></presentations>
          <h3 class="heading mb-5">Videos</h3>
          <videos :modules="modules" :index="index"></videos>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Presentations from "./Items/Presentations.vue";
import Videos from "./Items/Videos.vue";
import WorkSheets from "./Items/WorkSheets.vue";

export default {
  components: { WorkSheets, Presentations, Videos },
  props: ["modules", "index"],
  data() {
    return {
      power: 0,
    };
  },
  computed: {
    ...mapState({ currentUser: (state) => state.user.currentUser }),
  },
};
</script>

<style scoped>
</style>