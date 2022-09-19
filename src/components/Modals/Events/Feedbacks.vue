
<template>
  <v-row justify="center">
    <v-dialog v-model="feedbackEventModal.isShowing" max-width="1100">
      <v-card>
        <v-card-title>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="feedbackEventModal.data"
          :search="search"
        >
          <template
            v-for="(col, i) in averageLabels"
            v-slot:[`header.${i}`]="{ header }"
          >
            <div style="display: inline-block; padding: 16px 0" :key="i">
              {{ header.text }}
            </div>
            <v-badge
              color="red"
              content="6"
              :key="col"
              v-model="averageLabels[header.value]"
            >
            </v-badge>
          </template>
          <template v-slot:[`item.topicRating`]="{ item }">
            <v-rating
              color="yellow darken-3"
              background-color="grey darken-1"
              empty-icon="$ratingFull"
              half-increments
              small
              readonly
              v-model="item.topicRating"
            >
            </v-rating>
          </template>
          <template v-slot:[`item.speakerRating`]="{ item }">
            <v-rating
              color="yellow darken-3"
              background-color="grey darken-1"
              empty-icon="$ratingFull"
              half-increments
              small
              readonly
              v-model="item.speakerRating"
            >
            </v-rating>
          </template>
          <template v-slot:[`item.overallRating`]="{ item }">
            <v-rating
              color="yellow darken-3"
              background-color="grey darken-1"
              empty-icon="$ratingFull"
              half-increments
              small
              readonly
              v-model="item.overallRating"
            >
            </v-rating>
          </template>
        </v-data-table>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Feedbacks",
  computed: {
    ...mapState({
      feedbackEventModal: (state) => state.modals.feedbackEventModal,
    }),
  },
  mounted() {
    this.calculateAvg();
  },
  data() {
    return {
      search: "",
      averageLabels: ["topicRating", "speakerRating", "overallRating"],
      averageValues: [],
      headers: [
        {
          text: "Name",
          align: "center",
          sortable: true,
          value: "name",
        },
        {
          text: "Where",
          value: "where",
          align: "center",
          sortable: true,
        },
        {
          text: "Topic rating",
          value: "topicRating",
          sortable: true,
          align: "center",
          average: (value) => {
            return this.averageLabels[value]
          }
        },
        {
          text: "Speaker rating",
          value: "speakerRating",
          sortable: true,
          align: "center",
        },
        {
          text: "Overall rating",
          value: "overallRating",
          sortable: true,
          align: "center",
        },

        { text: "Suggestions", value: "suggestions", sortable: true },
        {
          text: "Timestamp",
          value: "createdAt",
          sortable: true,
          align: "center",
        },
      ],
    };
  },
  methods: {
    calculateAvg() {
      for (let i = 0; i < this.averageLabels.length; i++) {
        this.averageValues[i] = this.feedbackEventModal.data.map(
          (dt) => dt[this.averageLabels[i]]
        );
        // .reduce((a, b) => a + b, 0) / arrLength;
      }
    },
  },
};
</script>

<style scoped>
>>> th {
  color: #3aa95a !important;
  font-size: 16px !important;
  font-weight: bold !important;
}

>>> td {
  font-size: 12px !important;
}
</style>