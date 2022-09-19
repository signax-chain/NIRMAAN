<template>
  <v-container>
    <v-card class="pa-5 mr-auto ml-auto" width="800">
      <v-img
        :src="incubator.photoURL"
        style="width: 250px; margin-left: auto; margin-right: auto"
      ></v-img>
      <h1 class="text-center mt-3">{{ data.type }}</h1>
      <h2 class="text-center mt-3" style="color: #20d855 !important">
        {{ data.title }}
      </h2>
      <v-row>
        <v-col cols="12" md="12" class="text-center pa-3">
          <v-img
            :src="data.speakers[0].photoURL"
            style="
              border-radius: 50%;
              width: 150px;
              height: 150px;
              object-fit: cover;
              margin-left: auto;
              margin-right: auto;
              display: block;
            "
          ></v-img>
          <h2 class="mt-3" style="color: #20d855 !important">
            {{ data.speakers[0].name }}
          </h2>
          <h3 style="color: event">{{ data.speakers[0].designation }}</h3>
          <h3 style="color: event">{{ data.speakers[0].organization }}</h3>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="12">
          <h3 class="text-center">{{ data.description }}</h3>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          cols="12"
          md="12"
          style="border: 1px solid #20d855; border-radius: 20px"
          class="mt-3"
        >
          <h2 class="text-center">{{ data.date }} at {{ data.time }}</h2>
          <div class="d-flex justify-space-around mt-3" v-show="data.isZoom">
            <!-- <h3>
              Zoom ID:
              <span style="color: #20d855 !important">{{ data.zoom.id }}</span>
            </h3>
            <h3>
              Password:
              <span style="color: #20d855 !important">{{
                data.zoom.password
              }}</span>
            </h3> -->
            <h3 class="text-center">
              Meeting Link -
              <a
                :href="data.zoom.link"
                style="color: #20d855 !important"
                target="_blank"
                >Click here</a
              >
            </h3>
          </div>
        </v-col>
      </v-row>
      <v-card-actions class="mt-3">
        <v-spacer></v-spacer>
        <v-btn
          color="traktor"
          @click="eventRegisterModal = true"
          style="color: white"
        >
          Register Now
        </v-btn>
        <v-btn
          color="traktor"
          @click="copyToClipboard"
          style="color: white"
          class="mr-3"
        >
          Share Event
        </v-btn>
        <!-- <v-btn
          color="traktor"
          style="color: white"
          @click="generateReport"
          class="mr-3"
        >
          Download Poster <v-icon>mdi-download</v-icon>
        </v-btn> -->
        <a
          class="addeventatc"
          id="addToCalendar"
          style="
            background-color: #39a959;
            color: white !important;
            font-weight: bold;
            z-index: 0 !important;
            height: 38px !important;
          "
        >
          Add to calendar
          <span class="start">{{ data.date }} {{ data.time }}</span>
          <span class="end">{{ data.date }} {{ data.time }}</span>
          <span class="timezone">Asia/Kolkata</span>
          <span class="title">{{ data.title }}</span>
          <span class="description">{{ data.description }}</span>
        </a>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
    <vue-html2pdf
      :show-layout="false"
      :float-layout="true"
      :enable-download="true"
      :preview-modal="false"
      :paginate-elements-by-height="1400"
      filename="eventPoster"
      :pdf-quality="1"
      :manual-pagination="false"
      pdf-format="a4"
      pdf-orientation="landscape"
      pdf-content-width="800px"
      @progress="onProgress($event)"
      @hasStartedGeneration="hasStartedGeneration()"
      @hasGenerated="hasGenerated($event)"
      ref="html2Pdf"
    >
      <section slot="pdf-content">
        <v-card class="pa-5 mr-auto ml-auto" width="800">
          <v-img
            :src="incubator.photoURL"
            style="width: 250px; margin-left: auto; margin-right: auto"
          ></v-img>
          <h1 class="text-center mt-3">{{ data.type }}</h1>
          <h2 class="text-center mt-3" style="color: #20d855 !important">
            {{ data.title }}
          </h2>
          <v-row>
            <v-col cols="4" md="4" class="text-center pa-3">
              <v-img
                :src="data.speakers.URL"
                style="
                  border-radius: 50%;
                  width: 150px;
                  height: 150px;
                  object-fit: cover;
                  margin-left: auto;
                  margin-right: auto;
                "
              ></v-img>
              <h2 class="mt-3" style="color: #20d855 !important">
                {{ data.speakers[0].name }}
              </h2>
              <h3 style="color: event">{{ data.speakers[0].designation }}</h3>
              <h3 style="color: event">{{ data.speakers[0].organization }}</h3>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="12">
              <h3 class="text-center">{{ data.description }}</h3>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="12"
              md="12"
              style="border: 1px solid #20d855; border-radius: 20px"
              class="mt-3"
            >
              <h2 class="text-center">
                {{ data.date }} at {{ data.time }} HRS
              </h2>
              <!-- <div
                class="d-flex justify-space-around mt-3"
                v-show="data.isZoom"
              >
                <h3>
                  Zoom ID:
                  <span style="color: #20d855 !important">{{
                    data.zoom.id
                  }}</span>
                </h3>
                <h3>
                  Password:
                  <span style="color: #20d855 !important">{{
                    data.zoom.password
                  }}</span>
                </h3>
                <h3 class="text-center">
                  Meeting Link -
                  <a :href="data.zoom.link" style="color: #20d855 !important"
                    >Click here</a
                  >
                </h3>
              </div> -->
            </v-col>
          </v-row>
        </v-card>
      </section>
    </vue-html2pdf>
    <v-row justify="center">
      <v-dialog v-model="eventRegisterModal" max-width="700" persistent>
        <v-card>
          <v-card-title class="headline text-center">
            Event Registration
          </v-card-title>
          <v-card-text>
            <v-form ref="">
              <v-row>
                <v-col cols="6">
                  <v-text-field
                    outlined
                    label="Name"
                    prepend-icon="mdi-text"
                    v-model="participant.name"
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    outlined
                    label="Designation/ Occupation"
                    prepend-icon="mdi-school"
                    v-model="participant.designation"
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    outlined
                    label="Organization/ Company"
                    prepend-icon="mdi-bank"
                    v-model="participant.organization"
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    outlined
                    label="Email Address"
                    prepend-icon="mdi-email"
                    v-model="participant.email"
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    outlined
                    label="Mobile Number"
                    prepend-icon="mdi-phone"
                    v-model="participant.phoneNumber"
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    outlined
                    label="LinkedIn"
                    prepend-icon="mdi-linkedin"
                    v-model="participant.linkedIn"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text color="red" @click="eventRegisterModal = false">
              Close
            </v-btn>
            <v-btn class="white--text" color="traktor " @click="register">
              Register
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>

