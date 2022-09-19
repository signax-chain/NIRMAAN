<template>
  <div id="chart">
    <apexchart
      width="100%"
      :options="chartOptions"
      :series="series"
      id="apex-chart"
    ></apexchart>
  </div>
</template>

<script>
import { getStartupsByStudentId } from "../../../../../services/graphs/startup/startupsByStudentId";

export default {
  data() {
    return {
      series: [
        {
          name: "Founders by student id",
          data: [],
        },
      ],
      chartOptions: {
        chart: {
          type: "bar",
          events: {
            dataPointSelection: this.onClickHandler
          },
        },
        plotOptions: {
          bar: {
            borderRadius: 10,
            dataLabels: {
              position: "top", // top, center, bottom
            },
          },
        },
        dataLabels: {
          enabled: true,
          formatter: function(val) {
            return val;
          },
          offsetY: 0,
          style: {
            fontSize: "12px",
            colors: ["#304758"],
          },
        },
        xaxis: {
          categories: [],
          position: "top",
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
          tooltip: {
            enabled: true,
          },
        },
        tooltip: {
          custom: function({ series, seriesIndex, dataPointIndex, w }) {
            const availableStudentIds = {
              AE: "Aerospace Engineering",
              AM: "Applied Machanics",
              BT: "Biotechnology",
              CH: "Chemical Engineering",
              CY: "Chemistry",
              CE: "Civil Engineering",
              CS: "Computer Science and Engineering",
              EE: "Electrical Engineering",
              ED: "Engineering Design",
              HS: "Humanities and Social Sciences",
              MS: "Management Studies",
              MA: "Mathematics",
              ME: "Mechanical Engineering",
              MM: "Metallurgical and Materials Engineering",
              OE: "Ocean Engineering",
              PH: "Physics",
              BS: "Biological Sciences",
              EP: "Engineering Physics",
              NA: "Naval Architecture",
            };
            return (
              '<div class="arrow_box">' +
              "<span>" +
              availableStudentIds[w.globals.labels[dataPointIndex]] +
              ": " +
              series[seriesIndex][dataPointIndex] +
              "</span>" +
              "</div>"
            );
          },
        },
        yaxis: {
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
          labels: {
            show: false,
            formatter: function(val) {
              return val;
            },
          },
        },
        fill: {
          colors: ["#3aa959"],
        },
        title: {
          floating: true,
          offsetY: 330,
          align: "center",
          style: {
            color: "#444",
          },
        },
      },
      studentDataArray: [],
    };
  },
  created() {
    this.initializeGraph();
  },
  methods: {
    async initializeGraph() {
      const data = await getStartupsByStudentId();
      this.studentDataArray = Object.keys(data);
      this.series[0].data = Object.values(data);
      this.chartOptions = {
        ...this.chartOptions,
        ...{ xaxis: { categories: Object.keys(data) } },
      };
    },
    onClickHandler(event, chartContext, config) {
      let dataPointIndex = config.dataPointIndex;
      const subjectIndex = this.studentDataArray[dataPointIndex];
      this.$router.push(`/startups?sub=${subjectIndex}`);
    },
  },
};
</script>

<style scoped>
#chart {
  max-width: 760px;
  margin: 35px auto;
  opacity: 0.9;
}

>>> .arrow_box {
  position: relative;
  background: #555;
  border: 2px solid #000000;
}
>>> .arrow_box:after,
>>> .arrow_box:before {
  right: 100%;
  top: 50%;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}

>>> .arrow_box:after {
  border-color: rgba(85, 85, 85, 0);
  border-right-color: #555;
  border-width: 10px;
  margin-top: -10px;
}
>>> .arrow_box:before {
  border-color: rgba(0, 0, 0, 0);
  border-right-color: #000000;
  border-width: 13px;
  margin-top: -13px;
}

>>> .apexcharts-tooltip {
  color: #fff;
  transform: translateX(10px) translateY(10px);
  overflow: visible !important;
  white-space: normal !important;
}

>>> .apexcharts-tooltip span {
  padding: 5px 10px;
  display: inline-block;
}
</style>
