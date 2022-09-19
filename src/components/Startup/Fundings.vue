<template>
  <v-container>
    <div class="d-flex">
      <h2>Funding</h2>
      <v-spacer></v-spacer>
      <v-btn
        icon
        color="traktor"
        dark
        class="float-right"
        @click="fundingDialog = true"
        v-show="currentUser.role === 'incubator'"
        ><v-icon>mdi-pencil</v-icon> Edit</v-btn
      >
    </div>
    <div class="funding__row">
      <div class="funding__col">
        <h1>Rs.{{ funding.received.toLocaleString() }}</h1>
        <span>Funding Received</span>
      </div>
      <div class="funding__col">
        <h1>Rs.{{ funding.utilized.toLocaleString() }}</h1>
        <span>Funding Utilized</span>
      </div>
      <div class="funding__col">
        <h1>Rs.{{ funding.external.toLocaleString() }}</h1>
        <span>External Funding</span>
      </div>
    </div>
    <funding
      :visible="fundingDialog"
      :funding="funding"
      @close="fundingDialog = false"
      @updateFunding="update"
    ></funding>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import { startupsRef } from "../../config/firebase_services";
import Funding from "../Modals/Startup/Funding.vue";

export default {
  components: { Funding },
  name: "Fundings",
  data() {
    return {
      funding: {
        received: 0,
        utilized: 0,
        external: 0,
      },
      startupId: "",
      awards: [],
      fundingDialog: false,
    };
  },
  computed: {
    ...mapState({ currentUser: (state) => state.user.currentUser }),
  },
  created() {
    this.startupId =
      this.$route.params.id !== undefined
        ? this.$route.params.id
        : this.$store.state.user.currentUser.docId;

    startupsRef.doc(this.startupId).onSnapshot((snapshot) => {
      const data = snapshot.data();
      this.awards = data.awards === undefined ? [] : data.awards;
      this.funding =
        data.funding === undefined
          ? (this.funding = {
              received: 0,
              utilized: 0,
              external: 0,
            })
          : data.funding;
      this.getTotal();
    });
  },
  methods: {
    getTotal() {
      const amounts = this.awards.map((award) => award.money);
      if (amounts.length === 0) return;
      let filteredAmount = [];
      amounts.forEach((amount) => {
        if (amount !== "") filteredAmount.push(amount.replace(/[^0-9]/g, ""));
      });
      this.funding.external = filteredAmount.reduce(
        (ac, amt) => parseInt(ac) + parseInt(amt)
      );
    },
    async update() {
      try {
        await startupsRef
          .doc(this.startupId)
          .set({ funding: this.funding }, { merge: true });
        this.$toast.success("Updated", {
          position: "top",
        });
        this.fundingDialog = false;
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
.funding__row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  flex-wrap: wrap;
}

h1 {
  color: #3aa959;
}

@media only screen and (max-width: 600px) {
  .funding__col {
    width: 100%;
    margin-bottom: 15px;
  }
}
</style>