<template>
  <div>
    <v-row>
      <v-col cols="12" md="8">
        <v-text-field
          outlined
          label="Enter keywork"
          dense
          v-model="keyword"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="4">
        <v-btn outlined color="primary" @click="search">Search</v-btn>
      </v-col>
    </v-row>
    <div>
      <v-list subheader>
        <v-list-item
          v-for="(news, index) in data.rss.channel.item"
          :key="index"
        >
          <v-list-item-content>
            <v-list-item-title>
              <a :href="news.link._text" target="_blank">
                {{ news.title._text }}
              </a>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      data: {
        rss: {
          channel: {
            item: [],
          },
        },
      },
      keyword: "",
    };
  },
  methods: {
    async search() {
      try {
        const response = await axios.get(
          `http://localhost:5001/search?keyword=${this.keyword}`
        );
        this.data = JSON.parse(response.data);
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style>
</style>