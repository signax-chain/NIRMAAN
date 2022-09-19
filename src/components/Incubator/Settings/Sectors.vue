<template>
  <section>
    <div>
      <h3 class="heading d-flex justify-space-between">
        Sectors
        <v-btn color="traktor" outlined @click="isEdit = true">Add new</v-btn>
      </h3>
      <!-- <v-textarea
      v-model="sectors"
      label="Sector"
      :rules="[(v) => !!v || 'Sector is required']"
      required
      outlined
      v-if="isEdit"
    ></v-textarea> -->
      <ol class="d-flex justify-space-between">
        <li v-for="(sector, index) in sectors" :key="index">
          {{ sector }}
          <div class="actions">
            <!-- <v-btn color="traktor" @click="editSector(index)" icon
              ><v-icon>mdi-pencil</v-icon>
            </v-btn> -->
            <v-btn color="red" @click="deleteSector(index)" icon
              ><v-icon>mdi-delete</v-icon></v-btn
            >
          </div>
        </li>
      </ol>
    </div>
    <v-dialog v-model="isEdit" width="500">
      <v-card>
        <v-card-title class="heading">Add new sector</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="newSector"
            label="Sector"
            :rules="[(v) => !!v || 'Sector is required']"
            required
            outlined
            dense
          ></v-text-field>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" @click="isEdit = false" text>Cancel</v-btn>
            <v-btn color="traktor" @click="addSector" dark>Add</v-btn>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-dialog>
  </section>
</template>

<script>
import { dynamicsRef } from "../../../config/firebase_services";
export default {
  name: "IncubatorSettingsSectors",
  props: ["incubatorId"],
  data() {
    return {
      sectors: "",
      docId: "",
      isEdit: false,
    };
  },
  created() {
    this.getSectors();
  },
  methods: {
    async getSectors() {
      const documents = await dynamicsRef
        .doc(this.incubatorId)
        .collection("sectors")
        .get();
      let data = [];
      documents.forEach((doc) => {
        this.docId = doc.id;
        data = doc.data()["sectors"];
      });
      this.sectors = data;
    },
    addSector() {
      this.sectors.push(this.newSector);
      this.updateSector();
    },
    async updateSector() {
      try {
        await dynamicsRef
          .doc(this.incubatorId)
          .collection("sectors")
          .doc(this.docId)
          .update(
            {
              sectors: this.sectors,
            },
            { merge: true }
          );
        this.$toast.open({
          message: "Sectors updated successfully",
          type: "success",
          position: "top",
        });
        this.isEdit = false;
      } catch (error) {
        console.log(error);
        this.$toast.open({
          message: "Error updating sectors",
          type: "error",
          position: "top",
        });
      }
    },
    deleteSector(index) {
      this.sectors.splice(index, 1);
      this.updateSector();
    },
  },
};
</script>

<style scoped>
.heading {
  color: #4d4d4d;
  margin: 0 1rem 1rem 1.5rem;
  font-weight: 500;
}

ol {
  flex-wrap: wrap;
}

li {
  width: 25%;
  display: flex;
  align-items: center;
}

.actions {
  display: none;
}

li:hover .actions {
  display: flex;
}
</style>