<template>
  <v-container>
    <v-row class="mt-5">
      <v-col cols="12" md="3">
        <v-autocomplete
          outlined
          label="Select field"
          :items="fileds"
          @change="onChangeField()"
          v-model="selectedField"
        ></v-autocomplete>
      </v-col>
      <v-col cols="12" md="3" v-if="selectedField === 'Startup'">
        <v-autocomplete
          outlined
          label="Select Startup"
          :items="startups"
          v-model="selectedStartup"
          item-text="name"
          item-value="docId"
        ></v-autocomplete>
      </v-col>
      <v-col cols="12" md="3" v-if="selectedField === 'Mentor'">
        <v-autocomplete
          outlined
          label="Select Mentor"
          :items="mentors"
          v-model="selectedMentor"
          item-text="name"
          item-value="docId"
        ></v-autocomplete>
      </v-col>
      <v-col cols="12" md="3">
        <v-autocomplete
          outlined
          label="Select Status"
          :items="status"
          v-model="stage"
        ></v-autocomplete>
      </v-col>
      <v-col cols="12" md="3">
        <v-file-input
          outlined
          label="Upload document"
          v-model="document"
        ></v-file-input>
      </v-col>
      <v-col cols="12" md="12">
        <v-textarea label="Comment" outlined v-model="description"></v-textarea>
      </v-col>
      <v-col cols="12" md="12">
        <v-btn
          color="traktor"
          class="white--text ml-auto d-block"
          @click="submit()"
          >Submit</v-btn
        >
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {
  startupsRef,
  mentorsRef,
  startupProgressRef,
  mentorProgressRef,
} from "../../config/firebase_services";
import { uploadFile } from "../../_helpers/FileUpload";

export default {
  name: "ProgressUpdate",
  data() {
    return {
      fileds: ["Startup", "Mentor"],
      selectedField: "Startup",
      startups: [],
      selectedStartup: null,
      selectedMentor: null,
      mentors: [],
      status: [
        "General",
        "Idea",
        "Prototype",
        "MVP",
        "Pivoted",
        "Early Traction",
        "Seed Funding",
        "Product Market Fit",
        "VC Funding",
        "Scaling",
        "Jobs Created",
        "Internal Seed Funding",
        "Awards and Recognitions",
        "Media Mentions",
        "Exit",
      ],
      stage: null,
      document: null,
      description: null,
    };
  },
  async created() {
    let documents = await startupsRef
      .where(
        "incubatorId",
        "==",
        this.$store.state.incubator.currentIncubator.docId
      )
      .where("isDeleted", "==", false)
      .get();

    documents.forEach((document) => {
      if (document.exists) {
        this.startups.push(document.data());
      }
    });

    documents = await mentorsRef
      .where(
        "incubatorId",
        "==",
        this.$store.state.incubator.currentIncubator.docId
      )
      .where("isDeleted", "==", false)
      .get();

    documents.forEach((document) => {
      if (document.exists) {
        this.mentors.push(document.data());
      }
    });
  },
  methods: {
    onChangeField() {
      const selectedField = this.selectedField;
      if (selectedField === "Startup") {
        this.status = [
          "General",
          "Idea",
          "Prototype",
          "MVP",
          "Pivoted",
          "Early Traction",
          "Seed Funding",
          "Product Market Fit",
          "VC Funding",
          "Scaling",
          "Jobs Created",
          "Internal Seed Funding",
          "Awards and Recognitions",
          "Media Mentions",
          "Exit",
        ];
      }

      if (selectedField === "Mentor") {
        this.status = ["Active", "Inactive", "On a break", "Exit"];
      }
    },
    async submit() {
      if (this.stage === null) {
        this.$toast.error("Stage cannot be empty!", {
          position: "top",
        });
        return;
      }

      if (this.selectedField === "Startup") {
        if (this.selectedStartup === null || this.selectedStartup === "") {
          this.$toast.error("Startup cannot be empty!", {
            position: "top",
          });
          return;
        }
      }

      if (this.selectedField === "Mentor") {
        if (this.selectedMentor === null || this.selectedMentor === "") {
          this.$toast.error("Mentor cannot be empty!", {
            position: "top",
          });
          return;
        }
      }

      this.$store.dispatch("SHOW_LOADER", { isShowing: true });

      if (this.document !== null && typeof this.document === "object") {
        const downloadURL = await uploadFile(
          this.document,
          "progressUpdateDocs"
        );
        this.uploadData(downloadURL);
        this.$store.dispatch("SHOW_LOADER", { isShowing: false });
      } else {
        this.uploadData(null);
        this.$store.dispatch("SHOW_LOADER", { isShowing: false });
      }
    },

    async uploadData(downloadURL) {
      const data = {};

      if (this.selectedField === "Startup") {
        const obj = this.startups.find(
          (startup) => startup.docId === this.selectedStartup
        );
        data.startup = obj;
        data.incubator = this.$store.state.incubator.currentIncubator;
        data.stage = this.stage;
        data.document = downloadURL;
        data.description = this.description;
        data.createdAt = new Date();

        try {
          await startupProgressRef.add(data);
          await startupsRef
            .doc(data.startup.docId)
            .set({ stage: data.stage }, { merge: true });
          this.$toast.success("Updated", {
            position: "top",
          });
        } catch (error) {
          this.$toast.error(error, {
            position: "top",
          });
        }
      }

      if (this.selectedField === "Mentor") {
        const obj = this.mentors.find(
          (mentor) => mentor.docId === this.selectedMentor
        );
        data.mentor = obj;
        data.incubator = this.$store.state.incubator.currentIncubator;
        data.stage = this.stage;
        data.document = downloadURL;
        data.description = this.description;
        data.createdAt = new Date();

        try {
          await mentorProgressRef.add(data);
          await mentorsRef
            .doc(data.mentor.docId)
            .set({ stage: data.stage }, { merge: true });
          this.$toast.success("Updated", {
            position: "top",
          });
        } catch (error) {
          this.$toast.error(error, {
            position: "top",
          });
        }
      }
    },
  },
};
</script>

<style scoped>
.v-btn {
  text-transform: capitalize;
}
</style>