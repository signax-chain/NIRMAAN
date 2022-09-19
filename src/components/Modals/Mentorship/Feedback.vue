<template>
  <v-container>
    <v-dialog v-model="show" persistent max-width="700">
      <v-card>
        <v-card-title class="headline">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                class="ml-auto"
                v-bind="attrs"
                v-on="on"
                @click="show = false"
                ><v-icon>mdi-close</v-icon></v-btn
              >
            </template>
            <span>Close</span>
          </v-tooltip>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="12">
              <h2 class="mb-5 text-center">Startup feedback</h2>
              <h5
                class="mb-2 text-center"
                v-if="feedbacks.feedbacks.startup === null"
              >
                No feedbacks found
              </h5>
              <v-btn
                color="traktor"
                class="white--text ma-auto d-block"
                v-if="feedbacks.feedbacks.startup === null"
                @click="sendReminder('s')"
                >Send reminder</v-btn
              >
              <v-row class="mt-3" v-else>
                <v-col cols="12" md="12">
                  <label
                    >1) Did the mentoring session take place as scheduled
                    (Yes/No) If No, please specify.</label
                  >
                  <h4 class="ml-5">
                    {{ feedbacks.feedbacks.startup.question1 }}
                  </h4>
                  <label
                    >2) Did the mentor arrive on time for the Mentoring
                    Session?</label
                  >
                  <h4 class="ml-5">
                    {{ feedbacks.feedbacks.startup.question2 }}
                  </h4>
                  <label
                    >3) What were your takeaways from the Mentoring
                    Session?</label
                  >
                  <h4 class="ml-5">
                    {{ feedbacks.feedbacks.startup.question3 }}
                  </h4>
                  <label>4) Any feedback for the mentor?.</label>
                  <h4 class="ml-5">
                    {{ feedbacks.feedbacks.startup.question4 }}
                  </h4>
                  <label>5) Any follow up request to the mentor?</label>
                  <h4 class="ml-5">
                    {{ feedbacks.feedbacks.startup.question5 }}
                  </h4>
                  <label>Overall rating</label>
                  <v-rating
                    v-model="feedbacks.feedbacks.startup.rating"
                    color="yellow darken-3"
                    background-color="grey darken-1"
                    empty-icon="$ratingFull"
                    half-increments
                    hover
                    large
                    readonly
                  >
                  </v-rating>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" md="12">
              <v-divider></v-divider>
            </v-col>
            <v-col cols="12" md="12">
              <h2 class="mb-5 text-center">Mentor feedback</h2>
              <h5
                class="mb-2 text-center"
                v-if="feedbacks.feedbacks.mentor === null"
              >
                No feedbacks found
              </h5>
              <v-btn
                color="traktor"
                class="white--text ma-auto d-block"
                v-if="feedbacks.feedbacks.mentor === null"
                @click="sendReminder('m')"
                >Send reminder</v-btn
              >
              <v-row class="mt-3" v-else>
                <v-col cols="12" md="12">
                  <label
                    >1) Did the mentoring session take place as scheduled
                    (Yes/No) If No, please specify.</label
                  >
                  <h4 class="ml-5">
                    {{ feedbacks.feedbacks.mentor.question1 }}
                  </h4>
                  <label
                    >2) Did the startup arrive on time for the Mentoring
                    Session?</label
                  >
                  <h4 class="ml-5">
                    {{ feedbacks.feedbacks.mentor.question2 }}
                  </h4>
                  <label>3) Key highlights from your Mentoring Session?</label>
                  <h4 class="ml-5">
                    {{ feedbacks.feedbacks.mentor.question3 }}
                  </h4>
                  <label>4) Any feedback for the startup?.</label>
                  <h4 class="ml-5">
                    {{ feedbacks.feedbacks.mentor.question4 }}
                  </h4>
                  <label>5) Any follow up actions for the startup?</label>
                  <h4 class="ml-5">
                    {{ feedbacks.feedbacks.mentor.question5 }}
                  </h4>
                  <label>Overall rating</label>
                  <v-rating
                    v-model="feedbacks.feedbacks.mentor.rating"
                    color="yellow darken-3"
                    background-color="grey darken-1"
                    empty-icon="$ratingFull"
                    half-increments
                    hover
                    large
                    readonly
                  >
                  </v-rating>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
        <!-- <v-btn
          class="floating__btn"
          color="traktor"
          fab
          dark
          v-bind="attrs"
          v-on="on"
          v-if="
            feedbacks.feedbacks.startup !== null &&
            feedbacks.feedbacks.mentor !== null
          "
          ><v-icon>mdi-file-export</v-icon></v-btn
        > -->
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import Swal from "sweetalert2";
import axios from "axios";

