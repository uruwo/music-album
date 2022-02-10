<template>
  <v-card width="600" class="ml-4" min-height="100">
    <v-row>
      <v-col class="d-none d-sm-flex">
        <v-card-title class="subtitle-1 py-3">{{ $store.state.profile.name }}さんの感想</v-card-title>
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
          @blur="filterAlbum"
          @keyup.enter.exact="blur"
          >
          <template v-slot:append>
            <v-btn icon plain :ripple="false" @click="filterAlbum">
              <v-icon color="grey darken-1">mdi-magnify</v-icon>
            </v-btn>
          </template>
          </v-text-field>
        </v-card-title>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <div
      v-for="(music, index) in filtered_album"
      :key="index"
    >
      <div class="flex mt-2 ml-2">
        <div>
          <v-avatar tile rounded="sm">
            <v-img :src="profileImage" aspect-ratio="1"></v-img>
          </v-avatar>
        </div>
        <div class="flex-grow">
          <p class="ml-2 mb-2">{{ $store.state.profile.name }}</p>
          <v-card color="grey darken-4" class="ma-2">
            <div class="flex">
              <div>
                <v-card-title class="subtitle-1 pt-2">{{ music.title }}</v-card-title>
                <v-card-subtitle class="py-0">{{ music.artist }}</v-card-subtitle>
              </div>
              <v-spacer></v-spacer>
              <div>
                <v-card-title :class="[{ 'pr-10': $vuetify.breakpoint.smAndUp }, 'pl-0']">
                  <v-btn icon @click="play(music)" v-if="music.audio_url.match(/audios%2F(.+)\?/)[1] !== 'undefined'">
                    <v-icon large>mdi-play-circle-outline</v-icon>
                  </v-btn>
                </v-card-title>
              </div>
            </div>
            <v-card-text class="pb-0 pt-0 mt-n2">
              <v-textarea
                class="mt-0"
                background-color="#1E1E1E"
                v-model="music.comment"
                loading="false"
                hide-details=""
                @blur="updateComment(index)"
              >
              </v-textarea>
            </v-card-text>
            <div class="flex mr-10 mt-1 pb-1">
              <v-spacer></v-spacer>
              <div>
                <v-icon small class="pb-1 pr-1">mdi-thumb-up</v-icon>
                {{ likes(music.id) }}
              </div>
            </div>
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
      filtered_album: [],
      keyword: '',
      liked_comments: [],
    }
  },
  created () {
    this.album = this.$store.state.album
    this.filtered_album = this.$store.state.commented_album
    this.liked_comments = this.$store.state.liked_comments
    this.putFilteredAlbum(this.filtered_album)
  },
  watch: {
    keyword: function (newVal) {
      if (!newVal) {
        this.filterAlbum()
      }
    }
  },
  methods: {
    filterAlbum () {
      const album = []
      for (const i in this.$store.state.commented_album) {
        const music = this.$store.state.commented_album[i]
        if (music.title.indexOf(this.keyword) !== -1 ||
            music.artist.indexOf(this.keyword) !== -1) {
            album.push(music)
        }
      }
      this.filtered_album = album
      this.putFilteredAlbum(this.filtered_album)
    },
    blur () {
      this.$refs.blurThis.blur()
    },
    play (music) {
      this.switchBarContent(music)
      this.switchPlayerBar()
    },
    updateComment (index) {
      const filteredMusic = this.filtered_album[index]
      this.updateMusic({id: filteredMusic.id, music: filteredMusic})
      this.updateMusicInAll({id: filteredMusic.id, music: filteredMusic})
    },
    ...mapActions(['putFilteredAlbum','updateMusic','switchBarContent', 'switchPlayerBar', 'updateMusicInAll'])
  },
  computed: {
    likes: function () {
      return function(id) {
        return this.liked_comments.filter(comment => comment === id).length
      }
    },
    profileImage: function () {
      if (this.$store.state.profile.profile_image) {
        return this.$store.state.profile.profile_image
      } else {
        return 'default_user_icon.png'
      }
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