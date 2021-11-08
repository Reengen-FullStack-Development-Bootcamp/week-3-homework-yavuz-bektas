<template>
  <div>
    <Navbar />
    <v-simple-table dense>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Path</th>
            <th class="text-left">Who</th>
            <th class="text-left">Year</th>
            <th class="text-left">Time</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in $store.state.pathFollow" :key="item.name">
            <td>{{ item.Paths }}</td>
            <td class="">
              {{ item.who }}
            </td>
            <td>{{ item.yearMonthDay }}</td>
            <td>{{ item.HourMin }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
export default {
  components: {
    Navbar,
  },
  data() {
    return {
      classBind:true
    };
  },
};
</script>

<style scoped>
.table {
  background-color: red;
}
</style>
