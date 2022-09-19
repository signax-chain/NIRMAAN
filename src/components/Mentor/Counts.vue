<template>
  <v-container class="d-flex row">
    <div class="d-flex startups__mentoring">
      <v-icon color="traktor" size="54">mdi-account</v-icon>
      <div class="details">
        <span>Startups Mentored</span>
        <h1>{{ mentor.startupsAssociated.length }}</h1>
      </div>
    </div>
    <div class="d-flex sessions__conducted">
      <v-icon color="traktor" size="54">mdi-school</v-icon>
      <div class="details">
        <span>Sessions Conducted</span>
        <h1>{{ sessionCount }}</h1>
      </div>
    </div>
     <!-- <div class="d-flex sessions__conducted">
      <v-icon color="traktor" size="54">mdi-comment-quote</v-icon>
      <div class="details">
        <span>Average mentoring feedback</span>
        <h1>{{ feedback }}</h1>
      </div>
    </div> -->
  </v-container>
</template>
<script>
import { mentorsRef, mentorshipRef } from "../../config/firebase_services";

export default {
  name: "Counts",
  data() {
    return {
      mentor: null,
      sessionCount: 0,
      feedback: 0
    };
  },
  async created() {
    const mentorId =
      this.$route.params.id === undefined
        ? this.$store.state.user.currentUser.docId
        : this.$route.params.id;

    const document = await mentorsRef.doc(mentorId).get();
    this.mentor = document.data();

    const documents = await mentorshipRef
      .where("mentor.docId", "==", mentorId)
      .get();
    this.sessionCount = documents.size;
  },
};
</script>

<style scoped>
h2 {
  color: #3aa959;
}

p {
  color: #b0b0b0;
}

.startups__mentoring,
.sessions__conducted {
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-right: 20px;
  padding: 15px;
  justify-content: space-between;
  align-items: center;
}

span {
  font-weight: bold;
}

h1 {
  font-size: 40px;
  margin-left: 20px;
}

@media only screen and (max-width: 600px) {
  .startups__mentoring,
  .sessions__conducted {
    margin-top: 15px;
    margin-right: 0 !important;
    width: 100%;
  }

  .container {
    margin: 0 !important;
    width: 100%;
  }
}
</style>

