<template>
  <v-dialog v-model="show" persistent width="600">
    <v-form ref="form">
      <v-card>
        <v-card-title
          >Add Mentor hours
          <v-spacer></v-spacer>
          <v-btn color="red" icon @click="show = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="mt-5">
          <v-row>
            <v-col cols="12" md="6">
              <v-autocomplete
                outlined
                dense
                label="Select Startup"
                v-model="data.startup"
                return-object
                item-text="name"
                :rules="rule"
                :items="startups"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" md="6">
              <v-autocomplete
                outlined
                dense
                label="Select Mentor"
                v-model="data.mentor"
                return-object
                item-text="name"
                :rules="rule"
                :items="mentors"
              ></v-autocomplete>
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
                    v-model="data.date"
                    label="Select date"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    outlined
                    dense
                  ></v-text-field>
                </template>
                <v-date-picker v-model="data.date" scrollable>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="modal = false"
                    >Cancel</v-btn
                  >
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.dialog1.save(data.date)"
                    >OK</v-btn
                  >
                </v-date-picker>
              </v-dialog>
            </v-col>
            <v-col cols="12" md="6">
              <v-dialog
                ref="dialog2"
                v-model="modal2"
                :return-value.sync="data.time"
                persistent
                width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="data.time"
                    label="Select time"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    outlined
                    dense
                  ></v-text-field>
                </template>
                <v-time-picker v-if="modal2" v-model="data.time" full-width>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="modal2 = false"
                    >Cancel</v-btn
                  >
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.dialog2.save(data.time)"
                    >OK</v-btn
                  >
                </v-time-picker>
              </v-dialog>
            </v-col>
            <v-col cols="12" md="3">
              <v-autocomplete
                label="hour"
                suffix="hr"
                outlined
                dense
                :items="hours"
                v-model="hour"
                :rules="rule"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" md="3">
              <v-autocomplete
                label="Min"
                suffix="m"
                outlined
                dense
                :items="minutes"
                v-model="min"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" md="12">
              <v-textarea
                label="Other details"
                outlined
                dense
                v-model="data.description"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="traktor" dark @click="submit()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { getStartupsByIncubatorId } from "../../../services/Startups";
import { getMentorsByIncubatorId } from "../../../services/Mentors";
import { mentorshipRef } from "../../../config/firebase_services";

export default {
  props: ["visible"],
  computed: {
    show: {
      get() {
        return this.visible;
      },
      set(val) {
        if (!val) return this.$emit("close");
      },
    },
  },
  created() {
    this.initialize();
  },
  data() {
    return {
      rule: [(v) => !!v || "Required"],
      modal: false,
      modal2: false,
      data: {
        startup: null,
        mentor: null,
        date: null,
        time: null,
        datetime: null,
        document: null,
        description: "",
        incubator: null,
        status: "Completed",
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
        createdAt: new Date(),
        mentorHours: 0,
      },
      hours: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
      minutes: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55],
      hour: "0",
      min: 30,
      startups: [],
      mentors: [],
    };
  },
  methods: {
    async initialize() {
      const currentIncubator = await this.$store.state.incubator
        .currentIncubator;
      this.data.incubator = {
        name: currentIncubator.name,
        docId: currentIncubator.docId,
      };
      this.startups = await getStartupsByIncubatorId(this.data.incubator.docId);
      this.startups = this.startups.map((startup) => {
        return { name: startup.name, id: startup.docId };
      });
      this.mentors = await getMentorsByIncubatorId(this.data.incubator.docId);
      this.mentors = this.mentors.map((mentor) => {
        return { name: mentor.name, id: mentor.docId };
      });
    },
    async submit() {
      if (this.$refs.form.validate()) {
        this.data.mentorHours = +this.hour * 60 + +this.min;
        if (this.data.date && this.data.time) {
          this.data.datetime = new Date(this.data.date + " " + this.data.time);
        }
        
        try {
          await mentorshipRef.add(this.data);
          this.$toast.success("Saved", {
            position: "top",
          });
          this.data.startup = null;
          this.data.mentor = null;
          this.hour = 1;
          this.min = 0;
          this.data.mentorHours = 0;
          this.data.description = null;
          this.$emit("close");
        } catch (error) {
          this.$toast.error(error, {
            position: "top",
          });
        }
      }
    },
  },
};
</script>

<style scoped>
</style>