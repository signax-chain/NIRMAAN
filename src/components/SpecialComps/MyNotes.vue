<template>
  <div>
    <!-- <h2 v-if="notes.length === 0">No notes found</h2> -->
    <v-row class="px-3 mt-3">
      <v-col cols="12" md="8">
        <h2>Notes</h2>
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
          label="Search notes"
          append-icon="mdi-magnify"
          @keyup="handleSearch"
          outlined
          dense
        ></v-text-field>
      </v-col>
    </v-row>
    <div class="notes__row">
      <div class="notes__col add__new" @click="newNote()">
        <div class="inner__items">
          <v-btn icon>
            <v-icon color="traktor" size="48">mdi-plus-circle</v-icon></v-btn
          >
          <h2>New Note</h2>
        </div>
      </div>
      <div class="notes__col" v-for="(note, index) in notes_" :key="index">
        <router-link :to="`/notes/${note.docId}`">
          <div class="contents" v-html="getContents(note.notes[0])"></div>
          <h6 class="mx-4">{{ note.startup.name }}</h6>
        </router-link>
        <div class="actions px-3 pb-2">
          <span
            >last updated on {{ note.updatedAt.toDate().toDateString() }} at
            {{
              note.updatedAt.toDate().toLocaleTimeString("en-in", {
                hour: "2-digit",
                minute: "2-digit",
              })
            }}
            by {{ getAuthor(note) }}</span
          >
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on" color="black"
                ><v-icon size="28">mdi-dots-vertical</v-icon></v-btn
              >
            </template>
            <v-list>
              <v-list-item @click="view(note.docId)">
                <v-list-item-title>View</v-list-item-title>
              </v-list-item>
              <v-list-item @click="edit(note.docId)">
                <v-list-item-title>Edit</v-list-item-title>
              </v-list-item>
              <v-list-item @click="_delete(note.docId)">
                <v-list-item-title>Delete</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { notesRef } from "../../config/firebase_services";
import Swal from "sweetalert2";

export default {
  name: "MyNotes",
  data() {
    return {
      notes: [],
      msn: false, //mentorship notes
      loaded: false,
      notes_: [],
    };
  },
  created() {
    this.getNotes();
  },
  methods: {
    getAuthor(note) {
      return note.user.docId === this.$store.state.user.currentUser.docId
        ? "You"
        : note.user.name;
    },
    async getNotes() {
      const params = this.$route.params;
      Object.keys(params).length === 0
        ? this.getNotesByUserId()
        : this.getMentorshipNotes(params.id);
      this.loaded = true;
    },
    getContents(notes) {
      return notes.substring(0, 500) + "...";
    },
    getNotesByUserId() {
      const role = this.$store.state.user.currentUser.role;
      this.msn = false;
      if (role === "incubator" || role === "mentor") {
        notesRef
          .where(
            "incubatorId",
            "==",
            this.$store.state.incubator.currentIncubator.docId
          )
          .orderBy("updatedAt", "desc")
          .onSnapshot((snapshot) => {
            this.notes = [];
            snapshot.forEach((document) => {
              const data = document.data();
              data.docId = document.id;
              this.notes.push(data);
            });
            this.notes_ = this.notes;
          });
      }
    },
    handleSearch(e) {
      this.notes_ = this.notes.filter((note) => {
        return note.startup.name
          .toLowerCase()
          .includes(e.target.value.toLowerCase());
      });
    },
    getMentorshipNotes(id) {
      this.msn = true;
      notesRef.where("mentorshipId", "==", id).onSnapshot((snapshot) => {
        this.notes = [];
        snapshot.forEach((document) => {
          const data = document.data();
          data.docId = document.id;
          this.notes.push(data);
        });
      });
    },
    view(docId) {
      this.$router.push(`/notes/${docId}`);
    },
    edit(docId) {
      this.$router.push(`/notes/${docId}`);
    },
    newNote() {
      this.$router.push("/notes/new");
    },
    _delete(docId) {
      Swal.fire({
        title: "Are you sure?",
        showCancelButton: true,
        confirmButtonColor: "#3aa959",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await notesRef.doc(docId).delete();

            this.$toast.success("Deleted", {
              position: "top",
            });
          } catch (error) {
            this.$toast.error(error, {
              position: "top",
            });
          }
        }
      });
    },
  },
};
</script>

<style scoped>
.notes__row {
  display: flex;
  flex-wrap: wrap;
  margin-top: 20px;
}
.notes__col {
  margin-right: 20px;
  width: 23%;
  height: 250px;
  border: 1px solid rgb(224, 210, 210);
  background: #fff;
  border-radius: 5px;
  cursor: pointer;
  position: relative;
  margin-bottom: 25px;
}

.contents {
  font-size: 8px;
  padding: 15px;
  z-index: -999;
  opacity: 0.6;
  transition: 0.8s;
}

.contents:hover {
  opacity: 1;
  transform: scale(1.05);
  z-index: 2;
}

.actions {
  position: absolute;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.add__new {
  text-align: center;
  display: grid;
  place-items: center;
}

span {
  font-size: 12px;
  font-weight: bold;
  color: #2c2c2c81;
}

a {
  text-decoration: none !important;
  color: #000;
}

h6 {
  position: absolute;
  bottom: 50px;
}

@media only screen and (max-width: 600px) {
  .notes__col {
    width: 100%;
  }
}
</style>