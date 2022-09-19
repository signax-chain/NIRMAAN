<template>
  <v-container>
    <div class="d-flex">
      <h2>Documents</h2>
      <v-spacer></v-spacer>
      <!-- <v-speed-dial
        v-model="fab"
        :top="top"
        :bottom="bottom"
        :right="right"
        :left="left"
        :direction="direction"
        :open-on-hover="hover"
        :transition="transition"
      >
        <template v-slot:activator>
          <v-btn v-model="fab" color="traktor" dark fab>
            <v-icon v-if="fab"> mdi-close </v-icon>
            <v-icon v-else> mdi-plus-circle-outline </v-icon>
          </v-btn>
        </template>
        <v-btn fab dark small color="traktor" @click="handleDownload()">
          <v-icon>mdi-cloud-download-outline</v-icon>
        </v-btn>
        <v-btn fab dark small color="traktor" @click="handleUpload()">
          <v-icon>mdi-cloud-upload-outline</v-icon>
        </v-btn>
      </v-speed-dial> -->
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            color="traktor"
            v-bind="attrs"
            v-on="on"
            @click="dialog = true"
            v-show="currentUser.role !== 'mentor'"
          >
            <v-icon size="28">mdi-plus-circle-outline</v-icon>
          </v-btn>
        </template>
        <span>Upload your own document</span>
      </v-tooltip>
    </div>
    <div class="documents__row mt-5">
      <div class="document__card">
        <v-autocomplete
          :items="templates"
          dense
          v-model="activeName"
          item-text="title"
          @change="handleDocument"
          outlined
        >
        </v-autocomplete>
        <v-btn
          icon
          color="red"
          class="delete__btn"
          @click="_delete(activeDocument.docId)"
          v-show="currentUser.role !== 'mentor'"
          ><v-icon>mdi-delete</v-icon></v-btn
        >
        <span v-if="!activeDocument.document"
          >No Document uploaded</span
        >
        <span v-else
          >Uploaded on
          {{ activeDocument.uploadedAt.toDate().toDateString() }}</span
        >
        <div class="actions">
          <v-btn
            color="traktor"
            class="white--text mr-2"
            small
            @click="download(activeDocument.document)"
            ><v-icon>mdi-arrow-down</v-icon>Download</v-btn
          >
          <v-btn
            v-if="activeDocument._type === undefined"
            color="traktor"
            class="white--text mr-2"
            small
            @click="update(activeDocument)"
            v-show="currentUser.role !== 'mentor'"
            ><v-icon>mdi-arrow-up</v-icon>Upload</v-btn
          >
          <v-btn
            color="traktor"
            small
            class="white--text mr-2"
            :disabled="activeDocument.uploadedAt === ''"
            @click="download(activeDocument.file)"
            ><v-icon>mdi-eye</v-icon> view</v-btn
          >
        </div>
      </div>
    </div>
    <v-row justify="center">
      <v-dialog v-model="updateDialog" persistent max-width="500">
        <v-card>
          <v-card-title class="headline"> Update Document </v-card-title>
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
              accept="application/pdf"
            ></v-file-input>
            <span style="color: red">* Upload only pdf files</span>
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
    <DocumentUpdate
      :visible="showDocumentModal"
      :download="isDownload"
      :templateTitle="template"
      @close="showDocumentModal = false"
    />
    <other-document :visible="dialog" @close="dialog = false"></other-document>
  </v-container>
</template>
<script>
import { mapState } from "vuex";
import { documentationRef, uploadsRef } from "../../config/firebase_services";
import { uploadFile } from "../../_helpers/FileUpload";
import DocumentUpdate from "../../components/Modals/Documentation/DocumentUpdate";
import OtherDocument from "../Modals/Documentation/OtherDocument.vue";
import Swal from "sweetalert2";

export default {
  name: "Documents",
  components: {
    DocumentUpdate,
    OtherDocument,
  },
  data() {
    return {
      direction: "top",
      fab: false,
      fling: false,
      hover: true,
      tabs: null,
      top: false,
      right: false,
      bottom: true,
      left: true,
      transition: "slide-y",
      documents: [],
      updateDialog: false,
      showDocumentModal: false,
      isDownload: false,
      updateTemplate: null,
      uploadDocument: null,
      templates: [],
      docId: null,
      userId: null,
      template: "",
      dialog: false,
      activeDocument: {},
      activeName: "",
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
            // data.docId = document.id;

            const obj = this.documents.find(
              (document) => document.type === data.title
            );
            if (obj !== undefined) {
              data.file = obj.document;
              data.uploadedAt = obj.createdAt;
              data.docId = obj.docId;
            } else {
              data.file = "";
              data.uploadedAt = "";
            }
            this.templates.push(data);
          });
          this.mapOtherDocs();
        });
    },
    mapOtherDocs() {
      this.documents.forEach((doc) => {
        if (doc._type === "other") {
          doc.file = doc.document;
          doc.uploadedAt = doc.createdAt;
          this.templates.push(doc);
        }
      });
      this.activeDocument = this.templates[0];
      this.activeDocument.idx = 0;
      this.activeName = this.activeDocument.title;
    },
    _delete(docId) {
      Swal.fire({
        title: "Are you sure?",
        showCancelButton: true,
        confirmButtonColor: "#3aa959",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await documentationRef.doc(docId).delete();
            this.$toast.success("Deleted", {
              position: "top",
            });
          } catch (error) {
            this.$toast.error(error, {
              position: "top",
            });
          }
        }
      });
    },
    download(link) {
      window.open(link, "_blank").focus();
    },
    handleDownload() {
      this.isDownload = true;
      this.showDocumentModal = true;
    },
    handleUpload(title) {
      this.isDownload = false;
      this.showDocumentModal = true;
      this.template = title;
    },
    update(document) {
      this.handleUpload(document.title);
      // this.updateTemplate = document.type;
      // this.docId = document.docId;
      // this.updateDialog = true;
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
    handleDocument(title) {
      const idx = this.templates.findIndex(
        (template) => template.title === title
      );
      this.activeDocument = this.templates[idx];
      this.activeDocument.idx = idx;
    },
  },
};
</script>
<style scoped>
.documents__row {
  height: 180px;
  border-radius: 10px;
  display: flex;
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
  margin-bottom: 20px;
}

.document__card {
  border: 1px solid #3aa959;
  min-width: 55%;
  width: fit-content;
  height: 85%;
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

.delete__btn {
  position: absolute;
  bottom: 0;
  right: 0;
  display: none;
}

.document__card:hover .delete__btn {
  display: inline-block;
}

.actions {
  position: absolute;
  bottom: 10px;
  width: 100%;
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