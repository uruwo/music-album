<template>
  <v-container>
    <v-row>
      <v-col cols="9" sm="5">
        <v-text-field
        v-model="keyword"
        label="曲名・アーティスト名・アルバム名"
        type="text"
        :class="[{'mt-2': $vuetify.breakpoint.xs}, {'mt-16': $vuetify.breakpoint.smAndUp}]"
        @blur="searchTracks()"
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
        >
          <template>
            <v-row
              class="fill-height ma-0"
              align="center"
              justify="center"
            >
              <v-btn icon @click="play(music, index)" v-if="music.preview_url && index !== is_play">
                <v-icon x-large>mdi-play-circle-outline</v-icon>
              </v-btn>
              <v-btn icon @click="pause()" v-if="index === is_play">
                <v-icon x-large color="blue">mdi-stop-circle-outline</v-icon>
              </v-btn>
            </v-row>
          </template>
        </v-img>
        <p class="text-caption ma-0 mt-1">{{ music.title }}</p>
        <p class="text-caption ma-0">{{ music.artist }}</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'

export default {
  data() {
    return {
      keyword: '',
      music_list: [],
      audio: new Audio(),
      is_play: null
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
  watch: {
    keyword: function (newVal) {
      if (!newVal) {
        this.music_list = this.$store.state.spotify_playlist
      }
    }
  },
  methods: {
    clearKeyword () {
      this.keyword = ''
      this.blur()
    },
    blur () {
      this.$refs.blurThis.blur()
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
    searchTracks () {
      this.pause()
      if (this.keyword) {
        this.music_list = []
        axios.get('https://fy393u9qvd.execute-api.ap-northeast-1.amazonaws.com/access-token', {params: {user_id: this.uid}}).then(response => {
          const access_token = JSON.parse(response.data.body)[0].access_token
          try {
            this.getTracks(access_token)
          } catch {
            this.updateAccessToken()
          }
        })
      }
    },
    getTracks (access_token) {
      const spotify = require('spotify-web-api-js')
      const spotify_api = new spotify()

      spotify_api.setAccessToken(access_token)
      spotify_api.searchTracks(this.keyword, {limit: 24}).then(data => {
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
      }).catch(() => {
        throw new Error(`Expired Access Token`)
      })
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
          const access_token = body.access_token
          this.getTracks(access_token)
          axios.post('https://fy393u9qvd.execute-api.ap-northeast-1.amazonaws.com/access-token', {user_id: this.uid, access_token: access_token})
        }
      })
    },
  },
  computed: {
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