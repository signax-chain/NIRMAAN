// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyBEMS9wPfLB5rMxvzYckiDtvX8UF3bSDFk",
  authDomain: "ims-traktor.firebaseapp.com",
  databaseURL: "https://ims-traktor.firebaseio.com",
  projectId: "ims-traktor",
  storageBucket: "ims-traktor.appspot.com",
  messagingSenderId: "1097114383627",
  appId: "1:1097114383627:web:b777f23059f893297f5e0e",
  measurementId: "G-N0GKCJY3W3",
};

// Add the public key generated from the console here.
// messaging.getToken({vapidKey: "BKm-JmFFMGzux5-1T1iQsSQlr18p_BWgJbou3dzJaNciBsEqHESarJ_qW74HMaIn61VIrnF4AJ2egPP8eFKke_A"});

firebase.initializeApp(firebaseConfig);
firebase.messaging();
firebase.analytics();
