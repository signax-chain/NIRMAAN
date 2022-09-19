<template>
  <v-card>
    <v-card-title>Notifications</v-card-title>
    <v-card-text>
      <v-list two-line>
        <v-list-item-group multiple>
          <template v-for="(item, index) in notifications">
            <v-list-item :key="item.id">
              <template>
                <v-list-item-content>
                  <!-- <v-list-item-title
                    v-text="item.mentor.name"
                  ></v-list-item-title> -->

                  <v-list-item-subtitle
                    class="text--primary"
                    v-text="item.statement"
                  ></v-list-item-subtitle>

                  <!-- <v-list-item-subtitle
                    v-text="item.subtitle"
                  ></v-list-item-subtitle> -->
                </v-list-item-content>

                <v-list-item-action>
                  <!-- <v-list-item-action-text
                    v-text="item.action"
                  ></v-list-item-action-text> -->
                  <v-btn color="traktor" dark @click="scheduleSession(item)"
                    >Schedule session</v-btn
                  >
                </v-list-item-action>
              </template>
            </v-list-item>

            <v-divider
              v-if="index < notifications.length - 1"
              :key="index"
            ></v-divider>
          </template>
        </v-list-item-group>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "MentorshipNotifications",
  props: ['notifications'],
  data() {
    return {
    };
  },
  methods: {
    scheduleSession(item) {
      this.$router.push({
        name: "ScheduleSession",
        params: {
          item: { startup: item.startup.name, mentor: item.mentor.name },
        },
      });
    },
  },
};
</script>

<style scoped>
>>> .v-list-item__content {
  width: 450px !important;
}

>>> .v-list-item__subtitle {
  white-space: break-spaces !important;
}
</style>