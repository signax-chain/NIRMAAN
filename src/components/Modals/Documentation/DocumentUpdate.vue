<template>
  <v-row justify="center">
    <v-dialog v-model="show" persistent max-width="500">
      <v-card>
        <v-card-title class="headline">
          {{ title }}
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click.stop="show = false">
            Close
          </v-btn>
          <v-btn
            color="traktor"
            class="white--text"
            @click="downloadTemplate()"
            v-if="download"
          >
            Download
          </v-btn>
          <v-btn
            color="traktor"
            class="white--text"
            @click="uploadDocument()"
            v-else
          >
            Upload
          </v-btn>
        </v-card-title>
        <v-card-text class="mt-5">
          <v-select
            outlined
            dense
            :items="documents"
            item-text="title"
            label="Select document type"
            prepend-icon="mdi-text"
            v-model="templateTitle"
          ></v-select>
          <router-link
            to="/uploads"
            v-if="download && currentUser.role === 'incubator'"
            ><span>Upload new template?</span></router-link
          >
          <v-file-input
            label="Choose file"
            dense
            outlined
            v-model="document"
            v-if="!download"
            @change="handleDocumentType"
            accept="application/pdf"
          ></v-file-input>
          <span style="color: red">* Upload only pdf files</span>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import {
  documentationRef,
  uploadsRef,
} from "../../../config/firebase_services";
import { uploadFile } from "../../../_helpers/FileUpload";
import { mapState } from "vuex";

export default {
  name: "DocumentUpdate",
  props: ["visible", "download", "templateTitle"],
  computed: {
    show: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) {
          this.$emit("close");
        }
      },
    },
    title: function () {
      return this.download ? "Download Template" : "Upload Document";
    },
    ...mapState({ currentUser: (state) => state.user.currentUser }),
  },
  data() {
    return {
      userId: null,
      documents: [],
      template: null,
      document: null,
    };
  },
  created() {
    this.setCurrentUser();
    this.getDocumentTemplates();
  },
  methods: {
    handleDocumentType(doc) {
      if (doc.type !== "application/pdf") {
        this.$toast.error("Only pdf format is allowed!", {
          position: "top",
        });
        this.document = null;
      }
    },
    setCurrentUser() {
      this.userId =
        this.$route.params.id !== undefined
          ? this.$route.params.id
          : this.$store.state.user.currentUser.docId;
    },
    async getDocumentTemplates() {
      uploadsRef
        .doc(this.$store.state.incubator.currentIncubator.docId)
        .collection("documentationTemplates")
        .onSnapshot((snapshot) => {
          this.documents = [];
          snapshot.forEach((document) => {
            const data = document.data();
            data.docId = document.id;
            this.documents.push(data);
          });
        });
    },
    downloadTemplate() {
      const obj = this.documents.find(
        (document) => document.docId === this.template
      );
      window.open(obj.document, "_blank").focus();
      this.show = false;
    },
    async uploadDocument() {
      if (this.templateTitle === null) {
        this.$toast.error("Select the type of document to upload!", {
          position: "top",
        });
        return;
      }

      if (this.document === null) {
        this.$toast.error("Select the document to upload!", {
          position: "top",
        });
        return;
      }

      // const obj = this.documents.find(
      //   (document) => document.docId === this.template
      // );

      try {
        const downloadURL = await uploadFile(this.document, "Documentation");
        const data = {
          type: this.templateTitle,
          document: downloadURL,
        };

        data.userId = this.userId;
        data.incubatorId = this.$store.state.incubator.currentIncubator.docId;
        data.createdAt = new Date();

        await documentationRef.add(data);
        this.$toast.success("Uploaded", {
          position: "top",
        });
        this.show = false;
      } catch (error) {
        this.$toast.error(error, {
          position: "top",
        });
      }
    },
  },
  mounted() {
    console.log(this.visible);
  }
};
</script>

<style scoped>
.v-btn {
  text-transform: capitalize;
}
</style>