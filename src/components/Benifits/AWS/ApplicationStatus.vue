<template>
  <section>
    <v-breadcrumbs :items="crumbs"></v-breadcrumbs>
    <div class="wrapper mt-5">
      <v-card>
        <v-card-text>
          <div class="d-flex align-center justify-space-around">
            <img :src="currentIncubator.photoURL" width="200px" />
            <div>
              <h2>{{ currentIncubator.name }}</h2>
              <h2 class="mt-2">Application for AWS Credits</h2>
            </div>
          </div>
          <div class="heading mt-10">Application Status of AWS Credits</div>
          <div class="text-center mt-10">
            <img
              :src="request.request.photoURL"
              :alt="request.request.name"
              width="100px"
            />
            <h2>{{ request.request.name }}</h2>
            <p class="mt-8" v-if="request.request.status === 'granted'">
              We are happy to infor you that, under the Booster Kit Programme of
              <b>{{ currentIncubator.name }}</b> your startup
              <b>{{ request.request.name }}</b> has been approved to be eligible
              for <b>AWS Credits</b> of <b>${{ request.creditsGranted }}</b
              >.
            </p>
            <h2
              class="mt-10"
              style="width: 80%; margin: 0 auto"
              v-if="request.request.status === 'granted'"
            >
              Click the button below to complete your application
            </h2>
            <v-btn
              color="traktor"
              dark
              class="mt-5"
              large
              @click="goto()"
              v-if="request.request.status === 'granted'"
            >
              Claim Credits</v-btn
            >
            <v-chip
              color="traktor"
              dark
              class="mt-5"
              v-if="request.request.status === 'claimed'"
            >
              Already Claimed</v-chip
            >
            <v-chip
              color="red"
              outlined
              dark
              class="mt-5 pa-2"
              v-if="request.request.status === 'rejected'"
            >
              Rejected</v-chip
            >
          </div>
        </v-card-text>
      </v-card>
    </div>
  </section>
</template>

<script>
import { mapState } from "vuex";
import { requestsRaisedRef } from "../../../config/firebase_services";
import { getRequestById } from "../../../services/raise-request";
export default {
  computed: {
    ...mapState({
      currentUser: (state) => state.user.currentUser,
      currentIncubator: (state) => state.incubator.currentIncubator,
    }),
  },
  created() {
    this.getRequest();
  },
  data() {
    return {
      request: {},
      crumbs: [
        {
          text: "Dashboard",
          disabled: true,
        },
        {
          text: "Requests",
          disabled: true,
        },
        {
          text: "AWS Credits",
          disabled: true,
        },
      ],
    };
  },
  methods: {
    async getRequest() {
      this.request = await getRequestById(this.$route.params.id);
    },
    async goto() {
      try {
        await requestsRaisedRef.doc(this.request.id).set(
          {
            request: {
              status: "claimed",
            },
            claimedAt: new Date(),
          },
          { merge: true }
        );
        window.open(this.request.applicationLink, "_blank");
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style scoped>
.wrapper {
  width: 580px;
  margin: 0 auto;
}

h2 {
  color: #4f4f4f;
}

.heading {
  color: #3aa959;
  font-size: 26px;
  font-weight: bold;
  text-align: center;
  width: 50%;
  margin: 0 auto;
  line-height: 30px;
}

p {
  color: #4f4f4f;
  font-size: 18px;
  width: 80%;
  margin: 0 auto;
}
</style>