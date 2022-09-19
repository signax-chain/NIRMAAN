<template>
  <v-form>
    <v-select
      outlined
      label="Select startup"
      :items="startups"
      v-model="startup"
      item-text="name"
      item-value="docId"
    ></v-select>
    <v-row v-for="(milestone, index) in milestones" :key="index">
      <v-col cols="12" md="3">
        <v-select
          outlined
          label="Select milestone"
          :items="milestoneOptions"
          dense
          v-model="milestone.title"
          @change="handleMilestone(index)"
        ></v-select>
      </v-col>
      <v-col cols="12" md="3">
        <v-text-field
          type="date"
          outlined
          dense
          label="Milestone date"
          v-model="milestone.date"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="3">
        <v-text-field
          label="Description"
          outlined
          dense
          v-model="milestone.description"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="1"></v-col>
      <v-col cols="12" md="2">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              v-on="on"
              icon
              color="traktor"
              @click="addNewMilestone()"
              v-show="index + 1 === milestones.length"
              ><v-icon size="28">mdi-plus-circle</v-icon></v-btn
            >
          </template>
          <span>Add new task</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              v-on="on"
              icon
              color="red"
              @click="deleteMilestone(index)"
              v-show="milestones.length !== 1"
              ><v-icon size="28">mdi-delete</v-icon></v-btn
            >
          </template>
          <span>Delete task</span>
        </v-tooltip>
      </v-col>
    </v-row>
    <h2 class="mt-5 black--text">Visualization</h2>
    <div class="row mt-2">
      <div class="col-md-12">
        <div style="display: inline-block; width: 100%; overflow-y: auto">
          <ul class="timeline timeline-horizontal">
            <li
              class="timeline-item"
              v-for="(milestone, index) in milestones"
              :key="index"
            >
              <div class="timeline-badge success">
                <v-icon style="font-size: 48px" class="white--text"
                  >mdi-progress-clock</v-icon
                >
              </div>
              <div class="timeline-panel">
                <div class="timeline-heading">
                  <h4 class="timeline-title black--text">
                    {{ milestone.title }}
                    <div style="float: right"></div>
                  </h4>
                </div>
                <div class="timeline-body">
                  <p style="font-size: 10px">{{ milestone.description }}</p>
                </div>
                <small class="text-muted pull-right"
                  ><v-icon>mdi-clock</v-icon>{{ milestone.date }}</small
                >
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <v-btn color="traktor" class="white--text ml-auto d-block" @click="submit()"
      >Save milestone</v-btn
    >
    <v-dialog v-model="addNewDialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline"> Add new </v-card-title>
        <v-card-text>
          <v-text-field
            outlined
            label="Add new"
            v-model="newOption"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="addNewDialog = false"> Cancel </v-btn>
          <v-btn color="traktor" class="white--text" @click="addNewOption()">
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-form>
</template>

<script>
import { startupsRef, milestonesRef } from "../../config/firebase_services";
import axios from "axios";

