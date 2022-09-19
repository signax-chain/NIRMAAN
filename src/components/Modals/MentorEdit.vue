<template>
  <v-row justify="center">
    <v-dialog v-model="mentorEditModal.isShowing" persistent max-width="1000">
      <v-card>
        <v-card-text>
          <div class="d-flex">
            <div style="width: 180px"></div>
            <img
              :src="mentorEditModal.basicDetails.photoURL"
              class="logo mt-2"
            />
            <!-- <h3 class="text-center">{{ mentorEditModal.basicDetails.name }}</h3> -->
            <div>
              <v-btn class="white--text mt-5" color="traktor" @click="update()">
                Update
              </v-btn>
              <v-btn
                class="white--text mt-5"
                text
                color="red"
                @click="mentorEditModal.isShowing = false"
              >
                Close
              </v-btn>
            </div>
          </div>
          <span class="pa-auto mt-2" @click="$refs.file.click()"
            >Change picture</span
          >
          <input type="file" class="d-none" ref="file" @change="changeLogo" />
          <v-form class="mt-5">
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field
                  outlined
                  label="Name of the mentor"
                  dense
                  v-model="mentorEditModal.basicDetails.name"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  outlined
                  dense
                  label="Current Designation"
                  v-model="mentorEditModal.basicDetails.designation"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  outlined
                  dense
                  label="Year of passing"
                  v-model="mentorEditModal.basicDetails.yearOfPassing"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  outlined
                  dense
                  label="Contact Number"
                  v-model="mentorEditModal.basicDetails.mobile"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  outlined
                  dense
                  label="Qualification"
                  v-model="mentorEditModal.basicDetails.qualification"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  outlined
                  dense
                  label="Institution"
                  v-model="mentorEditModal.basicDetails.institution"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  outlined
                  dense
                  label="Email ID"
                  v-model="mentorEditModal.basicDetails.email"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-select
                  outlined
                  label="Area of Expertise"
                  dense
                  multiple
                  v-model="mentorEditModal.basicDetails.areaOfExpertise"
                  :items="areas"
                ></v-select>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  outlined
                  dense
                  label="LinkedIN Profile"
                  v-model="mentorEditModal.basicDetails.socialLinks.linkedIn"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-select
                  outlined
                  label="Startups Associated"
                  dense
                  multiple
                  v-model="mentorEditModal.basicDetails.startupsAssociated"
                  :items="startups"
                  item-text="name"
                ></v-select>
              </v-col>
              <v-col cols="12" md="12">
                <v-textarea
                  label="Description"
                  outlined
                  v-model="mentorEditModal.basicDetails.description"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <!-- <v-card-actions>
          <v-btn class="white--text ma-auto" color="traktor" @click="update()">
            Update
          </v-btn>
          <v-btn
            class="white--text"
            text
            color="red"
            @click="mentorEditModal.isShowing = false"
          >
            Close
          </v-btn>
        </v-card-actions> -->
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import firebase from "firebase";
import { mapState } from "vuex";
import { mentorsRef, startupsRef } from "../../config/firebase_services";

export default {
  name: "MentorEditModal",
  data() {
    return {
      areas: [
        "Business Model",
        "General Management",
        "HR/Team",
        "Marketing & Sales",
        "Operations",
        "Project Management",
        "Pricing",
        "Scale Up",
        "Strategy",
        "Technology",
        "Valuation/Funding",
        "Finance",
        "Add new",
      ],
      startups: [],
    };
  },
  async created() {
    const documents = await startupsRef
      .where("incubatorId", "==", this.$store.state.user.currentUser.docId)
      .get();
    documents.forEach((document) => {
      const data = document.data();
      if (document.exists) {
        this.startups.push({ id: data.docId, name: data.name });
      }
    });
  },
  computed: {
    ...mapState({ mentorEditModal: (state) => state.modals.mentorEditModal }),
  },
  methods: {
    async update() {
      await mentorsRef
        .doc(this.mentorEditModal.basicDetails.mentorUserId)
        .set(this.mentorEditModal.basicDetails, { merge: true });
      this.mentorEditModal.isShowing = false;
    },

    changeLogo(e) {
      const fileObj = e.target.files[0];
      const firebaseStorageRef = firebase
        .storage()
        .ref()
        .child(`Logos/mentors/${Date.now()}_file`)
        .put(fileObj);
      firebaseStorageRef.on(
        "state_changed",
        (snapshot) => {
          console.log(snapshot);
        },
        (error) => {
          console.error(error);
        },
        async () => {
          const link = await firebaseStorageRef.snapshot.ref.getDownloadURL();
          this.mentorEditModal.basicDetails.photoURL = link;
          await mentorsRef
            .doc(this.mentorEditModal.basicDetails.docId)
            .set({ photoURL: link }, { merge: true });

          this.$store.dispatch("SHOW_SNACKBAR", {
            showing: true,
            text: "Updated",
            color: "success",
          });
        }
      );
    },
  },
};
</script>

<style scoped>
>>> .v-dialog:not(.v-dialog--fullscreen) {
  /* max-height: 95% !important; */
  /* overflow: hidden !important; */
  border-radius: 20px !important;
}

img {
  display: block;
  margin: 0 auto;
}

.logo {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

span {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: auto;
  max-width: 100px;
  border: 1px solid #3aa959;
  border-radius: 20px;
  text-align: center;
  color: #3aa959;
  cursor: pointer;
}

.v-text-field.v-text-field--enclosed .v-text-field__details {
  margin-bottom: 0px !important;
}
</style>