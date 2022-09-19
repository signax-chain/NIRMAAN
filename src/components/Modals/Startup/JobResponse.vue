<template>
  <v-row justify="center">
    <v-dialog v-model="show" max-width="1000">
      <v-card>
        <v-card-title>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
            dense
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="show = false">Close</v-btn>
          <download-excel :data="data">
            <v-btn color="traktor" dark>Export data</v-btn>
          </download-excel>
        </v-card-title>
        <v-card-text class="mt-5">
          <v-data-table :headers="headers" :items="data" :search="search">
            <template v-slot:[`item.createdAt`]="{ item }">
              {{ formatDate(item.createdAt) }}
            </template>
            <template v-slot:[`item.resume`]="{ item }">
              <a :href="item.resume" target="_blank" v-if="item.resume">View</a>
              <span v-else>Not uploaded</span>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  name: "Responses",
  props: ["visible", "data"],
  computed: {
    show: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) this.$emit("close");
      },
    },
  },
  data() {
    return {
      search: "",
      headers: [
        {
          text: "Name",
          align: "start",
          sortable: true,
          value: "name",
        },
        { text: "Email", value: "email", align: "start", sortable: true },
        {
          text: "Contact",
          value: "contact",
          sortable: true,
          align: "start",
        },
        {
          text: "Resume",
          value: "resume",
          sortable: true,
          align: "start",
        },
        {
          text: "Timestamp",
          value: "createdAt",
          sortable: true,
          align: "start",
        },
      ],
    };
  },
  methods: {
    formatDate(timestamp) {
      return (
        timestamp.toDate().toDateString() +
        " at " +
        timestamp.toDate().toLocaleTimeString("en-in", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
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

.v-btn {
  text-transform: capitalize;
}

a {
  text-decoration: none;
}
</style>