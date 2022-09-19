<template>
  <v-dialog v-model="show" persistent width="500">
    <v-form ref="form">
      <v-card>
        <v-card-title class="heading">
          Suggest Changes
          <v-spacer></v-spacer>
          <v-btn color="red" icon @click="show = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="mt-5">
          <v-textarea
            outlined
            label="Suggestions"
            v-model="data.suggestions"
            :rules="rule"
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="traktor" dark @click="submit()">Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { deSuggestionsRef } from "../../../config/firebase_services";
import { getStartupById } from "../../../services/Startups";
export default {
  name: "SuggestChanges",
  props: ["visible"],
  data() {
    return {
      rule: [(v) => !!v || "Cannot be empty!"],
      data: {
        suggestions: null,
        createdAt: new Date(),
        suggestedBy: { name: null, id: null, email: null },
        suggestedTo: { name: null, id: null, email: null },
      },
    };
  },
  computed: {
    show: {
      get() {
        return this.visible;
      },
      set(val) {
        if (!val) return this.$emit("close");
      },
    },
  },
  methods: {
    async submit() {
      if (this.$refs.form.validate()) {
        const currentUser = this.$store.state.user.currentUser;

        this.data.suggestedTo.id = localStorage.getItem("strResId");
        const data = await getStartupById(this.data.suggestedTo.id);

        this.data.suggestedTo.id = data.docId;
        this.data.suggestedTo.name = data.name;
        this.data.suggestedTo.email = data.email;

        this.data.suggestedBy.id = currentUser.docId;
        this.data.suggestedBy.name = currentUser.name;
        this.data.suggestedBy.email = currentUser.email;

        try {
          await deSuggestionsRef.add(this.data);
          this.$emit("close");
          this.$toast.success("Suggestion sent", {
            position: "top",
          });
          this.$router.push("/de");
        } catch (error) {
          this.$toast.error(error, {
            position: "top",
          });
        }
      }
    },
  },
};
</script>

<style scoped>
</style>