<template>
  <div>
    <v-breadcrumbs :items="crumbs"></v-breadcrumbs>
    <h3 class="heading d-flex align-center">
      Mentorship
      <v-btn
        color="traktor"
        dark
        class="d-block ml-auto"
        @click="goto('/mentorship')"
        >View All sessions</v-btn
      >
    </h3>
    <v-form ref="form" @submit.prevent="schedule()" class="wrapper mx-5">
      <h3 class="heading ml-0">Schedule Session</h3>
      <v-row>
        <v-col cols="12" md="6">
          <v-autocomplete
            label="Select startup"
            outlined
            :items="items1"
            v-model="selectedStartup"
            :rules="rules.startup"
          >
          </v-autocomplete>
        </v-col>
        <v-col cols="12" md="6">
          <v-autocomplete
            label="Select mentor"
            outlined
            :items="items2"
            v-model="selectedMentor"
            :rules="rules.mentor"
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
                label="Select date"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
                outlined
                :rules="rules.date"
              ></v-text-field>
            </template>
            <v-date-picker v-model="date" scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="modal = false">Cancel</v-btn>
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
                label="Select time"
                prepend-icon="mdi-clock"
                readonly
                v-bind="attrs"
                v-on="on"
                outlined
                :rules="rules.time"
              ></v-text-field>
            </template>
            <v-time-picker v-if="modal2" v-model="time" full-width>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="modal2 = false">Cancel</v-btn>
              <v-btn text color="primary" @click="handleTime()">OK</v-btn>
            </v-time-picker>
          </v-dialog>
        </v-col>
        <v-col cols="12" md="6">
          <v-file-input
            outlined
            label="Upload document (if any)"
            v-model="data.document"
          >
          </v-file-input>
        </v-col>
        <v-col cols="12" md="6">
          <v-textarea label="Other details" outlined v-model="data.description">
          </v-textarea>
        </v-col>
        <v-col cols="12" md="4">
          <v-checkbox
            class="mx-2"
            label="Include meeting link"
            v-model="isZoom"
          ></v-checkbox>
          <!-- @change="confirmGenZoom()" -->
        </v-col>
      </v-row>
      <v-row v-show="isZoom">
        <v-col cols="12" md="6">
          <v-text-field
            label="Meeting link"
            outlined
            prepend-icon="mdi-link"
            v-model="data.zoom.link"
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
      <v-row class="mt-5">
        <v-col cols="12" md="12">
          <v-btn
            color="traktor"
            class="white--text ml-auto d-block"
            type="submit"
            >Schedule session</v-btn
          >
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";

import {
  activityRef,
  mentorshipRef,
  mentorsRef,
  startupsRef,
} from "../../config/firebase_services";
import { uploadFile } from "../../_helpers/FileUpload";

import { meeting } from "../../services/Meeting";

