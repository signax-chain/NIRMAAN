<template>
  <div class="current__mentors_container pa-3" v-if="mentors.length > 0">
    <h3 class="heading">Current Mentors</h3>
    <div class="my-2 d-flex">
      <div
        class="mentor__container ml-3 mb-3"
        v-for="(mentor, index) in mentors"
        :key="index"
        @click="view(mentor.docId)"
      >
        <div class="mentor__info pa-2">
          <img :src="mentor.photoURL" alt="" />
          <div class="text-right">
            <h4>{{ mentor.name }}</h4>
            <span v-if="mentor.designation !== ''">{{
              mentor.designation
            }}</span>
            <span v-else>No designation</span>
            <p v-if="mentor.areaOfExpertise.length > 0">
              {{ mentor.areaOfExpertise.toString() }}
            </p>
            <!-- <v-btn
              class="mt-10"
              color="traktor"
              @click="view(mentor.docId)"
              dark
              small
              >View</v-btn
            > -->
          </div>
        </div>
      </div>
    </div>
    <Profile
      v-if="profileData"
      :modal.sync="showModal"
      :profileData="profileData"
    />
  </div>
</template>
<script>
import { startupsRef, mentorsRef } from "../../config/firebase_services";
import Profile from "@/components/Modals/Mentor/Profile";

export default {
  name: "CurrentMentors",
  components: {
    Profile,
  },
  data() {
    return {
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
h2,
h4 {
  color: #4f4f4f;
}

.current__mentors_container {
  height: 250px;
  background: #ffffff;
  border: 1px solid #dbdbdb;
  box-sizing: border-box;
  border-radius: 5px;
  margin-bottom: 20px;
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
  margin: 0 1rem 1rem 1rem;
}

.mentor__container {
  /* border: 1px solid #3aa959;
  width: 33.33%;
  border-radius: 10px;
  height: auto;
  position: relative;
  min-height: 170px; */
  background-color: #fff;
  border: 1px solid #eee;
  border-radius: 5px;
  width: 24%;
  padding: 1rem;
  box-shadow: 0 4px 0 rgba(58, 169, 89, 1);
  transition: 0.3s;
  cursor: pointer;
}

.mentor__info {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
}

.mentor__info > img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  object-position: center;
}

.view__btn {
  position: absolute;
  bottom: 5px;
  right: 5px;
}

span {
  font-size: 14px;
  color: #b0b0b0;
  white-space: normal;
}

p {
  font-size: 14px;
  color: #3aa959;
  white-space: normal;
}

.v-btn {
  margin-top: -20px !important;
}

.heading {
  color: #4d4d4d;
  margin: 0 1rem 1rem 1.5rem;
  font-weight: 500;
}

@media only screen and (max-width: 600px) {
  .mentor__container {
    width: 100%;
  }
}
</style>