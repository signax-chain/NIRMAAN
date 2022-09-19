<template>
  <div class="text-center">
    <div class="d-flex justify-space-between actions__container mx-auto mt-10">
      <v-btn color="traktor" class="white--text" @click="downloadDialog = true"
        ><v-icon>mdi-arrow-down</v-icon> Download Template</v-btn
      >
      <v-btn color="traktor" class="white--text" @click="uploadDialog = true"
        ><v-icon>mdi-plus-circle</v-icon> Upload Document</v-btn
      >
    </div>
    <v-row justify="center mt-10">
      <v-dialog v-model="downloadDialog" persistent max-width="500">
        <v-card>
          <v-card-title class="headline"> Download Template </v-card-title>
          <v-card-text class="mt-5">
            <v-select
              outlined
              dense
              :items="templates"
              item-text="title"
              item-value="title"
              label="Select Template"
              v-model="downloadTemplate"
            ></v-select>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="downloadDialog = false">
              Close
            </v-btn>
            <v-btn color="traktor" class="white--text" @click="download()">
              Download
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <v-row justify="center">
      <v-dialog v-model="uploadDialog" persistent max-width="500">
        <v-card>
          <v-card-title class="headline"> Upload Document </v-card-title>
          <v-card-text class="mt-5">
            <v-select
              outlined
              dense
              :items="templates"
              item-text="title"
              item-value="title"
              label="Select document type"
              prepend-icon="mdi-text"
              v-model="uploadTemplate"
            ></v-select>
            <v-file-input
              label="Choose file"
              dense
              outlined
              v-model="uploadDocument"
            ></v-file-input>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="uploadDialog = false">
              Close
            </v-btn>
            <v-btn color="traktor" class="white--text" @click="upload()">
              Upload
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { uploadFile } from "../../_helpers/FileUpload";
import { documentationRef, activityRef } from "../../config/firebase_services";
import firebase from "firebase";

export default {
  name: "Actions",
  computed: {
    ...mapState(
      { currentUser: (state) => state.user.currentUser },
      { currentIncubator: (state) => state.incubator.currentIncubator }
    ),
  },
  data() {
    return {
      downloadDialog: false,
      uploadDialog: false,
      templates: [
        // {
        //   title: "Cohort Report",
        //   link:
        //     "https://firebasestorage.googleapis.com/v0/b/ims-traktor.appspot.com/o/Templates%2FStartups%20signup%20template.csv?alt=media&token=b44794ad-6b79-4799-8f7b-cdd7a91c5749",
        // },
        // {
        //   title: "Pitch Deck",
        //   link:
        //     "https://firebasestorage.googleapis.com/v0/b/ims-traktor.appspot.com/o/Templates%2FStartups%20signup%20template.csv?alt=media&token=b44794ad-6b79-4799-8f7b-cdd7a91c5749",
        // },
        // {
        //   title: "Business Model Canvas",
        //   link:
        //     "https://firebasestorage.googleapis.com/v0/b/ims-traktor.appspot.com/o/Templates%2FStartups%20signup%20template.csv?alt=media&token=b44794ad-6b79-4799-8f7b-cdd7a91c5749",
        // },
        // {
        //   title: "Accounts",
        //   link:
        //     "https://firebasestorage.googleapis.com/v0/b/ims-traktor.appspot.com/o/Templates%2FStartups%20signup%20template.csv?alt=media&token=b44794ad-6b79-4799-8f7b-cdd7a91c5749",
        // },
        // {
        //   title: "Others",
        //   link:
        //     "https://firebasestorage.googleapis.com/v0/b/ims-traktor.appspot.com/o/Templates%2FStartups%20signup%20template.csv?alt=media&token=b44794ad-6b79-4799-8f7b-cdd7a91c5749",
        // },
      ],
      downloadTemplate: null,
      uploadTemplate: null,
      uploadDocument: null,
    };
  },
  created() {
    this.getTemplates();
  },
  methods: {
    getTemplates() {
      firebase
        .firestore()
        .collection("uploads")
        .doc(this.$store.state.incubator.currentIncubator.docId)
        .collection("documentationTemplates")
        .onSnapshot((snapshot) => {
          this.templates = [];
          snapshot.forEach(async (document) => {
            const data = document.data();
            data.docId = document.id;
            this.templates.push(data);
          });
        });
    },
    download() {
      if (this.downloadTemplate === null) {
        this.$toast.warning("Select a template to download", {
          position: "top",
        });
        return;
      }

      const obj = this.templates.find(
        (template) => template.title === this.downloadTemplate
      );

      location.href = obj.document;
      this.downloadDialog = false;
    },

    async upload() {
      if (this.uploadTemplate === null) {
        this.$toast.warning("Select a template to upload", {
          position: "top",
        });
        return;
      }

      if (this.uploadDocument === null) {
        this.$toast.warning("Choose a file to upload", {
          position: "top",
        });
        return;
      }

      this.uploadDocument = await uploadFile(
        this.uploadDocument,
        "Documentation"
      );

      const data = {
        type: this.uploadTemplate,
        createdAt: new Date(),
        document: this.uploadDocument,
        userId: this.$store.state.user.currentUser.docId,
        incubatorId: this.$store.state.incubator.currentIncubator.docId,
      };

      const activity = {
        createdAt: new Date(),
        incubatorId: this.$store.state.incubator.currentIncubator.docId,
        notification: false,
        photoURL: this.$store.state.user.currentUser.photoURL,
        type: this.$store.state.user.currentUser.role,
        statement: `${this.$store.state.user.currentUser.role} ${this.$store.state.user.currentUser.name} have uploaded a new ${this.uploadTemplate} document.`,
        startup: this.$store.state.user.currentUser,
      };

      try {
        await documentationRef.add(data);
        await activityRef.add(activity);

        this.$toast.success("Uploaded", {
          position: "top",
        });
        this.uploadDialog = false;
      } catch (error) {
        this.$toast.error(error, {
          position: "top",
        });
        this.uploadDialog = false;
      }
    },
  },
};
</script>
<style scoped>
.actions__container {
  width: 450px;
}

.v-btn {
  text-transform: capitalize;
}

>>> .v-dialog:not(.v-dialog--fullscreen) {
  overflow: hidden !important;
  border-radius: 20px !important;
}

@media only screen and (max-width: 600px) {
  .actions__container {
    width: 100%;
    flex-wrap: wrap;
  }

  .actions__container > * {
    margin-top: 10px;
    margin: 5px auto 10px auto;
  }
}
</style>