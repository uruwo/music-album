<template>
  <v-card width="600" class="ml-4" min-height="100">
    <v-row>
      <v-col class="d-none d-sm-flex">
        <v-card-title class="subtitle-1 py-3">{{ profile.name }}さんの感想</v-card-title>
      </v-col>
      <v-col>
        <v-card-title class="pa-0 px-4">
          <v-text-field
          single-line
          class="pt-0 mt-3"
          v-model="keyword"
          dense
          placeholder="曲名・アーティスト名"
          type="text"
          >
          <template v-slot:append>
          <v-icon color="grey darken-1">mdi-magnify</v-icon>
          </template>
          </v-text-field>
        </v-card-title>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <div
      v-for="(music, index) in filteredAlbum"
      :key="index"
    >
      <div class="flex mt-2 ml-2">
        <div>
          <v-avatar tile rounded="sm">
            <v-img :src="profile.profile_image" aspect-ratio="1"></v-img>
          </v-avatar>
        </div>
        <div class="flex-grow">
          <p class="ml-2 mb-2">{{ profile.name }}</p>
          <v-card color="grey darken-4" class="ma-2">
            <div class="flex">
              <div>
                <v-card-title class="subtitle-1 pt-2">{{ music.title }}</v-card-title>
                <v-card-subtitle class="py-0">{{ music.artist }}</v-card-subtitle>
              </div>
              <v-spacer></v-spacer>
              <div>
                <v-card-title :class="{ 'pr-10': $vuetify.breakpoint.smAndUp }">
                </v-card-title>
              </div>
            </div>
            <v-card-text class="pb-0 pt-0 mt-n2">
              <v-textarea
                class="mt-0"
                background-color="#1E1E1E"
                v-model="music.comment"
                loading="false"
                readonly
              >
              </v-textarea>
            </v-card-text>
          </v-card>
        </div>
      </div>
      <v-divider></v-divider>
    </div>
  </v-card>
</template>

<script>
export default {
  data () {
    return {
      keyword: '',
    }
  },
  props: [
    "profile",
    "album"
  ],
  computed: {
    filteredAlbum: function () {
      const album = []
      for (const i in this.album) {
        const music = this.album[i]
        if (music.title.indexOf(this.keyword) !== -1 ||
            music.artist.indexOf(this.keyword) !== -1) {
            album.push(music)
        }
      }
      return album.sort((a,b) => {
        let titleA = a.title.toUpperCase()
        let titleB = b.title.toUpperCase()
        if (titleA < titleB) {
          return -1
        }
        if (titleA > titleB) {
          return 1
        }
        return 0
      })
    },
  }
}
</script>

<style scoped>
  .flex {
    display: flex;
  }
  .flex-grow {
    flex-grow: 1;
  }
</style>