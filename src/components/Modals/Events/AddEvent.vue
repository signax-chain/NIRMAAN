<template>
  <v-dialog v-model="show" width="700">
    <v-card>
        <v-card-title class="heading">Add Past Event</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-autocomplete
              label="Event type"
              outlined
              :items="eventTypes"
              v-model="event.type"
              @change="handleEventType"
            >
            </v-autocomplete>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              outlined
              label="Event title"
              v-model="event.title"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="12">
            <v-textarea
              label="Event description"
              outlined
              v-model="event.description"
            >
            </v-textarea>
          </v-col>
          <v-col cols="12" md="12">
            <v-autocomplete
              label="Select speaker"
              outlined
              :items="speakers"
              item-text="name"
              item-value="docId"
              v-model="event.speakers"
              @change="handleSpeaker"
              multiple
            >
            </v-autocomplete>
          </v-col>
          <v-col cols="12" md="6">
            <v-dialog
              ref="dialog1"
              v-model="modal"
              :return-value.sync="date"
              persistent
              width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="date"
                  label="Event date"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  outlined
                ></v-text-field>
              </template>
              <v-date-picker v-model="date" scrollable>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="modal = false"
                  >Cancel</v-btn
                >
                <v-btn text color="primary" @click="$refs.dialog1.save(date)"
                  >OK</v-btn
                >
              </v-date-picker>
            </v-dialog>
          </v-col>
          <v-col cols="12" md="6">
            <v-dialog
              ref="dialog2"
              v-model="modal2"
              :return-value.sync="time"
              persistent
              width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="time"
                  label="Event time"
                  prepend-icon="mdi-clock"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  outlined
                ></v-text-field>
              </template>
              <v-time-picker v-if="modal2" v-model="time" full-width>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="modal2 = false"
                  >Cancel</v-btn
                >
                <v-btn text color="primary" @click="handleTime()">OK</v-btn>
              </v-time-picker>
            </v-dialog>
          </v-col>

          <v-col cols="12" md="6">
            <v-checkbox
              class="mx-2"
              label="Include meeting link"
              v-model="isZoom"
              @click="confirmGenZoom()"
            ></v-checkbox>
          </v-col>
        </v-row>
        <v-row v-show="isZoom">
          <!-- <v-col cols="4">
        <v-text-field
          label="Meeting ID"
          outlined
          prepend-icon="mdi-text"
          v-model="event.zoom.id"
          :disabled="mid"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
          label="Meeting password"
          outlined
          prepend-icon="mdi-lock"
          v-model="event.zoom.password"
          :disabled="mpwd"
        ></v-text-field>
      </v-col> -->
          <v-col cols="12" md="6">
            <v-text-field
              label="Meeting link"
              outlined
              prepend-icon="mdi-link"
              v-model="event.zoom.link"
              :disabled="mlink"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="1" v-if="isLinkLoaded">
            <v-progress-circular
              :width="3"
              color="traktor"
              indeterminate
            ></v-progress-circular>
          </v-col>
        </v-row>
        <v-row class="mb-5">
          <v-col cols="12" md="12">
            <div class="d-block mx-auto text-center">
              <v-btn
                color="traktor"
                class="white--text mr-2"
                @click="createEvent()"
                >Add event</v-btn
              >
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-dialog v-model="addNewDialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">
          Add new
          <v-btn color="red" text @click="cancel()"> Cancel </v-btn>
          <v-btn color="traktor" class="white--text" @click="add()">
            Add
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-text-field
            outlined
            label="Add new"
            v-model="addNewValue"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <Speaker />
  </v-dialog>
</template>

<script>
import {
  startupsRef,
  mentorsRef,
  activityRef,
  eventsRef,
  speakersRef,
} from "../../../config/firebase_services";
import axios from "axios";
import Speaker from "@/components/Modals/Events/Speaker";
import Swal from "sweetalert2";
import { meeting } from "../../../services/Meeting";

