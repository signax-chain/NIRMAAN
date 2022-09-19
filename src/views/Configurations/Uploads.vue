<template>
  <v-container>
    <v-breadcrumbs :items="crumbs"></v-breadcrumbs>
    <h3 class="heading">Resources</h3>
    <div class="wrapper mx-5">
      <h3 class="heading ml-0">All Resources</h3>
      <documentation-templates />
    </div>
  </v-container>
</template>

<script>
import DocumentationTemplates from "@/components/Uploads/DocumentationTemplates";

export default {
  name: "Uploads",
  components: {
    DocumentationTemplates,
  },
  data() {
    return {
      crumbs: [
        {
          text: "Dashboard",
          disabled: true,
        },
        {
          text: "Resources",
          disabled: true,
        },
        {
          text: "All Resources",
          disabled: true,
        },
      ],
    };
  },
};
</script>

<style scoped>
.heading {
  color: #4d4d4d;
  margin: 0 1rem 1rem 1.5rem;
  font-weight: 500;
}

.wrapper {
  background-color: #fff;
  border: 1px solid #dbdbdb;
  border-radius: 5px;
  padding: 1rem 1rem 2rem 1rem;
}

@media only screen and (max-width: 600px) {
  .wrapper {
    margin-top: 5%;
  }
}
</style>