<template>
  <v-card tile>
    <v-progress-linear
      v-model="progress"
      class="my-0"
      height="3"
      @change="onChange"
    ></v-progress-linear>

    <v-list>
      <v-list-item>
        <v-list-item-content :class="{ 'd-none': $vuetify.breakpoint.xs }">
          <v-slider
            hide-details
            v-model="volume"
            prepend-icon="mdi-volume-high"
            class="slider"
          ></v-slider>
        </v-list-item-content>

        <v-list-item-icon :class="[{ 'd-none': $vuetify.breakpoint.smAndUp }, 'mr-2']">
          <v-btn icon @click="setMusicActive(music); switchCommentDialog()">
            <v-icon>mdi-message-text</v-icon>
          </v-btn>
        </v-list-item-icon>

        <v-spacer></v-spacer>

        <v-list-item-avatar tile size="45" class="ma-0 mx-4 d-none d-sm-flex">
          <v-img :src="music.image_url"></v-img>
        </v-list-item-avatar>

        <v-list-item-content :class="[{ 'theme-xs': $vuetify.breakpoint.xs }, { 'theme-sm': $vuetify.breakpoint.sm }]">
          <v-list-item-title>{{ music.title }}</v-list-item-title>
          <v-list-item-subtitle>{{ music.artist }}</v-list-item-subtitle>
        </v-list-item-content>

        <v-spacer></v-spacer>

        <v-list-item-icon :class="[{ 'mr-8': $vuetify.breakpoint.mdAndUp }, { 'd-none': $vuetify.breakpoint.xs}]">
          <v-btn icon @click="setMusicActive(music); switchCommentDialog()">
            <v-icon>mdi-message-text</v-icon>
          </v-btn>
        </v-list-item-icon>

        <v-list-item-icon>
          <v-btn icon @click="rewind">
            <v-icon>mdi-rewind</v-icon>
          </v-btn>
        </v-list-item-icon>

        <v-list-item-icon :class="{ 'mx-5': $vuetify.breakpoint.mdAndUp }">
          <v-btn icon @click="is_play ? stop(): play()">
            <v-icon x-large v-if="is_play">mdi-pause</v-icon>
            <v-icon x-large v-else>mdi-play</v-icon>
          </v-btn>
        </v-list-item-icon>

        <v-list-item-icon
          class="ml-0"
          :class="{ 'mr-3': $vuetify.breakpoint.mdAndUp }"
        >
          <v-btn icon @click="next()">
            <v-icon>mdi-fast-forward</v-icon>
          </v-btn>
        </v-list-item-icon>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      music: {},
      album: [],
      audio: new Audio,
      is_play: false,
      duration: 0,
      current_time: 0,
      volume: 50
    }
  },
  created () {
    this.music = this.$store.state.music_active
    this.album = this.$store.state.filtered_album.filter(music => music.audio_url.match(/audios%2F(.+)\?/)[1] !== 'undefined')
  },
  async mounted () {
    this.audio.src = this.music.audio_url
    this.audio.load()

    this.audio.addEventListener('loadedmetadata', () => {
      this.duration = this.audio.duration
    })

    this.audio.addEventListener('timeupdate', () => {
      this.current_time = this.audio.currentTime
      this.audio.volume = this.volume / 100
    })

    this.audio.addEventListener('ended', () => {
      this.next()
    })

    await this.play()
  },
  computed: {
    progress: {
      get() {
        return (this.current_time / this.duration) * 100
      },
      set(new_value) {
        return new_value
      }
    },
  },
  async beforeDestroy () {
    await this.audio.pause()
  },
  methods: {
    play () {
      this.audio.play()
      this.is_play = true
    },
    stop () {
      this.audio.pause()
      this.is_play = false
    },
    rewind () {
      const index = this.album.findIndex(music => music.id == this.music.id)

      if (this.audio.currentTime > 2) {
        this.audio.currentTime = 0
      } else if (index == 0) {
        this.switchPlayerBarContent(this.album[this.album.length-1])
      } else {
        this.switchPlayerBarContent(this.album[index-1])
      }
    },
    next () {
      const index = this.album.findIndex(music => music.id == this.music.id)

      if (index == this.album.length - 1) {
        this.switchPlayerBarContent(this.album[0])
      } else {
        this.switchPlayerBarContent(this.album[index + 1])
      }
      
      this.switchPlayerBar()
    },
    onChange (event) {
      this.audio.currentTime = (event / 100) * this.duration
    },
    ...mapActions(['switchCommentDialog','switchPlayerBar','switchPlayerBarContent','setMusicActive'])
  }
}
</script>

<style lang="scss" scoped>
  .v-list-item__content {
    overflow: visible;
  }
  .v-progress-linear {
    cursor: pointer;
  }
  .wrap-text {
    overflow-wrap: break-word;
    white-space: normal;
  }
  .slider {
    min-width: 120px;
    max-width: 120px;
  }
  .theme-xs {
    max-width: 190px;
  }
  .theme-sm {
    max-width: 290px;
  }
</style>