<template>
  <v-dialog v-model="show" width="500">
    <v-card>
      <v-card-title class="heading"></v-card-title>
      <v-card-text>
        <div class="text-center">
          <v-progress-circular
            :size="30"
            color="traktor"
            indeterminate
          ></v-progress-circular>
          <span class="ml-3">
            {{ loaderText }}
          </span>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ["visible", "loaderText"],
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
  },
};
</script>

<style>
</style>