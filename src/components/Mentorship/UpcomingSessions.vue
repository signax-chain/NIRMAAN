<template>
  <v-container>
    <h2 class="mb-5" v-if="sessions.length > 0">Upcoming sessions</h2>
    <!-- <span class="mt-5 grey--text" v-if="sessions.length === 0"
      >No sessions found</span
    > -->
    <div class="row pa-2 flex-wrap">
      <div
        class="upcoming__event_container mt-5"
        v-for="(session, index) in sessions"
        :key="index"
      >
        <div class="d-flex align-center">
          <div class="event__img">
            <img :src="session.mentor.photoURL" alt="" />
          </div>
          <div class="event__details ml-3">
            <span>Startup:</span>
            <h5>{{ session.startup.name }}</h5>
            <span>Mentor:</span>
            <h5>{{ session.mentor.name }}</h5>
          </div>
          <div class="event__timings">
            <h3>{{ session.datetime.toDate().toDateString().slice(0, -4) }}</h3>
            <span>{{
              session.datetime.toDate().toLocaleString("en-us").split(",")[1]
            }}</span>
          </div>
        </div>
        <div class="mt-2">
          <v-btn
            v-if="role !== 'incubator'"
            small
            color="traktor"
            class="white--text d-block ml-auto"
            @click="requestCancel(session.docId)"
            :disabled="checkStatus(session)"
            >{{ getText(session) }}</v-btn
          >
        </div>
      </div>
    </div>
    <div v-if="sessions.length === 0" class="no-documents text-center">
      <img src="../../assets/images/no-documents.svg" alt="" />
      <h3>No Sessions found</h3>
    </div>
  </v-container>
</template>

<script>
import { mentorshipRef, activityRef } from "../../config/firebase_services";
import Swal from "sweetalert2";

export default {
  name: "UpcomingSessions",
  data() {
    return {
      sessions: [],
      role: null,
    };
  },
  created() {
    this.getUpcomingSessions();
  },
  methods: {
    async getUpcomingSessions() {
      const now = new Date();
      this.role = this.$store.state.user.currentUser.role;
      if (this.role === "startup") {
        await mentorshipRef
          .where("status", "==", "Scheduled")
          .where(
            "startup.docId",
            "==",
            this.$store.state.user.currentUser.docId
          )
          .onSnapshot((snapshot) => {
            this.sessions = [];
            snapshot.forEach((document) => {
              const date = document.data()["datetime"].toDate();
              if (date >= now) {
                const data = document.data();
                data.docId = document.id;
                this.sessions.push(data);
              }
            });
          });
        return;
      }

      if (this.role === "mentor") {
        await mentorshipRef
          .where("status", "==", "Scheduled")
          .where("mentor.docId", "==", this.$store.state.user.currentUser.docId)
          .onSnapshot((snapshot) => {
            this.sessions = [];
            snapshot.forEach((document) => {
              const date = document.data()["datetime"].toDate();
              if (date >= now) {
                const data = document.data();
                data.docId = document.id;
                this.sessions.push(data);
              }
            });
          });
        return;
      }

      await mentorshipRef
        .where("status", "==", "Scheduled")
        .where(
          "incubator.docId",
          "==",
          this.$store.state.user.currentUser.docId
        )
        .onSnapshot((snapshot) => {
          this.sessions = [];
          snapshot.forEach((document) => {
            const date = document.data()["datetime"].toDate();
            if (date >= now) {
              const data = document.data();
              data.docId = document.id;
              this.sessions.push(data);
            }
          });
        });
    },
    checkStatus(session) {
      if (session.requestCancel === undefined) return false;

      if (this.role === "startup") {
        return session.requestCancel.startup;
      }

      if (this.role === "mentor") {
        return session.requestCancel.mentor;
      }
    },
    getText(session) {
      return this.checkStatus(session)
        ? "Cancellation requested"
        : "Request for cancellation";
    },
    requestCancel(docId) {
      Swal.fire({
        title: "Are you sure?",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const obj = this.sessions.find((session) => session.docId === docId);
          const activity = {
            createdAt: new Date(),
            notification: true,
            read: false,
            incubatorId: this.$store.state.incubator.currentIncubator.docId,
            statement: `${this.firstLetterCaps(this.role)} ${
              obj[this.role].name
            } has requested for cancellation of the mentoring session.`,
            type: "incubator",
            photoURL: this.$store.state.user.currentUser.photoURL,
          };

          if (this.role === "startup")
            obj.requestCancel = {
              startup: true,
            };

          if (this.role === "mentor")
            obj.requestCancel = {
              mentor: true,
            };

          try {
            await mentorshipRef.doc(obj.docId).set(obj, { merge: true });
            await activityRef.add(activity);
            this.$toast.success("Request sent", {
              position: "top",
            });
          } catch (error) {
            this.$toast.error(error, {
              position: "top",
            });
          }
        }
      });
    },
    firstLetterCaps(word) {
      return word.charAt(0).toUpperCase() + word.substring(1);
    },
  },
};
</script>

<style scoped>
.container {
  /* background: #fff; */
}
.upcoming__event_container {
  padding: 10px;
  border: 1px solid #3aa959;
  border-radius: 10px;
  width: 350px;
  margin-right: 10px;
}

.event__img > img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: contain;
}

.event__img > span {
  font-weight: bold;
  font-size: 14px;
}

.event__details > span {
  font-size: 12px;
  color: gray;
}

.event__timings {
  text-align: center;
}

.event__timings > h3 {
  color: #3aa959;
}

.event__timings > span {
  font-size: 12px;
  font-weight: bold;
}

.v-btn {
  text-transform: capitalize;
}

.no-documents > img {
  width: 400px;
}

@media only screen and (max-width: 600px) {
  .upcoming__event_container {
    width: 100%;
  }
}
</style>