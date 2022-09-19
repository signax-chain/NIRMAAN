<template>
  <v-dialog v-model="show" persistent max-width="500">
    <v-card>
      <v-card-title class="headline">
        Add new sector
        <v-spacer></v-spacer>
        <v-btn color="red" text @click="show = false"> Cancel </v-btn>
        <v-btn color="traktor" class="white--text" @click="add()"> Add </v-btn>
      </v-card-title>
      <v-card-text class="mt-5">
        <v-text-field outlined label="Add new" v-model="sector"></v-text-field>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "AddNewSector",
  props: ["visible"],
  data() {
    return {
      sector: "",
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
      if (this.sector === "") {
        this.$toast.error("Sector cannot be empty!", {
          position: "top",
        });
        return;
      }
      this.$emit("addNewSector", this.sector);
    },
  },
};
</script>

<style scoped>
.v-btn {
  text-transform: capitalize;
}
</style>