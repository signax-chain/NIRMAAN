<template>
  <v-dialog v-model="show" width="800">
    <v-card>
      <v-card-title class="heading">
        Create Funding
        <v-spacer></v-spacer>
        <v-btn icon color="red" @click="show = false"
          ><v-icon>mdi-close</v-icon></v-btn
        >
      </v-card-title>
      <v-card-text>
        <funding-form></funding-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import FundingForm from "../../../views/Accountant/FundingForm.vue";

export default {
  components: { FundingForm },
  props: ["visible"],
  computed: {
    show: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) return this.$emit("close", false);
      },
    },
  },
};
</script>

<style>
</style>