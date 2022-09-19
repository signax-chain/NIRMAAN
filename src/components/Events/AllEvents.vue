<template>
  <div>
    <v-row class="mb-4">
      <v-col cols="12" md="6">
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          placeholder="Search for events"
          single-line
          hide-details
          outlined
          dense
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <div class="float-right">
          <v-btn
            color="traktor"
            dark
            class="mr-2"
            @click="pastEventModal = true"
            >Add past Event</v-btn
          >
          <v-btn color="traktor" dark to="/events/new">Create Event</v-btn>
          <v-btn color="grey" text dark to="/events/request-speaker"
            >Request Speaker</v-btn
          >
        </div>
      </v-col>
    </v-row>
    <v-data-table
      :headers="headers"
      :items="events"
      :items-per-page="5"
      class="elevation-1 mb-5"
      mobile-breakpoint="0"
    >
      <template v-slot:[`item.speakers`]="{ item }">
        {{ getSpeakers(item.speakers).toString() }}
      </template>
      <template v-slot:[`item.responses`]="{ item }">
        <v-btn
          color="traktor"
          class="white--text"
          @click="viewResponses(item.docId)"
          >View</v-btn
        >
      </template>
      <template v-slot:[`item.feedback`]="{ item }">
        <v-btn
          v-if="!item.isFeedback"
          color="traktor"
          class="white--text"
          @click="initiateFeedback(item)"
          :disabled="checkForFeedback(item) || item.status === 'cancelled'"
          >{{ getStatus(item.status) }}</v-btn
        >
        <v-btn
          v-else
          color="traktor"
          class="white--text"
          @click="viewFeedbacks(item.docId)"
          >View</v-btn
        >
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-icon v-bind="attrs" v-on="on">mdi-dots-vertical</v-icon>
          </template>
          <v-list>
            <v-list-item link :to="`/event/view/${item.docId}`">
              <v-list-item-title> View </v-list-item-title>
            </v-list-item>
            <!-- <v-list-item
              @click="edit(item)"
              v-if="!item.isFeedback && item.status !== 'cancelled'"
            >
              <v-list-item-title> Edit </v-list-item-title>
            </v-list-item> -->
            <v-list-item
              @click="share(item)"
              v-if="!item.isFeedback && item.status !== 'cancelled'"
            >
              <v-list-item-title> Share </v-list-item-title>
            </v-list-item>
            <v-list-item
              @click="cancel(item)"
              v-if="!item.isFeedback && item.status !== 'cancelled'"
            >
              <v-list-item-title> Cancel </v-list-item-title>
            </v-list-item>
            <v-list-item @click="_delete(item.docId)">
              <v-list-item-title> Delete </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-data-table>
    <v-dialog v-model="confirmDialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline"> Are you sure? </v-card-title>
        <v-card-text>Cancel the session</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="confirmDialog = false">
            No
          </v-btn>
          <v-btn color="green darken-1" text @click="cancel()">
            Yes Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <Responses />
    <Feedbacks />
    <share-event />
    <add-event
      :visible="pastEventModal"
      @close="pastEventModal = false"
    ></add-event>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import axios from "axios";
import Responses from "@/components/Modals/Events/Responses";
import Feedbacks from "@/components/Modals/Events/Feedbacks";
import ShareEvent from "@/components/Modals/Events/ShareEvent";

import {
  eventsRef,
  eventRegistrationsRef,
  eventFeedbacksRef,
  activityRef,
} from "../../config/firebase_services";
import AddEvent from "../Modals/Events/AddEvent.vue";

