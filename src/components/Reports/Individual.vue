<template>
  <v-container>
    <v-form>
      <v-row>
        <v-col cols="12" md="4">
          <v-autocomplete
            label="Select field"
            outlined
            :items="fields"
            v-model="selectedField"
            @change="handleField"
          ></v-autocomplete>
        </v-col>
        <v-col cols="12" md="4">
          <v-autocomplete
            label="Select startup"
            outlined
            :items="startups"
            item-text="name"
            item-value="docId"
            v-if="selectedField === 'Startup'"
            v-model="user"
          ></v-autocomplete>
          <v-autocomplete
            label="Select mentor"
            outlined
            :items="mentors"
            item-text="name"
            item-value="docId"
            v-if="selectedField === 'Mentor'"
            v-model="user"
          ></v-autocomplete>
        </v-col>
        <v-col cols="12" md="4">
          <v-autocomplete
            label="Select report type"
            outlined
            :items="reportType"
            v-model="type"
          ></v-autocomplete>
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
import { startupsRef, mentorsRef } from "../../config/firebase_services";
import "../../mixins/_helpers";
import _helpers from "../../mixins/_helpers";

export default {
  name: "Individual",
  data() {
    return {
      fields: ["Startup", "Mentor"],
      selectedField: "Startup",
      startups: [],
      mentors: [],
      reportType: ["One page report"],
      user: null,
      type: null,
    };
  },
  mixins: [_helpers],
  created() {
    this.getStartups();
    this.getMentors();
  },
  methods: {
    async getStartups() {
      const documents = await startupsRef
        .where(
          "incubatorId",
          "==",
          this.$store.state.incubator.currentIncubator.docId
        )
        .where("isDeleted", "==", false)
        .get();

      documents.forEach((document) => {
        this.startups.push(document.data());
      });
    },
    async getMentors() {
      const documents = await mentorsRef
        .where(
          "incubatorId",
          "==",
          this.$store.state.incubator.currentIncubator.docId
        )
        .where("isDeleted", "==", false)
        .get();

      documents.forEach((document) => {
        this.mentors.push(document.data());
      });
    },
    handleField() {
      this.user = null;
    },
    exportReport() {
      if (this.user === null) {
        this.$toast.error(
          `Select a valid ${this.selectedField} to export report!`,
          {
            position: "top",
          }
        );
        return;
      }

      if (this.type === null) {
        this.$toast.error("Select the report type", {
          position: "top",
        });
        return;
      }

      const link = `${this.getCurrentOrigin()}/report/ir/${this.selectedField
        .charAt(0)
        .toLowerCase()}/${this.user}`;
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