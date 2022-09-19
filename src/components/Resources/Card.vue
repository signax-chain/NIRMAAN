<template>
  <div class="resource-card d-flex align-center justify-space-between pa-3">
    <v-icon color="traktor" style="font-size: 28px">{{
      types[resource.type]
    }}</v-icon>
    <h5>{{ resource.title }}</h5>
    <a :href="resource.file" download target="_blank">
      <v-btn icon>
        <v-icon>mdi-download</v-icon>
      </v-btn>
    </a>
  </div>
</template>

<script>
export default {
  props: ["resource"],
  data() {
    return {
      types: {
        "image/png": "mdi-image",
        "image/jpeg": "mdi-image",
        "image/jpg": "mdi-image",
        "image/gif": "mdi-image",
        "image/svg+xml": "mdi-image",
        "application/pdf": "mdi-file-pdf",
        "audio/mpeg": "mdi-file-music",
        "video/mp4": "mdi-file-video",
        "video/mpeg": "mdi-file-video",
        "video/webm": "mdi-file-video",
        "video/ogg": "mdi-file-video",
        "image/webp": "mdi-image",
        "application/msword": "mdi-file-word",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          "mdi-file-word",
        "application/vnd.ms-excel": "mdi-file-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
          "mdi-file-excel",
        "application/vnd.ms-powerpoint": "mdi-file-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation":
          "mdi-file-powerpoint",
        "application/vnd.oasis.opendocument.text": "mdi-file-word",
        "application/vnd.oasis.opendocument.spreadsheet": "mdi-file-excel",
        "application/vnd.oasis.opendocument.presentation":
          "mdi-file-powerpoint",
        "application/vnd.oasis.opendocument.graphics": "mdi-file-image",
        "text/csv": "mdi-file-csv",
      },
    };
  },
};
</script>

<style scoped>
.resource-card {
  border: 1px solid #dbdbdb;
  border-radius: 5px;
  width: 230px;
}

a {
  text-decoration: none !important;
}
</style>