export default {
  name: "AllEvents",
  components: {
    Responses,
    Feedbacks,
    ShareEvent,
    AddEvent,
  },
  computed: {
    headers: function () {
      return [
        {
          text: "Event type",
          value: "type",
          sortable: true,
          align: "left",
        },
        {
          text: "Title",
          value: "title",
          sortable: true,
          align: "left",
        },
        {
          text: "Speaker",
          value: "speakers",
          sortable: true,
          align: "left",
        },
        {
          text: "Date",
          value: "date",
          sortable: true,
          align: "left",
        },
        {
          text: "Time",
          value: "time",
          sortable: true,
          align: "left",
        },
        {
          text: "Responses",
          value: "responses",
          sortable: true,
          align: "left",
        },
        {
          text: "Feedback",
          value: "feedback",
          sortable: true,
          align: "left",
        },
        { text: "Actions", value: "actions", sortable: true, align: "left" },
      ];
    },
  },
  data() {
    return {
      events: [],
      confirmDialog: false,
      id: null,
      items: [],
      feedbacks: null,
      feedbackDialog: false,
      rescheduleModal: false,
      rescheduleData: null,
      filters: {
        mentorname: [],
        startupname: [],
        date: [],
        time: [],
        status: [],
      },
      activeFilters: {},
      pastEventModal: false,
    };
  },
  async created() {
    this.getEvents();
  },
  methods: {
    getSpeakers(speakers) {
      return speakers.map((speaker) => speaker.name);
    },
    async getEvents() {
      eventsRef
        .where(
          "incubatorId",
          "==",
          this.$store.state.incubator.currentIncubator.docId
        )
        .orderBy("createdAt", "desc")
        .onSnapshot((snapshot) => {
          this.events = [];
          snapshot.forEach((document) => {
            const data = document.data();
            data.docId = document.id;
            data.date = new Date(data.date).toDateString();
            data.time = new Date(
              data.date + " " + data.time
            ).toLocaleTimeString("en-in");
            this.events.push(data);
          });
        });
    },

    getStatus(status) {
      return status === "cancelled" ? "Cancelled" : "Initiate";
    },

    async sendMail(item) {
      try {
        const link = `https://traktor.thestartupreneur.co/event/feedback/${item.eventId}`;

        await axios.post("https://traktor-api.herokuapp.com/sendMail", {
          from: {
            name: this.$store.state.incubator.currentIncubator.name,
            email: this.$store.state.incubator.currentIncubator.email,
          },
          to: {
            name: item.name,
            email: item.email,
          },
          subject: "Event Feedback Requested",
          content: `<body class="no-padding" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;"><table class="wrapper" style="border-collapse: collapse;table-layout: fixed;min-width: 320px;width: 100%;background-color: #fff;" cellpadding="0" cellspacing="0" role="presentation"><tbody><tr><td><div><div class="layout one-col fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"><div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #ffffff;"><div class="column" style="text-align: left;color: #8e959c;font-size: 14px;line-height: 21px;font-family: sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);"><div style="Margin-left: 20px;Margin-right: 20px;"><div style="mso-line-height-rule: exactly;line-height: 50px;font-size: 1px;margin-left: 7%;">&nbsp;</div></div></div></div></div><div style="line-height:20px;font-size:20px;">&nbsp;</div><div class="layout one-col fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"><div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #fff;"><div class="column" style="text-align: left;color: #8e959c;font-size: 14px;line-height: 21px;font-family: sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);"><div style="Margin-left: 20px;Margin-right: 20px;"><div style="mso-line-height-rule: exactly;mso-text-raise: 4px;margin-left: 7%;"><h3 class="size-16" style="Margin-top: 0;Margin-bottom: 0;font-style: normal;font-weight: normal;color: #000000;font-size: 16px;line-height: 24px;font-family: arial,sans-serif;" lang="x-size-16"><span class="font-arial">Dear ${item.name},</span></h3><p style="Margin-top: 12px;Margin-bottom: 0;"><span style="color:#000000;font-size: 16px;">Hope you are doing well. This is to request your feedback for the recent event you have participated. </span></p><p style="Margin-top: 20px;Margin-bottom: 0;"><span style="color:#000000;font-size: 16px;">Please find the below link to give your feedback.&nbsp;</span></p></div></div></div></div></div><div style="line-height:20px;font-size:20px;">&nbsp;</div><div class="layout one-col fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"><div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #fff;"><div class="column" style="text-align: left;margin-left:8%;color: #8e959c;font-size: 14px;line-height: 21px;font-family: sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);"><div style="Margin-left: 20px;Margin-right: 20px;"><div style="mso-line-height-rule: exactly;mso-text-raise: 4px;"></div></div><h6 style="Margin-top: 12px;Margin-bottom: 0;font-style: normal;font-weight: normal;color: black;font-size: 16px;line-height: 26px;font-family: Avenir,sans-serif;">Kindly share your feedback by clicking on this <a href="${link}">link </a></h6></div></div></div><div style="line-height:20px;font-size:20px;">&nbsp;</div><div class="layout one-col fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"><div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #ffffff;"><div class="column" style="text-align: left;color: #8e959c;font-size: 14px;margin-left:8%;line-height: 21px;font-family: sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);"></div></div><div style="line-height:20px;font-size:20px;">&nbsp;</div><div role="contentinfo"><div class="layout email-footer" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"><div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;"><div class="column wide" style="text-align: left;font-size: 12px;line-height: 19px;color: #adb3b9;font-family: sans-serif;Float: left;max-width: 400px;min-width: 320px; width: 320px;width: calc(8000% - 47600px);"><div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 10px;Margin-bottom: 10px;"><div style="font-size: 14px;line-height: 19px;margin-left: 7%;"><div>Regards,</div></div><div style="font-size: 14px;line-height: 19px;Margin-top: 18px;margin-left: 7%;"><div>${this.$store.state.incubator.currentIncubator.name}</div></div></div></div></div></div></div></div></td></tr></tbody></table></body>`,
        });
      } catch (error) {
        this.$toast.error(error, {
          position: "top",
        });
      }
    },

    async getParticipants(item) {
      const documents = await eventRegistrationsRef
        .where("eventId", "==", item.docId)
        .get();

      if (documents.size === 0) {
        this.$store.dispatch("SHOW_LOADER", { isShowing: false });
        this.$toast.info("No Regsitrations found to initiate the feedback", {
          position: "top",
        });
        return;
      }

      const responses = [];
      documents.forEach((document) => {
        responses.push(document.data());
      });

      let counter = 0;
      responses.forEach(async (response) => {
        this.sendMail(response);
        counter++;

        if (counter === responses.length) {
          const activity = {
            incubatorId: this.$store.state.incubator.currentIncubator.docId,
            photoURL: this.$store.state.incubator.currentIncubator.photoURL,
            statement: `Feedback for the recent event ${item.title} by ${item.speakers[0].name} have been initiated by ${this.$store.state.incubator.currentIncubator.name}`,
            createdAt: new Date(),
            type: "incubator",
            notification: false,
          };

          await activityRef.add(activity);
          await eventsRef
            .doc(item.docId)
            .set({ isFeedback: true }, { merge: true });
          this.$store.dispatch("SHOW_LOADER", { isShowing: false });
          this.$toast.success("Initiated", {
            position: "top",
          });
        }
      });
    },

    initiateFeedback(item) {
      Swal.fire({
        title: "Are you sure?",
        showCancelButton: true,
        confirmButtonColor: "#3aa959",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.$store.dispatch("SHOW_LOADER", { isShowing: true });
          this.getParticipants(item);
        }
      });
    },

    async viewResponses(eventId) {
      const documents = await eventRegistrationsRef
        .where("eventId", "==", eventId)
        .get();
      const responses = [];
      documents.forEach((document) => {
        const data = document.data();
        const createdAt = data.createdAt;
        // if (createdAt.charAt(createdAt.length - 1) === "Z") {
        //   const temp = createdAt.split("T");
        //   const date = temp[0];
        //   const time = temp[1].split("Z")[0];
        //   const datetime = new Date(date + " " + time);
        //   data.createdAt = datetime.toLocaleString("en-in").split(",");
        // } else {
        data.createdAt = createdAt.toDate().toLocaleString("en-in").split(",");
        // }
        responses.push(data);
      });
      this.$store.dispatch("SHOW_RESPONSE_EVENT", {
        isShowing: true,
        data: responses,
      });
    },

    checkForFeedback(item) {
      const now = parseInt(+new Date());
      const datetime = parseInt(+new Date(item.date + " " + item.time));
      return now < datetime;
    },

    async viewFeedbacks(eventId) {
      const documents = await eventFeedbacksRef
        .where("eventId", "==", eventId)
        .get();

      const feedbacks = [];
      documents.forEach((document) => {
        const data = document.data();
        const createdAt = data.createdAt
          .toDate()
          .toLocaleString("en-in")
          .split(",");
        data.createdAt = createdAt;
        feedbacks.push(data);
      });
      this.$store.dispatch("SHOW_FEEDBACK_EVENT", {
        isShowing: true,
        data: feedbacks,
      });
    },

    async sendCancelMail(item) {
      try {
        await axios.post("https://traktor-api.herokuapp.com/sendMail", {
          from: {
            name: this.$store.state.incubator.currentIncubator.name,
            email: this.$store.state.incubator.currentIncubator.email,
          },
          to: {
            name: item.name,
            email: item.email,
          },
          subject: "Event has been cancelled",
          content: `<body class="no-padding" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;"><table class="wrapper" style="border-collapse: collapse;table-layout: fixed;min-width: 320px;width: 100%;background-color: #fff;" cellpadding="0" cellspacing="0" role="presentation"><tbody><tr><td><div><div class="layout one-col fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"><div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #ffffff;"><div class="column" style="text-align: left;color: #8e959c;font-size: 14px;line-height: 21px;font-family: sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);"><div style="Margin-left: 20px;Margin-right: 20px;"><div style="mso-line-height-rule: exactly;line-height: 50px;font-size: 1px;margin-left: 7%;">&nbsp;</div></div></div></div></div><div style="line-height:20px;font-size:20px;">&nbsp;</div><div class="layout one-col fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"><div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #fff;"><div class="column" style="text-align: left;color: #8e959c;font-size: 14px;line-height: 21px;font-family: sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);"><div style="Margin-left: 20px;Margin-right: 20px;"><div style="mso-line-height-rule: exactly;mso-text-raise: 4px;margin-left: 7%;"><h3 class="size-16" style="Margin-top: 0;Margin-bottom: 0;font-style: normal;font-weight: normal;color: #000000;font-size: 16px;line-height: 24px;font-family: arial,sans-serif;" lang="x-size-16"><span class="font-arial">Dear ${item.name},</span></h3><p style="Margin-top: 12px;Margin-bottom: 0;"><span style="color:#000000;font-size: 16px;">Hope you are doing well. This is to inform you that the following event has been cancelled: </span></p><p style="Margin-top: 20px;Margin-bottom: 0;"></p></div></div></div></div></div><div style="line-height:20px;font-size:20px;">&nbsp;</div><div class="layout one-col fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"><div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #fff;"><div class="column" style="text-align: left;margin-left:8%;color: #8e959c;font-size: 14px;line-height: 21px;font-family: sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);"><div style="Margin-left: 20px;Margin-right: 20px;"><div style="mso-line-height-rule: exactly;mso-text-raise: 4px;"></div></div></div></div></div><div style="line-height:20px;font-size:20px;">&nbsp;</div><div class="layout one-col fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"><div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #ffffff;"><div class="column" style="text-align: left;color: #8e959c;font-size: 14px;margin-left:8%;line-height: 21px;font-family: sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);"></div></div><div style="line-height:20px;font-size:20px;">&nbsp;</div><div role="contentinfo"><div class="layout email-footer" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"><div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;"><div class="column wide" style="text-align: left;font-size: 12px;line-height: 19px;color: #adb3b9;font-family: sans-serif;Float: left;max-width: 400px;min-width: 320px; width: 320px;width: calc(8000% - 47600px);"><div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 10px;Margin-bottom: 10px;"><div style="font-size: 14px;line-height: 19px;margin-left: 7%;"><div>Regards,</div></div><div style="font-size: 14px;line-height: 19px;Margin-top: 18px;margin-left: 7%;"><div>${this.$store.state.incubator.currentIncubator.name}</div></div></div></div></div></div></div></div></td></tr></tbody></table></body>`,
        });
      } catch (error) {
        this.$toast.error(error, {
          position: "top",
        });
      }
    },

    async getParticipantDetails(item) {
      const documents = await eventRegistrationsRef
        .where("eventId", "==", item.docId)
        .get();

      const responses = [];
      documents.forEach((document) => {
        responses.push(document.data());
      });

      let counter = 0;
      responses.forEach(async (response) => {
        this.sendCancelMail(response);
        counter++;

        if (counter === responses.length) {
          const activity = {
            incubatorId: this.$store.state.incubator.currentIncubator.docId,
            photoURL: this.$store.state.incubator.currentIncubator.photoURL,
            statement: `Event ${item.title} has been cancelled by ${this.$store.state.incubator.currentIncubator.name}`,
            createdAt: new Date(),
            type: "incubator",
            notification: false,
          };

          await activityRef.add(activity);
          await eventsRef
            .doc(item.docId)
            .set({ status: "cancelled" }, { merge: true });
          this.$store.dispatch("SHOW_LOADER", { isShowing: false });
          this.$toast.success("Event Cancelled", {
            position: "top",
          });
        }
      });
    },

    share(item) {
      this.$store.dispatch("SHOW_SHARE_EVENT", {
        isShowing: true,
        data: item,
      });
    },

    cancel(item) {
      Swal.fire({
        title: "Are you sure?",
        showCancelButton: true,
        confirmButtonColor: "#3AA95A",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.getParticipantDetails(item);
        }
      });
    },

    _delete(id) {
      Swal.fire({
        title: "Are you sure?",
        showCancelButton: true,
        confirmButtonColor: "#3aa959",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await eventsRef.doc(id).delete();

            this.$toast.success("Deleted", {
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
  },
};
</script>

<style scoped>
.v-btn {
  font-weight: bold;
  text-transform: capitalize;
}

>>> th {
  color: #3aa95a !important;
  font-size: 14px !important;
}

>>> td {
  font-weight: bold;
}
</style>