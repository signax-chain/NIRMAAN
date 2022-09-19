<template>
  <v-row justify="center">
    <v-dialog v-model="newspeakerModal.isShowing" persistent max-width="800">
      <v-card>
        <v-card-title class="headline">
          Add new speaker
          <v-spacer></v-spacer>
          <v-btn
            color="red darken-1"
            text
            @click="newspeakerModal.isShowing = false"
          >
            Cancel
          </v-btn>
          <v-btn color="traktor" class="white--text" @click="add()">
            Add
          </v-btn>
        </v-card-title>
        <v-card-text class="mt-5">
          <v-form>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  outlined
                  dense
                  label="Name"
                  v-model="speaker.name"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-file-input
                  outlined
                  dense
                  label="Speaker photo"
                  v-model="speaker.photoURL"
                ></v-file-input>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  outlined
                  dense
                  label="Designation"
                  v-model="speaker.designation"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  outlined
                  dense
                  label="Organisation"
                  v-model="speaker.organization"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  outlined
                  dense
                  label="Email"
                  v-model="speaker.email"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  outlined
                  dense
                  label="Contact number"
                  v-model="speaker.phoneNumber"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="12">
                <v-textarea
                  outlined
                  dense
                  label="Description"
                  v-model="speaker.description"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapState } from "vuex";
import { uploadFile } from "../../../_helpers/FileUpload";
import { speakersRef, activityRef } from "../../../config/firebase_services";

export default {
  name: "Speaker",
  computed: {
    ...mapState({ newspeakerModal: (state) => state.modals.newspeakerModal }),
  },
  data() {
    return {
      speaker: {
        name: null,
        photoURL: null,
        designation: null,
        organization: null,
        email: null,
        phoneNumber: null,
        description: null,
      },
    };
  },
  methods: {
    async add() {
      const obj = Object.keys(this.speaker).find(
        (key) => this.speaker[key] === null
      );
      if (obj !== undefined) {
        this.$toast.error("All fileds are required!", {
          position: "top",
        });
        return;
      }

      if (this.speaker.photoURL !== null && typeof this.speaker === "object") {
        this.speaker.photoURL = await uploadFile(
          this.speaker.photoURL,
          "Logos/Speaker"
        );
        this.uploadData();
      }
    },
    async uploadData() {
      this.speaker.incubatorId =
        this.$store.state.incubator.currentIncubator.docId;
      this.createdAt = new Date();

      const activity = {
        incubatorId: this.$store.state.incubator.currentIncubator.docId,
        photoURL: this.$store.state.incubator.currentIncubator.photoURL,
        statement: `${this.$store.state.incubator.currentIncubator.name} added new speaker ${this.speaker.name}`,
        type: "incubator",
        notification: false,
        createdAt: new Date(),
      };

      try {
        await speakersRef.add(this.speaker);
        await activityRef.add(activity);

        this.$toast.success("Added", {
          position: "top",
        });
        this.newspeakerModal.isShowing = false;
      } catch (error) {
        this.$toast.error(error, {
          position: "top",
        });
      }
    },
  },
};
</script>

<style>
</style>