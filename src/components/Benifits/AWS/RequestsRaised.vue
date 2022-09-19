<template>
  <div>
    <v-breadcrumbs :items="crumbs"></v-breadcrumbs>
    <v-card class="elevation-0 mx-5">
      <v-card-title class="heading"
        >{{ getPendingRequestsCount() }} Request Pending</v-card-title
      >
      <v-card-text>
        <div
          class="request pa-3 mb-5"
          v-for="(item, index) in requests"
          :key="index"
        >
          <div class="request-header d-flex justify-space-between align-center">
            <div class="d-flex align-center">
              <img
                :src="item.request.photoURL"
                :alt="item.request.name"
                width="60px"
                class="mr-2"
              />
              <h4>{{ item.request.name }}</h4>
            </div>
            <div>
              <v-btn
                color="traktor"
                dark
                @click="handleAccept(item.id)"
                v-if="item.request.status === 'pending'"
                class="mr-3"
              >
                Accept
              </v-btn>
              <v-btn
                color="red"
                dark
                @click="handleReject(item.id)"
                v-if="item.request.status === 'pending'"
              >
                Reject
              </v-btn>
              <v-chip
                color="traktor"
                outlined
                class="pa-2"
                v-if="item.request.status === 'granted'"
                >Credits Granted</v-chip
              >
              <v-chip
                color="red"
                outlined
                class="pa-2"
                v-if="item.request.status === 'rejected'"
                >Rejected</v-chip
              >
              <v-chip
                color="traktor"
                outlined
                class="pa-2"
                v-if="item.request.status === 'claimed'"
                >Credits Claimed</v-chip
              >
            </div>
          </div>
          <div class="request-body">
            <h2 class="my-3">Application for AWS Credits</h2>
            <p>{{ item.request.description }}</p>
          </div>
        </div>
      </v-card-text>
    </v-card>
    <accept-application
      :visible="acceptApplicationDialog"
      :requestId="requestId"
      @close="handleAcceptClose"
    ></accept-application>
  </div>
</template>

<script>
import {
  activityRef,
  requestsRaisedRef,
} from "../../../config/firebase_services";
import { getRequestsByType } from "../../../services/raise-request";
import AcceptApplication from "./AcceptApplication.vue";
import { mapState } from "vuex";

export default {
  components: { AcceptApplication },
  data() {
    return {
      crumbs: [
        {
          text: "Dashboard",
          disabled: true,
        },
        {
          text: "Requests",
          disabled: true,
        },
      ],
      requests: [],
      acceptApplicationDialog: false,
      requestId: "",
      creditsGranted: "1500",
      applicationLink: "https://aws.amazon.com/?nc2=h_lg",
    };
  },
  created() {
    this.getRequests();
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.user.currentUser,
    }),
  },
  methods: {
    async getRequests() {
      this.requests = await getRequestsByType(
        "aws-credits",
        this.$store.state.incubator.currentIncubator.docId
      );
    },
    getPendingRequestsCount() {
      return this.requests.filter(
        (request) => request.request.status === "pending"
      ).length;
    },
    async handleAccept(id) {
      // this.acceptApplicationDialog = true;
      // this.requestId = id;
      try {
        await requestsRaisedRef.doc(id).set(
          {
            creditsGranted: parseInt(this.creditsGranted),
            applicationLink: this.applicationLink,
            request: {
              status: "granted",
            },
            grantedAt: new Date(),
          },
          { merge: true }
        );

        const request = this.requests.find((request) => request.id === id);
        const activity = {
          createdAt: new Date(),
          startupId: request.userId,
          incubatorId: this.currentUser.docId,
          photoURL: this.currentUser.photoURL,
          notification: true,
          read: false,
          onlyStartup: true,
          statement: `${this.currentUser.name} accepted the application for AWS credits`,
          link: `/aws-credits/${id}`,
        };

        await activityRef.add(activity);

        this.$toast.open({
          message: "Credits Granted",
          type: "success",
          position: "top",
        });
        this.getRequests();
      } catch (error) {
        this.$toast.open({
          message: error.message,
          type: "error",
          position: "top",
        });
      }
    },
    async handleReject(id) {
      try {
        await requestsRaisedRef.doc(id).set(
          {
            request: {
              status: "rejected",
            },
            rejectedAt: new Date(),
          },
          { merge: true }
        );

        const request = this.requests.find((request) => request.id === id);
        const activity = {
          createdAt: new Date(),
          startupId: request.userId,
          incubatorId: this.currentUser.docId,
          photoURL: this.currentUser.photoURL,
          notification: true,
          read: false,
          onlyStartup: true,
          statement: `${this.currentUser.name} Rejected your application for AWS credits`,
          link: `/aws-credits/${id}`,
        };

        await activityRef.add(activity);

        this.$toast.open({
          message: "Application Rejected",
          type: "success",
          position: "top",
        });
        this.getRequests();
      } catch (error) {
        this.$toast.open({
          message: error.message,
          type: "error",
          position: "top",
        });
      }
    },
    async handleAcceptClose() {
      this.acceptApplicationDialog = false;
      this.getRequests();

      const request = this.requests.find(
        (request) => request.id === this.requestId
      );
      const activity = {
        createdAt: new Date(),
        startupId: request.userId,
        incubatorId: this.currentUser.docId,
        photoURL: this.currentUser.photoURL,
        notification: true,
        read: false,
        onlyStartup: true,
        statement: `${this.currentUser.name} accepted the application for AWS credits`,
        link: `/aws-credits/${request.id}`,
      };

      await activityRef.add(activity);
    },
  },
};
</script>

<style scoped>
.heading,
h2 {
  color: #4f4f4f;
}

.request {
  border: 1px solid #e5e5e5;
  border-radius: 5px;
}
</style>