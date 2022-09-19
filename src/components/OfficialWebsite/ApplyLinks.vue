<template>
  <v-card>
    <v-card-title>Apply to nirmaan link</v-card-title>
    <v-card-text>
      <v-form>
        <v-text-field
          v-model="apply_link"
          label="Apply link"
          hint="https://nirmaan.org/apply"
          persistent-hint
          prepend-icon="mdi-link"
          @change="updateApplyLink"
          outlined
        ></v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn color="traktor" class="ml-auto" dark @click="updateApplyLink">
        Update Link
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { websiteRef } from "../../config/firebase_services";
export default {
  data() {
    return {
      apply_link: "",
    };
  },
  created() {
    this.getApplyLink();
  },
  methods: {
    async getApplyLink() {
      const documents = await websiteRef
        .doc(this.$store.state.user.currentUser.docId)
        .collection("applyLinks")
        .get();

      documents.forEach((document) => {
        this.apply_link = document.data().link;
      });
      console.log(this.apply_link);
    },
    async updateApplyLink() {
      try {
        await websiteRef
          .doc(this.$store.state.user.currentUser.docId)
          .collection("applyLinks")
          .doc("apply_link")
          .set({ link: this.apply_link });
        this.$toast.open({
          message: "Apply link updated",
          type: "success",
        });
      } catch (error) {
        this.$toast.error(error.message);
      }
    },
  },
};
</script>

<style>
</style>