<template>
  <div class="wrapper pa-5">
    <div class="d-flex">
      <h2>About</h2>
      <v-spacer></v-spacer>
      <v-btn icon color="traktor" @click="dialog = true">
        <v-icon>mdi-eye</v-icon>
      </v-btn>
      <v-btn
        color="traktor"
        class="white--text"
        v-if="isEditable"
        @click="save()"
        >Update</v-btn
      >
      <v-btn
        icon
        color="traktor"
        @click="isEditable = !isEditable"
        v-else
        v-show="currentUser.role !== 'mentor'"
      >
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </div>
    <v-textarea
      outlined
      v-model="data.description"
      v-if="isEditable"
      class="mt-5"
    ></v-textarea>
    <p class="mt-3" v-else>{{ truncateParagraph(500, data.description) }}</p>
    <about-modal
      :data="data"
      :visible="dialog"
      @close="dialog = false"
    ></about-modal>
  </div>
</template>

<script>
import { startupsRef } from "../../../config/firebase_services";
import { mapState } from "vuex";
import _helpers from "../../../mixins/_helpers";
import About from "../../Modals/Startup/About.vue";

export default {
  name: "About",
  components: { aboutModal: About },
  props: ["data"],
  computed: {
    ...mapState({ currentUser: (state) => state.user.currentUser }),
  },
  data() {
    return {
      startupId: null,
      isEditable: false,
      dialog: false,
    };
  },
  mixins: [_helpers],
  methods: {
    async save() {
      try {
        await startupsRef
          .doc(this.data.docId)
          .set({ description: this.data.description }, { merge: true });

        this.$toast.success("Updated", {
          position: "top",
        });
        this.isEditable = false;
      } catch (error) {
        this.$toast.error(error, {
          position: "top",
        });
      }
    },
  },
};
</script>

<style scoped>
.wrapper {
}

.heading {
  color: #4d4d4d;
  margin: 0 1rem 1rem 0;
  font-weight: 500;
}
</style>