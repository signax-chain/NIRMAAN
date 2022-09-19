<template>
  <v-row>
    <v-col cols="12" md="4" v-for="(video, index) in videos" :key="index">
      <v-card class="pa-2" elevation="5">
        <iframe
          :src="`http://www.youtube.com/embed/${video.id.videoId}`"
        ></iframe>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import axios from "axios";
const YOUTUBE_API_KEY = "AIzaSyADccscTThpecA2p4bPkYzo9zC6xSxrfOs";
const CHANNEL_ID = "UCqXpedHH46Y5_x-7MNY6nCw";
const URL = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=20`;

export default {
  name: "Youtube",
  data() {
    return {
      videos: [],
    };
  },
  created() {
    this.getVideos();
  },
  methods: {
    async getVideos() {
      try {
        const response = await axios.get(URL);
        this.videos = response.data.items;
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