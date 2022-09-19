<template>
  <v-container>
    <v-card class="pa-5">
      <h1 class="text-center">Update availability</h1>
      <v-row class="mt-5">
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
                outlined
                v-model="date"
                label="Select date"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
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
                outlined
                v-model="time"
                label="Select time"
                prepend-icon="mdi-clock"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-time-picker v-if="modal2" v-model="time" full-width>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="modal2 = false">Cancel</v-btn>
              <v-btn text color="primary" @click="$refs.dialog2.save(time)"
                >OK</v-btn
              >
            </v-time-picker>
          </v-dialog>
        </v-col>
        <v-col cols="12" md="12">
          <v-textarea
            v-model="info"
            prepend-icon="mdi-comment"
            outlined
            label="Additional information to share?"
          >
          </v-textarea>
        </v-col>
        <v-btn color="traktor" class="white--text ml-10" @click="update()"
          >Send</v-btn
        >
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import {
  speakerAvailabilityRef,
  activityRef,
} from "../../../config/firebase_services";

export default {
  name: "UpdateAvailability",
  data() {
    return {
      date: new Date().toISOString().substr(0, 10),
      modal: false,
      modal2: false,
      time: null,
      info: null,
    };
  },
  methods: {
    async update() {
      await speakerAvailabilityRef.doc(this.$route.params.id).set(
        {
          availableDate: this.date,
          availableTime: this.time,
          additionalInfo: this.info,
        },
        { merge: true }
      );

      const snapshot = await speakerAvailabilityRef
        .doc(this.$route.params.id)
        .get();

      const data = snapshot.data();

      const activity = {
        incubatorId: data.incubatorId,
        statement: `Speaker ${data.speaker.name} updated their availability to ${this.date} at ${this.time}`,
        createdAt: new Date(),
        type: "mentor",
        photoURL: data.speaker.photoURL,
        notification: true,
        read: false,
      };

      await activityRef.add(activity);

      this.$toast.success("Updated", {
        position: "top",
      });

      this.date = null;
      this.time = null;
      this.info = null;
    },
  },
};
</script>

<style scoped>
.v-btn {
  font-weight: bold;
}
</style>