<script>
import {
  eventsRef,
  incubatorsRef,
  eventRegistrationsRef,
  activityRef,
} from "../../../config/firebase_services";
import copy from "copy-to-clipboard";
import VueHtml2pdf from "vue-html2pdf";

export default {
  name: "Register",
  components: {
    VueHtml2pdf,
  },
  data: () => ({
    data: {},
    incubator: {},
    eventRegisterModal: false,
    participant: {
      name: null,
      designation: null,
      organization: null,
      email: null,
      phoneNumber: null,
      linkedIn: null,
      incubatorId: null,
      eventId: null,
    },
    eventId: null,
  }),
  created() {
    this.getEventDetails();
  },
  methods: {
    async getEventDetails() {
      const document = await eventsRef.doc(this.$route.params.id).get();
      this.data = document.data();

      const datetime = new Date(
        this.data.date + " " + this.data.time,
        "dddd, dd MMMM yyyy hh:mm tt"
      );
      console.log(datetime);
      // this.data.date = datetime.toDateString().slice(0, -4);
      // this.data.time = datetime.toLocaleString("en-in").split(",")[1];

      this.getIncubator();
    },
    async getIncubator() {
      const document = await incubatorsRef.doc(this.data.incubatorId).get();
      this.incubator = document.data();
    },
    async register() {
      if (
        this.participant.name === null ||
        this.participant.designation === null ||
        this.participant.organization === null ||
        this.participant.email === null
      ) {
        this.$toast.error("Some fields are missing!", {
          position: "top",
        });
        return;
      }

      this.participant.incubatorId = this.incubator.docId;
      this.participant.eventId = this.$route.params.id;
      this.participant.createdAt = new Date();

      const activity = {
        incubatorId: this.incubator.docId,
        photoURL: this.incubator.photoURL,
        statement: `${this.participant.name} has registered for the event ${this.data.title}`,
        notification: true,
        read: false,
        createdAt: new Date(),
        type: "incubator",
      };

      try {
        await eventRegistrationsRef.add(this.participant);
        await activityRef.add(activity);
        this.$toast.success("Registration Successful", {
          position: "top",
        });
        this.eventRegisterModal = false;
      } catch (error) {
        this.$toast.error(error, {
          position: "top",
        });
      }
    },
    copyToClipboard() {
      const location = window.location.href.split("/");
      const link =
        location[0] + "//" + location[2] + "/event/register/" + location[5];
      copy(link);
      this.$toast.success("Copied to clipboard", {
        position: "top",
      });
    },
    generateReport() {
      this.$refs.html2Pdf.generatePdf();
    },
  },
};
</script>

<style scoped>
.v-btn {
  text-transform: capitalize;
  font-family: "Open Sans", Roboto, "Helvetica Neue", Helvetica, Optima, Segoe,
    "Segoe UI", Candara, Calibri, Arial, sans-serif;
  font-weight: bold;
}

>>> .v-icon {
  color: #000 !important;
}
</style>