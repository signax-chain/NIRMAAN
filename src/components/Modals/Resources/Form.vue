<template>
  <v-dialog v-model="show" max-width="500">
    <v-form ref="form">
      <v-card>
        <v-card-title class="heading"
          >Create new resource
          <v-spacer></v-spacer>
          <v-btn icon @click.native="show = false" color="red">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="mt-4">
          <v-text-field
            label="Resource title"
            outlined
            dense
            v-model="resource.title"
            :rules="rules.title"
          ></v-text-field>
          <v-file-input
            label="Upload resource"
            outlined
            dense
            v-model="resource.file"
            :rules="rules.file"
          ></v-file-input>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="traktor" dark disabled v-if="loading">Loading...</v-btn>
          <v-btn color="traktor" dark @click="submit()" v-else>Create</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { resourcesRef } from "../../../config/firebase_services";
import { uploadFileWithName } from "../../../_helpers/FileUpload";
export default {
  name: "ResourcesForm",
  props: ["visible"],
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
      resource: {
        title: "",
        file: null,
        createdAt: "",
        incubatorId: "",
        type: "",
      },
      rules: {
        title: [(v) => !!v || "Title is required"],
        file: [(v) => !!v || "File is required"],
      },
      loading: false,
    };
  },
  methods: {
    async submit() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        this.resource.createdAt = new Date();
        this.resource.type = this.resource.file.type;
        this.resource.incubatorId = this.$store.state.user.currentUser.docId;

        try {
          console.log(this.resource);
          this.resource.file = await uploadFileWithName(
            this.resource.file,
            "resources"
          );
          await resourcesRef.add(this.resource);
          this.$toast.open({
            message: "Resource created successfully",
            type: "success",
            position: "top",
            duration: 5000,
          });

          this.resource = {
            title: "",
            file: null,
            createdAt: "",
            incubatorId: "",
            type: "",
          };
          this.loading = false;
          this.$emit("close");
        } catch (error) {
          this.loading = false;
          this.$toast.open({
            message: error.message,
            position: "top",
            type: "error",
          });
        }
      }
    },
  },
};
</script>

<style scoped>
</style>