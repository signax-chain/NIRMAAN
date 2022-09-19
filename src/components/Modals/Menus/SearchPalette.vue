<template>
  <v-card v-show="show">
    <v-card-text>
      <div class="startups-block">
        <div class="header d-flex align-center">
          <img
            src="../../../assets/images/icons/add-new-startup.svg"
            alt=""
            width="30px"
            class="mr-2"
          />
          <h3>Startups</h3>
        </div>
        <div
          class="results d-flex align-center"
          v-for="(startup, index) in searchResult.startups"
          :key="index"
          @click="goto(`/startup/${startup.docId}`)"
        >
          <img :src="startup.photoURL" alt="" width="40px" class="mr-2" />
          <h4>{{ startup.name }}</h4>
        </div>
        <span class="gray--text" v-if="searchResult.startups.length === 0"
          >No startups found</span
        >
      </div>
      <v-divider class="my-3"></v-divider>
      <div class="mentors-block">
        <div class="header d-flex align-center">
          <img
            src="../../../assets/images/icons/request-new-mentor.svg"
            alt=""
            width="30px"
            class="mr-2"
          />
          <h3>Mentors</h3>
        </div>
        <div
          class="results d-flex align-center"
          v-for="(mentor, index) in searchResult.mentors"
          :key="index"
          @click="goto(`/mentor/${mentor.docId}`)"
        >
          <img :src="mentor.photoURL" alt="" width="40px" class="mr-2" />
          <h4>{{ mentor.name }}</h4>
        </div>
        <span class="gray--text" v-if="searchResult.mentors.length === 0"
          >No mentors found</span
        >
      </div>
      <!-- <v-divider class="my-3"></v-divider> -->
      <!-- <div class="mentorship-block">
        <div class="header d-flex align-center">
          <img
            src="../../../assets/images/icons/schedule-mentoring-session.svg"
            alt=""
            width="30px"
            class="mr-2"
          />
          <h3>Mentoring Session</h3>
        </div>
        <div class="results d-flex align-center">
          <img
            src="../../../assets/images/top-mentor.svg"
            alt=""
            width="40px"
            class="mr-2"
          />
          <div>
            <h4>B. Vishwanathan</h4>
            <span>Startup: Resonect</span>
          </div>
        </div>
      </div> -->
      <div class="events-block"></div>
      <div class="connections-block"></div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "SearchPalette",
  props: ["visible", "searchResult"],
  computed: {
    show: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) return this.$emit("close");
      },
    },
  },
  methods: {
    goto(url) {
      this.$router.push(url);
    },
  },
};
</script>

<style scoped>
.header > h3 {
  color: #c8c8c8;
  font-weight: 500;
}

.results {
  width: 90%;
  margin-left: auto;
  margin-top: 0.5rem;
  cursor: pointer;
}

h4 {
  color: #4f4f4f;
  font-weight: 500;
}

span {
  color: #b0b0b0;
  font-size: 12px;
}

img {
  border-radius: 50%;
  width: 40px;
  height: 40px;
  object-fit: cover;
}
</style>