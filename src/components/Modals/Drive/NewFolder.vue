<template>
  <v-dialog v-model="show" width="500">
    <v-card>
      <v-card-title class="heading">
        Create New Folder
        <v-spacer></v-spacer>
        <v-btn color="red" icon @click="show = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="mt-3">
        <v-text-field
          outlined
          dense
          v-model="name"
          label="Name"
          :rules="[(v) => !!v || 'Name is required']"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn color="traktor" dark @click="createFolder" class="mx-auto">
          Create Folder</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
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
      name: "",
    };
  },
  methods: {
    createFolder() {
      this.$emit("createFolder", this.name);
    },
  },
};
</script>

<style>
</style>