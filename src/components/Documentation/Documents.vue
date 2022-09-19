<template>
  <div>
    <div class="documents__row" v-if="documents.length > 0">
      <div
        class="document__card"
        v-for="(document, index) in documents"
        :key="index"
      >
        <h2>{{ document.type }}</h2>
        <span
          >Uploaded on {{ document.createdAt.toDate().toDateString() }}</span
        >
        <div class="actions mb-3">
          <v-btn
            color="traktor"
            class="white--text mr-2"
            small
            @click="update(document)"
            ><v-icon>mdi-arrow-up</v-icon>Update</v-btn
          >
          <v-btn
            color="traktor"
            class="white--text mr-2"
            small
            @click="download(document.document)"
            ><v-icon>mdi-arrow-down</v-icon>Download</v-btn
          >
        </div>
      </div>
    </div>
    <v-row justify="center">
      <v-dialog v-model="updateDialog" persistent max-width="500">
        <v-card>
          <v-card-title class="headline"> Upload Document </v-card-title>
          <v-card-text class="mt-5">
            <v-select
              outlined
              dense
              :items="templates"
              label="Select document type"
              prepend-icon="mdi-text"
              v-model="updateTemplate"
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
            <v-btn color="red darken-1" text @click="updateDialog = false">
              Close
            </v-btn>
            <v-btn color="traktor" class="white--text" @click="save()">
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { documentationRef, uploadsRef } from "../../config/firebase_services";
import { uploadFile } from "../../_helpers/FileUpload";

export default {
  name: "Documents",
  data() {
    return {
      documents: [],
      updateDialog: false,
      updateTemplate: null,
      uploadDocument: null,
      templates: [],
      docId: null,
      userId: null,
    };
  },
  computed: {
    ...mapState(
      { currentUser: (state) => state.user.currentUser },
      { currentIncubator: (state) => state.incubator.currentIncubator }
    ),
  },
  created() {
    this.userId =
      this.$route.params.id !== undefined
        ? this.$route.params.id
        : this.$store.state.user.currentUser.docId;

    this.getDocuments();
  },
  methods: {
    async getDocuments() {
      documentationRef
        .where("userId", "==", this.userId)
        .onSnapshot((snapshot) => {
          this.documents = [];
          snapshot.forEach((document) => {
            const data = document.data();
            data.docId = document.id;
            this.documents.push(data);
          });
          this.getTemplates();
        });
    },
    getTemplates() {
      uploadsRef
        .doc(this.$store.state.incubator.currentIncubator.docId)
        .collection("documentationTemplates")
        .onSnapshot((snapshot) => {
          this.templates = [];
          snapshot.forEach((document) => {
            const data = document.data();
            this.templates.push(data.title);
          });
        });
    },
    download(link) {
      location.href = link;
    },
    update(document) {
      this.updateTemplate = document.type;
      this.docId = document.docId;
      this.updateDialog = true;
    },
    async save() {
      if (this.updateTemplate === null && this.uploadDocument === null) {
        this.$toast.warning("There are no changes to update", {
          position: "top",
        });
        this.updateDialog = false;
        return;
      }

      const obj = this.documents.find(
        (document) => document.docId === this.docId
      );
      const data = {
        type: obj.type,
        document: obj.document,
      };
      if (this.uploadDocument !== null) {
        data.document = await uploadFile(this.uploadDocument, "Documentation");
      }

      if (this.updateTemplate !== null) {
        data.type = this.updateTemplate;
      }

      try {
        await documentationRef.doc(obj.docId).set(data, { merge: true });
        this.$toast.success("Updated", {
          position: "top",
        });
        this.updateDialog = false;
        this.docId = null;
      } catch (error) {
        this.$toast.error(error, {
          position: "top",
        });
        this.docId = null;
      }
    },
  },
};
</script>
<style scoped>
.documents__row {
  border: 1px solid #dbdbdb;
  height: 180px;
  border-radius: 10px;
  margin-top: 5%;
  padding: 15px;
  display: flex;
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
}

.document__card {
  border: 1px solid #3aa959;
  width: 30%;
  height: 100%;
  border-radius: 10px;
  padding: 10px;
  margin-right: 15px;
  position: relative;
}

.document__card > h2 {
  color: #3aa959;
}

.document__card > span {
  font-size: 12px;
  color: #666666;
}

.actions {
  position: absolute;
  bottom: 0;
  right: 0;
}

.v-btn {
  text-transform: capitalize;
}

>>> .v-dialog:not(.v-dialog--fullscreen) {
  overflow: hidden !important;
  border-radius: 20px !important;
}

@media only screen and (max-width: 600px) {
  .document__card {
    width: 100%;
  }
}
</style>