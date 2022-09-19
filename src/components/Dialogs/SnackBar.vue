<template>
  <v-snackbar v-model="snackbar.showing" :color="snackbar.color" top>
    {{ snackbar.text }}

    <template v-slot:action="{ attrs }">
      <v-btn color="#fff" text v-bind="attrs" @click="snackbar.showing = false">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "SnackBar",
  computed: {
    ...mapState({ snackbar: (state) => state.dialogs.snackbar }),
  },
};
</script>

<style scoped>
</style>