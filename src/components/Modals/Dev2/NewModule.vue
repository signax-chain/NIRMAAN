<template>
  <v-dialog v-model="show" width="500">
    <v-form ref="form">
      <v-card>
        <v-card-title class="heading">
          Add New Module
          <v-spacer></v-spacer>
          <v-btn color="red" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="mt-5">
          <v-text-field
            label="Module Title"
            outlined
            dense
            v-model="title"
            :rules="[(v) => !!v || 'Title is required']"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="traktor"
            class="d-block mx-auto"
            dark
            @click="addModule()"
            >Add Module</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
export default {
  props: ["visible", "modules"],
  computed: {
    show: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) this.$emit("close", value);
      },
    },
  },
  data() {
    return {
      title: "",
    };
  },
  methods: {
    async addModule() {
      try {
        if (this.$refs.form.validate()) {
          const module = {
            title: this.title,
            presentations: [],
            sheets: [],
            steps: [],
            videos: [],
          };
          this.modules.push(module);
          this.$emit("close", false);
          this.title = "";
        }
      } catch (error) {
        this.$toast.open({
          message: error.message,
          type: "error",
          duration: 5000,
          position: "top",
        });
      }
    },
  },
};
</script>

<style>
</style>