export default {
  name: "AddEvent",
  props: ["visible"],
  computed: {
    show: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) {
          return this.$emit("close");
        }
      },
    },
  },
  components: {
    Speaker,
  },
  data() {
    return {
      eventTypes: [
        "Webinar",
        "Conference",
        "Seminar",
        "Workshop",
        "Masterclass",
        "Add new +",
      ],
      event: {
        type: null,
        title: null,
        description: null,
        date: null,
        time: null,
        speakers: [],
        zoom: {
          id: null,
          password: null,
          link: null,
        },
        status: null,
        incubatorId: null,
        createdAt: null,
        isFeedback: false,
      },
      addNewDialog: false,
      addNewValue: null,
      speakers: ["Add new +"],
      previewDialog: false,
      date: new Date().toISOString().substr(0, 10),
      time: null,
      modal: false,
      modal2: false,
      isZoom: false,
      mid: false,
      mpwd: false,
      mlink: false,
      endTime: null,
      isLinkLoaded: false,
      crumbs: [
        {
          text: "Dashboard",
          disabled: true,
        },
        {
          text: "Events",
          disabled: true,
        },
        {
          text: "Create",
          disabled: true,
        },
      ],
    };
  },
  async created() {
    this.getStartups();
    this.getMentors();
    this.getSpeakers();
  },
  methods: {
    handleTime() {
      this.$refs.dialog2.save(this.time);
      let splitTime = this.time.split(":");
      this.endTime = +splitTime[0] + 1 + ":" + splitTime[1];
    },
    handleEventType(type) {
      if (type === "Add new +") this.addNewDialog = true;
    },
    add() {
      if (this.addNewValue === null || this.addNewValue === "") {
        this.$toast.error("Type cannot be empty", {
          position: "top",
        });
        return;
      }

      const obj = this.eventTypes.find(
        (type) =>
          type.toLowerCase() ===
          this.addNewValue.split(" ").join("").toLowerCase()
      );

      if (obj !== undefined) {
        this.$toast.warning("Type already exists", {
          position: "top",
        });
        return;
      }

      this.eventTypes.splice(this.eventTypes.length - 1, 0, this.addNewValue);
      this.eventTypes.join();
      this.event.type = this.addNewValue;
      this.addNewDialog = false;
      this.addNewValue = null;
    },

    cancel() {
      this.addNewDialog = false;
      this.event.type = this.eventTypes[0];
    },

    handleSpeaker(select) {
      if (select[select.length - 1] === "Add new +") {
        this.$store.dispatch("SHOW_NEW_SPEAKER", {
          isShowing: true,
          data: "",
        });
        const index = this.event.speakers.indexOf("Add new +");
        if (index !== -1) this.event.speakers.splice(index, 1);
        return;
      }
      // const obj = this.speakers.find(
      //   (speaker) => speaker.docId === select[select.length - 1]
      // );
      // this.event.speakers.push(obj);
      // this.event.speakers.splice(this.event.speakers.length - 2, 1);
    },

    async generateMeetingLink() {
      const data = await meeting.validate();
      localStorage.setItem("sc-auth-token", data.data["sc-auth-token"]);
      const meetingInfo = await meeting.create({
        title: this.event.title,
        description: this.event.description,
        startDate: new Date(this.date + " " + this.time).toISOString(),
        endDate: new Date(this.date + " " + this.endTime).toISOString(),
      });
      this.event.zoom.id = meetingInfo.meetingId;
      this.event.zoom.password = meetingInfo.password;
      this.event.zoom.link = meetingInfo.meetingLink;

      this.mid = true;
      this.mpwd = true;
      this.mlink = true;

      this.isLinkLoaded = false;
    },

    confirmGenZoom() {
      if (!this.isZoom) {
        this.isZoom = false;
        return;
      }
      Swal.fire({
        title: "Generate Startupreneur Meet Link?",
        showCancelButton: true,
        confirmButtonColor: "#3aa959",
        cancelButtonColor: "#d33",
        confirmButtonText: "Generate",
      }).then(async (result) => {
        if (result.isConfirmed) {
          // this.includeZoom();
          this.isLinkLoaded = true;
          this.generateMeetingLink();
        }
      });
    },

    includeZoom() {
      if (this.event.zoom.id === null) {
        axios({
          method: "get",
          url: "https://vue-connect-api.herokuapp.com/meeting/new",
          data: {
            topic: this.event.description,
            startTime: this.date + "T" + this.time + ":00Z",
          },
        })
          .then((response) => {
            this.event.zoom.id = "978632105";
            this.event.zoom.password = "hwcbjs51";
            this.event.zoom.link = "https://tiny-meet.web.app/" + response.data;

            this.mid = true;
            this.mpwd = true;
            this.mlink = true;
          })
          .catch((error) => {
            this.$store.dispatch("SHOW_SNACKBAR", {
              showing: true,
              text: error,
              color: "error",
            });
          });
      }
    },

    preview() {
      const speakers = [];
      this.event.speakers.forEach((speakerId) => {
        const obj = this.speakers.find(
          (speaker) => speaker.docId === speakerId
        );
        speakers.push(obj);
      });
      this.event.speakers = speakers;
      this.previewDialog = true;
    },

    async getStartups() {
      const documents = await startupsRef
        .where(
          "incubatorId",
          "==",
          this.$store.state.incubator.currentIncubator.docId
        )
        .where("status", "!=", "droppedout")
        .where("isDeleted", "==", false)
        .get();

      documents.forEach((document) => {
        this.speakers.push(document.data());
      });
    },
    async getMentors() {
      const documents = await mentorsRef
        .where(
          "incubatorId",
          "==",
          this.$store.state.incubator.currentIncubator.docId
        )
        .where("isDeleted", "==", false)
        .get();

      documents.forEach((document) => {
        this.speakers.push(document.data());
      });
    },

    getSpeakers() {
      speakersRef
        .where(
          "incubatorId",
          "==",
          this.$store.state.incubator.currentIncubator.docId
        )
        .onSnapshot((snapshot) => {
          snapshot.forEach((document) => {
            const data = document.data();
            data.docId = document.id;
            this.speakers.push(data);
          });
        });
    },
    async createEvent() {
      if (
        this.event.type === null ||
        this.event.title === null ||
        this.event.description === null ||
        this.data === null ||
        this.time === null ||
        this.event.speaker === ""
      ) {
        this.$toast.error("Looks like some fields are missing", {
          position: "top",
        });
        return;
      }

      if (this.event.speakers.length === 0) {
        const speaker = {
          name: this.$store.state.incubator.currentIncubator.name,
          photoURL: this.$store.state.incubator.currentIncubator.photoURL,
        };
        this.event.speakers.push(speaker);
      }

      this.event.date = this.date;
      this.event.time = this.time;
      this.event.createdAt = new Date();
      this.event.incubatorId =
        this.$store.state.incubator.currentIncubator.docId;
      this.event.status = "active";

      const activity = {
        incubatorId: this.$store.state.incubator.currentIncubator.docId,
        photoURL: this.$store.state.incubator.currentIncubator.photoURL,
        statement: `New Event ${this.event.title} created by ${this.$store.state.incubator.currentIncubator.name}`,
        createdAt: new Date(),
        type: "incubator",
        notification: false,
      };

      try {
        const eventRef = await eventsRef.add(this.event);
        this.event.docId = eventRef.id;
        await activityRef.add(activity);

        this.$toast.success("Created", {
          position: "top",
        });

        this.$store.dispatch("SHOW_SHARE_EVENT", {
          isShowing: true,
          data: this.event,
        });
      } catch (error) {
        this.$toast.error(error, {
          position: "top",
        });
      }
    },
  },
};
</script>

<style scoped>
</style>