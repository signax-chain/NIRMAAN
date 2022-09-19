<template>
  <div class="event-card mb-3" v-if="events.length > 0">
    <div class="event-row">
      <div class="event-col">
        <img src="../../../assets/images/aakarsh-naidu.svg" alt="" />
      </div>
      <div class="event-col ml-5">
        <h4 class="event-speaker">Masterclass on Business Model Canvas</h4>
        <span class="event-designation">Aakarsh Naidu</span>
      </div>
    </div>
    <div class="event-row mt-2">
      <div class="d-block ml-auto">
        <!-- <v-btn class="traktor mr-2" outlined dark>View Feedback</v-btn> -->
        <v-btn class="traktor" dark @click="goto()">Join now</v-btn>
      </div>
    </div>
  </div>
  <div class="no-events" v-else>
    <img src="../../../assets/images/no-events.svg" alt="" />
    <h3 class="heading">No upcoming events</h3>
  </div>
</template>

<script>
export default {
  name: "UpcomingEvents",
  data() {
    return {
      events: [],
    };
  },
  methods: {
    goto() {
      window.open("https://meet.google.com/yzh-nizc-xca", "_blank");
    },
  },
};
</script>

<style scoped>
.event-card {
  border: 1px solid #dbdbdb;
  border-radius: 5px;
  padding: 1rem;
  width: 80%;
}

.event-row {
  display: flex;
}

>>> .v-btn--outlined {
  background-color: #fff !important;
  color: #3aa959;
}

.event-speaker {
  color: #4f4f4f;
  font-size: 20px;
}

.no-events {
  text-align: center;
}

.no-events > img {
  width: 400px;
}

.heading {
  color: #4f4f4f;
  font-size: 20px;
}

.event-designation {
  color: #b0b0b0;
  font-size: 14px;
}

@media only screen and (max-width: 600px) {
  .no-events > img {
    width: 300px;
  }

  .heading {
    font-size: 16px;
  }
}
</style>