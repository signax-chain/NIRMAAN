<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="12">
        <List />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import List from "@/components/Incubator/Mentors";

export default {
  name: "Mentors",
  components: {
    List,
  },
};
</script>