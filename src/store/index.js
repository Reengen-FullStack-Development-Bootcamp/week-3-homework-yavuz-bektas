import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    select: null,
    apiURL: "https://alpha-vantage.p.rapidapi.com",
    headers: {
      "x-rapidapi-host": "alpha-vantage.p.rapidapi.com",
      "x-rapidapi-key": "04f1cf8d8dmsh83b013b0557f2c0p12b759jsna835a2b2a9c2", //api kodu
    },
    searchResults: [],
    dailySeries: [],
    SeriesDailyResponse: [],
    metaDatas: [],
    pathFollow: [],
  },
  mutations: {
    SET_searchFromEndpoint(state, payload) {
      state.searchResults = payload;
    },
    setTimeSeriesDaily(state, payload) {
      state.dailySeries = payload;
    },
    setTimeSeriesDailyResponse(state, payload) {
      state.SeriesDailyResponse = payload;
    },
    setMetaData(state, payload) {
      state.metaDatas = payload;
    },
    setCleanArrays(state, payload) {
      state.searchResults = payload;
    },
    setPathFollow(state, payload) {
      state.pathFollow.push(payload);
    },
  },
  actions: {
    GET_earchFromEndpoint({ state, commit }, payload) {
      commit("SET_searchFromEndpoint", []);
      return axios
        .get(`${state.apiURL}/query`, {
          headers: { ...state.headers },
          params: {
            keywords: payload,
            function: "SYMBOL_SEARCH",
            datatype: "json",
          },
        })
        .then((res) => {
          console.log(res.data.bestMatches);
          commit("SET_searchFromEndpoint", res.data.bestMatches);
        })
        .catch((err) => console.log(err));
    },
    getTimeSeriesDaily({ state, commit }, payload) {
      commit("setTimeSeriesDaily", []);
      return axios
        .get(`${state.apiURL}/query`, {
          headers: { ...state.headers },
          params: {
            symbol: payload,
            function: "TIME_SERIES_DAILY",
            datatype: "json",
            outputsize: "compact",
          },
        })
        .then((res) => {
          console.log(res.data);
          let metaData = res.data["Meta Data"];
          let data = res.data["Time Series (Daily)"];
          let comingData = [];
          Object.keys(data).forEach((item) => {
            let obj = new Object({
              date: item,
              open: data[item]["1. open"],
              close: data[item]["4. close"],
              high: data[item]["2. high"],
              low: data[item]["3. low"],
              volume: data[item]["5. volume"],
            });
            comingData.push(obj);
          });
          commit("setTimeSeriesDailyResponse", comingData.slice(0, 30));
          commit("setMetaData", metaData);
        })
        .catch((err) => console.log(err));
    },
    cleanArrays({ commit }) {
      commit("setCleanArrays", []);
    },
  },
  modules: {},
});
