<template>
  <v-row justify="center">
    <v-dialog
      v-model="mentorProgressUpdateModal.isShowing"
      persistent
      max-width="800"
    >
      <v-card class="pt-3">
        <v-card-title>
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            text
            @click="mentorProgressUpdateModal.isShowing = false"
          >
            Close
          </v-btn>
          <v-btn class="white--text ma-auto" color="traktor" @click="update()">
            Update
          </v-btn>
        </v-card-title>
        <v-card-text>
          <img
            :src="mentorProgressUpdateModal.data.photoURL"
            :alt="mentorProgressUpdateModal.data.name"
            border="0"
          />
          <h3 class="text-center">
            {{ mentorProgressUpdateModal.data.name }}
          </h3>
          <v-form class="mt-5">
            <v-row>
              <v-col cols="12" md="12">
                <v-select
                  prepend-icon="mdi-text"
                  :items="progressFields"
                  label="Select stage"
                  outlined
                  v-model="progress.status"
                  dense
                ></v-select>
              </v-col>
              <v-col cols="12" md="12">
                <v-file-input
                  label="Upload document (optional)"
                  outlined
                  v-model="progress.document"
                  dense
                ></v-file-input>
              </v-col>
              <v-col cols="12" md="12">
                <v-textarea
                  prepend-icon="mdi-text"
                  counter
                  outlined
                  label="Description"
                  v-model="progress.description"
                  dense
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
import firebase from "firebase";
import { mapState } from "vuex";

export default {
  name: "ProgressUpdate",
  data() {
    return {
      progressFields: [],
      progress: {
        status: null,
        document: null,
        description: null,
        data: null,
        timestamp: +new Date(),
      },
    };
  },
  computed: {
    ...mapState({
      mentorProgressUpdateModal: (state) =>
        state.modals.mentorProgressUpdateModal,
    }),
  },
  async created() {
    const documents = await firebase
      .firestore()
      .collection("imsDropdowns")
      .doc("progress_update")
      .collection("cSrNFegmx9Vtj3pGXpOLvL0QU7v2")
      .get();
    documents.forEach((document) => {
      if (document.exists) {
        this.progressFields = document.data()["mentor"];
      }
    });
  },
  methods: {
    async update() {
      this.progress.data = this.mentorProgressUpdateModal.data;

      if (
        typeof this.progress.document === "object" &&
        this.progress.document !== null
      ) {
        const firebaseStorageRef = firebase
          .storage()
          .ref()
          .child(`mentorProgress/${Date.now()}_file`)
          .put(this.progress.document);
        firebaseStorageRef.on(
          "state_changed",
          (snapshot) => {
            console.log(snapshot);
          },
          (error) => {
            console.error(error);
          },
          async () => {
            this.progress.document =
              await firebaseStorageRef.snapshot.ref.getDownloadURL();
            firebase
              .firestore()
              .collection("mentorProgress")
              .add(this.progress);

            const activity = {
              incubator: this.$store.user.currentUser,
              statement: `Mentor ${this.progress.data.name} moved to ${this.progress.status}`,
              mentor: this.progress.data,
              progress: this.progress,
              createdAt: new Date(),
              type: "mentor",
              notification: true,
            };

            await firebase.firestore().collection("activities").add(activity);
          }
        );
      } else {
        await firebase
          .firestore()
          .collection("mentorProgress")
          .add(this.progress);

        const activity = {
          incubator: this.$store.user.currentUser,
          statement: `Mentor ${this.progress.data.name} moved to ${this.progress.status}`,
          mentor: this.progress.data,
          progress: this.progress,
          createdAt: new Date(),
          type: "mentor",
          notification: true,
        };

        await firebase.firestore().collection("activities").add(activity);
      }
      this.mentorProgressUpdateModal.isShowing = false;
    },
  },
};
</script>

<style scoped>
img {
  display: block;
  margin: 0 auto;
  width: 150px;
  height: 150px;
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
}

.v-text-field.v-text-field--enclosed .v-text-field__details {
  margin-bottom: 0px !important;
}

@media only screen and (max-width: 600px) {
  img {
    width: 100px;
    height: 100px;
  }
}
</style>