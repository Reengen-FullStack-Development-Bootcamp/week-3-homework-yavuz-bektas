<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row>
          <v-col cols="3">
            <v-sheet rounded="lg">
              <v-list>
                <v-list-item v-for="i in $store.state.metaDatas" :key="i.id">
                  <v-list-item-content>
                    <v-list-item-title> {{ i }}</v-list-item-title>
                    <v-divider class="my-2"></v-divider>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-sheet>
            <br />
            <div class="text-center">
              <v-btn
                @click="backToHomePage"
                rounded
                color="blue lighten-3"
                dark
              >
                Ana Sayfaya Dön
              </v-btn>
            </div>
          </v-col>
          <v-col>
            <v-sheet rounded="lg">
              <v-btn @click="monthData()" rounded color="green" dark>
                Ay
              </v-btn>
              <v-btn @click="yearData()" rounded color="green" dark>
                Yıl
              </v-btn>
              <div id="chart" ref="chart"></div>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import * as d3 from "d3";
/* <div class="dark" id="chart" ref="chart"></div>; */

export default {
  created() {
    this.$store.dispatch("getTimeSeriesDaily", {
      symbol: this.$route.query.symbol,
      daymonthyear: "TIME_SERIES_DAILY",
      daymonthyearr: "Time Series (Daily)",
    });
  },

  mounted() {
    setTimeout(() => {
      if (this.$store.state.SeriesDailyResponse != null) this.setChart();
    }, 2000);
  },

  methods: {
    setChart() {
      if (document.getElementById("chartsvg")) {
        const chartsvg = document.getElementById("chartsvg");
        this.$refs.chart.removeChild(chartsvg);
      }

      let margin = { top: 70, right: 50, bottom: 50, left: 50 };
      let padding = { top: 30, right: 70, bottom: 50, left: 70 };
      let width = 1000;
      let height = 400;
      let space = 10;
      let vol_width = width;
      let vol_height = 200;
      let candles_height = height + margin.top;
      let chart_height = candles_height + space + vol_height;
      let chart_width = width + padding.left + padding.right;
      let svg_width = chart_width + margin.left + margin.right;
      let svg_height = chart_height + margin.top + margin.bottom;
      let maxList = [];
      let minList = [];

      this.$store.state.SeriesDailyResponse.forEach((item) => {
        //ardından en yüksek ve en düşük değerlerin içinden
        maxList.push(Math.max(item.open, item.close, item.high));
        minList.push(Math.min(item.open, item.close, item.low));
      });

      this.$store.state.SeriesDailyResponse.map((data) => data.volume);

      let max_value = Math.max(...maxList);
      let min_value = Math.min(...minList);

      let maxVol = Math.max(
        ...this.$store.state.SeriesDailyResponse.map((data) => data.volume)
      ); //volume y ekseni için min max değerleri

      let minVol = Math.min(
        ...this.$store.state.SeriesDailyResponse.map((data) => data.volume)
      );

      const svg = d3
        .select(this.$refs.chart)
        .append("svg")
        .attr("id", "chartsvg")
        .attr("width", svg_width)
        .attr("height", svg_height);

      svg
        .append("rect")
        .attr("width", chart_width)
        .attr("height", chart_height)
        .attr("rx", 7)
        .attr("ry", 7)
        .attr("fill", "#121212")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      const vol = svg
        .append("g")
        .attr("width", vol_width)
        .attr("height", vol_height)
        .attr(
          "transform",
          "translate(" +
            (margin.left + padding.left) +
            "," +
            (margin.top + candles_height + space) +
            ")"
        );

      const base = svg
        .append("g")
        .attr("width", width)
        .attr("height", height)
        .attr(
          "transform",
          "translate(" +
            (margin.left + padding.left) +
            "," +
            (margin.top + padding.top) +
            ")"
        );

      const x = d3
        .scaleBand()
        .domain(this.$store.state.SeriesDailyResponse.map((d) => d.date))
        .range([0, width]);

      base
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-25)")
        .style("text-anchor", "end");

      const y = d3
        .scaleLinear()
        .domain([min_value, max_value])
        .range([height, 0]);

      base.append("g").call(d3.axisLeft(y));

      base
        .selectAll("candles")
        .data(this.$store.state.SeriesDailyResponse)
        .enter()
        .append("rect")
        .attr("x", function (d) {
          return x(d.date);
        })
        .attr("y", function (d) {
          return y(d3.max([parseFloat(d.open), parseFloat(d.close)]));
        })
        .attr("width", 10)
        .attr("height", function (d) {
          return Math.abs(y(d.open) - y(d.close));
        })
        .attr("rx", 3)
        .classed("rise", function (d) {
          return d.close > d.open;
        })
        .classed("fall", function (d) {
          return d.open > d.close;
        })
        .attr(
          "transform",
          "translate(" +
            (width / this.$store.state.SeriesDailyResponse.length / 2 - 5.5) +
            ")"
        )
        .attr("fill", (d) =>
          d.open === d.close ? "silver" : d.open > d.close ? "red" : "green"
        );

      base
        .selectAll("sticks") //ince çizgiler (high-low)
        .data(this.$store.state.SeriesDailyResponse)
        .enter()
        .append("rect")
        .attr("x", function (d) {
          return x(d.date);
        })
        .attr("y", function (d) {
          if (parseFloat(d.high) > parseFloat(d.low)) {
            return y(d.high);
          } else {
            return y(d.low);
          }
        })
        .attr("width", 2)
        .attr("height", function (d) {
          return y(d.low) - y(d.high);
        })
        .classed("rise", function (d) {
          return d.close > d.open;
        })
        .classed("fall", function (d) {
          return d.open > d.close;
        })
        .attr(
          "transform",
          "translate(" +
            (width / this.$store.state.SeriesDailyResponse.length / 2 - 1.5) +
            ")"
        )
        .attr("fill", (d) =>
          d.open === d.close ? "silver" : d.open > d.close ? "red" : "green"
        );

      const vy = d3
        .scaleLinear()
        .domain([minVol, maxVol])
        .range([vol_height, 0]);

      vol
        .append("g")
        .call(d3.axisRight(vy))
        .attr("transform", "translate(" + vol_width + ")");
      vol
        .selectAll("volBars")
        .data(this.$store.state.SeriesDailyResponse)
        .enter()
        .append("rect")
        .attr("x", function (d) {
          return x(d.date);
        })
        .attr("y", function (d) {
          return vy(d.volume);
        })
        .attr("width", x.bandwidth())
        .attr("height", function (d) {
          return vol_height - vy(d.volume);
        })
        .attr("fill", "red")
        .attr("fill", (d) =>
          d.open === d.close ? "silver" : d.open > d.close ? "red" : "green"
        );
    },
    backToHomePage() {
      this.$router.push("/");
      this.$store.dispatch("cleanArrays");
    },
    monthData() {
      this.$store.dispatch("getTimeSeriesDaily", {
        symbol: this.$route.query.symbol,
        daymonthyear: "TIME_SERIES_WEEKLY",
        daymonthyearr: "Weekly Time Series",
      });
      setTimeout(() => {
        if (this.$store.state.SeriesDailyResponse != null) this.setChart();
      }, 2000);
    },
  },
};
</script>

<style></style>
