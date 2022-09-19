import Vue from "vue";
import { errorLogsRef } from "../config/firebase_services";

Vue.config.errorHandler = async (err, vm, info) => {
  console.log(err);
  const data = {
    err: err.message,
    info: info,
    platform: navigator.platform,
    createdAt: new Date(),
  };

  try {
    await errorLogsRef.add(data);
  } catch (error) {
    console.log(error);
  }
};
