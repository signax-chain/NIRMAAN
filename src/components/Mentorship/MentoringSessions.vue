<template>
  <div>
    <v-row class="mb-4">
      <v-col cols="12" md="4">
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          placeholder="Search for sessions"
          single-line
          hide-details
          outlined
          dense
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="8">
        <div class="float-right">
          <v-btn
            color="traktor"
            dark
            to="/mentorship/mentor-availability"
            class="mr-2"
            >Mentor availability</v-btn
          >
          <v-btn
            color="traktor"
            dark
            @click="mentorHourModal = true"
            class="mr-2"
            >Add mentor hours
            <!-- <v-icon>mdi-plus-circle</v-icon> -->
          </v-btn>
          <v-btn color="traktor" dark to="/mentorship/schedule-session"
            >Schedule Session</v-btn
          >
          <v-btn color="grey" text dark to="/mentorship/request-mentor"
            >Request Mentor</v-btn
          >
        </div>
      </v-col>
    </v-row>
    <v-data-table
      :headers="headers"
      :items="items"
      :items-per-page="10"
      class="elevation-1"
      mobile-breakpoint="0"
      :search="search"
    >
      <!-- <template
          v-for="(col, i) in filters"
          v-slot:[`header.${i}`]="{ header }"
        >
          <div style="display: inline-block; padding: 16px 0" :key="i">
            {{ header.text }}
          </div>
          <div style="float: right; margin-top: 8px" :key="col[i]">
            <v-menu
              :close-on-content-click="false"
              :nudge-width="200"
              offset-y
              transition="slide-y-transition"
              left
              fixed
              style="position: absolute; right: 0"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="indigo" icon v-bind="attrs" v-on="on">
                  <v-icon
                    small
                    :color="
                      activeFilters[header.value].length <
                      filters[header.value].length
                        ? 'red'
                        : 'default'
                    "
                  >
                    mdi-filter-variant
                  </v-icon>
                </v-btn>
              </template>
              <v-list flat dense class="pa-0">
                <v-list-item-group
                  multiple
                  v-model="activeFilters[header.value]"
                  class="py-2"
                >
                  <template v-for="(item, i) in filters[header.value]">
                    <v-list-item
                      :key="`item-${i}`"
                      :value="item"
                      :ripple="false"
                    >
                      <template v-slot:default="{ active, toggle }">
                        <v-list-item-action>
                          <v-checkbox
                            :input-value="active"
                            :true-value="item"
                            @click.native="toggle"
                            color="primary"
                            dense
                          ></v-checkbox>
                        </v-list-item-action>
                        <v-list-item-content>
                          <v-list-item-title v-text="item"></v-list-item-title>
                        </v-list-item-content>
                      </template>
                    </v-list-item>
                  </template>
                </v-list-item-group>
                <v-divider></v-divider>
                <v-btn text block @click="toggleAll(header.value)"
                  >Toggle all</v-btn
                >
                <v-btn text block @click="clearAll(header.value)"
                  >Clear all</v-btn
                >
              </v-list>
            </v-menu>
          </div>
        </template> -->
      <template v-slot:[`item.status`]="{ item }">
        <v-chip :color="getColor(item)" class="white--text">{{
          getStatus(item)
        }}</v-chip>
      </template>
      <template v-slot:[`item.feedback`]="{ item }">
        <v-btn
          color="traktor"
          class="white--text"
          v-if="item.isFeedback"
          @click="viewFeedback(item.docId)"
          >View feedback</v-btn
        >
        <v-btn
          color="traktor"
          class="white--text"
          :disabled="compareDate(item.datetime)"
          @click="initiateFeedback(item)"
          v-else
          >Initiate</v-btn
        >
      </template>
      <template v-slot:[`item.mentorHours`]="{ item }">
        {{ getMentorHours(item) }}
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="notes(item.docId)" v-if="isFeedback">
              <v-list-item-title> View notes </v-list-item-title>
            </v-list-item>
            <v-list-item
              @click="update(item)"
              v-if="compareDate(item.datetime)"
            >
              <v-list-item-title> Re-schedule </v-list-item-title>
            </v-list-item>
            <v-list-item
              @click="cancel(item)"
              v-if="compareDate(item.datetime)"
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
    <v-card-text></v-card-text>
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
    <feedback-modal
      v-if="feedbacks"
      :visible="feedbackDialog"
      :feedbacks="feedbacks"
      @close="feedbackDialog = false"
    />
    <reschedule-modal
      v-if="rescheduleModal"
      :dialog.sync="rescheduleModal"
      :data="rescheduleData"
    />
    <mentor-hours
      :visible="mentorHourModal"
      @close="mentorHourModal = false"
    ></mentor-hours>
  </div>
