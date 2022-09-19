<template>
  <v-row justify="center">
    <v-dialog
      v-model="startupProgressUpdateModal.isShowing"
      persistent
      max-width="800"
    >
      <v-card>
        <v-card-title class="headline">{{ title }}</v-card-title>
        <v-card-text>
          <!-- <img
            :src="startupProgressUpdateModal.data.photoURL"
            alt="logo-final-AADITYA-CHANDEL-me15d001"
            border="0"
            width="100"
          />
          <h3 class="text-center mb-5">
            {{ startupProgressUpdateModal.data.name }}
          </h3> -->
          <v-form class="mt-5">
            <v-row>
              <v-col cols="12" md="6">
                <label>Select stage</label>
                <v-autocomplete
                  :items="progressFields"
                  v-model="startupProgressUpdateModal.data.stage"
                  :disabled="startupProgressUpdateModal.isUpdate"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="6">
                <label>Upload document (optional)</label>
                <v-file-input
                  v-model="startupProgressUpdateModal.data.document"
                ></v-file-input>
              </v-col>
              <v-col cols="12" md="12">
                <label>Description</label>
                <v-textarea
                  counter
                  v-model="startupProgressUpdateModal.data.description"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="white--text"
            color="traktor"
            @click="update()"
            v-if="startupProgressUpdateModal.isUpdate"
          >
            Update
          </v-btn>
          <v-btn class="white--text" color="traktor" @click="add()" v-else>
            Add
          </v-btn>
          <v-btn
            color="error"
            text
            @click="startupProgressUpdateModal.isShowing = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import { mapState } from "vuex";
import { uploadFile } from "../../../_helpers/FileUpload";
import {
  startupsRef,
  startupProgressRef,
  activityRef,
} from "../../../config/firebase_services";

