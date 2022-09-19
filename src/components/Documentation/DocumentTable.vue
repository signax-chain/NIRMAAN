<template>
  <v-simple-table>
    <template v-slot:default>
      <tbody>
        <tr v-for="(document, index) in templates" :key="index">
          <td>
            <v-icon color="#DBDBDB" size="32" class="mr-4"
              >mdi-file-document-multiple-outline</v-icon
            ><span class="title">{{ document.title }}</span>
          </td>
          <td>
            <span class="uploadedAt">
              {{
                document.file === "" ? "Not yet uploaded" : document.uploadedAt
              }}
            </span>
          </td>
          <td>
            <v-btn icon>
              <!-- <v-icon color="#C9C9C9">mdi-dots-vertical</v-icon> -->
            </v-btn>
          </td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
import documents from "../../mixins/documents";

export default {
  name: "DocumentTable",
  mixins: [documents],
};
</script>

<style scoped>
.title {
  color: #3aa959;
  font-size: 16px !important;
}

.uploadedAt {
  color: #b0b0b0;
  font-size: 16px;
}

@media only screen and (max-width: 600px) {
  td {
    font-size: 12px;
  }
}
</style>