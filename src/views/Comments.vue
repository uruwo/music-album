<template>
  <div class="container">
    <MyStatus></MyStatus>
    <v-card width="600" class="ml-4" min-height="100">
      <v-row>
        <v-col class="d-none d-sm-flex">
          <v-card-title class="subtitle-1 py-3">みんなの感想</v-card-title>
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
        v-for="(music, index) in all_album"
        :key="index"
      >
        <div class="flex mt-2 ml-2">
          <div>
            <v-avatar tile rounded="sm" @click="watchProfile(music)">
              <v-img :src="music.profile_image" aspect-ratio="1"></v-img>
            </v-avatar>
          </div>
          <div class="flex-grow">
            <p class="ml-2 mb-2">{{ music.profile_name }}</p>
            <v-card color="grey darken-4" class="ma-2">
              <div class="flex">
                <div>
              <v-card-title class="subtitle-1 pt-2">{{ music.title }}</v-card-title>
              <v-card-subtitle class="pt-0 pb-2">{{ music.artist }}</v-card-subtitle>
                </div>
                <v-spacer></v-spacer>
                <div>
                  <v-card-title :class="[{ 'pr-10': $vuetify.breakpoint.smAndUp }, 'pl-0']">
                    <v-btn icon @click="play(music)" v-if="music.audio_url && music.audio_url.match(/audios%2F(.+)\?/)[1] !== 'undefined'">
                      <v-icon large>mdi-play-circle-outline</v-icon>
                    </v-btn>
                    <v-btn icon v-else-if="music.audio_url && music.audio_url.match(/audios%2F(.+)\?/)[1] == 'undefined'" class="d-none">
                    </v-btn>
                    <v-btn icon @click="addLike({music_id: music.id, creater_id: music.user_id})" v-else-if="!music.audio_url && !favorite_comment.includes(music.id)">
                      <v-icon>mdi-thumb-up-outline</v-icon>
                    </v-btn>
                    <v-btn icon v-else @click="deleteLike(music.id)">
                      <v-icon color="blue">mdi-thumb-up</v-icon>
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
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { mapGetters } from 'vuex'
import "firebase/storage"
import MyStatus from '../components/MyStatus.vue'

export default {
  components: {
    MyStatus
  },
  data () {
    return {
      all_album: [],
      favorite_comment: [],
      keyword: '',
    }
  },
  created () {
    this.all_album = this.$store.state.all_album
    this.putFilteredAlbum(this.all_album.filter(music => music.user_id === this.uid))
    this.favorite_comment = this.$store.state.favorite_comment
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
      for (const i in this.$store.state.all_album) {
        const music = this.$store.state.all_album[i]
        if (music.title.indexOf(this.keyword) !== -1 ||
            music.artist.indexOf(this.keyword) !== -1) {
            album.push(music)
        }
      }
      this.all_album = album
      this.putFilteredAlbum(this.all_album.filter(music => music.user_id === this.uid))
    },
    blur () {
      this.$refs.blurThis.blur()
    },
    play (music) {
      this.switchBarContent(music)
      this.switchPlayerBar()
    },
    watchProfile (music) {
      if (music.user_id === this.uid) {
        this.$router.push({name: 'MyComment'})
      } else {
        this.$router.push({name: 'OthersComment', params: {user_id: music.user_id}})
      }
    },
    ...mapActions(['fetchAllProfile', 'switchBarContent', 'switchPlayerBar', 'putFilteredAlbum', 'addLike', 'deleteLike'])
  },
  computed: {
    ...mapGetters(['uid'])
  }
}
</script>

<style scoped>
  .container {
    display: flex;
    justify-content: center;
    margin-top: 40px;
    align-items: flex-start;
  }
  .flex {
    display: flex;
  }
  .flex-grow {
    flex-grow: 1;
  }
</style>