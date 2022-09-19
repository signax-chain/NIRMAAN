<template>
  <v-dialog v-model="show" persistent max-width="290">
    <v-card>
      <v-card-title class="headline">
        Add new
        <v-spacer></v-spacer>
        <v-btn color="red" text @click="show = false"> Cancel </v-btn>
        <v-btn color="traktor" class="white--text" @click="add()"> Add </v-btn>
      </v-card-title>
      <v-card-text>
        <v-text-field outlined label="Add new" v-model="area"></v-text-field>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "AddNewAreaOfExpertise",
  props: ["visible"],
  data() {
    return {
      area: "",
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
      if (this.area === "") {
        this.$toast.error("Area cannot be empty!", {
          position: "top",
        });
        return;
      }
      this.$emit("addNewArea", this.area);
    },
  },
};
</script>

<style scoped>
.v-btn {
  text-transform: capitalize;
}
</style>