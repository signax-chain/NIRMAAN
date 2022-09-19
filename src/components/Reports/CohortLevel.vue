<template>
  <v-container>
    <v-form>
      <v-row>
        <v-col cols="12" md="6">
          <v-select
            label="Select cohort name"
            outlined
            :items="cohorts"
            item-text="name"
            item-value="name"
            v-model="cohortName"
          ></v-select>
        </v-col>
        <v-col cols="12" md="6">
          <v-select
            label="Select cohort year"
            outlined
            :items="cohorts"
            item-text="year"
            item-value="year"
            v-model="cohortYear"
          ></v-select>
        </v-col>
        <v-col cols="12" md="12">
          <v-btn
            color="traktor"
            class="white--text d-flex ml-auto"
            @click="exportReport()"
            >Export</v-btn
          >
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
import { startupsRef } from "../../config/firebase_services";
import _helpers from "../../mixins/_helpers";

export default {
  name: "CohortLevel",
  data() {
    return {
      cohorts: [],
      cohortName: null,
      cohortYear: null,
    };
  },
  mixins: [_helpers],
  created() {
    this.getCohorts();
  },
  methods: {
    async getCohorts() {
      const documents = await startupsRef
        .where(
          "incubatorId",
          "==",
          this.$store.state.incubator.currentIncubator.docId
        )
        .where("isDeleted", "==", false)
        .get();

      documents.forEach((document) => {
        this.cohorts.push(document.data()["cohort"]);
      });
    },
    exportReport() {
      if (this.cohortName === null) {
        this.$toast.error(`Select a valid cohort name to export the report!`, {
          position: "top",
        });
        return;
      }

      if (this.cohortYear === null) {
        this.$toast.error("a valid cohort name to export the report!", {
          position: "top",
        });
        return;
      }

      const link = `${this.getCurrentOrigin()}/report/clr/${this.cohortName}/${
        this.cohortYear
      }`;
      const win = window.open(link, "_blank");
      win.focus();
    },
  },
};
</script>

<style scoped>
.v-btn {
  text-transform: capitalize;
}
</style>