export default {
  name: "FeedbackModal",
  computed: {
    show: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) {
          this.$emit("close");
        }
      },
    },
  },
  props: ["visible", "feedbacks"],
  methods: {
    sendReminder(type) {
      Swal.fire({
        title: "Are you sure?",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.$store.dispatch("SHOW_LOADER", { isShowing: true });

          if (type === "s") {
            try {
              const link = `https://traktor.thestartupreneur.co/mentorship/feedback/s/${this.feedbacks.docId}`;

              await axios.post("https://traktor-api.herokuapp.com/sendMail", {
                from: {
                  name: this.feedbacks.incubator.name,
                  email: this.feedbacks.incubator.email,
                },
                to: {
                  name: this.feedbacks.startup.name,
                  email: this.feedbacks.startup.email,
                },
                subject: "Mentoring Session Feedback Reminder",
                content: `<body class="no-padding" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;"><table class="wrapper" style="border-collapse: collapse;table-layout: fixed;min-width: 320px;width: 100%;background-color: #fff;" cellpadding="0" cellspacing="0" role="presentation"><tbody><tr><td><div><div class="layout one-col fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"><div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #ffffff;"><div class="column" style="text-align: left;color: #8e959c;font-size: 14px;line-height: 21px;font-family: sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);"><div style="Margin-left: 20px;Margin-right: 20px;"><div style="mso-line-height-rule: exactly;line-height: 50px;font-size: 1px;margin-left: 7%;">&nbsp;</div></div><div style="Margin-left: 20px;Margin-right: 20px;"><div style="mso-line-height-rule: exactly;mso-text-raise: 4px;"><h2 style="Margin-top: 0;Margin-bottom: 0;font-style: normal;font-weight: normal;color: #e31212;font-size: 26px;line-height: 34px;font-family: Avenir,sans-serif;text-align: center;"><span style="color:#000000">Mentoring Session Feedback Reminder</span></h2></div></div></div></div></div><div style="line-height:20px;font-size:20px;">&nbsp;</div><div class="layout one-col fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"><div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #fff;"><div class="column" style="text-align: left;color: #8e959c;font-size: 14px;line-height: 21px;font-family: sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);"><div style="Margin-left: 20px;Margin-right: 20px;"><div style="mso-line-height-rule: exactly;mso-text-raise: 4px;margin-left: 7%;"><h3 class="size-16" style="Margin-top: 0;Margin-bottom: 0;font-style: normal;font-weight: normal;color: #000000;font-size: 16px;line-height: 24px;font-family: arial,sans-serif;" lang="x-size-16"><span class="font-arial">Dear ${this.feedbacks.startup.name},</span></h3><p style="Margin-top: 12px;Margin-bottom: 0;"><span style="color:#000000;font-size: 16px;">This is to remind for your feedback for the following mentoring session: </span></p><p style="Margin-top: 20px;Margin-bottom: 0;"><span style="color:#000000;font-size: 16px;">Below are the details about the recent mentoring session that had happened.&nbsp;</span></p></div></div></div></div></div><div style="line-height:20px;font-size:20px;">&nbsp;</div><div class="layout one-col fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"><div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #fff;"><div class="column" style="text-align: left;margin-left:8%;color: #8e959c;font-size: 14px;line-height: 21px;font-family: sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);"><div style="Margin-left: 20px;Margin-right: 20px;"><div style="mso-line-height-rule: exactly;mso-text-raise: 4px;"><table style="border:1px solid black; border-collapse: collapse;text-align:center;"><tr><td style="border:1px solid black;width:150px;color:black;"><b>Mentor</b></td><td style="border:1px solid black;width:180px;color:black;">${this.feedbacks.mentor.name}</td></tr><tr><td style="border:1px solid black;color:black;"><b>Date</b></td><td style="border:1px solid black;color:black;">${this.feedbacks.date}</td></tr><tr><td style="border:1px solid black;color:black;"><b>Time</b></td><td style="border:1px solid black;color:black;">${this.feedbacks.time}</td></tr><tr><td style="border:1px solid black;color:black;"><b>Message</b></td><td style="border:1px solid black;color:black;">${this.feedbacks.description}</td></tr></table></div></div><h6 style="Margin-top: 12px;Margin-bottom: 0;font-style: normal;font-weight: normal;color: black;font-size: 16px;line-height: 26px;font-family: Avenir,sans-serif;">Kindly share your feedback by clicking on <a href="${link}">this</a> link. </br></br>Please feel free to reach out to us in case of any queries. We thank you for your constant support</h6></div></div></div><div style="line-height:20px;font-size:20px;">&nbsp;</div><div class="layout one-col fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"><div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #ffffff;"><div class="column" style="text-align: left;color: #8e959c;font-size: 14px;margin-left:8%;line-height: 21px;font-family: sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);"></div></div><div style="line-height:20px;font-size:20px;">&nbsp;</div><div role="contentinfo"><div class="layout email-footer" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"><div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;"><div class="column wide" style="text-align: left;font-size: 12px;line-height: 19px;color: #adb3b9;font-family: sans-serif;Float: left;max-width: 400px;min-width: 320px; width: 320px;width: calc(8000% - 47600px);"><div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 10px;Margin-bottom: 10px;"><div style="font-size: 14px;line-height: 19px;margin-left: 7%;"><div>Regards,</div></div><div style="font-size: 14px;line-height: 19px;Margin-top: 18px;margin-left: 7%;"><div>${this.feedbacks.incubator.name}</div></div></div></div></div></div></div></div></td></tr></tbody></table></body>`,
              });

              this.$store.dispatch("SHOW_LOADER", { isShowing: false });

              this.$store.dispatch("SHOW_SNACKBAR", {
                showing: true,
                text: "Reminder sent",
                color: "success",
              });
            } catch (error) {
              this.$store.dispatch("SHOW_SNACKBAR", {
                showing: true,
                text: error,
                color: "error",
              });
            }
          } else {
            try {
              const link = `https://traktor.thestartupreneur.co/mentorship/feedback/m/${this.feedbacks.docId}`;

              await axios.post("https://traktor-api.herokuapp.com/sendMail", {
                from: {
                  name: this.feedbacks.incubator.name,
                  email: this.feedbacks.incubator.email,
                },
                to: {
                  name: this.feedbacks.mentor.name,
                  email: this.feedbacks.mentor.email,
                },
                subject: "Mentoring Session Feedback Requested",
                content: `<body class="no-padding" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;"><table class="wrapper" style="border-collapse: collapse;table-layout: fixed;min-width: 320px;width: 100%;background-color: #fff;" cellpadding="0" cellspacing="0" role="presentation"><tbody><tr><td><div><div class="layout one-col fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"><div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #ffffff;"><div class="column" style="text-align: left;color: #8e959c;font-size: 14px;line-height: 21px;font-family: sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);"><div style="Margin-left: 20px;Margin-right: 20px;"><div style="mso-line-height-rule: exactly;line-height: 50px;font-size: 1px;margin-left: 7%;">&nbsp;</div></div><div style="Margin-left: 20px;Margin-right: 20px;"><div style="mso-line-height-rule: exactly;mso-text-raise: 4px;"><h2 style="Margin-top: 0;Margin-bottom: 0;font-style: normal;font-weight: normal;color: #e31212;font-size: 26px;line-height: 34px;font-family: Avenir,sans-serif;text-align: center;"><span style="color:#000000">Mentoring Session Feedback Reminder</span></h2></div></div></div></div></div><div style="line-height:20px;font-size:20px;">&nbsp;</div><div class="layout one-col fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"><div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #fff;"><div class="column" style="text-align: left;color: #8e959c;font-size: 14px;line-height: 21px;font-family: sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);"><div style="Margin-left: 20px;Margin-right: 20px;"><div style="mso-line-height-rule: exactly;mso-text-raise: 4px;margin-left: 7%;"><h3 class="size-16" style="Margin-top: 0;Margin-bottom: 0;font-style: normal;font-weight: normal;color: #000000;font-size: 16px;line-height: 24px;font-family: arial,sans-serif;" lang="x-size-16"><span class="font-arial">Dear ${this.feedbacks.startup.name},</span></h3><p style="Margin-top: 12px;Margin-bottom: 0;"><span style="color:#000000;font-size: 16px;">This is to remind for your feedback for the following mentoring session: </span></p><p style="Margin-top: 20px;Margin-bottom: 0;"><span style="color:#000000;font-size: 16px;">Below are the details about the recent mentoring session that had happened.&nbsp;</span></p></div></div></div></div></div><div style="line-height:20px;font-size:20px;">&nbsp;</div><div class="layout one-col fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"><div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #fff;"><div class="column" style="text-align: left;margin-left:8%;color: #8e959c;font-size: 14px;line-height: 21px;font-family: sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);"><div style="Margin-left: 20px;Margin-right: 20px;"><div style="mso-line-height-rule: exactly;mso-text-raise: 4px;"><table style="border:1px solid black; border-collapse: collapse;text-align:center;"><tr><td style="border:1px solid black;width:150px;color:black;"><b>Mentor</b></td><td style="border:1px solid black;width:180px;color:black;">${this.feedbacks.mentor.name}</td></tr><tr><td style="border:1px solid black;color:black;"><b>Date</b></td><td style="border:1px solid black;color:black;">${this.feedbacks.date}</td></tr><tr><td style="border:1px solid black;color:black;"><b>Time</b></td><td style="border:1px solid black;color:black;">${this.feedbacks.time}</td></tr><tr><td style="border:1px solid black;color:black;"><b>Message</b></td><td style="border:1px solid black;color:black;">${this.feedbacks.description}</td></tr></table></div></div><h6 style="Margin-top: 12px;Margin-bottom: 0;font-style: normal;font-weight: normal;color: black;font-size: 16px;line-height: 26px;font-family: Avenir,sans-serif;">Kindly share your feedback by clicking on <a href="${link}">this</a> link. </br></br>Please feel free to reach out to us in case of any queries. We thank you for your constant support</h6></div></div></div><div style="line-height:20px;font-size:20px;">&nbsp;</div><div class="layout one-col fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"><div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #ffffff;"><div class="column" style="text-align: left;color: #8e959c;font-size: 14px;margin-left:8%;line-height: 21px;font-family: sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);"></div></div><div style="line-height:20px;font-size:20px;">&nbsp;</div><div role="contentinfo"><div class="layout email-footer" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"><div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;"><div class="column wide" style="text-align: left;font-size: 12px;line-height: 19px;color: #adb3b9;font-family: sans-serif;Float: left;max-width: 400px;min-width: 320px; width: 320px;width: calc(8000% - 47600px);"><div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 10px;Margin-bottom: 10px;"><div style="font-size: 14px;line-height: 19px;margin-left: 7%;"><div>Regards,</div></div><div style="font-size: 14px;line-height: 19px;Margin-top: 18px;margin-left: 7%;"><div>${this.feedbacks.incubator.name}</div></div></div></div></div></div></div></div></td></tr></tbody></table></body>`,
              });
              this.$store.dispatch("SHOW_LOADER", { isShowing: false });

              this.$store.dispatch("SHOW_SNACKBAR", {
                showing: true,
                text: "Reminder sent",
                color: "success",
              });
            } catch (error) {
              this.$store.dispatch("SHOW_SNACKBAR", {
                showing: true,
                text: error,
                color: "error",
              });
            }
          }
        }
      });
    },
  },
};
</script>

<style scoped>
h4 {
  margin-bottom: 5px;
}

.floating__btn {
  bottom: 0;
  position: absolute;
  margin: 1em;
  right: 0;
  z-index: 998;
}
</style>