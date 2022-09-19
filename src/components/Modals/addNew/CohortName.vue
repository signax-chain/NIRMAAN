<template>
  <v-dialog v-model="show" persistent max-width="500">
    <v-card>
      <v-card-title class="headline">
        Add new cohort name
        <v-spacer></v-spacer>
        <v-btn color="red" text @click="show = false"> Cancel </v-btn>
        <v-btn color="traktor" class="white--text" @click="add()"> Add </v-btn>
      </v-card-title>
      <v-card-text class="mt-5">
        <v-text-field
          outlined
          label="Add new"
          v-model="cohortName"
        ></v-text-field>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "AddNewCohortName",
  props: ["visible"],
  data() {
    return {
      cohortName: "",
    };
  },
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
  methods: {
    add() {
      if (this.cohortName === "") {
        this.$toast.error("Cohort Name cannot be empty!", {
          position: "top",
        });
        return;
      }
      this.$emit("addCohortName", this.cohortName);
    },
  },
};
</script>

<style scoped>
.v-btn {
  text-transform: capitalize;
}
</style>