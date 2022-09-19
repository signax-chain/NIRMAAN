<template>
  <v-row justify="center">
    <v-dialog
      v-model="incubatorProfileModal.isShowing"
      persistent
      max-width="800"
    >
      <v-card>
        <v-card-text class="pa-5">
          <v-img
            :src="incubatorProfileModal.data.photoURL"
            :alt="incubatorProfileModal.data.name"
            width="200"
            class="mx-auto"
          ></v-img>
          <!-- <h3 class="text-center mt-2 black--text">
            {{ incubatorProfileModal.data.name }}
          </h3> -->
          <v-form class="mt-5">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Name"
                  outlined
                  dense
                  v-model="incubatorProfileModal.data.name"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Institution type"
                  outlined
                  dense
                  v-model="incubatorProfileModal.data.type"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Sector"
                  outlined
                  dense
                  v-model="incubatorProfileModal.data.sector"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Email"
                  outlined
                  dense
                  v-model="incubatorProfileModal.data.email"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Contact number"
                  outlined
                  dense
                  v-model="incubatorProfileModal.data.phoneNumber"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Website"
                  outlined
                  dense
                  v-model="incubatorProfileModal.data.socialLinks.website"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Linked In"
                  outlined
                  dense
                  v-model="incubatorProfileModal.data.socialLinks.linkedIn"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="CEO name"
                  outlined
                  dense
                  v-model="incubatorProfileModal.data.ceo.name"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="CEO email"
                  outlined
                  dense
                  v-model="incubatorProfileModal.data.ceo.email"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="CEO Contact number"
                  outlined
                  dense
                  v-model="incubatorProfileModal.data.ceo.phoneNumber"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="12">
                <v-textarea
                  label="Description"
                  outlined
                  dense
                  v-model="incubatorProfileModal.data.description"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="red darken-1"
            text
            @click="incubatorProfileModal.isShowing = false"
          >
            Close
          </v-btn>
          <v-btn color="traktor" class="white--text" @click="update()">
            Update
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapState } from "vuex";
import { incubatorsRef } from "../../../config/firebase_services";

export default {
  name: "Profile",
  computed: {
    ...mapState({
      incubatorProfileModal: (state) => state.modals.incubatorProfileModal,
    }),
  },
  methods: {
    async update() {
      if (
        this.incubatorProfileModal.data.name === null ||
        this.incubatorProfileModal.data.name === ""
      ) {
        this.$toast.error("Name cannot be empty", {
          position: "top",
        });
        return;
      }

      if (
        this.incubatorProfileModal.data.email === null ||
        this.incubatorProfileModal.data.email === ""
      ) {
        this.$toast.error("Email cannot be empty", {
          position: "top",
        });
        return;
      }

      try {
        await incubatorsRef
          .doc(this.incubatorProfileModal.data.docId)
          .set(this.incubatorProfileModal.data, { merge: true });
        this.$toast.success("Updated", {
          position: "top",
        });
        this.incubatorProfileModal.isShowing = false;
      } catch (error) {
        this.$toast.error(error, {
          position: "top",
        });
      }
    },
  },
};
</script>

<style scoped>
>>> .v-text-field__details {
  display: none !important;
  margin-bottom: 0px !important;
}

>>> .v-dialog:not(.v-dialog--fullscreen) {
  max-height: 98% !important;
  border-radius: 20px !important;
}

@media only screen and (max-width: 600px) {
  >>> .v-dialog:not(.v-dialog--fullscreen) {
    border-radius: 0 !important;
    max-height: 90% !important;
    bax-shadow: none !important;
  }
}
</style>