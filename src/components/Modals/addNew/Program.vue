<template>
  <v-dialog v-model="show" max-width="500">
    <v-form ref="form" @submit.prevent="add()">
      <v-card>
        <v-card-title class="heading"
          >Create new program
          <v-spacer> </v-spacer>
          <v-btn color="red" text @click="show = false"> Close</v-btn>
          <v-btn color="traktor" dark type="submit"> Add</v-btn>
        </v-card-title>
        <v-card-text class="mt-5">
          <v-text-field
            label="Program name"
            outlined
            v-model="program"
            :rules="programRule"
          ></v-text-field>
        </v-card-text>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
export default {
  name: "Program",
  props: ["visible"],
  data() {
    return {
      program: "",
      programRule: [(v) => !!v || "Program cannot be empty!"],
    };
  },
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
  methods: {
    add() {
      if (this.$refs.form.validate()) {
        this.$emit("addNewProgram", this.program);
      }
    },
  },
};
</script>

<style scoped>
</style>