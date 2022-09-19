<template>
  <v-container>
    <v-breadcrumbs :items="crumbs"></v-breadcrumbs>
    <h3 class="heading">Incubators</h3>
    <div class="wrapper mx-5">
      <h3 class="heading ml-0">All Incubators</h3>
      <div class="d-flex justify-space-between">
        <div class="d-flex">
          <v-text-field
            outlined
            dense
            label="Search for incubators"
            class="mr-2"
            append-icon="mdi-magnify"
          ></v-text-field>
          <v-select outlined dense label="Select Region"></v-select>
        </div>
        <div>
          <v-btn dark color="traktor" @click="addNewIncubatorDialog = true"
            >Add new Incubator</v-btn
          >
        </div>
      </div>
      <v-data-table
        :headers="headers"
        :items="items"
        :items-per-page="5"
        mobile-breakpoint="0"
      >
        <template v-slot:[`item.photoURL`]="{ item }">
          <v-img
            :src="item.photoURL"
            :aspect-ratio="1"
            class="mr-4"
            @click="view()"
          ></v-img>
        </template>
        <template v-slot:[`item.actions`]="{}">
          <v-btn icon>
            <v-icon color="#b0b0b0">mdi-web</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon color="#b0b0b0">mdi-phone</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon color="#b0b0b0">mdi-email</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </div>
    <incubator-form
      :visible="addNewIncubatorDialog"
      @close="addNewIncubatorDialog = false"
    ></incubator-form>
  </v-container>
</template>

<script>
import IncubatorForm from "../../components/Modals/Incubator/Form.vue";
export default {
  components: {
    IncubatorForm,
  },
  data() {
    return {
      addNewIncubatorDialog: false,
      headers: [
        {
          text: "",
          value: "photoURL",
          sortable: true,
          align: "center",
        },
        {
          text: "Name",
          value: "name",
          sortable: true,
          align: "center",
        },
        {
          text: "Branch",
          value: "branch",
          sortable: true,
          align: "center",
        },
        {
          text: "Region",
          value: "region",
          sortable: true,
          align: "center",
        },
        {
          text: "Lead",
          value: "lead",
          sortable: true,
          align: "center",
        },
        {
          text: "Actions",
          value: "actions",
          align: "center",
        },
      ],
      items: [
        {
          photoURL:
            "https://firebasestorage.googleapis.com/v0/b/ims-traktor.appspot.com/o/Logos%2Fincubator%2Fnain.png?alt=media&token=0b3a96ae-6927-4a18-b469-9b755cab8ac0",
          name: "NAIN Center",
          branch: "Sahyadri",
          region: "Mangalore",
          lead: "Gouse Khan",
        },
        {
          photoURL:
            "https://firebasestorage.googleapis.com/v0/b/ims-traktor.appspot.com/o/Logos%2Fincubator%2Fnain.png?alt=media&token=0b3a96ae-6927-4a18-b469-9b755cab8ac0",
          name: "NAIN Center",
          branch: "Sahyadri",
          region: "Mangalore",
          lead: "Gouse Khan",
        },
        {
          photoURL:
            "https://firebasestorage.googleapis.com/v0/b/ims-traktor.appspot.com/o/Logos%2Fincubator%2Fnain.png?alt=media&token=0b3a96ae-6927-4a18-b469-9b755cab8ac0",
          name: "NAIN Center",
          branch: "Sahyadri",
          region: "Mangalore",
          lead: "Gouse Khan",
        },
        {
          photoURL:
            "https://firebasestorage.googleapis.com/v0/b/ims-traktor.appspot.com/o/Logos%2Fincubator%2Fnain.png?alt=media&token=0b3a96ae-6927-4a18-b469-9b755cab8ac0",
          name: "NAIN Center",
          branch: "Sahyadri",
          region: "Mangalore",
          lead: "Gouse Khan",
        },
        {
          photoURL:
            "https://firebasestorage.googleapis.com/v0/b/ims-traktor.appspot.com/o/Logos%2Fincubator%2Fnain.png?alt=media&token=0b3a96ae-6927-4a18-b469-9b755cab8ac0",
          name: "NAIN Center",
          branch: "Sahyadri",
          region: "Mangalore",
          lead: "Gouse Khan",
        },
      ],
      crumbs: [
        {
          text: "Dashboard",
          disabled: true,
        },
        {
          text: "Incubators",
          disabled: true,
        },
      ],
    };
  },
  methods: {
    view() {
      const id = "VN4yZS32Br4Xat1yPKcNiT";
      this.$router.push(`/incubator/${id}`);
    },
  },
};
</script>

<style scoped>
>>> th {
  color: #3aa95a !important;
  font-size: 14px !important;
}

.heading {
  color: #4d4d4d;
  margin: 0 1rem 1rem 1.5rem;
  font-weight: 500;
}

.wrapper {
  background-color: #fff;
  border: 1px solid #dbdbdb;
  border-radius: 5px;
  padding: 1rem;
}

img {
  cursor: pointer;
}
</style>