<template>
  <v-dialog v-model="show" width="500">
    <v-card>
      <v-card-title class="heading">
        Upload New {{ title }}
        <v-spacer></v-spacer>
        <v-btn icon @click="show = false" color="red">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="mt-5">
        <v-form>
          <v-text-field
            v-model="item.title"
            label="Title"
            outlined
            required
            dense
          ></v-text-field>
          <v-file-input
            v-model="item.document"
            label="File"
            outlined
            required
            dense
          ></v-file-input>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="traktor" dark class="mx-auto" @click="uploadItem">
          Upload
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { uploadFileWithName } from "../../../_helpers/FileUpload";
export default {
  props: ["visible", "title"],
  computed: {
    show: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) return this.$emit("close");
      },
    },
  },
  data() {
    return {
      item: {
        title: "",
        document: "",
      },
    };
  },
  methods: {
    async uploadItem() {
      try {
        this.item.document = await uploadFileWithName(
          this.item.document,
          "de-documents"
        );
        this.$emit("result", this.item);
      } catch (error) {
        this.$toast.open({
          message: error.message,
          type: "error",
        });
      }
    },
  },
};
</script>

<style>
</style>