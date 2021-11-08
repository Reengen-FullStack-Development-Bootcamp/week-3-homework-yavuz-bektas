<template>
  <v-toolbar dark color="dark">
    <v-toolbar-title>Hisse Ara</v-toolbar-title>
    <v-autocomplete
      v-on:keyup.enter="onEnter"
      v-model="$store.state.select"
      :loading="loading"
      :items="items"
      :search-input.sync="search"
      cache-items
      class="mx-4"
      flat
      hide-no-data
      hide-details
      label="Hangi şirketi arıyorsunuz?"
      solo-inverted
    ></v-autocomplete>
    <v-btn icon>
      <v-icon>mdi-dots-vertical</v-icon>
    </v-btn>
  </v-toolbar>
</template>

<script>
import companies from '../store/companies'

export default {
  data() {
    return {
      loading: false,
      items: [],
      search: null,
    };
  },
  watch: {
    search(val) {
      val && val !== this.$store.state.select && this.querySelections(val);
    },
  },
  methods: {
    querySelections(v) {
      this.loading = true;
      // Simulated ajax query
      setTimeout(() => {
        this.items = companies.state.companies.filter((e) => {
          return (e || "").toLowerCase().indexOf((v || "").toLowerCase()) > -1;
        });
        this.loading = false;
      }, 500);
    },
    onEnter: function() {
       this.$store.dispatch('GET_earchFromEndpoint',this.$store.state.select)
    }
  },
};
</script>
