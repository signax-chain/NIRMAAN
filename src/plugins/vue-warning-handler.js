import Vue from "vue";
import { warningLogsRef } from "../config/firebase_services";

Vue.config.warnHandler = async (msg, vm, trace) => {
  const data = {
    msg: msg,
    trace: trace,
    platform: navigator.platform,
    createdAt: new Date(),
  };

  try {
    await warningLogsRef.add(data);
  } catch (error) {
    console.log(error);
  }
};
