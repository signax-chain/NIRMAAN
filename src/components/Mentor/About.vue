<template>
  <v-container>
    <div class="d-flex">
      <h2>About</h2>
      <v-spacer></v-spacer>
      <v-btn
        color="traktor"
        class="white--text"
        v-if="isEditable"
        @click="save()"
        >Update</v-btn
      >
      <v-btn
        icon
        color="grayFont"
        @click="isEditable = !isEditable"
        v-else
        v-show="
          currentUser.role === 'incubator' ||
          currentUser.role === 'member' ||
          (currentUser.role === 'mentor' && !$route.params.id)
        "
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
    <p class="mt-3 black--text" v-else>
      {{ data.description }}
    </p>
  </v-container>
</template>
<script>
import { mentorsRef } from "../../config/firebase_services";
import { mapState } from "vuex";

export default {
  name: "About",
  computed: {
    ...mapState({ currentUser: (state) => state.user.currentUser }),
  },
  data() {
    return {
      isEditable: false,
      data: {},
      mentorId: null,
    };
  },
  async created() {
    this.mentorId =
      this.$route.params.id === undefined || this.$route.params.id === null
        ? this.$store.state.user.currentUser.docId
        : this.$route.params.id;

    const document = await mentorsRef.doc(this.mentorId).get();
    this.data = document.data();
  },
  methods: {
    async save() {
      try {
        await mentorsRef
          .doc(this.mentorId)
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
  color: #3e3e3e;
}

p {
  color: #b0b0b0;
}
</style>

