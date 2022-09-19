<template>
  <div class="wrapper pb-5">
    <div class="d-flex">
      <h3 class="heading">Documents</h3>
      <v-spacer></v-spacer>
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="traktor"
            v-bind="attrs"
            v-on="on"
            @click="addNewDocument()"
            v-show="currentUser.role !== 'mentor'"
            outlined
          >
            Add
            <v-icon size="24">mdi-plus</v-icon>
          </v-btn>
        </template>
        <span>Upload your own document</span>
      </v-tooltip>
    </div>

    <div class="documents py-3" v-if="templates.length > 0">
      <ol v-for="(template, index) in templates" :key="index">
        <li v-if="index < 5">
          <div>
            <a
              :href="template.file !== '' ? template.file : null"
              target="_blank"
              class="document-name"
              >{{ index + 1 }}. {{ template.title }}</a
            >
            <span
              class="grey--text d-block ml-5"
              v-if="template.uploadedAt === ''"
            >
              No Document uploaded</span
            >
            <span class="grey--text d-block ml-5" v-else>
              Uploaded on
              {{ template.uploadedAt.toDate().toDateString() }}</span
            >
          </div>
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-bind="attrs" v-on="on" icon class="float-right">
                <v-icon>mdi-dots-vertical</v-icon></v-btn
              >
            </template>
            <v-list>
              <v-list-item @click="download(template.document)">
                <v-list-item-title>Download</v-list-item-title>
              </v-list-item>
              <v-list-item
                @click="update(template)"
                v-show="
                  currentUser.role !== 'mentor' && template._type !== 'other'
                "
              >
                <v-list-item-title>Upload</v-list-item-title>
              </v-list-item>
              <v-list-item
                @click="editOther(template)"
                v-show="
                  currentUser.role !== 'mentor' && template._type === 'other'
                "
              >
                <v-list-item-title>Edit</v-list-item-title>
              </v-list-item>
              <v-list-item
                @click="_delete(template.docId)"
                v-show="template.file && currentUser.role !== 'mentor'"
              >
                <v-list-item-title>Delete</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </li>
        <v-divider class="mb-3" v-if="index < 5"></v-divider>
      </ol>
    </div>
    <div v-else class="no-documents">
      <img src="../../../assets/images/no-documents.svg" alt="" />
    </div>
    <h3 class="title-footer" v-if="templates.length < 0">
      Upload Documents here
    </h3>
    <v-btn
      color="traktor"
      dark
      v-if="templates.length > 5"
      class="d-block ml-auto"
      @click="viewMoreDocuments()"
      >View more <v-icon>mdi-arrow-right</v-icon></v-btn
    >
    <v-row justify="center">
      <v-dialog v-model="updateDialog" persistent max-width="500">
        <v-card>
          <v-card-title class="headline">
            Update Document
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="updateDialog = false">
              Close
            </v-btn>
            <v-btn color="traktor" class="white--text" @click="save()">
              Save
            </v-btn>
          </v-card-title>
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
        </v-card>
      </v-dialog>
    </v-row>
    <DocumentUpdate
      :visible="showDocumentModal"
      :download="isDownload"
      :templateTitle="template"
      @close="showDocumentModal = false"
    />
    <other-document
      :visible="dialog"
      @close="dialog = false"
      :userId="userId"
      :isEdit="isEdit"
      :document="editDocument"
    ></other-document>
  </div>
</template>

<script>
import { mapState } from "vuex";
import {
  documentationRef,
  uploadsRef,
} from "../../../config/firebase_services";
import { uploadFileWithName } from "../../../_helpers/FileUpload";
import DocumentUpdate from "../../../components/Modals/Documentation/DocumentUpdate";
import OtherDocument from "../../Modals/Documentation/OtherDocument.vue";
import Swal from "sweetalert2";
import activity from "../../../mixins/activity";

export default {
  name: "Documents",
  props: ["userId"],
  components: {
    DocumentUpdate,
    OtherDocument,
  },
  mixins: [activity],
  created() {
    this.getDocuments();
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
      template: "",
      dialog: false,
      isEdit: false,
      editDocument: null,
    };
  },
  computed: {
    ...mapState(
      { currentUser: (state) => state.user.currentUser },
      { currentIncubator: (state) => state.incubator.currentIncubator }
    ),
  },
  methods: {
    viewMoreDocuments() {
      const userId =
        this.currentUser.role === "startup"
          ? this.currentUser.docId
          : this.$route.params.id;
      this.$router.push(`/startup/${userId}/documents`);
    },
    async getDocuments() {
      documentationRef
        .where("userId", "==", this.userId)
        .orderBy("createdAt", "desc")
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
      const role = this.$store.state.user.currentUser.role;
      uploadsRef
        .doc(this.$store.state.incubator.currentIncubator.docId)
        .collection("documentationTemplates")
        .onSnapshot((snapshot) => {
          this.templates = [];
          snapshot.forEach((document) => {
            const data = document.data();
            const obj = this.documents.find(
              (document) => document.type === data.title
            );
            if (obj !== undefined) {
              data.file = obj.document;
              data.uploadedAt = obj.createdAt;
              data.docId = obj.docId;
              this.templates.push(data);
            } else if (role === "startup") {
              data.file = "";
              data.uploadedAt = "";
              this.templates.push(data);
            }
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
      this.sortDocuments();
    },
    sortDocuments() {
      this.templates.sort((a, b) => {
        if (a.uploadedAt > b.uploadedAt) {
          return -1;
        } else if (a.uploadedAt < b.uploadedAt) {
          return 1;
        } else {
          return 0;
        }
      });
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
            await this.updateActivity("has deleted a document");

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
    },
    addNewDocument() {
      this.isEdit = false;
      this.editDocument = null;
      this.dialog = true;
    },
    editOther(document) {
      this.isEdit = true;
      this.editDocument = {
        docId: document.docId,
        document: document.document,
        title: document.title,
      };
      this.dialog = true;
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
        data.document = await uploadFileWithName(
          this.uploadDocument,
          "Documentation"
        );
      }

      if (this.updateTemplate !== null) {
        data.type = this.updateTemplate;
      }

      try {
        await documentationRef.doc(obj.docId).set(data, { merge: true });
        await this.updateActivity("has uploaded a document");
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
.wrapper {
  width: 100%;
  position: relative;
  height: 400px;
}

.heading {
  color: #4f4f4f;
  font-weight: 500;
}

.no-documents {
  text-align: center;
}

.no-documents > img {
  width: 400px;
}

.document-name {
  color: #3aa959 !important;
  font-weight: bold;
}

.title-footer {
  color: #4f4f4f;
  font-size: 20px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
}

a {
  text-decoration: none;
  color: #4f4f4f !important;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.span {
  /* font-size: 14px; */
}

@media only screen and (max-width: 600px) {
  ol {
    margin-bottom: 15px;
  }

  .title-footer {
    display: none;
  }
}
</style>