export default {
  name: "ScheduleSession",
  data() {
    return {
      confirmDialog: false,
      date: new Date().toISOString().substr(0, 10),
      time: null,
      modal: false,
      modal2: false,
      startups: [],
      mentors: [],
      items1: [],
      items2: [],
      selectedStartup: null,
      selectedMentor: null,
      isZoom: false,
      genZoom: false,
      myZoom: false,
      mid: false,
      mpwd: false,
      mlink: false,
      data: {
        docId: null,
        startup: null,
        mentor: null,
        date: null,
        time: null,
        datetime: null,
        document: null,
        description: "",
        incubator: null,
        status: null,
        zoom: {
          id: null,
          password: null,
          link: null,
        },
        isFeedback: false,
        feedbacks: {
          mentor: null,
          startup: null,
        },
        createdAt: null,
      },
      endTime: "",
      rules: {
        startup: [(v) => !!v || "Startup is required"],
        mentor: [(v) => !!v || "Mentor is required"],
        date: [(v) => !!v || "Date is required"],
        time: [(v) => !!v || "Time is required"],
      },
      isLinkLoaded: false,
      crumbs: [
        {
          text: "Dashboard",
          disabled: true,
        },
        {
          text: "Mentorship",
          disabled: true,
        },
        {
          text: "Schedule Session",
          disabled: true,
        },
      ],
    };
  },
  mounted() {
    if (this.$route.params.item !== undefined) {
      this.selectedStartup = this.$route.params.item.startup;
      this.selectedMentor = this.$route.params.item.mentor;
    }
  },
  async created() {
    const startupDocs = await startupsRef
      .where(
        "incubatorId",
        "==",
        this.$store.state.incubator.currentIncubator.docId
      )
      .where("isDeleted", "==", false)
      .where("status", "!=", "droppedout")
      .get();
    startupDocs.forEach((document) => {
      this.startups.push(document.data());
      this.items1.push(document.data()["name"]);
    });

    const mentorDocs = await mentorsRef
      .where(
        "incubatorId",
        "==",
        this.$store.state.incubator.currentIncubator.docId
      )
      .where("isDeleted", "==", false)
      .get();
    mentorDocs.forEach((document) => {
      this.mentors.push(document.data());
      this.items2.push(document.data()["name"]);
    });
  },
  methods: {
    async generateMeetingLink() {
      const data = await meeting.validate();
      localStorage.setItem("sc-auth-token", data.data["sc-auth-token"]);

      const meetingInfo = await meeting.create({
        title: "Mentoring Session",
        description: this.data.description,
        startDate: new Date(this.date + " " + this.time).toISOString(),
        endDate: new Date(this.date + " " + this.endTime).toISOString(),
      });
      this.data.zoom.id = meetingInfo.meetingId;
      this.data.zoom.password = meetingInfo.password;
      this.data.zoom.link = meetingInfo.meetingLink;

      this.mid = true;
      this.mpwd = true;

      this.isLinkLoaded = false;
    },

    async schedule() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch("SHOW_LOADER", { isShowing: true });

        const startupObj = this.startups.find(
          (startup) => startup.name === this.selectedStartup
        );
        const mentorObj = this.mentors.find(
          (mentor) => mentor.name === this.selectedMentor
        );

        this.data.startup = startupObj;
        this.data.mentor = mentorObj;
        this.data.incubator = this.$store.state.user.currentUser;
        this.data.date = this.date;
        this.data.time = this.time;
        this.data.datetime = new Date(this.date + " " + this.time);
        this.data.createdAt = new Date();

        this.data.status = "Scheduled";

        if (
          typeof this.data.document === "object" &&
          this.data.document !== null
        ) {
          this.data.document = await uploadFile(
            "Documents",
            this.data.document
          );
        }

        try {
          const dataRef = await mentorshipRef.add(this.data);
          await mentorshipRef
            .doc(dataRef.id)
            .set({ docId: dataRef.id }, { merge: true });

          let link = `https://calendar.google.com/calendar/u/0/r/eventedit?dates=${this.date
            .split("-")
            .join("")}T${
            this.time.split(":")[0] + this.time.split(":")[1] * 100
          }/${this.date.split("-").join("")}T${
            this.endTime.split(":")[0] + this.endTime.split(":")[1] * 100
          }Z&&text=Mentoring session with ${this.data.mentor.name}&&details=${
            this.data.description
          }`;

          await axios.post("https://traktor-api.herokuapp.com/sendMail", {
            from: {
              name: this.data.incubator.name,
              email: this.data.incubator.email,
            },
            to: {
              name: this.data.startup.name,
              email: this.data.startup.email,
            },
            subject: "Mentoring Session Request",
            content: `<!doctype html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><title></title> <!--[if !mso]><!-- --><meta http-equiv="X-UA-Compatible" content="IE=edge"> <!--<![endif]--><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style type="text/css">#outlook a{padding:0}.ReadMsgBody{width:100%}.ExternalClass{width:100%}.ExternalClass *{line-height:100%}body{margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}table,td{border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt}img{border:0;height:auto;line-height:100%;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic}p{display:block;margin:13px 0}</style><!--[if !mso]><!--><style type="text/css">@media only screen and (max-width:480px){@-ms-viewport{width:320px}@viewport{width:320px}}</style><!--<![endif]--> <!--[if mso]> <xml> <o:OfficeDocumentSettings> <o:AllowPNG/> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml> <![endif]--> <!--[if lte mso 11]><style type="text/css">.outlook-group-fix{width:100% !important}</style><![endif]--><!--[if !mso]><!--><link href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700" rel="stylesheet" type="text/css"><link href="https://fonts.googleapis.com/css?family=Cabin:400,700" rel="stylesheet" type="text/css"><style type="text/css">@import url(https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700);@import url(https://fonts.googleapis.com/css?family=Cabin:400,700);</style><!--<![endif]--><style type="text/css">@media only screen and (min-width:480px){.mj-column-per-100{width:100% !important;max-width:100%}.mj-column-per-50{width:50% !important;max-width:50%}}</style><style type="text/css">@media only screen and (max-width:480px){table.full-width-mobile{width:100% !important}td.full-width-mobile{width:auto !important}}</style><style type="text/css">.hide_on_mobile{display:none !important}@media only screen and (min-width: 480px){.hide_on_mobile{display:block !important}}.hide_section_on_mobile{display:none !important}@media only screen and (min-width: 480px){.hide_section_on_mobile{display:table !important}}.hide_on_desktop{display:block !important}@media only screen and (min-width: 480px){.hide_on_desktop{display:none !important}}.hide_section_on_desktop{display:table !important}@media only screen and (min-width: 480px){.hide_section_on_desktop{display:none !important}}[owa] .mj-column-per-100{width:100% !important}[owa] .mj-column-per-50{width:50% !important}[owa] .mj-column-per-33{width:33.333333333333336% !important}p,h1,h2,h3{margin:0px}@media only print and (min-width:480px){.mj-column-per-100{width:100% !important}.mj-column-per-40{width:40% !important}.mj-column-per-60{width:60% !important}.mj-column-per-50{width:50% !important}mj-column-per-33{width:33.333333333333336% !important}}</style></head><body style="background-color:#FFFFFF;"><div style="background-color:#FFFFFF;"><!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"> <![endif]--><div style="Margin:0px auto;max-width:600px;"><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:9px 0px 9px 0px;text-align:center;vertical-align:top;"> <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" > <![endif]--><div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"><tr><td align="left" style="font-size:0px;padding:15px 15px 15px 15px;word-break:break-word;"><div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:11px;line-height:1.5;text-align:left;color:#000000;"><img src="${this.data.incubator.photoURL}" width="200" style="display: block; margin: 0 auto; margin-bottom: 10px" /><p style="text-align: center;"><span style="font-size: 18px;"><strong>Mentoring Session Request</strong></span></p></div></td></tr><tr><td style="font-size:0px;padding:10px undefined;padding-top:10px;padding-right:10px;word-break:break-word;"><p style="border-top:solid 1px #000000;font-size:1;margin:0px auto;width:100%;"></p><!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 1px #000000;font-size:1;margin:0px auto;width:NaNpx;" role="presentation" width="NaNpx" ><tr><td style="height:0;line-height:0;"> &nbsp;</td></tr></table> <![endif]--></td></tr></table></div><!--[if mso | IE]></td></tr></table> <![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"> <![endif]--><div style="Margin:0px auto;max-width:600px;"><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:9px 0px 9px 0px;text-align:center;vertical-align:top;"> <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" > <![endif]--><div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"><tr><td align="left" style="font-size:0px;padding:15px 15px 15px 15px;word-break:break-word;"><div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:11px;line-height:1.5;text-align:left;color:#000000;"><p><span style="font-size: 14px;">Dear <strong>${this.data.startup.name},</strong></span></p></div></td></tr><tr><td align="left" style="font-size:0px;padding:15px 15px 15px 15px;word-break:break-word;"><div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:11px;line-height:1.5;text-align:left;color:#000000;"><p><span style="font-size: 12px;">Hope you are doing well. This is a confirmation email on your mentoring session scheduled as per your availability.</span></p></div></td></tr><table style="border-collapse: collapse; width: 100%; margin: 0 10px;"><tr><th style="border: 1px solid #dddddd; text-align: left; padding: 8px;"> Mentor</th><td style="border: 1px solid #dddddd; text-align: left; padding: 8px;"> ${this.data.mentor.name}</td></tr><tr><th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Date</th><td style="border: 1px solid #dddddd; text-align: left; padding: 8px;"> ${this.data.date}</td></tr><tr><th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Time</th><td style="border: 1px solid #dddddd; text-align: left; padding: 8px;"> ${this.data.time}</td></tr><tr><th style="border: 1px solid #dddddd; text-align: left; padding: 8px;"> Description</th><td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Test ${this.data.description}</td></tr></table><tr><td align="left" style="font-size:0px;padding:15px 15px 15px 15px;word-break:break-word;"><div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:11px;line-height:1.5;text-align:left;color:#000000;"><p><span style="font-size: 12px;">Request you to let us know in case you wish to reschedule the same or suggest an alternative day and time that works for you.</span></p></div></td></tr><tr><td align="center" vertical-align="middle" style="font-size:0px;padding:20px 20px 20px 20px;word-break:break-word;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;"><tr><td align="center" bgcolor="#3aa959" role="presentation" style="border:0px solid #000;border-radius:24px;cursor:auto;mso-padding-alt:9px 26px 9px 26px;background:#3aa959;" valign="middle"> <a href="${link}" style="display:inline-block;background:#3aa959;color:#ffffff;font-family:Ubuntu, Helvetica, Arial, sans-serif, Helvetica, Arial, sans-serif;font-size:13px;font-weight:normal;line-height:100%;Margin:0;text-decoration:none;text-transform:none;padding:9px 26px 9px 26px;mso-padding-alt:0px;border-radius:24px;" target="_blank"> Add Event to calendar </a></td></tr></table></td></tr><tr><td align="left" style="font-size:0px;padding:15px 15px 15px 15px;word-break:break-word;"><div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:11px;line-height:1.5;text-align:left;color:#000000;"><p><span style="font-size: 12px;">Please feel free to reach out to us in case of any queries. We thank you for your constant support.</span></p></div></td></tr><tr><td align="left" style="font-size:0px;padding:15px 15px 15px 15px;word-break:break-word;"><div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:11px;line-height:1.5;text-align:left;color:#000000;"><p><span style="font-size: 12px; color: #7e8c8d;">Regards,</span></p><p><span style="color: #000000;"><strong><span style="font-size: 12px;">${this.data.incubator.name}</span></strong></span></p></div></td></tr><tr><td style="font-size:0px;padding:10px undefined;padding-top:10px;padding-right:10px;word-break:break-word;"><p style="border-top:solid 1px #000000;font-size:1;margin:0px auto;width:100%;"></p><!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 1px #000000;font-size:1;margin:0px auto;width:NaNpx;" role="presentation" width="NaNpx" ><tr><td style="height:0;line-height:0;"> &nbsp;</td></tr></table> <![endif]--></td></tr></table></div><!--[if mso | IE]></td></tr></table> <![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"> <![endif]--><div style="Margin:0px auto;max-width:600px;"><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:9px 0px 9px 0px;text-align:center;vertical-align:top;"> <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" > <![endif]--><div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"><tr><td align="left" style="font-size:0px;padding:15px 15px 15px 15px;word-break:break-word;"><div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:11px;line-height:1.5;text-align:left;color:#000000;"><p style="text-align: center;">Powered By</p></div></td></tr><tr><td align="center" style="font-size:0px;padding:0px 0px 0px 0px;word-break:break-word;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;"><tbody><tr><td style="width:270px;"><img height="auto" src="https://s3-eu-west-1.amazonaws.com/topolio/uploads/606d856563a94/1617791341.jpg" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="270"></td></tr></tbody></table></td></tr></table></div></td></tr></tbody></table></div></div></body></html>`,
          });

          link = `https://calendar.google.com/calendar/u/0/r/eventedit?dates=${this.date
            .split("-")
            .join("")}T${
            this.time.split(":")[0] + this.time.split(":")[1] * 100
          }/${this.date.split("-").join("")}T${
            this.endTime.split(":")[0] + this.endTime.split(":")[1] * 100
          }Z&&text=Mentoring session with ${this.data.startup.name}&&details=${
            this.data.description
          }`;

          await axios.post("https://traktor-api.herokuapp.com/sendMail", {
            from: {
              name: this.data.incubator.name,
              email: this.data.incubator.email,
            },
            to: {
              name: this.data.mentor.name,
              email: this.data.mentor.email,
            },
            subject: "Mentoring Session Request",
            content: `<!doctype html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><title></title> <!--[if !mso]><!-- --><meta http-equiv="X-UA-Compatible" content="IE=edge"> <!--<![endif]--><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style type="text/css">#outlook a{padding:0}.ReadMsgBody{width:100%}.ExternalClass{width:100%}.ExternalClass *{line-height:100%}body{margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}table,td{border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt}img{border:0;height:auto;line-height:100%;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic}p{display:block;margin:13px 0}</style><!--[if !mso]><!--><style type="text/css">@media only screen and (max-width:480px){@-ms-viewport{width:320px}@viewport{width:320px}}</style><!--<![endif]--> <!--[if mso]> <xml> <o:OfficeDocumentSettings> <o:AllowPNG/> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml> <![endif]--> <!--[if lte mso 11]><style type="text/css">.outlook-group-fix{width:100% !important}</style><![endif]--><!--[if !mso]><!--><link href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700" rel="stylesheet" type="text/css"><link href="https://fonts.googleapis.com/css?family=Cabin:400,700" rel="stylesheet" type="text/css"><style type="text/css">@import url(https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700);@import url(https://fonts.googleapis.com/css?family=Cabin:400,700);</style><!--<![endif]--><style type="text/css">@media only screen and (min-width:480px){.mj-column-per-100{width:100% !important;max-width:100%}.mj-column-per-50{width:50% !important;max-width:50%}}</style><style type="text/css">@media only screen and (max-width:480px){table.full-width-mobile{width:100% !important}td.full-width-mobile{width:auto !important}}</style><style type="text/css">.hide_on_mobile{display:none !important}@media only screen and (min-width: 480px){.hide_on_mobile{display:block !important}}.hide_section_on_mobile{display:none !important}@media only screen and (min-width: 480px){.hide_section_on_mobile{display:table !important}}.hide_on_desktop{display:block !important}@media only screen and (min-width: 480px){.hide_on_desktop{display:none !important}}.hide_section_on_desktop{display:table !important}@media only screen and (min-width: 480px){.hide_section_on_desktop{display:none !important}}[owa] .mj-column-per-100{width:100% !important}[owa] .mj-column-per-50{width:50% !important}[owa] .mj-column-per-33{width:33.333333333333336% !important}p,h1,h2,h3{margin:0px}@media only print and (min-width:480px){.mj-column-per-100{width:100% !important}.mj-column-per-40{width:40% !important}.mj-column-per-60{width:60% !important}.mj-column-per-50{width:50% !important}mj-column-per-33{width:33.333333333333336% !important}}</style></head><body style="background-color:#FFFFFF;"><div style="background-color:#FFFFFF;"><!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"> <![endif]--><div style="Margin:0px auto;max-width:600px;"><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:9px 0px 9px 0px;text-align:center;vertical-align:top;"> <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" > <![endif]--><div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"><tr><td align="left" style="font-size:0px;padding:15px 15px 15px 15px;word-break:break-word;"><div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:11px;line-height:1.5;text-align:left;color:#000000;"><img src="${this.data.incubator.photoURL}" width="200" style="display: block; margin: 0 auto; margin-bottom: 10px" /><p style="text-align: center;"><span style="font-size: 18px;"><strong>Mentoring Session Request</strong></span></p></div></td></tr><tr><td style="font-size:0px;padding:10px undefined;padding-top:10px;padding-right:10px;word-break:break-word;"><p style="border-top:solid 1px #000000;font-size:1;margin:0px auto;width:100%;"></p><!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 1px #000000;font-size:1;margin:0px auto;width:NaNpx;" role="presentation" width="NaNpx" ><tr><td style="height:0;line-height:0;"> &nbsp;</td></tr></table> <![endif]--></td></tr></table></div><!--[if mso | IE]></td></tr></table> <![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"> <![endif]--><div style="Margin:0px auto;max-width:600px;"><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:9px 0px 9px 0px;text-align:center;vertical-align:top;"> <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" > <![endif]--><div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"><tr><td align="left" style="font-size:0px;padding:15px 15px 15px 15px;word-break:break-word;"><div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:11px;line-height:1.5;text-align:left;color:#000000;"><p><span style="font-size: 14px;">Dear <strong>${this.data.mentor.name},</strong></span></p></div></td></tr><tr><td align="left" style="font-size:0px;padding:15px 15px 15px 15px;word-break:break-word;"><div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:11px;line-height:1.5;text-align:left;color:#000000;"><p><span style="font-size: 12px;">Hope you are doing well. This is a confirmation email on your mentoring session scheduled as per your availability.</span></p></div></td></tr><table style="border-collapse: collapse; width: 100%; margin: 0 10px;"><tr><th style="border: 1px solid #dddddd; text-align: left; padding: 8px;"> Startup</th><td style="border: 1px solid #dddddd; text-align: left; padding: 8px;"> ${this.data.startup.name}</td></tr><tr><th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Date</th><td style="border: 1px solid #dddddd; text-align: left; padding: 8px;"> ${this.data.date}</td></tr><tr><th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Time</th><td style="border: 1px solid #dddddd; text-align: left; padding: 8px;"> ${this.data.time}</td></tr><tr><th style="border: 1px solid #dddddd; text-align: left; padding: 8px;"> Description</th><td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Test ${this.data.description}</td></tr></table><tr><td align="left" style="font-size:0px;padding:15px 15px 15px 15px;word-break:break-word;"><div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:11px;line-height:1.5;text-align:left;color:#000000;"><p><span style="font-size: 12px;">Request you to let us know in case you wish to reschedule the same or suggest an alternative day and time that works for you.</span></p></div></td></tr><tr><td align="center" vertical-align="middle" style="font-size:0px;padding:20px 20px 20px 20px;word-break:break-word;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;"><tr><td align="center" bgcolor="#3aa959" role="presentation" style="border:0px solid #000;border-radius:24px;cursor:auto;mso-padding-alt:9px 26px 9px 26px;background:#3aa959;" valign="middle"> <a href="${link}" style="display:inline-block;background:#3aa959;color:#ffffff;font-family:Ubuntu, Helvetica, Arial, sans-serif, Helvetica, Arial, sans-serif;font-size:13px;font-weight:normal;line-height:100%;Margin:0;text-decoration:none;text-transform:none;padding:9px 26px 9px 26px;mso-padding-alt:0px;border-radius:24px;" target="_blank"> Add Event to calendar </a></td></tr></table></td></tr><tr><td align="left" style="font-size:0px;padding:15px 15px 15px 15px;word-break:break-word;"><div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:11px;line-height:1.5;text-align:left;color:#000000;"><p><span style="font-size: 12px;">Please feel free to reach out to us in case of any queries. We thank you for your constant support.</span></p></div></td></tr><tr><td align="left" style="font-size:0px;padding:15px 15px 15px 15px;word-break:break-word;"><div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:11px;line-height:1.5;text-align:left;color:#000000;"><p><span style="font-size: 12px; color: #7e8c8d;">Regards,</span></p><p><span style="color: #000000;"><strong><span style="font-size: 12px;">${this.data.incubator.name}</span></strong></span></p></div></td></tr><tr><td style="font-size:0px;padding:10px undefined;padding-top:10px;padding-right:10px;word-break:break-word;"><p style="border-top:solid 1px #000000;font-size:1;margin:0px auto;width:100%;"></p><!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 1px #000000;font-size:1;margin:0px auto;width:NaNpx;" role="presentation" width="NaNpx" ><tr><td style="height:0;line-height:0;"> &nbsp;</td></tr></table> <![endif]--></td></tr></table></div><!--[if mso | IE]></td></tr></table> <![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"> <![endif]--><div style="Margin:0px auto;max-width:600px;"><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:9px 0px 9px 0px;text-align:center;vertical-align:top;"> <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" > <![endif]--><div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"><tr><td align="left" style="font-size:0px;padding:15px 15px 15px 15px;word-break:break-word;"><div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:11px;line-height:1.5;text-align:left;color:#000000;"><p style="text-align: center;">Powered By</p></div></td></tr><tr><td align="center" style="font-size:0px;padding:0px 0px 0px 0px;word-break:break-word;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;"><tbody><tr><td style="width:270px;"><img height="auto" src="https://s3-eu-west-1.amazonaws.com/topolio/uploads/606d856563a94/1617791341.jpg" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="270"></td></tr></tbody></table></td></tr></table></div></td></tr></tbody></table></div></div></body></html>`,
          });

          const activity = {
            incubator: this.data.incubator,
            incubatorId: this.data.incubator.docId,
            statement: `Session scheduled bewteen ${this.data.mentor.name} and ${this.data.startup.name} on ${this.data.date} at ${this.data.time}`,
            createdAt: new Date(),
            type: "",
            notification: false,
            photoURL: this.data.incubator.photoURL,
          };

          await activityRef.add(activity);
          this.data.startup = null;
          this.data.mentor = null;
          this.data.date = null;
          this.data.time = null;
          this.data.document = null;
          this.data.description = "";
          this.data.status = null;
          this.data.zoom.id = null;
          this.data.zoom.password = null;
          this.data.zoom.link = null;
          this.data.isFeedback = false;
          this.isZoom = false;
          this.genZoom = false;
          this.myZoom = false;
          this.mid = false;
          this.mpwd = false;
          this.mlink = false;

          this.$store.dispatch("SHOW_LOADER", { isShowing: false });
          this.$store.dispatch("SHOW_SNACKBAR", {
            showing: true,
            text: "Scheduled",
            color: "success",
          });
        } catch (error) {
          this.$store.dispatch("SHOW_LOADER", { isShowing: false });
          this.$store.dispatch("SHOW_SNACKBAR", {
            showing: true,
            text: error,
            color: "error",
          });
        }
      }
    },

    confirmGenZoom() {
      if (!this.isZoom) {
        // this.isZoom = false;
        // this.myZoom = false;
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
          this.isLinkLoaded = true;

          this.isZoom = true;
          this.genZoom = true;
          this.myZoom = false;
          // this.includeZoom();
          this.generateMeetingLink();
        } else {
          this.isZoom = false;
          this.genZoom = false;
          this.myZoom = false;
        }
      });
    },

    handleTime() {
      this.$refs.dialog2.save(this.time);
      let splitTime = this.time.split(":");
      this.endTime = +splitTime[0] + 1 + ":" + splitTime[1];
    },

    confirmMyZoom() {
      if (!this.myZoom) {
        this.isZoom = false;
        this.myZoom = false;
        this.genZoom = false;
      } else {
        this.isZoom = true;
        this.myZoom = true;
        this.genZoom = false;
        // this.includeZoom();
      }
    },

    includeZoom() {
      if (this.data.zoom.id === null) {
        axios({
          method: "get",
          url: "https://vue-connect-api.herokuapp.com/meeting/new",
          data: {
            topic: this.data.description,
            startTime: this.date + "T" + this.time + ":00Z",
          },
        })
          .then((response) => {
            this.data.zoom.id = "978632105";
            this.data.zoom.password = "hwcbjs51";
            this.data.zoom.link = "https://tiny-meet.web.app/" + response.data;

            this.mid = true;
            this.mpwd = true;
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
    goto(path) {
      this.$router.push(path);
    },
  },
};
</script>

<style scoped>
.wrapper {
  background-color: #fff;
  border: 1px solid #dbdbdb;
  border-radius: 5px;
  padding: 1rem 1rem 3rem 1rem;
}

.heading {
  color: #4d4d4d;
  margin: 0 1rem 1rem 1.5rem;
  font-weight: 500;
}
</style>