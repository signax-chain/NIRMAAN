<template>
  <v-container>
    <div class="d-flex">
      <h2>About</h2>
      <v-spacer></v-spacer>
      <v-btn icon color="grayFont" @click="dialog = true">
        <v-icon size="28">mdi-eye</v-icon>
      </v-btn>
      <v-btn
        color="traktor"
        class="white--text"
        v-if="isEditable"
        @click="save()"
        >save</v-btn
      >
      <v-btn
        icon
        color="grayFont"
        @click="isEditable = !isEditable"
        v-else
        v-show="currentUser.role !== 'mentor'"
      >
        <v-icon size="28">mdi-pencil</v-icon>
      </v-btn>
    </div>
    <v-textarea
      outlined
      v-model="data.description"
      v-if="isEditable"
      class="mt-5"
    ></v-textarea>
    <p class="mt-3" v-else>{{ truncateParagraph(190, data.description) }}</p>
    <about-modal
      :data="data"
      :visible="dialog"
      @close="dialog = false"
    ></about-modal>
  </v-container>
</template>
<script>
import { startupsRef } from "../../config/firebase_services";
import { mapState } from "vuex";
import _helpers from "../../mixins/_helpers";
import About from "../Modals/Startup/About.vue";

export default {
  components: { aboutModal: About },
  name: "About",
  computed: {
    ...mapState({ currentUser: (state) => state.user.currentUser }),
  },
  data() {
    return {
      data: {},
      startupId: null,
      isEditable: false,
      dialog: false,
    };
  },
  mixins: [_helpers],
  async created() {
    this.startupId =
      this.$route.params.id !== undefined || this.$route.params.id === null
        ? this.$route.params.id
        : this.$store.state.user.currentUser.docId;

    const document = await startupsRef.doc(this.startupId).get();
    this.data = document.data();
  },
  methods: {
    async save() {
      try {
        await startupsRef
          .doc(this.startupId)
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
h2 {
  /* color: #3aa959; */
}

p {
  font-weight: normal;
  line-height: 25px;
  color: #828282;
}
</style>

