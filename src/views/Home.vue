<template>
  <v-container>
    <v-row>
      <v-col cols=8>
        <v-text-field
        v-model="keyword"
        @change="putFilteredAlbum(filteredAlbum)"
        label="曲名・アーティスト名"
        type="text"
        class="mt-16"
        >
        <template v-slot:append>
        <v-icon color="grey darken-1">mdi-magnify</v-icon>
        </template>
        </v-text-field>
      </v-col>
      <v-col class="mt-16" v-show="false">
        <div align="center" class="mt-4">
          <v-btn>比較・鑑賞</v-btn>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col @click="switchDialog" class="child-flex pa-2" cols="4" sm="3" md="2">
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
        cols="4" sm="3" md="2"
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
                <v-icon x-large @mouseover="mouseHover(index)" @mouseleave="mouseLeave" >mdi-play-circle-outline</v-icon>
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
      audio: new Audio(),
    }
  },
  created () {
    this.album = this.$store.state.album
    this.putFilteredAlbum(this.album)
  },
  computed: {
    filteredAlbum: function () {
      const album = []
      for (const i in this.album) {
        let music = this.album[i]
        if (music.title.indexOf(this.keyword) !== -1 ||
            music.artist.indexOf(this.keyword) !== -1) {
            album.push(music)
        }
      }
      return album
    }
  },
  methods: {
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
</style>