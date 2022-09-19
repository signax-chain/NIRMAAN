<template>
  <v-dialog persistent max-width="500" v-model="show">
    <v-form ref="formRef">
      <v-card>
        <v-card-title>
          {{ documentTitle }}
          <v-spacer></v-spacer>
          <v-btn color="red" text class="white--text" @click="show = false"
            >Close</v-btn
          >
          <v-btn color="traktor" disabled class="white--text" v-if="isUploading"
            >Uploading...</v-btn
          >
          <v-btn
            v-else
            color="traktor"
            class="white--text"
            @click="isEdit ? update() : upload()"
            >{{ btnTitle }}</v-btn
          >
        </v-card-title>
        <v-card-text>
          <v-text-field
            outlined
            dense
            label="Document title"
            v-model="item.title"
            :rules="rules.titleRule"
          ></v-text-field>
          <v-file-input
            label="Upload file"
            outlined
            dense
            v-model="item.document"
            :rules="rules.documentRule"
            accept="application/pdf"
          ></v-file-input>
          <span style="color: red">* Upload only pdf files</span>
        </v-card-text>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { documentationRef } from "../../../config/firebase_services";
import { uploadFileWithName } from "../../../_helpers/FileUpload";
import activity from "../../../mixins/activity";

export default {
  name: "OtherDocument",
  props: ["visible", "userId", "isEdit", "document"],
  mixins: [activity],
  computed: {
    show: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) this.$emit("close");
      },
    },
    documentTitle: function () {
      return this.isEdit ? "Edit document" : "Upload Document";
    },
    btnTitle: function () {
      return this.isEdit ? "Update" : "Submit";
    },
    item: function () {
      if (this.isEdit) {
        return this.document;
      } else {
        return {
          createdAt: "",
          document: "",
          incubatorId: "",
          title: "",
          userId: "",
          _type: "other",
        };
      }
    },
  },
  data() {
    return {
      rules: {
        titleRule: [(v) => !!v || "Title is required"],
        documentRule: [(v) => !!v || "Document is required"],
      },
      isUploading: false,
    };
  },
  methods: {
    async upload() {
      if (this.$refs.formRef.validate()) {
        this.isUploading = true;
        this.item.createdAt = new Date();
        this.item.incubatorId =
          this.$store.state.incubator.currentIncubator.docId;
        this.item.userId = this.userId;
        try {
          this.item.document = await uploadFileWithName(
            this.item.document,
            "Documentation"
          );
          await documentationRef.add(this.item);
          await this.updateActivity("has uploaded new document");
          this.$toast.success("Uploaded", {
            position: "top",
          });
          this.show = false;
          this.item = {
            createdAt: "",
            document: "",
            incubatorId: "",
            title: "",
            userId: "",
            _type: "other",
          };
          this.isUploading = false;
        } catch (error) {
          this.$toast.error(error, {
            position: "top",
          });
          this.isUploading = false;
        }
      }
    },
    async update() {
      try {
        this.isUploading = true;
        if (typeof this.item.document === "object")
          this.item.document = await uploadFileWithName(
            this.item.document,
            "Documentation"
          );
        await documentationRef
          .doc(this.item.docId)
          .set(this.item, { merge: true });
        this.$toast.success("Updated", {
          position: "top",
        });
        this.show = false;
        this.item = {
          createdAt: "",
          document: "",
          incubatorId: "",
          title: "",
          userId: "",
          _type: "other",
        };
        this.isUploading = false;
      } catch (error) {
        this.$toast.error(error, {
          position: "top",
        });
        this.isUploading = false;
      }
    },
  },
};
</script>

<style scoped>
.v-btn {
  text-transform: capitalize;
}
</style>