export default {
  name: "Milestones",
  data() {
    return {
      startup: null,
      startups: [],
      modal: false,
      milestoneOptions: [
        "General",
        "Idea",
        "Prototype",
        "MVP",
        "Pivoted",
        "Early Traction",
        "Seed Funding",
        "Product Market Fit",
        "VC Funding",
        "Scaling",
        "Jobs Created",
        "Internal Seed Funding",
        "Awards and Recognitions",
        "Media Mentions",
        "Exit",
        "Add new +",
      ],
      milestones: [
        {
          id: +new Date(),
          title: null,
          date: null,
          description: null,
          isCompleted: false,
        },
      ],
      addNewDialog: false,
      newOption: null,
      index: null,
    };
  },
  created() {
    this.getStartups();
  },
  methods: {
    async getStartups() {
      const documents = await startupsRef
        .where(
          "incubatorId",
          "==",
          this.$store.state.incubator.currentIncubator.docId
        )
        .where("isDeleted", "==", false)
        .get();

      documents.forEach((document) => {
        this.startups.push(document.data());
      });
    },

    handleMilestone(index) {
      if (this.milestones[index].title === "Add new +") {
        this.addNewDialog = true;
        this.index = index;
      }
    },

    addNewOption() {
      if (this.newOption === null || this.newOption === "") {
        this.$toast.error("Milestone cannot be empty!", {
          position: "top",
        });
        return;
      }
      this.milestoneOptions.splice(
        this.milestoneOptions.length - 1,
        0,
        this.newOption
      );
      this.milestoneOptions.join();
      this.milestones[this.index].title = this.newOption;
      this.newOption = null;
      this.index = null;
      this.addNewDialog = false;
    },

    addNewMilestone() {
      this.milestones.push({
        id: +new Date(),
        title: null,
        date: null,
        description: null,
        isCompleted: false,
      });
    },

    deleteMilestone(index) {
      this.milestones.splice(index, 1);
    },

    async submit() {
      if (this.startup === null) {
        this.$toast.warning("Please select a startup to set the milestone", {
          position: "top",
        });
        return;
      }

      const checkForNull = this.milestones.find(
        (milestone) => milestone.title === null || milestone.date === null
      );
      if (checkForNull !== undefined) {
        this.$toast.warning(
          "Looks like you are missing with title or date for some tasks!...",
          {
            position: "top",
          }
        );
        return;
      }

      const obj = this.startups.find(
        (startup) => startup.docId === this.startup
      );
      const data = {
        startup: obj,
        milestones: this.milestones,
        incubatorId: this.$store.state.incubator.currentIncubator.docId,
        createdAt: new Date(),
      };

      try {
        await milestonesRef.add(data);
        let tableData = null;
        for (let i = 0; i < data.milestones.length; i++) {
          tableData +=
            '<tr><td style="border:1px solid black;width:150px;color:black;">' +
            data.milestones[i].title +
            '</td><td style="border:1px solid black;width:180px;color:black;">' +
            data.milestones[i].date +
            '</td><td style="border:1px solid black;width:180px;color:black;">' +
            data.milestones[i].description +
            "</td></tr>";
        }
        await axios.post("https://traktor-api.herokuapp.com/sendMail", {
          from: {
            name: this.$store.state.incubator.currentIncubator.name,
            email: this.$store.state.incubator.currentIncubator.email,
          },
          to: {
            name: data.startup.name,
            email: data.startup.email,
          },
          subject: "Milestone update",
          content: `<body class="no-padding" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;"><table class="wrapper" style="border-collapse: collapse;table-layout: fixed;min-width: 320px;width: 100%;background-color: #fff;" cellpadding="0" cellspacing="0" role="presentation"><tbody><tr><td><div><div class="layout one-col fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"><div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #ffffff;"><div class="column" style="text-align: left;color: #8e959c;font-size: 14px;line-height: 21px;font-family: sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);"><div style="Margin-left: 20px;Margin-right: 20px;"><div style="mso-line-height-rule: exactly;line-height: 50px;font-size: 1px;margin-left: 7%;">&nbsp;</div></div><div style="Margin-left: 20px;Margin-right: 20px;"><div style="mso-line-height-rule: exactly;mso-text-raise: 4px;"><h2 style="Margin-top: 0;Margin-bottom: 0;font-style: normal;font-weight: normal;color: #e31212;font-size: 26px;line-height: 34px;font-family: Avenir,sans-serif;text-align: center;"></h2></div></div></div></div></div><div style="line-height:20px;font-size:20px;">&nbsp;</div><div class="layout one-col fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"><div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #fff;"><div class="column" style="text-align: left;color: #8e959c;font-size: 14px;line-height: 21px;font-family: sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);"><div style="Margin-left: 20px;Margin-right: 20px;"><div style="mso-line-height-rule: exactly;mso-text-raise: 4px;margin-left: 7%;"><h3 class="size-16" style="Margin-top: 0;Margin-bottom: 0;font-style: normal;font-weight: normal;color: #000000;font-size: 16px;line-height: 24px;font-family: arial,sans-serif;" lang="x-size-16"><span class="font-arial">Dear ${data.startup.name} </span></h3><p style="Margin-top: 12px;Margin-bottom: 0;"><span style="color:#000000;font-size: 16px;">Hope you are doing well. This is to inform you that following are the milestones to be completed in the given schedule.</span></p></div></div></div></div></div><div style="line-height:20px;font-size:20px;">&nbsp;</div><div class="layout one-col fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"><div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #fff;"><div class="column" style="text-align: left;margin-left:8%;color: #8e959c;font-size: 14px;line-height: 21px;font-family: sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);"><div style="Margin-left: 20px;Margin-right: 20px;"><div style="mso-line-height-rule: exactly;mso-text-raise: 4px;"><table style="border:1px solid black; border-collapse: collapse;text-align:center;"><tr><th>Milestone</th><th>Date</th><th>Description</th></tr>${tableData}</table></div></div></div> </div></div><div style="line-height:20px;font-size:20px;">&nbsp;</div><div class="layout one-col fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"><div style="line-height:20px;font-size:20px;">&nbsp;</div><div role="contentinfo"><div class="layout email-footer" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"><div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;"><div class="column wide" style="text-align: left;font-size: 12px;line-height: 19px;color: #adb3b9;font-family: sans-serif;Float: left;max-width: 400px;min-width: 320px; width: 320px;width: calc(8000% - 47600px);"><div style="Margin-left: 20px; Margin-right: 20px;Margin-top: 10px;Margin-bottom: 10px;"><div style="font-size: 14px;line-height: 19px; margin-left: 7%;"><div>Regards,</div></div><div style="font-size: 14px;line-height: 19px;Margin-top: 18px;margin-left: 7%;"><div>' + data.incubatorData.name + ${this.$store.state.incubator.currentIncubator.name}</div></div></div></div></div></div></div></div></div></td></tr></tbody></table></body>`,
        });
        this.$toast.success("Milestones set successfully", {
          position: "top",
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
.timeline,
.timeline-horizontal {
  list-style: none;
  padding: 20px;
  position: relative;
}

.timeline:before {
  top: 40px;
  bottom: 0;
  position: absolute;
  content: " ";
  width: 3px;
  background-color: #eeeeee;
  left: 50%;
  margin-left: -1.5px;
}

.timeline .timeline-item {
  margin-bottom: 20px;
  position: relative;
}

.timeline .timeline-item:before,
.timeline .timeline-item:after {
  content: "";
  display: table;
}

.timeline .timeline-item:after {
  clear: both;
}

.timeline .timeline-item .timeline-badge {
  color: #fff;
  width: 54px;
  height: 54px;
  line-height: 52px;
  font-size: 22px;
  text-align: center;
  position: absolute;
  top: 18px;
  left: 50%;
  margin-left: -25px;
  background-color: #333333;
  border: 3px solid #ffffff;
  z-index: 100;
  border-top-right-radius: 50%;
  border-top-left-radius: 50%;
  border-bottom-right-radius: 50%;
  border-bottom-left-radius: 50%;
}

.timeline .timeline-item .timeline-badge i,
.timeline .timeline-item .timeline-badge .fa,
.timeline .timeline-item .timeline-badge .glyphicon {
  top: 0px;
  left: 0px;
}

.timeline .timeline-item .timeline-badge.primary {
  background-color: #1f9eba;
}

.timeline .timeline-item .timeline-badge.info {
  background-color: #5bc0de;
}

.timeline .timeline-item .timeline-badge.success {
  background-color: #3aa95a;
  display: flex;
}

.timeline .timeline-item .timeline-badge.warning {
  background-color: #d1bd10;
}

.timeline .timeline-item .timeline-badge.danger {
  background-color: #ba1f1f;
}

.timeline .timeline-item .timeline-panel {
  position: relative;
  width: 46%;
  float: left;
  right: 16px;
  border: 1px solid #3aa95a;
  background: #ffffff;
  border-radius: 2px;
  padding: 20px;
  -webkit-box-shadow: 0 1px 6px rgba(0, 0, 0, 0.175);
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.175);
}

.timeline .timeline-item .timeline-panel:before {
  position: absolute;
  top: 26px;
  right: -16px;
  display: inline-block;
  border-top: 16px solid transparent;
  border-left: 16px solid #777777;
  border-right: 0 solid #777777;
  border-bottom: 16px solid transparent;
  content: " ";
}

.timeline .timeline-item .timeline-panel .timeline-title {
  margin-top: 0;
  color: inherit;
}

.timeline-horizontal {
  list-style: none;
  position: relative;
  padding: 20px 0px 20px 0px;
  display: inline-block;
}

.timeline-horizontal:before {
  height: 3px;
  top: auto;
  bottom: 26px;
  left: 56px;
  right: 0;
  width: 100%;
  margin-bottom: 20px;
}

.timeline-horizontal .timeline-item {
  display: table-cell;
  height: 220px;
  min-width: 260px;
  float: none !important;
  vertical-align: bottom;
}

.timeline-horizontal .timeline-item .timeline-panel {
  top: auto;
  bottom: 64px;
  display: inline-block;
  float: none !important;
  left: 0 !important;
  right: 0 !important;
  width: 70%;
  margin-bottom: 20px;
  border-radius: 30px;
}

.timeline-horizontal .timeline-item .timeline-panel:before {
  top: auto;
  bottom: -16px;
  left: 28px !important;
  right: auto;
  border-right: 16px solid transparent !important;
  border-top: 16px solid #777777 !important;
  border-bottom: 0 solid #777777 !important;
  border-left: 16px solid transparent !important;
}

.timeline-horizontal .timeline-item:before,
.timeline-horizontal .timeline-item:after {
  display: none;
}

.timeline-horizontal .timeline-item .timeline-badge {
  top: auto;
  bottom: 0px;
  left: 43px;
}

.v-btn {
  text-transform: capitalize;
}
</style>