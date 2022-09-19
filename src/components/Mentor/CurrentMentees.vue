<template>
  <v-container class="container">
    <h2>Current Mentees</h2>
    <div class="mentors mt-5 mb-5">
      <div class="col__" v-for="(mentee, index) in mentees" :key="index">
        <v-list three-line>
          <template>
            <v-list-item>
              <v-list-item-avatar size="54">
                <img :src="mentee.photoURL" :alt="mentee.name" />
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>
                  v-html="mentee.name" class="startup__name"
                </v-list-item-title>
                <v-list-item-subtitle
                  >Current stage -
                  {{ getStage(mentee.progress) }}</v-list-item-subtitle
                >
              </v-list-item-content>
            </v-list-item>
            <v-btn color="traktor" dark link :to="`/startup/${mentee.docId}`"
              >View Profile</v-btn
            >
          </template>
        </v-list>
      </div>
    </div>
  </v-container>
</template>
<script>
import {
  mentorshipRef,
  mentorsRef,
  startupsRef,
} from "../../config/firebase_services";

export default {
  name: "CurrentMentees",
  data() {
    return {
      mentees: [],
      mentorId: "",
    };
  },
  async created() {
    this.mentorId =
      this.$route.params.id === undefined
        ? this.$store.state.user.currentUser.docId
        : this.$route.params.id;

    this.getMentees();
    // console.log(this.mentees);
  },
  methods: {
    getStage(progress) {
      return progress === undefined ? "Not updated" : progress.currentStage;
    },
    async getMentees() {
      const document = await mentorsRef.doc(this.mentorId).get();
      const mentees = document.data()["startupsAssociated"];
      let counter = 0;
      mentees.forEach(async (mentee) => {
        const document = await startupsRef.doc(mentee.id).get();
        const data = document.data();
        if (
          data.isDeleted !== undefined &&
          !data.isDeleted &&
          data.status !== "droppedout"
        )
          this.mentees.push(data);
        counter++;
      });
      if (counter == this.mentees.length) {
        console.log(counter, mentees.length);
        this.getMentorshipMentees();
      }
    },
    async getMentorshipMentees() {
      const sessions = await mentorshipRef
        .where("mentor.id", "==", this.$route.params.id)
        .get();
      sessions.forEach(async (session) => {
        const data = session.data();
        const document = await startupsRef.doc(data.startup.id).get();
        const startup = document.data();
        if (
          startup.isDeleted !== undefined &&
          !startup.isDeleted &&
          startup.status !== "droppedout"
        )
          this.mentees.push(startup);
        this.$forceUpdate();
      });
    },
  },
};
</script>

<style scoped>
.v-btn {
  color: #fff;
  font-weight: bold;
  text-transform: capitalize;
  float: right;
  margin-bottom: 15px;
  margin-right: 15px;
}

.text-left {
  color: #3aa959 !important;
  font-size: 16px !important;
}

.mentors {
  display: flex;
  overflow-x: scroll;
  overflow-y: hidden;
  width: 100%;
  /* white-space: nowrap; */
}

.col__ {
  border: 1px solid #3aa959;
  width: 250px;
  margin-right: 10px;
  min-width: 300px;
}

.startup__name {
  color: #3aa959 !important;
  font-size: 18px;
  font-weight: bold;
}

a {
  text-decoration: none;
}

.container {
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 96%;
}

.heading {
  color: #4d4d4d;
  margin: 0 1rem 1rem 0;
  font-weight: 500;
}

@media only screen and (max-width: 600px) {
  .mentors {
    width: 100%;
  }
}
</style>
