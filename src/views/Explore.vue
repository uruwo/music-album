<template>
  <v-container>
    <v-row>
      <v-col cols="9" sm="5">
        <v-text-field
        v-model="keyword"
        label="曲名・アーティスト名"
        type="text"
        :class="[{'mt-2': $vuetify.breakpoint.xs}, {'mt-16': $vuetify.breakpoint.smAndUp}]"
        ref="blurThis"
        @keyup.enter.exact="blur"
        >
        <template v-slot:append>
        <v-btn icon plain :ripple="false" @click="clearKeyword" v-if="keyword">
          <v-icon color="grey darken-1">mdi-close-circle</v-icon>
        </v-btn>
        <v-btn icon plain :ripple="false">
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
    }
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