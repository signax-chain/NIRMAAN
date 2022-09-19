<template>
  <v-dialog v-model="show" persistent max-width="500">
    <v-form ref="form">
      <v-card>
        <v-card-title class="heading">Reason</v-card-title>
        <v-card-text>
          <v-autocomplete
            label="Reason"
            outlined
            v-model="reason"
            :rules="rule"
            :items="
              status === 'droppedout' ? droppedOutReasons : graduatedReasons
            "
            @change="handleReason"
          ></v-autocomplete>
          <v-text-field
            label="Please mention"
            v-model="otherReason"
            v-show="other"
            outlined
          ></v-text-field>
          <v-textarea
            label="Description"
            outlined
            v-model="description"
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="show = false">Close</v-btn>
          <v-btn color="traktor" dark @click="validate()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
export default {
  name: "StatusReason",
  props: ["visible", "status"],
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
      droppedOutReasons: [
        "Academic load",
        "Lost interest",
        "Unable to form team",
        "Idea not viable",
        "Prefer placements",
        "Other reason",
      ],
      graduatedReasons: ["Remarks"],
      reason: null,
      description: null,
      rule: [(v) => !!v || "Reason cannot be empty"],
      other: false,
      otherReason: null,
    };
  },
  methods: {
    validate() {
      if (this.$refs.form.validate()) {
        if (this.other) this.reason = this.otherReason;
        this.$emit("save", this.reason, this.description);
      }
    },
    handleReason(reason) {
      if (reason === "Other reason") this.other = true;
      else this.other = false;
    },
  },
};
</script>

<style>
</style>