<template>
  <v-card width="700" :class="[{'ml-4': $vuetify.breakpoint.smAndUp}, {'mt-4': $vuetify.breakpoint.xs}]" min-height="100">
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
          ref='blurThis'
          >
          <template v-slot:append>
          <v-btn icon plain :ripple="false" @click="clearKeyword" v-if="keyword">
            <v-icon color="grey darken-1">mdi-close-circle</v-icon>
          </v-btn>
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
            <v-img :src="music.profile_image" aspect-ratio="1"></v-img>
          </v-avatar>
        </div>
        <div class="flex-grow">
          <p class="ml-2 mb-2">{{ music.profile_name }}</p>
          <v-card color="grey darken-4" class="ma-2">
            <div class="flex">
              <v-img
                :src="music.preview_image ? music.preview_image : require('../../public/album.png')"
                aspect-ratio="1"
                max-width="60"
                class="mt-3 mb-2 ml-4"
              >
                <template>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-btn icon @click.stop="play_preview(music, index)" v-if="music.preview_audio && index !== is_play">
                      <v-icon large class="preview">mdi-play-circle-outline</v-icon>
                    </v-btn>
                    <v-btn icon @click.stop="pause_preview()" v-if="index === is_play">
                      <v-icon large color="blue">mdi-stop-circle-outline</v-icon>
                    </v-btn>
                  </v-row>
                </template>
              </v-img>
              <div>
                <v-card-title class="subtitle-1 pt-2">{{ music.title }}</v-card-title>
                <v-card-subtitle class="py-0">{{ music.artist }}</v-card-subtitle>
              </div>
              <v-spacer></v-spacer>
              <v-card-title class="mr-2">
                <v-btn icon @click="addLike({music_id: music.id, creater_id: music.user_id})" v-if="!$store.state.favorite_comment.includes(music.id)">
                  <v-icon>mdi-thumb-up-outline</v-icon>
                </v-btn>
                <v-btn icon v-else @click="deleteLike(music.id)">
                  <v-icon color="blue">mdi-thumb-up</v-icon>
                </v-btn>
              </v-card-title>
              <v-card-title class="pa-0 mr-6" v-if="music.spotify_url">
                <v-btn icon @click="openSpotify(music.spotify_url)">
                  <v-img src="../../public/spotify_icon.png" max-width="29"></v-img>
                </v-btn>
              </v-card-title>
            </div>
            <v-card-text class="pb-0 pt-0 mt-n2">
              <v-textarea
                class="mt-0"
                background-color="#1E1E1E"
                v-model="music.comment"
                loading="false"
                readonly
                auto-grow
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
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      keyword: '',
      is_play: null,
      audio: new Audio()
    }
  },
  props: [
    "profile",
    "album"
  ],
  created () {
    if (this.$route.params.keyword !== undefined) {
      this.keyword = this.$route.params.keyword
    }
  },
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
      return album.filter(music => music.comment && music.public).sort((a,b) => {
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
  },
  methods: {
    clearKeyword () {
      this.keyword = ''
      this.blur()
    },
    blur () {
      this.$refs.blurThis.blur()
    },
    play_preview (music, index) {
      this.is_play = index
      this.audio.src = music.preview_audio
      this.audio.play()
    },
    pause_preview () {
      this.is_play = null
      this.audio.pause()
    },
    openSpotify (url) {
      window.open(url, '_blank')
    },
    ...mapActions(['addLike', 'deleteLike'])
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