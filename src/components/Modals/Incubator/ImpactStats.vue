<template>
  <v-dialog v-model="show" width="500">
    <v-card>
      <v-card-title class="heading">
        {{ collection }}
        <v-spacer></v-spacer>
        <v-btn icon @click.native="show = false" color="red">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-text-field
          :label="collection"
          outlined
          dense
          v-model="count"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="traktor" dark @click="save()">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { impactStatsRef } from "../../../config/firebase_services";
export default {
  props: ["visible", "collection", "count"],
  data() {
    return {
      collectionMap: {
        "Jobs Created": "jobsCreated",
        "IPs Created": "ipsCreated",
        "Revenue Generated": "revenueGenerated",
        "Startup Valuation": "startupValuation",
      },
      // impact: 0,
    };
  },
  computed: {
    show: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) {
          return this.$emit("close");
        }
      },
    },
  },
  methods: {
    async save() {
      const collection = this.collectionMap[this.collection];
      try {
        await impactStatsRef
          .doc(this.$store.state.incubator.currentIncubator.docId)
          .set({ [collection]: this.count }, { merge: true });
        this.$toast.success("Saved", {
          position: "top",
        });

        this.$emit("close");
      } catch (error) {
        this.$toast.error(error, {
          position: "top",
        });
      }
    },
  },
};
</script>

<style>
</style>