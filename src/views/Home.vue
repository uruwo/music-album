<template>
  <v-container>
    <v-row>
      <v-col cols=9 sm="8">
        <v-text-field
        v-model="keyword"
        label="曲名・アーティスト名"
        type="text"
        :class="[{'mt-2': $vuetify.breakpoint.xs}, {'mt-16': $vuetify.breakpoint.smAndUp}]"
        @blur="filterAlbum"
        ref="blurThis"
        @keyup.enter.exact="blur"
        >
        <template v-slot:append>
        <v-btn icon plain :ripple="false" @click="clearKeyword" v-if="keyword">
          <v-icon color="grey darken-1">mdi-close-circle</v-icon>
        </v-btn>
        <v-btn icon plain :ripple="false" @click="filterAlbum">
          <v-icon color="grey darken-1">mdi-magnify</v-icon>
        </v-btn>
        </template>
        </v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col @click="switchDialog" class="child-flex pa-2" cols="6" sm="3" md="2">
        <v-img
          :src="create"
          aspect-ratio="1"
          class="grey lighten-2"
        >
        </v-img>
        <p></p>
      </v-col>
      <v-col
        v-for="(music, index) in filteredAlbum"
        :key="index"
        class=" child-flex pa-2"
        cols="6" sm="3" md="2"
      >
        <v-img
          :lazy-src="music.image_url.match(/images%2F(.+)\?/)[1] !== 'undefined' ? music.image_url: 'undefined.jpeg'"
          :src="music.image_url.match(/images%2F(.+)\?/)[1] !== 'undefined' ? music.image_url: 'undefined.jpeg'"
          aspect-ratio="1"
          class="grey lighten-2"
          @mouseover="mouseHover(index)"
          @mouseleave="mouseLeave"
          @click="setMusicActive(music); switchCommentState()"
          @click.right.prevent="switchDialogUpdate(); setMusicTemp(music)"
        >
          <template>
            <v-row
              class="fill-height ma-0"
              align="center"
              justify="center"
            >
              <v-btn icon @click.stop="play(music)" v-if="hoverFlag && index === hoverIndex && music.audio_url.match(/audios%2F(.+)\?/)[1] !== 'undefined'">
                <v-icon x-large @mouseover="mouseHover(index)" @mouseleave="mouseLeave">mdi-play-circle-outline</v-icon>
              </v-btn>
            </v-row>
          </template>
        </v-img>
        <p class="text-caption ma-0 mt-1">{{ music.artist }}</p>
        <p class="text-caption ma-0">{{ music.title }}</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data() {
    return {
      keyword: '',
      create: 'song-images/create-song.jpg',
      hoverFlag: false,
      album: [],
      filteredAlbum: [],
      audio: new Audio(),
    }
  },
  created () {
    this.album = this.$store.state.album
    this.filteredAlbum = this.album
    this.putFilteredAlbum(this.album)
  },
  watch: {
    keyword: function (newVal) {
      if (!newVal) {
        this.filteredAlbum = this.album
        this.putFilteredAlbum(this.filteredAlbum)
      }
    }
  },
  methods: {
    clearKeyword () {
      this.keyword = ''
    },
    blur () {
      this.$refs.blurThis.blur()
    },
    filterAlbum () {
      const album = []
      for (const i in this.album) {
        let music = this.album[i]
        if (music.title.indexOf(this.keyword) !== -1 ||
            music.artist.indexOf(this.keyword) !== -1) {
            album.push(music)
        }
      }
      this.filteredAlbum = album
      this.putFilteredAlbum(this.filteredAlbum)
    },
    mouseHover (index) {
      setTimeout(() => {
        this.hoverFlag = true
        this.hoverIndex = index
      }, 100)
    },
    mouseLeave () {
      setTimeout(() => {
        this.hoverFlag = false
      }, 100)
    },
    play (music) {
      this.switchBarContent(music)
      this.switchPlayerBar()
    },
    ...mapActions(['switchDialog','switchDialogUpdate','setMusicTemp','switchPlayerBar','switchBarContent','switchCommentState','setMusicActive','putFilteredAlbum'])
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
    max-width: 900px;
  }
</style>