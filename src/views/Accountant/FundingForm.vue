<template>
  <div>
    <v-breadcrumbs
      :items="crumbs"
      v-if="currentUser.role === 'accountant'"
    ></v-breadcrumbs>
    <h3 class="heading" v-if="currentUser.role === 'accountant'">
      Funding Form
    </h3>
    <div class="wrapper mx-5">
      <v-form ref="form">
        <v-autocomplete
          label="Select Startup"
          outlined
          v-model="funding.startup"
          :items="startups"
          item-text="name"
          item-value="id"
          :rules="[rules.required]"
        >
          <template v-slot:selection="{ item }">
            <div class="d-flex align-center">
              <img :src="item.photoURL" :alt="item.name" class="logo" />
              <span class="ml-2">{{ item.name }}</span>
            </div>
          </template>
          <template v-slot:item="{ item }">
            <div class="d-flex align-center">
              <img :src="item.photoURL" :alt="item.name" class="logo" />
              <span class="ml-2">{{ item.name }}</span>
            </div>
          </template>
        </v-autocomplete>
        <v-select
          label="Select Funding Type"
          outlined
          v-model="funding.type"
          :items="fundingTypes"
          item-text="text"
          item-value="value"
          :rules="[rules.required]"
        >
        </v-select>
        <v-text-field
          label="Amount"
          outlined
          v-model="funding.amount"
          :rules="[rules.required, rules.number]"
          @keypress="readOnlyNumbers"
        ></v-text-field>
        <v-text-field
          label="Purpose"
          outlined
          v-model="funding.purpose"
          :rules="[rules.required]"
        ></v-text-field>
        <v-textarea
          label="Description"
          outlined
          v-model="funding.description"
        ></v-textarea>
        <v-dialog
          ref="dialog"
          v-model="modal"
          :return-value.sync="date"
          persistent
          width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="dateFormatted"
              label="Funding date"
              readonly
              v-bind="attrs"
              v-on="on"
              outlined
              @blur="date = parseDate(dateFormatted)"
              :rules="[rules.required]"
            ></v-text-field>
          </template>
          <v-date-picker v-model="date" scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="traktor" @click="modal = false"> Cancel </v-btn>
            <v-btn text color="traktor" @click="$refs.dialog.save(date)">
              OK
            </v-btn>
          </v-date-picker>
        </v-dialog>
        <v-text-field
          label="Reference Number"
          outlined
          v-model="funding.reference_number"
        ></v-text-field>
        <v-file-input
          label="Upload document(if any)"
          outlined
          v-model="funding.document"
        ></v-file-input>
        <v-btn color="" disabled class="d-block mx-auto" large v-if="isLoading"
          >Loading...</v-btn
        >
        <v-btn
          color="traktor"
          @click="submit"
          dark
          class="d-block mx-auto"
          large
          v-else
        >
          Submit
        </v-btn>
      </v-form>
    </div>
  </div>
</template>

<script>
import { getStartupsByIncubatorId } from "../../services/Startups";
import rules from "../../mixins/rules";
import { fundingsRef } from "../../config/firebase_services";
import { uploadFileWithName } from "../../_helpers/FileUpload";
import { mapState } from "vuex";

export default {
  name: "FundingForm",
  props: ["item"],
  mixins: [rules],
  data(vm) {
    return {
      crumbs: [
        {
          text: "Funding",
          disabled: true,
        },
        {
          text: "Funding Form",
          disabled: true,
        },
      ],
      isLoading: false,
      incubatorId: "",
      modal: false,
      startups: [],
      funding: {
        startup: "",
        amount: "",
        purpose: "",
        type: "",
        description: "",
        date: "",
        reference_number: "",
        document: "",
        created_at: "",
      },
      date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      dateFormatted: vm.formatDate(
        new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .substr(0, 10)
      ),
      fundingTypes: [
        {
          text: "Funding Disbursed",
          value: "received",
        },
        {
          text: "Funding Utilized",
          value: "utilized",
        },
      ],
    };
  },
  created() {
    this.getStartups();
  },
  computed: {
    computedDateFormatted() {
      return this.formatDate(this.date);
    },
    ...mapState({
      currentUser: (state) => state.user.currentUser,
    }),
  },
  mounted() {
    if (this.$route.params.item) {
      this.funding.startup = this.$route.params.item;
    }
  },
  watch: {
    date(val) {
      console.log(val);
      this.dateFormatted = this.formatDate(this.date);
    },
  },
  methods: {
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    },
    parseDate(date) {
      if (!date) return null;

      const [day, month, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },
    async getStartups() {
      this.incubatorId = this.$store.state.incubator.currentIncubator.docId;
      const data = await getStartupsByIncubatorId(this.incubatorId);
      data.forEach((startup) => {
        this.startups.push({
          id: startup.docId,
          name: startup.name,
          photoURL: startup.photoURL,
        });
      });
    },
    async submit() {
      if (this.$refs.form.validate()) {
        try {
          this.isLoading = true;
          this.funding.date = this.dateFormatted;
          this.funding.created_at = new Date();
          this.funding.incubatorId = this.incubatorId;
          if (typeof this.funding.document === "object") {
            this.funding.document = await uploadFileWithName(
              this.funding.document,
              "funding"
            );
          }

          await fundingsRef.add(this.funding);
          this.$toast.success("Funding created", {
            position: "top",
          });
          // this.funding = {
          //   startup: "",
          //   amount: "",
          //   purpose: "",
          //   description: "",
          //   reference_number: "",
          //   document: "",
          //   created_at: "",
          // };
          this.isLoading = false;
          this.$router.push(`/startups/${this.funding.startup}/funding`);
        } catch (error) {
          this.$toast.error(error, {
            position: "top",
          });
          this.isLoading = false;
        }
      }
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

.logo {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
</style>