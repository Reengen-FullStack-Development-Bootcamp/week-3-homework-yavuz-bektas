<template>
  <v-app id="inspire">
    <Navbar />

    <v-main class="dark">
      <v-container>
        <v-row>
          <v-col cols="12" sm="12">
            <v-sheet min-height="0vh" rounded="lg">
              <Vcard />
              <strong>{{ this.$store.state.select }}</strong> ile ilgili
              sonuçlar listeleniyor.
            </v-sheet>
          </v-col>
          <v-col v-for="i in $store.state.searchResults" :key="i.id" cols="4">
            <v-card @click="push(i['1. symbol'])" height="400">
              <div v-for="(value, key) in i" :key="key">
                <v-btn class="mx-5 my-1" outlined color="white">
                  {{ key }}
                </v-btn>
                <v-icon dark lef> mdi-arrow-right </v-icon>
                <v-btn class="mx-5 my-1" outlined color="red">
                  {{ value }}
                </v-btn>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Navbar from "@/components/Navbar";
import Vcard from "@/components/vcard";
export default {
  components: {
    Navbar,
    Vcard,
  },

  created(){
    localStorage.setItem("areyouadmin","user");
  },

  methods: {
    push(key) {
      this.$router.push({
        path: "/symbol",
        query: {
          symbol: key,
        },
      });
    },
  },
};
</script>
