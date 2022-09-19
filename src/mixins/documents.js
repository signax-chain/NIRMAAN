import { uploadsRef, documentationRef } from '../config/firebase_services'
import store from '../store'

export default {
    data() {
        return {
            documents: [],
            userId: null,
            templates: [],
        }
    },
    created() {
        this.setCurrentUser()
        this.getDocuments();
    },
    methods: {
        setCurrentUser() {
            this.userId = store.state.user.currentUser.docId
        },
        async getDocuments() {
            documentationRef
                .where("userId", "==", this.userId)
                .onSnapshot((snapshot) => {
                    this.documents = [];
                    snapshot.forEach((document) => {
                        const data = document.data();
                        data.docId = document.id;
                        this.documents.push(data);
                    });
                    this.getTemplates();
                });
        },
        getTemplates() {
            const role = store.state.user.currentUser.role;
            uploadsRef
                .doc(this.$store.state.incubator.currentIncubator.docId)
                .collection("documentationTemplates")
                .onSnapshot((snapshot) => {
                    this.templates = [];
                    snapshot.forEach((document) => {
                        const data = document.data();
                        const obj = this.documents.find(
                            (document) => document.type === data.title
                        );
                        if (obj !== undefined) {
                            data.file = obj.document;
                            data.uploadedAt = obj.createdAt;
                            data.docId = obj.docId;
                            this.templates.push(data);
                        } else if (role === "startup") {
                            data.file = "";
                            data.uploadedAt = "";
                            this.templates.push(data);
                        }
                    });
                    this.mapOtherDocs();
                });
        },
        mapOtherDocs() {
            this.documents.forEach((doc) => {
                if (doc._type === "other") {
                    doc.file = doc.document;
                    doc.uploadedAt = doc.createdAt;
                    this.templates.push(doc);
                }
            });
        },
    }
}