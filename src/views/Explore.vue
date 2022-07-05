<template>
  <v-container :class="[{'px-10': $vuetify.breakpoint.mdAndUp}]">
    <div :class="[{'mt-3': $vuetify.breakpoint.xs}, {'mt-10': $vuetify.breakpoint.smAndUp}]">
      <v-chip
        outlined
        class="mr-2"
        v-model="filter.track"
        @click="selectFilter('track')"
        filter
      >
        曲名
      </v-chip>

      <v-chip
        outlined
        class="mr-2"
        v-model="filter.artist"
        @click="selectFilter('artist')"
        filter
      >
        アーティスト名
      </v-chip>

      <v-chip
        outlined
        v-model="filter.album"
        @click="selectFilter('album')"
        filter
      >
        アルバム名
      </v-chip>
    </div>

    <v-row>
      <v-col cols="9" sm="5">
        <v-text-field
          class="pt-0"
          v-model="keyword"
          type="text"
          @blur="searchTracks(); pause()"
          ref="blur_this"
          @keyup.enter.exact="blur"
        >
          <template v-slot:append>
            <v-btn
              icon
              plain
              :ripple="false"
              @click="clearKeyword()"
              v-if="keyword"
            >
              <v-icon color="grey darken-1">mdi-close-circle</v-icon>
            </v-btn>

            <v-btn
              icon
              plain
              :ripple="false"
              @click="blur()"
            >
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
          :lazy-src="music.preview_image"
          :src="music.preview_image"
          aspect-ratio="1"
          class="hover"
          @click="switchCreateMusicDialog(); setMusicTemp(music)"
        >
          <template>
            <v-row
              class="fill-height ma-0"
              align="center"
              justify="center"
            >
              <v-btn
                icon
                @click.stop="play(music, index)"
                v-if="music.preview_audio && index !== is_play"
              >
                <v-icon x-large>mdi-play-circle-outline</v-icon>
              </v-btn>

              <v-btn
                icon
                @click.stop="pause()"
                v-if="index === is_play"
              >
                <v-icon x-large color="blue">mdi-stop-circle-outline</v-icon>
              </v-btn>
            </v-row>
          </template>
        </v-img>

        <p class="text-caption ma-0 mt-1">{{ music.title }}</p>
        <p class="text-caption ma-0">{{ music.artist }}</p>
      </v-col>
    </v-row>

    <infinite-loading
      spinner="spiral"
      @infinite="infiniteHandler"
      :identifier="infinite_id"
      v-if="keyword"
      class="mt-10"
    >
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
      infinite_id: 0,
      filter: {
        'track': false,
        'artist': false,
        'album': false
      }
    }
  },
  created () {
    this.music_list = this.$store.state.spotify.spotify_playlist
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
        this.music_list = this.$store.state.spotify.spotify_playlist
      }
    },
    myAlbum () {
      this.stopLoadingNewMusic()
    },
    myAlbums () {
      this.stopLoadingNewAlbum()
    }
  },
  methods: {
    selectFilter (field) {
      const keys = Object.keys(this.filter)
      keys.forEach(key => {
        if (key !== field) {
          this.filter[key] = false
        }
      })

      this.filter[field] = !this.filter[field]
    },
    clearKeyword () {
      this.keyword = ''
      this.blur()
    },
    blur () {
      this.$refs.blur_this.blur()
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
      //キーワード検索のページネーション

      this.page++

      const list_length_before = this.music_list.length

      await this.getTracks(this.access_token)

      if (this.music_list.length - list_length_before === 24) {
        setTimeout(() => {
          this.infinite_id++
          $state.loaded()
        }, 1000)
      } else {
        $state.complete()
      }
    },
    async searchTracks () {
      //キーワード検索で最初のページのトラックを取得
      //アクセストークンの有効期限が切れていた場合、新規アクセストークンを発行

      this.page = 0

      if (this.keyword) {
        this.music_list = []

        if (!this.access_token) {
          const response = await axios.get('https://fy393u9qvd.execute-api.ap-northeast-1.amazonaws.com/access-token',
          {params: {user_id: this.uid}, headers: this.headers})

          this.access_token = JSON.parse(response.data.body)[0].access_token
        }

        try {
          this.getTracks(this.access_token)
        } catch {
          this.updateAccessToken()
        }
      }

      setTimeout(() => {
        this.infinite_id++
      }, 1000)
    },
    async getTracks (access_token) {
      const spotify = require('spotify-web-api-js')
      const spotify_api = new spotify()

      spotify_api.setAccessToken(access_token)

      const keys = Object.keys(this.filter)
      const field = keys.filter(key => this.filter[key] === true)

      try {
        const search_results = await spotify_api.searchTracks(`${field}:${this.keyword}`, {limit: 24, offset: this.page * 24})
        const tracks = search_results.tracks.items

        tracks.forEach(track => {
          const music = {
            title: track.name,
            artist: track.artists[0].name,
            image_url: track.album.images[0].url,
            preview_image: track.album.images[0].url,
            preview_audio: track.preview_url,
            audio_url: track.preview_url,
            spotify_url: track.external_urls.spotify
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
          axios.post('https://fy393u9qvd.execute-api.ap-northeast-1.amazonaws.com/access-token', {user_id: this.uid, access_token: this.access_token}, {headers: this.headers})
        }
      })
    },
    ...mapActions(['switchCreateMusicDialog', 'setMusicTemp', 'stopLoadingNewMusic', 'stopLoadingNewAlbum'])
  },
  computed: {
    myAlbum () {
      return this.$store.getters.album
    },
    myAlbums () {
      return this.$store.getters.albums
    },
    ...mapGetters(['uid', 'headers'])
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