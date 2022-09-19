import domtoimage from "dom-to-image";
import { jsPDF } from "jspdf";

export default {
  data() {
    return {
      progressLoader: false,
    };
  },
  methods: {
    downloadDashboard() {
      this.progressLoader = true;
      this.$refs.downloadContainer.style.padding = "1rem";

      domtoimage
        .toPng(document.getElementById("download_container"))
        .then(function(blob) {
          const pdf = new jsPDF("p", "pt", [
            document.getElementById("download_container").clientWidth,
            document.getElementById("download_container").clientHeight,
          ]);
          pdf.addImage(
            blob,
            "PNG",
            0,
            0,
            document.getElementById("download_container").clientWidth,
            document.getElementById("download_container").clientHeight,
            undefined,
            "FAST"
          );
          pdf.save(`Report - ${new Date().toDateString()}.pdf`);
        })
        .then(() => {
          this.$refs.downloadContainer.style.padding = "0";
          this.progressLoader = false;
        });
    },
  },
};
