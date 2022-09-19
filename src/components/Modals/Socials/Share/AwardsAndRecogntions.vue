<template>
  <div>
    <v-dialog v-model="show" width="500">
      <v-card>
        <v-card-title class="heading"
          >Share on LinkedIn
          <v-spacer></v-spacer>
          <v-btn color="red" icon @click="show = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="mt-3">
          <v-textarea
            v-model="shareText"
            label="Share Text"
            :counter="140"
            maxlength="140"
            required
            outlined
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-btn color="traktor" @click="share()" dark class="d-block mx-auto">
            Share
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { linkedInSSO } from "../../../../services/Auth/sso/linkedin";
export default {
  props: ["visible", "shareText"],
  computed: {
    show: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) this.$emit("close", close);
      },
    },
  },
  data() {
    return {};
  },
  methods: {
    async share() {
      try {
        const response = await linkedInSSO.shareText(this.shareText);
        console.log(response);
        this.$toast.open({
          message: "Shared on LinkedIn",
          type: "success",
          position: "top",
          duration: 5000,
        });
        this.$emit("close", close);
      } catch (error) {
        this.$toast.error({
          message: error.message,
          type: "error",
          position: "top",
          duration: 5000,
        });
      }
    },
  },
};
</script>

<style>
</style>