<template>
  <v-container>
    <v-img
      :src="incubator.photoURL"
      class="logo mb-5"
      :alt="incubator.name"
      width="350px"
      style="margin-left: auto; margin-right: auto"
    >
    </v-img>
    <v-card class="pa-5">
      <v-card-title>Event Feedback Form</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-text-field
              outlined
              prepend-icon="mdi-text"
              label="Name"
              v-model="feedback.name"
            >
            </v-text-field>
            <v-text-field
              outlined
              prepend-icon="mdi-text"
              label="Where did you here about the event?"
              v-model="feedback.where"
            >
            </v-text-field>
            <p style="font-size: 20px; color: #000">Topic Rating</p>
            <v-rating
              color="yellow darken-3"
              background-color="grey darken-1"
              empty-icon="$ratingFull"
              half-increments
              hover
              large
              v-model="feedback.topicRating"
            >
            </v-rating>
            <p style="font-size: 20px; color: #000">Speaker Rating</p>
            <v-rating
              color="yellow darken-3"
              background-color="grey darken-1"
              empty-icon="$ratingFull"
              half-increments
              hover
              large
              v-model="feedback.speakerRating"
            >
            </v-rating>
            <p style="font-size: 20px; color: #000">Overall Rating</p>
            <v-rating
              color="yellow darken-3"
              background-color="grey darken-1"
              empty-icon="$ratingFull"
              half-increments
              hover
              large
              v-model="feedback.overallRating"
            >
            </v-rating>
            <v-textarea
              label="Any Suggestions?"
              outlined
              class="mt-3"
              v-model="feedback.suggestions"
            ></v-textarea>
            <v-btn
              class="white--text ml-auto d-block"
              color="traktor"
              @click="submit()"
              >Submit</v-btn
            >
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import {
  eventsRef,
  eventFeedbacksRef,
  incubatorsRef,
  activityRef,
} from "../../../config/firebase_services";

export default {
  name: "Feedback",
  data: () => ({
    data: {},
    feedback: {
      name: null,
      where: null,
      topicRating: null,
      speakerRating: null,
      overallRating: null,
      suggestions: null,
      eventId: null,
    },
    incubator: {},
  }),
  async created() {
    this.getEventDetails();
  },
  methods: {
    async getEventDetails() {
      const document = await eventsRef.doc(this.$route.params.id).get();
      this.data = document.data();
      this.getIncubator();
    },
    async getIncubator() {
      const document = await incubatorsRef.doc(this.data.incubatorId).get();
      this.incubator = document.data();
    },
    async submit() {
      if (
        this.feedback.name === null ||
        this.feedback.where === null ||
        this.feedback.topicRating === null ||
        this.feedback.speakerRating === null ||
        this.feedback.overallRating === null
      ) {
        this.$toast.error("Some fields are missing!", {
          position: "top",
        });
        return;
      }
      this.feedback.incubatorId = this.incubator.docId;
      this.feedback.eventId = this.$route.params.id;
      this.feedback.createdAt = new Date();

      const activity = {
        incubatorId: this.incubator.docId,
        photoURL: this.incubator.photoURL,
        statement: `${this.feedback.name} has given their feedback for the event ${this.data.title}`,
        notification: true,
        read: false,
        createdAt: new Date(),
        type: "incubator",
      };

      try {
        await eventFeedbacksRef.add(this.feedback);
        await activityRef.add(activity);
        this.$toast.success("Feedback Submitted", {
          position: "top",
        });
        this.eventRegisterModal = false;
      } catch (error) {
        this.$toast.error(error, {
          position: "top",
        });
      }
    },
  },
};
</script>