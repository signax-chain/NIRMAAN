<template>
  <v-row justify="center">
    <v-dialog v-model="modal" persistent max-width="1000">
      <v-card>
        <v-card-text class="pa-5">
          <v-img
            :src="profileData.photoURL"
            :alt="profileData.name"
            class="photo mx-auto"
          />
          <h3 class="text-center mt-2 black--text">{{ profileData.name }}</h3>
          <p class="mt-3" style="font-weight: bold">
            {{ profileData.description }}
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="modal = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
export default {
  name: "Profile",
  props: {
    modal: {
      default: false,
    },
    profileData: {
      type: Object,
    },
  },
  computed: {
    closeModal: function () {
      return this.$emit("update:modal", false);
    },
  },
};
</script>
<style scoped>
.photo {
  width: 150px;
  height: 150px;
  border-radius: 50%;
}
</style>