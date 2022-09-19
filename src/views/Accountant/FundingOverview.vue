<template>
  <div class="funding-row mx-5">
    <funding-card
      v-for="(funding, index) in fundingStats"
      :key="index"
      :funding="funding"
      :width="`${currentUser.role === 'accountant' ? '46' : '24'}`"
    ></funding-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
import FundingCard from "../../components/Startup/Cards/FundingCard.vue";
import { fundingsRef, startupsRef } from "../../config/firebase_services";
import { getExternalFundingByStartup } from "../../services/Fundings";
export default {
  components: { FundingCard },
  computed: {
    ...mapState({ currentUser: (state) => state.user.currentUser }),
  },
  created() {
    this.getFundingStats();
  },
  data() {
    return {
      fundingStats: [
        {
          title: "Funding Disbursed",
          icon: "funding-disbursed.svg",
          count: 0,
        },
        {
          title: "Funding Utilized",
          icon: "funding-utilized.svg",
          count: 0,
        },
        {
          title: "Balance",
          icon: "funding-disbursed.svg",
          count: 0,
        },
        {
          title: "External Funding",
          icon: "funding-external.svg",
          count: 0,
        },
      ],
    };
  },
  methods: {
    getFundingStats() {
      fundingsRef
        .where("startup", "==", this.$route.params.id)
        .onSnapshot(async (snapshot) => {
          let fundingReceived = 0;
          let fundingUtilized = 0;

          snapshot.forEach((document) => {
            const data = document.data();

            if (data.type === "received") {
              fundingReceived += +data.amount;
            }

            if (data.type === "utilized") {
              fundingUtilized += +data.amount;
            }
          });

          this.fundingStats[0].count = fundingReceived;
          this.fundingStats[1].count = fundingUtilized;

          const document = await startupsRef.doc(this.$route.params.id).get();
          const funding = document.data().funding;

          if (
            funding.received !== undefined &&
            funding.received !== null &&
            funding.received !== "" &&
            funding.received !== 0
          )
            this.fundingStats[0].count =
              fundingReceived +
              parseFloat(funding.received.toString().split(",").join(""));

          if (
            funding.utilized !== undefined &&
            funding.utilized !== null &&
            funding.utilized !== "" &&
            funding.utilized !== 0
          )
            this.fundingStats[1].count =
              fundingUtilized +
              parseFloat(funding.utilized.toString().split(",").join(""));

          this.fundingStats[2].count =
            this.fundingStats[0].count - this.fundingStats[1].count;

          const awardsMoney = await getExternalFundingByStartup(
            this.$route.params.id
          );
          if (
            funding.external !== undefined &&
            funding.external !== null &&
            funding.external !== "" &&
            funding.external !== 0
          ) {
            this.fundingStats[3].count = parseFloat(
              funding.external.toString().split(",").join("")
            );
          }
          this.fundingStats[3].count += awardsMoney;
        });
    },
  },
};
</script>

<style scoped>
.funding-row {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
}
</style>