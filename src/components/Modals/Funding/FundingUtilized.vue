<template>
  <v-dialog v-model="show" width="600">
    <v-card>
      <v-card-title class="title"
        >Funding Utilized
        <v-spacer></v-spacer>
        <v-btn icon color="red" @click="show = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="mt-2">
        <v-form ref="form">
          <v-text-field
            v-model="funding.purpose"
            :rules="[rules.required]"
            label="Purpose"
            outlined
          ></v-text-field>
          <v-text-field
            v-model="funding.amount"
            :rules="[rules.required, rules.number]"
            label="Amount"
            outlined
            @keypress="readOnlyNumbers"
          ></v-text-field>
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
              <v-btn text color="traktor" @click="modal = false">
                Cancel
              </v-btn>
              <v-btn text color="traktor" @click="$refs.dialog.save(date)">
                OK
              </v-btn>
            </v-date-picker>
          </v-dialog>
          <v-file-input
            label="Upload document(if any)"
            outlined
            v-model="funding.document"
          ></v-file-input>
          <v-btn
            color=""
            disabled
            class="d-block mx-auto"
            large
            v-if="isLoading"
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
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import rules from "../../../mixins/rules";
import { fundingsRef } from "../../../config/firebase_services";
import { uploadFileWithName } from "../../../_helpers/FileUpload";
import firebase from "firebase";

export default {
  props: ["visible", "id"],
  mixins: [rules],
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
      computedDateFormatted() {
        return this.formatDate(this.date);
      },
    },
  },
  data(vm) {
    return {
      funding: {
        purpose: "",
        amount: "",
        date: "",
        document: "",
      },
      isLoading: false,
      date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      dateFormatted: vm.formatDate(
        new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .substr(0, 10)
      ),
    };
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
    async submit() {
      if (this.$refs.form.validate()) {
        try {
          this.isLoading = true;
          this.funding.date = this.dateFormatted;
          this.funding.created_at = new Date();
          if (typeof this.funding.document === "object") {
            this.funding.document = await uploadFileWithName(
              this.funding.document,
              "funding"
            );
          }

          await fundingsRef.doc(this.id).update({
            utilized: firebase.firestore.FieldValue.arrayUnion(this.funding),
          });
          this.$toast.success("Updated", {
            position: "top",
          });
          this.funding = {
            amount: "",
            purpose: "",
            document: "",
            created_at: "",
          };
          this.isLoading = false;
          this.$emit("close");
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
</style>