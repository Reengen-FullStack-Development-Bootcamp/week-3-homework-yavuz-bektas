<template>
  <v-app-bar app color="dark" flat>
    <v-avatar
      :color="$vuetify.breakpoint.smAndDown ? 'grey darken-1' : 'transparent'"
      size="32"
    ></v-avatar>
    <v-tabs centered class="ml-n9" color="white">
      <v-tab @click="hello('/')"> Ana Sayfa </v-tab>
      <v-tab @click="hello('/logs')"> Log </v-tab>

      <v-tab>
        <v-container class="mt-6" fluid>
          <v-switch
            v-model="role"
            color="primary"
            value="Admin"
            label="Admin"
            @click="hi"
          ></v-switch>
        </v-container>
      </v-tab>
    </v-tabs>

    <v-avatar
      class="hidden-sm-and-down"
      color="grey darken-1 shrink"
      size="32"
    ></v-avatar>
  </v-app-bar>
</template>

<script>
export default {
  data() {
    return {
      role: [],
    };
  },
  methods: {
    hello(key) {
      this.$router.push(key);
    },
    hi() {
      if (this.role[0] === undefined) {
        localStorage.setItem("areyouadmin", "user");
      } else {
        localStorage.setItem("areyouadmin", "admin");
      }
    },
  },
};
</script>

<style></style>
