<template>
  <v-container>
    <h2 class="mb-5" v-if="events.length > 0">Upcoming events</h2>
    <!-- <span class="mt-5 grey--text" v-if="events.length === 0"
      >No events found</span
    > -->
    <v-row class="d-flex pa-2 events__row">
      <div
        class="upcoming__event_container my-5 mx-3"
        v-for="(event, index) in events"
        :key="index"
      >
        <div class="d-flex align-center">
          <div class="event__img text-center">
            <img :src="event.speakers[0].photoURL" alt="" />
            <span class="d-block">{{ event.type }}</span>
          </div>
          <div class="event__details ml-5">
            <span>Topic:</span>
            <h5>{{ event.title }}</h5>
            <span>Speaker:</span>
            <h5>{{ event.speakers[0].name }}</h5>
          </div>
          <div class="event__timings">
            <h3>{{ event.date }}</h3>
            <span>{{ event.time }}</span>
          </div>
        </div>
        <div class="mt-2" v-if="currentUser.role !== 'incubator'">
          <v-btn
            small
            color="traktor"
            class="white--text d-block ml-auto"
            @click="register(event.docId)"
            >Register</v-btn
          >
        </div>
      </div>
    </v-row>
    <div v-if="events.length === 0" class="no-awards pb-5 text-center">
      <img src="../../assets/images/no-awards.svg" alt="" />
      <h3>No Events found</h3>
    </div>
  </v-container>
</template>

<script>
import { eventsRef } from "../../config/firebase_services";
import { mapState } from "vuex";

export default {
  name: "UpcomingEvents",
  computed: {
    ...mapState({ currentUser: (state) => state.user.currentUser }),
  },
  data() {
    return {
      events: [],
    };
  },
  created() {
    this.getEvents();
  },
  methods: {
    async getEvents() {
      eventsRef
        .where(
          "incubatorId",
          "==",
          this.$store.state.incubator.currentIncubator.docId
        )
        .where("isFeedback", "==", false)
        .where("status", "==", "active")
        .onSnapshot((snapshot) => {
          const now = new Date();
          this.events = [];
          snapshot.forEach((document) => {
            const data = document.data();
            const datetime = new Date(data.date + " " + data.time);
            if (datetime >= now) {
              data.date = datetime.toDateString().slice(0, -4);
              data.time = datetime.toLocaleString("en-in").split(",")[1];
              data.docId = document.id;
              this.events.push(data);
            }
          });
        });
    },
    register(docId) {
      const link = `/event/register/${docId}`;
      this.$router.push(link);
      // window.open(link, "_blank").focus();
    },
  },
};
</script>

<style scoped>
.container {
  /* background: #fff; */
  border-radius: 10px;
  width: 100%;
  height: 100%;
}

.upcoming__event_container {
  padding: 10px;
  border: 1px solid #3aa959;
  border-radius: 10px;
}

.event__img > img {
  width: 50px;
  border-radius: 50%;
}

.event__img > span {
  font-weight: bold;
  font-size: 14px;
}

.event__details {
  width: 25%;
  text-align: center;
}

.event__details > span {
  font-size: 12px;
  color: gray;
}

.event__timings {
  text-align: center;
  width: 35%;
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

@media only screen and (max-width: 600px) {
  .upcoming__event_container {
    width: 100%;
  }
}
</style>