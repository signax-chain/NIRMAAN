<template>
  <v-container id="poster">
    <v-card class="pa-5 mr-auto ml-auto" width="800">
      <v-img
        :src="currentIncubator.photoURL"
        style="width: 250px; margin-left: auto; margin-right: auto"
      ></v-img>
      <h1 class="text-center mt-3">{{ data.type }}</h1>
      <h2 class="text-center mt-3" style="color: #20d855 !important">
        {{ data.title }}
      </h2>
      <v-row>
        <v-col
          cols="4"
          md="4"
          class="text-center pa-3"
          style="margin-left: auto; margin-right: auto"
          v-for="(speaker, index) in data.speakers"
          :key="index"
        >
          <v-img
            :src="speaker.photoURL"
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
            {{ speaker.name }}
          </h2>
          <h3 style="color: event">{{ speaker.designation }}</h3>
          <h3 style="color: event">{{ speaker.organization }}</h3>
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
        <!-- <v-btn
          color="traktor"
          @click="eventRegisterModal = true"
          style="color: white"
        >
          Register Now
          <v-icon>mdi-login</v-icon>
        </v-btn> -->
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
        <!-- <a
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
        </a> -->
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
      pdf-orientation="portrait"
      pdf-content-width="800px"
      @progress="onProgress($event)"
      @hasStartedGeneration="hasStartedGeneration()"
      @hasGenerated="hasGenerated($event)"
      ref="html2Pdf"
    >
      <section slot="pdf-content">
        <v-card class="pa-5 mr-auto ml-auto" width="800">
          <v-img
            :src="currentIncubator.photoURL"
            style="width: 250px; margin-left: auto; margin-right: auto"
          ></v-img>
          <h1 class="text-center mt-3">{{ data.type }}</h1>
          <h2 class="text-center mt-3" style="color: #20d855 !important">
            {{ data.title }}
          </h2>
          <v-row>
            <v-col
              cols="4"
              md="4"
              class="text-center pa-3"
              style="margin-left: auto; margin-right: auto"
              v-for="(speaker, index) in data.speakers"
              :key="index"
            >
              <v-img
                :src="speaker.photoURL"
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
                {{ speaker.name }}
              </h2>
              <h3 style="color: event">{{ speaker.designation }}</h3>
              <h3 style="color: event">{{ speaker.organization }}</h3>
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
              <div
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
              </div>
            </v-col>
          </v-row>
        </v-card>
      </section>
    </vue-html2pdf>
  </v-container>
</template>

<script>
import { eventsRef } from "../../config/firebase_services";
import copy from "copy-to-clipboard";
import VueHtml2pdf from "vue-html2pdf";
import { mapState } from "vuex";
import * as htmlToImage from "html-to-image";
// import { toPng, toJpeg, toBlob, toPixelData, toSvg } from "html-to-image";

export default {
  name: "ViewEvent",
  computed: {
    ...mapState({
      currentIncubator: (state) => state.incubator.currentIncubator,
    }),
  },
  components: {
    VueHtml2pdf,
  },
  data: () => ({
    data: {},
  }),
  created() {
    this.getEventDetails();
  },
  methods: {
    async getEventDetails() {
      const document = await eventsRef.doc(this.$route.params.id).get();
      this.data = document.data();
      const datetime = new Date(this.data.date + " " + this.data.time);
      this.data.date = datetime.toDateString().slice(0, -4);
      this.data.time = datetime.toLocaleString("en-in").split(",")[1];
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

      const node = document.getElementById("poster");

      htmlToImage
        .toPng(node)
        .then(function (dataUrl) {
          const img = new Image();
          img.src = dataUrl;
          document.body.appendChild(img);
        })
        .catch(function (error) {
          console.error("oops, something went wrong!", error);
        });
    },
  },
};
</script>

<style scoped>
>>> .v-btn {
  text-transform: capitalize;
}
</style>
