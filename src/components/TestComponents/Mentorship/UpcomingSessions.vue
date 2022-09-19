<template>
  <div v-if="mentors.length > 0">
    <div
      class="session-card mb-3"
      v-for="(mentor, index) in mentors"
      :key="index"
    >
      <div class="session-row">
        <div class="session-col">
          <img :src="mentor.photoURL" class="photo" alt="" />
        </div>
        <div class="session-col ml-5">
          <h4 class="session-speaker">{{ mentor.name }}</h4>
          <span class="session-designation" v-if="mentor.designation !== ''"
            >{{ mentor.designation }}
          </span>
          <span v-else>No designation</span>
        </div>
      </div>
      <div class="session-row mt-2">
        <div class="d-block ml-auto">
          <v-btn
            class="traktor mr-2"
            outlined
            dark
            @click="feedbackModal = true"
            >View Feedback</v-btn
          >
          <v-btn class="traktor" dark>Request</v-btn>
        </div>
      </div>
      <feedback
        :visible="feedbackModal"
        @close="feedbackModal = false"
        :feedbacks="{ feedbacks: {} }"
      ></feedback>
      <Profile
        v-if="profileData"
        :modal.sync="showModal"
        :profileData="profileData"
      />
    </div>
  </div>
  <div class="no-mentors" v-else>
    <img src="../../../assets/images/no-mentors.svg" alt="" />
    <h3 class="heading">Mentors to be assigned</h3>
  </div>
</template>

<script>
import Feedback from "../../Modals/Mentorship/Feedback.vue";
import { startupsRef, mentorsRef } from "../../../config/firebase_services";
import Profile from "@/components/Modals/Mentor/Profile";

export default {
  components: { Feedback, Profile },
  name: "UpcomingSessions",
  data() {
    return {
      feedbackModal: false,
      startupId: null,
      mentors: [],
      showModal: false,
      profileData: null,
    };
  },
  async created() {
    this.startupId =
      this.$route.params.id !== undefined
        ? this.$route.params.id
        : this.$store.state.user.currentUser.docId;

    const document = await startupsRef.doc(this.startupId).get();
    const mentors = document.data()["mentorsAssociated"];
    mentors.forEach(async (mentor) => {
      const document = await mentorsRef.doc(mentor.id).get();
      this.mentors.push(document.data());
    });
  },
  methods: {
    view(docId) {
      const obj = this.mentors.find((mentor) => mentor.docId === docId);
      this.showModal = true;
      this.profileData = obj;
    },
  },
};
</script>

<style scoped>
.session-card {
  border: 1px solid #dbdbdb;
  border-radius: 5px;
  padding: 1rem;
  width: 90%;
}

.session-row {
  display: flex;
}

>>> .v-btn--outlined {
  background-color: #fff !important;
  color: #3aa959;
}

.photo {
  border-radius: 50%;
  width: 100px;
  height: 100px;
}

.session-speaker {
  color: #4f4f4f;
  font-size: 20px;
}

.no-mentors {
  text-align: center;
}

.no-mentors > img {
  width: 400px;
}

.heading {
  color: #4f4f4f;
  font-size: 20px;
}

.session-designation {
  color: #b0b0b0;
  font-size: 14px;
}

@media only screen and (max-width: 600px) {
  .no-mentors > img {
    width: 300px;
  }

  .heading {
    font-size: 16px;
  }

  .session-card {
    width: 100%;
  }

  .photo {
    width: 60px;
    height: 60px;
  }

  .session-speaker {
    font-size: 16px;
  }

  .session-designation {
    font-size: 12px;
  }
}
</style>