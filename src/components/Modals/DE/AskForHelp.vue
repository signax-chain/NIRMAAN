<template>
  <v-dialog persistent v-model="show" max-width="500">
    <v-form ref="form" @submit.prevent="submit">
      <v-card>
        <v-card-title class="heading"
          >{{ data.stage }} / {{ data.step }}</v-card-title
        >
        <v-card-text class="mt-5">
          <v-autocomplete
            outlined
            label="Select the question"
            :items="data.questions"
            v-model="question"
            :rules="qtnRule"
          ></v-autocomplete>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="show = false">Close</v-btn>
          <v-btn color="traktor" dark type="submit">Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { mapState } from "vuex";
import { addToActivity } from "../../../services/activity";

export default {
  name: "AskForHelp",
  props: ["visible", "data"],
  data() {
    return {
      question: "",
      qtnRule: [(v) => !!v || "Question cannot be empty!"],
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
    ...mapState({ currentUser: (state) => state.user.currentUser }),
  },
  methods: {
    async submit() {
      if (this.$refs.form.validate()) {
        const data = {
          incubatorId: this.currentUser.incubatorId,
          startupId: this.currentUser.docId,
          statement: `${this.currentUser.name} has asked for help in ${this.data.stage} in step ${this.data.step} and question - ${this.question}`,
          createdAt: new Date(),
          photoURL: this.currentUser.photoURL,
          type: "startup",
          notification: true,
          read: false,
        };
        await addToActivity(data);
        this.$toast.success("Request sent to Incubator.", {
          position: "top",
        });
        this.$emit("close");
      }
    },
  },
};
</script>

<style scoped>
>>> .v-card__title {
  color: #3aa959 !important;
}
</style>