</template>

<script>
import { activityRef, mentorshipRef } from "../../config/firebase_services";
import Swal from "sweetalert2";
import axios from "axios";
import FeedbackModal from "@/components/Modals/Mentorship/Feedback";
import RescheduleModal from "@/components/Modals/Mentorship/Reschedule";
import MentorHours from "../Modals/Mentorship/MentorHours.vue";

export default {
  name: "MentoringSessions",
  components: {
    FeedbackModal,
    RescheduleModal,
    MentorHours,
  },
  computed: {
    headers: function () {
      return [
        {
          text: "Mentor",
          value: "mentorname",
          sortable: true,
          align: "left",
          // filter: (value) => {
          //   return this.activeFilters.mentorname.includes(value);
          // },
        },
        {
          text: "Startup",
          value: "startupname",
          sortable: true,
          align: "left",
          // filter: (value) => {
          //   return this.activeFilters.startupname.includes(value);
          // },
        },
        {
          text: "Date",
          value: "date",
          sortable: true,
          align: "left",
          // filter: (value) => {
          //   return this.activeFilters.date.includes(value);
          // },
        },
        {
          text: "Time",
          value: "time",
          sortable: true,
          align: "left",
          // filter: (value) => {
          //   return this.activeFilters.time.includes(value);
          // },
        },
        {
          text: "Mentor hours",
          value: "mentorHours",
          sortable: true,
          align: "left",
        },
        {
          text: "Status",
          value: "status",
          sortable: true,
          align: "left",
          // filter: (value) => {
          //   return this.activeFilters.status.includes(value);
          // },
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
      search: null,
      mentorHourModal: false,
    };
  },
  async created() {
    mentorshipRef
      .where(
        "incubator.docId",
        "==",
        this.$store.state.incubator.currentIncubator.docId
      )
      .onSnapshot((snapshot) => {
        this.items = [];
        snapshot.forEach((document) => {
          const data = document.data();
          data.docId = document.id;
          if (data.date !== null) {
            const temp = data.date.split("-");
            data.date = temp[2] + "/" + temp[1] + "/" + temp[0];
          }
          data.mentorname = data.mentor.name;
          data.startupname = data.startup.name;
          this.items.push(data);
        });
        // this.filterItems();
      });
  },
  methods: {
    getMentorHours(item) {
      if (!item.mentorHours) return "-";
      let hours = Math.floor(item.mentorHours / 60);
      let minutes = item.mentorHours % 60;
      return hours + ":" + (minutes < 10 ? "0" : "") + minutes;
    },
    filterItems() {
      for (let col in this.filters) {
        this.filters[col] = this.items
          .map((d) => {
            return d[col];
          })
          .filter((value, index, self) => {
            return self.indexOf(value) === index;
          });
      }
      this.activeFilters = Object.assign({}, this.filters);
    },
    toggleAll(col) {
      this.activeFilters[col] = this.items
        .map((d) => {
          return d[col];
        })
        .filter((value, index, self) => {
          return self.indexOf(value) === index;
        });
    },

    clearAll(col) {
      this.activeFilters[col] = [];
    },
    getColor(item) {
      if (item.status === "Completed") return "green";
      if (item.status === "Scheduled") {
        const isCompleted = this.getStatus(item);
        return isCompleted === "Completed" ? "green" : "blue";
      }
      if (item.status === "Re-Scheduled") return "orange";
      if (item.status === "Cancelled") return "red";
    },

    getStatus(item) {
      const isCompleted = this.compareDate(item.datetime);

      if (!isCompleted) {
        return "Completed";
      } else {
        return item.status;
      }
    },

    compareDate(datetime) {
      // if (datetime === null) return true;
      if (datetime === null) return false;
      const date = datetime.toDate().toUTCString();
      const _datetime = new Date(date);
      const now = new Date();
      return now >= _datetime ? false : true;
    },

    notes(_id) {
      this.$router.push(`/all-notes/${_id}`);
    },

    initiateFeedback(item) {
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

          try {
            const link = `https://traktor.thestartupreneur.co/mentorship/feedback/m/${item.docId}`;
            const nlink = `${location.origin}/mentorship/notes/m/${item.docId}`;

            await axios.post("https://traktor-api.herokuapp.com/sendMail", {
              from: {
                name: item.incubator.name,
                email: item.incubator.email,
              },
              to: {
                name: item.mentor.name,
                email: item.mentor.email,
              },
              subject: "Mentoring Session Feedback Requested",
              content: `<!doctype html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><title></title> <!--[if !mso]><!-- --><meta http-equiv="X-UA-Compatible" content="IE=edge"> <!--<![endif]--><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style type="text/css">#outlook a{padding:0}.ReadMsgBody{width:100%}.ExternalClass{width:100%}.ExternalClass *{line-height:100%}body{margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}table,td{border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt}img{border:0;height:auto;line-height:100%;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic}p{display:block;margin:13px 0}</style><!--[if !mso]><!--><style type="text/css">@media only screen and (max-width:480px){@-ms-viewport{width:320px}@viewport{width:320px}}</style><!--<![endif]--> <!--[if mso]> <xml> <o:OfficeDocumentSettings> <o:AllowPNG/> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml> <![endif]--> <!--[if lte mso 11]><style type="text/css">.outlook-group-fix{width:100% !important}</style><![endif]--><!--[if !mso]><!--><link href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700" rel="stylesheet" type="text/css"><link href="https://fonts.googleapis.com/css?family=Cabin:400,700" rel="stylesheet" type="text/css"><style type="text/css">@import url(https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700);@import url(https://fonts.googleapis.com/css?family=Cabin:400,700);</style><!--<![endif]--><style type="text/css">@media only screen and (min-width:480px){.mj-column-per-100{width:100% !important;max-width:100%}.mj-column-per-50{width:50% !important;max-width:50%}}</style><style type="text/css">@media only screen and (max-width:480px){table.full-width-mobile{width:100% !important}td.full-width-mobile{width:auto !important}}</style><style type="text/css">.hide_on_mobile{display:none !important}@media only screen and (min-width: 480px){.hide_on_mobile{display:block !important}}.hide_section_on_mobile{display:none !important}@media only screen and (min-width: 480px){.hide_section_on_mobile{display:table !important}}.hide_on_desktop{display:block !important}@media only screen and (min-width: 480px){.hide_on_desktop{display:none !important}}.hide_section_on_desktop{display:table !important}@media only screen and (min-width: 480px){.hide_section_on_desktop{display:none !important}}[owa] .mj-column-per-100{width:100% !important}[owa] .mj-column-per-50{width:50% !important}[owa] .mj-column-per-33{width:33.333333333333336% !important}p,h1,h2,h3{margin:0px}@media only print and (min-width:480px){.mj-column-per-100{width:100% !important}.mj-column-per-40{width:40% !important}.mj-column-per-60{width:60% !important}.mj-column-per-50{width:50% !important}mj-column-per-33{width:33.333333333333336% !important}}</style></head><body style="background-color:#FFFFFF;"><div style="background-color:#FFFFFF;"><!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"> <![endif]--><div style="Margin:0px auto;max-width:600px;"><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:9px 0px 9px 0px;text-align:center;vertical-align:top;"> <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" > <![endif]--><div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"><tr><td align="left" style="font-size:0px;padding:15px 15px 15px 15px;word-break:break-word;"><div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:11px;line-height:1.5;text-align:left;color:#000000;"><p style="text-align: center;"><span style="font-size: 18px;"><strong>Mentoring Session Feedback Requested</strong></span></p></div></td></tr><tr><td style="font-size:0px;padding:10px undefined;padding-top:10px;padding-right:10px;word-break:break-word;"><p style="border-top:solid 1px #000000;font-size:1;margin:0px auto;width:100%;"></p><!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 1px #000000;font-size:1;margin:0px auto;width:NaNpx;" role="presentation" width="NaNpx" ><tr><td style="height:0;line-height:0;"> &nbsp;</td></tr></table> <![endif]--></td></tr></table></div><!--[if mso | IE]></td></tr></table> <![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"> <![endif]--><div style="Margin:0px auto;max-width:600px;"><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:9px 0px 9px 0px;text-align:center;vertical-align:top;"> <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" > <![endif]--><div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"><tr><td align="left" style="font-size:0px;padding:15px 15px 15px 15px;word-break:break-word;"><div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:11px;line-height:1.5;text-align:left;color:#000000;"><p><span style="font-size: 14px;">Dear <strong>${item.mentor.name},</strong></span></p></div></td></tr><tr><td align="left" style="font-size:0px;padding:15px 15px 15px 15px;word-break:break-word;"><div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:11px;line-height:1.5;text-align:left;color:#000000;"><p><span style="font-size: 12px;">Hope you are doing well. This is to request your feedback for the following mentoring session:</span></p></div></td></tr><table style="border-collapse: collapse; width: 100%; margin: 0 10px;"><tr><th style="border: 1px solid #dddddd; text-align: left; padding: 8px;"> Startup</th><td style="border: 1px solid #dddddd; text-align: left; padding: 8px;"> ${item.startup.name}</td></tr><tr><th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Date</th><td style="border: 1px solid #dddddd; text-align: left; padding: 8px;"> ${item.date}</td></tr><tr><th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Time</th><td style="border: 1px solid #dddddd; text-align: left; padding: 8px;"> ${item.time}</td></tr><tr><th style="border: 1px solid #dddddd; text-align: left; padding: 8px;"> Description</th><td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Test ${item.description}</td></tr></table><tr><td align="left" style="font-size:0px;padding:15px 15px 15px 15px;word-break:break-word;"><div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:11px;line-height:1.5;text-align:left;color:#000000;"><p><span style="font-size: 12px;">Kindly share your feedback by clicking the below link.</span></p></div></td></tr><tr><td align="center" vertical-align="middle" style="font-size:0px;padding:20px 20px 20px 20px;word-break:break-word;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;"><tr><td align="center" bgcolor="#3aa959" role="presentation" style="border:0px solid #000;border-radius:24px;cursor:auto;mso-padding-alt:9px 26px 9px 26px;background:#3aa959;" valign="middle"> <a href="${link}" style="display:inline-block;background:#3aa959;color:#ffffff;font-family:Ubuntu, Helvetica, Arial, sans-serif, Helvetica, Arial, sans-serif;font-size:13px;font-weight:normal;line-height:100%;Margin:0;text-decoration:none;text-transform:none;padding:9px 26px 9px 26px;mso-padding-alt:0px;border-radius:24px;" target="_blank"> Give feedback </a></td><td align="center" bgcolor="#3aa959" role="presentation" style="border:0px solid #000;border-radius:24px;cursor:auto;mso-padding-alt:9px 26px 9px 26px;background:#3aa959;" valign="middle"> <a href="${nlink}" style="display:inline-block;background:#3aa959;color:#ffffff;font-family:Ubuntu, Helvetica, Arial, sans-serif, Helvetica, Arial, sans-serif;font-size:13px;font-weight:normal;line-height:100%;Margin:0;text-decoration:none;text-transform:none;padding:9px 26px 9px 26px;mso-padding-alt:0px;border-radius:24px;" target="_blank"> Take notes </a></td></tr></table></td></tr><tr><td align="left" style="font-size:0px;padding:15px 15px 15px 15px;word-break:break-word;"><div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:11px;line-height:1.5;text-align:left;color:#000000;"><p><span style="font-size: 12px;">Please feel free to reach out to us in case of any queries. We thank you for your constant support.</span></p></div></td></tr><tr><td align="left" style="font-size:0px;padding:15px 15px 15px 15px;word-break:break-word;"><div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:11px;line-height:1.5;text-align:left;color:#000000;"><p><span style="font-size: 12px; color: #7e8c8d;">Regards,</span></p><p><span style="color: #000000;"><strong><span style="font-size: 12px;">${item.incubator.name}</span></strong></span></p></div></td></tr><tr><td style="font-size:0px;padding:10px undefined;padding-top:10px;padding-right:10px;word-break:break-word;"><p style="border-top:solid 1px #000000;font-size:1;margin:0px auto;width:100%;"></p></td></tr></table></div></td></tr></tbody></table></div><div style="Margin:0px auto;max-width:600px;"><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:9px 0px 9px 0px;text-align:center;vertical-align:top;"><div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"><tr><td align="left" style="font-size:0px;padding:15px 15px 15px 15px;word-break:break-word;"><div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:11px;line-height:1.5;text-align:left;color:#000000;"><p style="text-align: center;">Powered By</p></div></td></tr><tr><td align="center" style="font-size:0px;padding:0px 0px 0px 0px;word-break:break-word;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;"><tbody><tr><td style="width:270px;"><img height="auto" src="https://s3-eu-west-1.amazonaws.com/topolio/uploads/606d856563a94/1617791341.jpg" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="270"></td></tr></tbody></table></td></tr></table></div></td></tr></tbody></table></div></div></body></html>`,
            });

            try {
              const link = `https://traktor.thestartupreneur.co/mentorship/feedback/s/${item.docId}`;
              const nlink = `${location.origin}/mentorship/notes/s/${item.docId}`;

              await axios.post("https://traktor-api.herokuapp.com/sendMail", {
                from: {
                  name: item.incubator.name,
                  email: item.incubator.email,
                },
                to: {
                  name: item.startup.name,
                  email: item.startup.email,
                },
                subject: "Mentoring Session Feedback Requested",
                content: `<!doctype html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><title></title> <!--[if !mso]><!-- --><meta http-equiv="X-UA-Compatible" content="IE=edge"> <!--<![endif]--><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style type="text/css">#outlook a{padding:0}.ReadMsgBody{width:100%}.ExternalClass{width:100%}.ExternalClass *{line-height:100%}body{margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}table,td{border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt}img{border:0;height:auto;line-height:100%;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic}p{display:block;margin:13px 0}</style><!--[if !mso]><!--><style type="text/css">@media only screen and (max-width:480px){@-ms-viewport{width:320px}@viewport{width:320px}}</style><!--<![endif]--> <!--[if mso]> <xml> <o:OfficeDocumentSettings> <o:AllowPNG/> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml> <![endif]--> <!--[if lte mso 11]><style type="text/css">.outlook-group-fix{width:100% !important}</style><![endif]--><!--[if !mso]><!--><link href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700" rel="stylesheet" type="text/css"><link href="https://fonts.googleapis.com/css?family=Cabin:400,700" rel="stylesheet" type="text/css"><style type="text/css">@import url(https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700);@import url(https://fonts.googleapis.com/css?family=Cabin:400,700);</style><!--<![endif]--><style type="text/css">@media only screen and (min-width:480px){.mj-column-per-100{width:100% !important;max-width:100%}.mj-column-per-50{width:50% !important;max-width:50%}}</style><style type="text/css">@media only screen and (max-width:480px){table.full-width-mobile{width:100% !important}td.full-width-mobile{width:auto !important}}</style><style type="text/css">.hide_on_mobile{display:none !important}@media only screen and (min-width: 480px){.hide_on_mobile{display:block !important}}.hide_section_on_mobile{display:none !important}@media only screen and (min-width: 480px){.hide_section_on_mobile{display:table !important}}.hide_on_desktop{display:block !important}@media only screen and (min-width: 480px){.hide_on_desktop{display:none !important}}.hide_section_on_desktop{display:table !important}@media only screen and (min-width: 480px){.hide_section_on_desktop{display:none !important}}[owa] .mj-column-per-100{width:100% !important}[owa] .mj-column-per-50{width:50% !important}[owa] .mj-column-per-33{width:33.333333333333336% !important}p,h1,h2,h3{margin:0px}@media only print and (min-width:480px){.mj-column-per-100{width:100% !important}.mj-column-per-40{width:40% !important}.mj-column-per-60{width:60% !important}.mj-column-per-50{width:50% !important}mj-column-per-33{width:33.333333333333336% !important}}</style></head><body style="background-color:#FFFFFF;"><div style="background-color:#FFFFFF;"><!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"> <![endif]--><div style="Margin:0px auto;max-width:600px;"><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:9px 0px 9px 0px;text-align:center;vertical-align:top;"> <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" > <![endif]--><div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"><tr><td align="left" style="font-size:0px;padding:15px 15px 15px 15px;word-break:break-word;"><div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:11px;line-height:1.5;text-align:left;color:#000000;"><p style="text-align: center;"><span style="font-size: 18px;"><strong>Mentoring Session Feedback Requested</strong></span></p></div></td></tr><tr><td style="font-size:0px;padding:10px undefined;padding-top:10px;padding-right:10px;word-break:break-word;"><p style="border-top:solid 1px #000000;font-size:1;margin:0px auto;width:100%;"></p><!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 1px #000000;font-size:1;margin:0px auto;width:NaNpx;" role="presentation" width="NaNpx" ><tr><td style="height:0;line-height:0;"> &nbsp;</td></tr></table> <![endif]--></td></tr></table></div><!--[if mso | IE]></td></tr></table> <![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"> <![endif]--><div style="Margin:0px auto;max-width:600px;"><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:9px 0px 9px 0px;text-align:center;vertical-align:top;"> <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" > <![endif]--><div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"><tr><td align="left" style="font-size:0px;padding:15px 15px 15px 15px;word-break:break-word;"><div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:11px;line-height:1.5;text-align:left;color:#000000;"><p><span style="font-size: 14px;">Dear <strong>${item.startup.name},</strong></span></p></div></td></tr><tr><td align="left" style="font-size:0px;padding:15px 15px 15px 15px;word-break:break-word;"><div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:11px;line-height:1.5;text-align:left;color:#000000;"><p><span style="font-size: 12px;">Hope you are doing well. This is to request your feedback for the following mentoring session:</span></p></div></td></tr><table style="border-collapse: collapse; width: 100%; margin: 0 10px;"><tr><th style="border: 1px solid #dddddd; text-align: left; padding: 8px;"> Mentor</th><td style="border: 1px solid #dddddd; text-align: left; padding: 8px;"> ${item.mentor.name}</td></tr><tr><th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Date</th><td style="border: 1px solid #dddddd; text-align: left; padding: 8px;"> ${item.date}</td></tr><tr><th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Time</th><td style="border: 1px solid #dddddd; text-align: left; padding: 8px;"> ${item.time}</td></tr><tr><th style="border: 1px solid #dddddd; text-align: left; padding: 8px;"> Description</th><td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Test ${item.description}</td></tr></table><tr><td align="left" style="font-size:0px;padding:15px 15px 15px 15px;word-break:break-word;"><div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:11px;line-height:1.5;text-align:left;color:#000000;"><p><span style="font-size: 12px;">Kindly share your feedback by clicking the below link.</span></p></div></td></tr><tr><td align="center" vertical-align="middle" style="font-size:0px;padding:20px 20px 20px 20px;word-break:break-word;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;"><tr><td align="center" bgcolor="#3aa959" role="presentation" style="border:0px solid #000;border-radius:24px;cursor:auto;mso-padding-alt:9px 26px 9px 26px;background:#3aa959;" valign="middle"> <a href="${link}" style="display:inline-block;background:#3aa959;color:#ffffff;font-family:Ubuntu, Helvetica, Arial, sans-serif, Helvetica, Arial, sans-serif;font-size:13px;font-weight:normal;line-height:100%;Margin:0;text-decoration:none;text-transform:none;padding:9px 26px 9px 26px;mso-padding-alt:0px;border-radius:24px;" target="_blank"> Give feedback </a></td><td align="center" bgcolor="#3aa959" role="presentation" style="border:0px solid #000;border-radius:24px;cursor:auto;mso-padding-alt:9px 26px 9px 26px;background:#3aa959;" valign="middle"> <a href="${nlink}" style="display:inline-block;background:#3aa959;color:#ffffff;font-family:Ubuntu, Helvetica, Arial, sans-serif, Helvetica, Arial, sans-serif;font-size:13px;font-weight:normal;line-height:100%;Margin:0;text-decoration:none;text-transform:none;padding:9px 26px 9px 26px;mso-padding-alt:0px;border-radius:24px;" target="_blank"> Take notes </a></td></tr></table></td></tr><tr><td align="left" style="font-size:0px;padding:15px 15px 15px 15px;word-break:break-word;"><div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:11px;line-height:1.5;text-align:left;color:#000000;"><p><span style="font-size: 12px;">Please feel free to reach out to us in case of any queries. We thank you for your constant support.</span></p></div></td></tr><tr><td align="left" style="font-size:0px;padding:15px 15px 15px 15px;word-break:break-word;"><div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:11px;line-height:1.5;text-align:left;color:#000000;"><p><span style="font-size: 12px; color: #7e8c8d;">Regards,</span></p><p><span style="color: #000000;"><strong><span style="font-size: 12px;">${item.incubator.name}</span></strong></span></p></div></td></tr><tr><td style="font-size:0px;padding:10px undefined;padding-top:10px;padding-right:10px;word-break:break-word;"><p style="border-top:solid 1px #000000;font-size:1;margin:0px auto;width:100%;"></p></td></tr></table></div></td></tr></tbody></table></div><div style="Margin:0px auto;max-width:600px;"><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:9px 0px 9px 0px;text-align:center;vertical-align:top;"><div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"><tr><td align="left" style="font-size:0px;padding:15px 15px 15px 15px;word-break:break-word;"><div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:11px;line-height:1.5;text-align:left;color:#000000;"><p style="text-align: center;">Powered By</p></div></td></tr><tr><td align="center" style="font-size:0px;padding:0px 0px 0px 0px;word-break:break-word;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;"><tbody><tr><td style="width:270px;"><img height="auto" src="https://s3-eu-west-1.amazonaws.com/topolio/uploads/606d856563a94/1617791341.jpg" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="270"></td></tr></tbody></table></td></tr></table></div></td></tr></tbody></table></div></div></body></html>`,
              });

              await mentorshipRef
                .doc(item.docId)
                .set({ isFeedback: true }, { merge: true });

              const activity = {
                incubator: item.incubator,
                statement: `Session feedback initiated to ${item.mentor.name} and ${item.startup.name}`,
                createdAt: new Date(),
                type: "",
                notification: false,
              };

              await activityRef.add(activity);

              this.$store.dispatch("SHOW_LOADER", { isShowing: false });

              this.$store.dispatch("SHOW_SNACKBAR", {
                showing: true,
                text: "Initiated",
                color: "success",
              });
            } catch (error) {
              this.$store.dispatch("SHOW_SNACKBAR", {
                showing: true,
                text: error,
                color: "error",
              });
            }
          } catch (error) {
            this.$store.dispatch("SHOW_SNACKBAR", {
              showing: true,
              text: error,
              color: "error",
            });
          }
        }
      });
    },

    viewFeedback(docId) {
      const obj = this.items.find((item) => item.docId === docId);
      this.feedbacks = obj;
      this.feedbackDialog = true;
    },

    confirm(id) {
      this.id = id;
      this.confirmDialog = true;
    },

    update(item) {
      (this.rescheduleModal = true), (this.rescheduleData = item);
    },

    cancel(item) {
      Swal.fire({
        title: "Are you sure?",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await mentorshipRef
              .doc(item.docId)
              .set({ status: "Cancelled" }, { merge: true });

            const activity = {
              incubator: this.$store.user.currentUser,
              statement: `Session cancelled between ${this.item.mentor.name} and ${this.item.startup.name}`,
              createdAt: new Date(),
              type: "",
              notification: false,
            };

            await activityRef.add(activity);

            this.$store.dispatch("SHOW_SNACKBAR", {
              showing: true,
              text: "Cancelled",
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
      });
    },

    _delete(id) {
      Swal.fire({
        title: "Are you sure?",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await mentorshipRef.doc(id).delete();

            this.$store.dispatch("SHOW_SNACKBAR", {
              showing: true,
              text: "Deleted",
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