<template>
  <v-app>
      

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
  }),
  watch: {
    '$route' (to, from) {
      const Paths = 'Route changed from ' + from.path + ' to ' + to.path;
      const today = new Date();
      const yearMonthDay = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()
      const HourMin = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      const who = localStorage.getItem("areyouadmin");
      const AllDatas = {
        Paths,
        yearMonthDay,
        HourMin,
        who
      }
      this.$store.commit("setPathFollow", AllDatas);
    }
}
};
</script>
