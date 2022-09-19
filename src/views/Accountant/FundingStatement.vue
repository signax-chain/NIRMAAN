<template>
  <div>
    <div class="wrapper mx-5">
      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th>Type</th>
              <th class="text-left">Amount</th>
              <th class="text-left">status</th>
              <th class="text-left">Purpose</th>
              <th class="text-left">Date</th>
              <th class="text-left">Ref Number</th>
              <th class="text-left">Document</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(funding, i) in fundings" :key="i">
              <td>{{ getStatus(funding) }}</td>
              <td>Rs. {{ funding.amount }}</td>
              <td>{{ getType(funding.type) }}</td>
              <td>{{ funding.purpose }}</td>
              <td>{{ funding.date }}</td>
              <td>{{ funding.reference_number }}</td>
              <td>
                <a
                  :href="funding.document"
                  target="_blank"
                  rel="noopener noreferrer"
                  v-if="funding.document"
                >
                  <v-icon>mdi-file-pdf</v-icon>
                </a>
                <span v-else>-</span>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </div>
    <v-alert border="left" colored-border type="info" class="mt-4 mx-5">
      Balance Remaining: Rs. {{ balance }}
    </v-alert>
  </div>
</template>

<script>
import { fundingsRef, startupsRef } from "../../config/firebase_services";
export default {
  data() {
    return {
      fundings: [],
      balance: 0,
    };
  },
  created() {
    this.getFundings();
  },
  methods: {
    getType(type) {
      return type === "received"
        ? "credit"
        : type === "utilized"
        ? "debit"
        : "broad forwarded";
    },
    getStatus(funding) {
      return funding.status === undefined
        ? funding.type === "received"
          ? "Funding Received"
          : "Funding Utilized"
        : "Brought Forward";
    },
    async getFundings() {
      const documents = await fundingsRef
        .where("startup", "==", this.$route.params.id)
        .orderBy("created_at", "asc")
        .get();
      documents.forEach((doc) => {
        this.fundings.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      this.getOtherFundings();
      this.fundings.reverse();
    },
    calculateBalance() {
      this.fundings.forEach((funding) => {
        if (funding.type === "received") {
          this.balance += +funding.amount.toString().split(",").join("");
          funding.balance = this.balance;
        } else if (funding.type === "utilized") {
          this.balance -= +funding.amount.toString().split(",").join("");
          funding.balance = this.balance;
        }
      });
    },
    async getOtherFundings() {
      const document = await startupsRef.doc(this.$route.params.id).get();
      const funding = document.data().funding;

      if (funding.received) {
        this.fundings.push({
          status: "brought_forward",
          id: "-",
          amount: funding.received,
          date: "-",
          type: "received",
          purpose: "-",
          reference_number: "-",
          document: "",
        });
      }

      if (funding.utilized) {
        this.fundings.push({
          status: "brought_forward",
          id: "-",
          amount: funding.utilized,
          date: "-",
          type: "utilized",
          purpose: "-",
          reference_number: "-",
          document: "",
        });
      }
      this.calculateBalance();
    },
  },
};
</script>

<style scoped>
a {
  text-decoration: none;
}

>>> th {
  color: #3aa959 !important;
  font-size: 16px !important;
}
</style>