export default {
  name: "ProgressUpdate",
  data() {
    return {
      progressFields: [
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
        "Add new +",
      ],
    };
  },
  computed: {
    ...mapState({
      startupProgressUpdateModal: (state) =>
        state.modals.startupProgressUpdateModal,
    }),
    title: function () {
      return this.startupProgressUpdateModal.isUpdate
        ? "Edit stage"
        : "Add new stage";
    },
  },
  methods: {
    async add() {
      if (this.startupProgressUpdateModal.data.stage === null) {
        this.$toast.error("Stage cannot be empty!", {
          position: "top",
        });
        return;
      }

      if (
        this.startupProgressUpdateModal.currentProgressedStages.includes(
          this.startupProgressUpdateModal.data.stage
        )
      ) {
        this.$toast.error(
          `Stage ${this.startupProgressUpdateModal.data.stage} has already achieved. Cannot add again! You can edit the already added stages.`,
          {
            position: "top",
          }
        );
        return;
      }

      this.$store.dispatch("SHOW_LOADER", { isShowing: true });
      this.startupProgressUpdateModal.data.incubatorId = this.$store.state.incubator.currentIncubator.docId;
      this.startupProgressUpdateModal.data.createdAt = new Date();
      if (
        typeof this.startupProgressUpdateModal.data.document === "object" &&
        this.startupProgressUpdateModal.data.document !== null
      ) {
        this.startupProgressUpdateModal.data.document = await uploadFile(
          this.startupProgressUpdateModal.data.document,
          "startupProgress"
        );
        try {
          await startupProgressRef.add(this.startupProgressUpdateModal.data);
          await startupsRef
            .doc(this.startupProgressUpdateModal.data.startup.docId)
            .set(
              { stage: this.startupProgressUpdateModal.data.stage },
              { merge: true }
            );
        } catch (error) {
          this.$toast.error(error, {
            position: "top",
          });
        }
        const activity = {
          incubatorId: this.$store.state.incubator.currentIncubator.docId,
          photoURL: this.startupProgressUpdateModal.data.startup.photoURL,
          statement: `Startup ${this.startupProgressUpdateModal.data.startup.name} moved to ${this.startupProgressUpdateModal.data.stage}`,
          progress: this.startupProgressUpdateModal.data,
          createdAt: new Date(),
          type: "startup",
          notification: false,
        };
        try {
          await activityRef.add(activity);
          this.$toast.success("Added", {
            position: "top",
          });
          this.$store.dispatch("SHOW_LOADER", { isShowing: false });
        } catch (error) {
          this.$toast.error(error, {
            position: "top",
          });
        }
      } else {
        try {
          await startupProgressRef.add(this.startupProgressUpdateModal.data);
          await startupsRef
            .doc(this.startupProgressUpdateModal.data.startup.docId)
            .set(
              { stage: this.startupProgressUpdateModal.data.stage },
              { merge: true }
            );
        } catch (error) {
          this.$toast.success(error, {
            position: "top",
          });
        }
        const activity = {
          incubatorId: this.$store.state.incubator.currentIncubator.docId,
          photoURL: this.startupProgressUpdateModal.data.startup.photoURL,
          statement: `Startup ${this.startupProgressUpdateModal.data.startup.name} moved to ${this.startupProgressUpdateModal.data.stage}`,
          progress: this.startupProgressUpdateModal.data,
          createdAt: new Date(),
          type: "startup",
          notification: false,
        };
        try {
          await activityRef.add(activity);
          this.$toast.success("Added", {
            position: "top",
          });
          this.$store.dispatch("SHOW_LOADER", { isShowing: false });
        } catch (error) {
          this.$toast.success(error, {
            position: "top",
          });
        }
      }
      this.startupProgressUpdateModal.isShowing = false;
    },
    async update() {
      if (this.startupProgressUpdateModal.data.stage === null) {
        this.$toast.error("Stage cannot be empty!", {
          position: "top",
        });
        return;
      }
      this.startupProgressUpdateModal.data.incubatorId = this.$store.state.incubator.currentIncubator.docId;
      this.startupProgressUpdateModal.data.createdAt = new Date();
      if (
        typeof this.startupProgressUpdateModal.data.document === "object" &&
        this.startupProgressUpdateModal.data.document !== null
      ) {
        this.startupProgressUpdateModal.data.document = await uploadFile(
          this.startupProgressUpdateModal.data.document,
          "startupProgress"
        );
        try {
          await startupProgressRef
            .doc(this.startupProgressUpdateModal.data.docId)
            .set(this.startupProgressUpdateModal.data, { merge: true });
          await startupsRef
            .doc(this.startupProgressUpdateModal.data.startup.docId)
            .set(
              { stage: this.startupProgressUpdateModal.data.stage },
              { merge: true }
            );
          this.$toast.success("Updated", {
            position: "top",
          });
        } catch (error) {
          this.$toast.error(error, {
            position: "top",
          });
        }
      } else {
        try {
          await startupProgressRef
            .doc(this.startupProgressUpdateModal.data.docId)
            .set(this.startupProgressUpdateModal.data, { merge: true });
          await startupsRef
            .doc(this.startupProgressUpdateModal.data.startup.docId)
            .set(
              { stage: this.startupProgressUpdateModal.data.stage },
              { merge: true }
            );
          this.$toast.success("Updated", {
            position: "top",
          });
        } catch (error) {
          this.$toast.success(error, {
            position: "top",
          });
        }
      }
      this.startupProgressUpdateModal.isShowing = false;
    },
  },
};
</script>

<style scoped>
.v-btn {
  text-transform: capitalize;
}

label {
  margin-left: 10px;
}

>>> .v-dialog {
  margin-left: 270px;
}

>>> .v-input__control {
  border-radius: 10px;
  border: 1px solid #dbdbdb;
  box-shadow: 0px 0px 24px rgba(219, 219, 219, 0.32);
  padding: 5px 5px 0px 10px;
}

>>> .v-text-field > .v-input__control > .v-input__slot:before {
  border-style: none;
}

>>> .v-text-field__details {
  margin-bottom: 0px !important;
  display: none;
}

>>> .v-text-field {
  margin-top: 0px;
  padding-top: 0px;
}
</style>