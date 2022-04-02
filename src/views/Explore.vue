<template>
  <v-container :class="[{'px-10': $vuetify.breakpoint.mdAndUp}]">
    <v-row>
      <v-col cols="9" sm="5">
        <v-text-field
        v-model="keyword"
        label="曲名・アーティスト名・アルバム名"
        type="text"
        :class="[{'mt-2': $vuetify.breakpoint.xs}, {'mt-16': $vuetify.breakpoint.smAndUp}]"
        @blur="searchTracks(); pause()"
        ref="blurThis"
        @keyup.enter.exact="blur"
        >
        <template v-slot:append>
        <v-btn icon plain :ripple="false" @click="clearKeyword()" v-if="keyword">
          <v-icon color="grey darken-1">mdi-close-circle</v-icon>
        </v-btn>
        <v-btn icon plain :ripple="false" @click="blur()">
          <v-icon color="grey darken-1">mdi-magnify</v-icon>
        </v-btn>
        </template>
        </v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        v-for="(music, index) in music_list"
        :key="index"
        class=" child-flex pa-2"
        cols="6" sm="3" md="2"
      >
        <v-img
          :lazy-src="music.image_url"
          :src="music.image_url"
          aspect-ratio="1"
          class="hover"
          @click="switchDialog(); setMusicTemp(music)"
        >
          <template>
            <v-row
              class="fill-height ma-0"
              align="center"
              justify="center"
            >
              <v-btn icon @click.stop="play(music, index)" v-if="music.preview_url && index !== is_play">
                <v-icon x-large>mdi-play-circle-outline</v-icon>
              </v-btn>
              <v-btn icon @click.stop="pause()" v-if="index === is_play">
                <v-icon x-large color="blue">mdi-stop-circle-outline</v-icon>
              </v-btn>
            </v-row>
          </template>
        </v-img>
        <p class="text-caption ma-0 mt-1">{{ music.title }}</p>
        <p class="text-caption ma-0">{{ music.artist }}</p>
      </v-col>
    </v-row>
    <infinite-loading spinner="spiral" @infinite="infiniteHandler" :identifier="infinite_id" v-if="keyword" class="mt-10">
      <template slot="no-more">No more results</template>
      <template slot="no-results">No more results</template>
    </infinite-loading>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import axios from 'axios'
import InfiniteLoading from 'vue-infinite-loading'

export default {
  components: {
    InfiniteLoading
  },
  data() {
    return {
      keyword: '',
      music_list: [],
      audio: new Audio(),
      is_play: null,
      page: 0,
      access_token: '',
      infinite_id: 0
    }
  },
  created () {
    this.music_list = this.$store.state.spotify_playlist
  },
  mounted () {
    this.audio.addEventListener('ended', () => {
      this.is_play = null
    })
  },
  beforeDestroy () {
    this.audio.pause()
  },
  watch: {
    keyword: function (newVal) {
      if (!newVal) {
        this.music_list = this.$store.state.spotify_playlist
      }
    },
    myAlbum () {
      this.stopLoading()
    }
  },
  methods: {
    clearKeyword () {
      this.keyword = ''
      this.blur()
    },
    blur () {
      this.$refs.blurThis.blur()
      this.infinite_id++
    },
    play (music, index) {
      this.is_play = index
      this.audio.src = music.audio_url
      this.audio.play()
    },
    pause () {
      this.is_play = null
      this.audio.pause()
    },
    async infiniteHandler ($state) {
      this.page++
      const list_length_before = this.music_list.length
      await this.getTracks(this.access_token)
      if (this.music_list.length - list_length_before === 12) {
        setTimeout(() => {
          this.infinite_id++
          $state.loaded()
        }, 1000)
      } else {
        $state.complete()
      }
    },
    async searchTracks () {
      this.page = 0
      this.infinite_id++
      if (this.keyword) {
        this.music_list = []

        if (!this.access_token) {
          const response = await axios.get('https://fy393u9qvd.execute-api.ap-northeast-1.amazonaws.com/access-token', {params: {user_id: this.uid}})
  
          this.access_token = JSON.parse(response.data.body)[0].access_token
        }

        try {
          this.getTracks(this.access_token)
        } catch {
          this.updateAccessToken()
        }
      }
    },
    async getTracks (access_token) {
      const spotify = require('spotify-web-api-js')
      const spotify_api = new spotify()

      spotify_api.setAccessToken(access_token)

      try {
        const data = await spotify_api.searchTracks(this.keyword, {limit: 12, offset: this.page * 12})
        const tracks = data.tracks.items
        tracks.forEach(track => {
          const music = {
            title: track.name,
            artist: track.artists[0].name,
            image_url: track.album.images[0].url,
            preview_url: track.preview_url,
            audio_url: track.preview_url
          }
          this.music_list.push(music)
        })
      } catch {
        throw new Error(`Expired Access Token`)
      }
    },
    updateAccessToken () {
      const request = require('request')

      const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
          'Authorization': 'Basic ' + process.env.VUE_APP_SPOTIFY_ENCODED_SECRET
        },
        form: {
          grant_type: 'refresh_token',
          refresh_token: process.env.VUE_APP_SPOTIFY_REFLESH_TOKEN
        },
        json: true
      }

      request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
          this.access_token = body.access_token
          this.getTracks(this.access_token)
          axios.post('https://fy393u9qvd.execute-api.ap-northeast-1.amazonaws.com/access-token', {user_id: this.uid, access_token: this.access_token})
        }
      })
    },
    ...mapActions(['switchDialog', 'setMusicTemp', 'stopLoading'])
  },
  computed: {
    myAlbum () {
      return this.$store.getters.album
    },
    ...mapGetters(['uid'])
  }
}
</script>

<style lang="scss" scoped>
  p {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .container {
    max-width: 1200px;
  }
  .hover {
    opacity: 0.9;
    cursor: pointer;
  }
</style>