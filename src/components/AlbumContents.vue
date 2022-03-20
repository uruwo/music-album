<template>
  <v-container>
    <v-row>
      <v-spacer v-if="album_id"></v-spacer>
      <v-col cols="9" sm="5" v-if="!album_id">
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
      <v-col class="mt-16 text-center" v-else>
        <v-chip outlined class="mt-2 mb-3 px-10" label large disabled color="grey lighten-1">
          <v-icon left>mdi-music-box-multiple-outline</v-icon>
          {{ album_title }}
        </v-chip>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
    <v-row>
      <v-col @click="switchDialog" class="child-flex pa-2" cols="6" sm="3" md="2">
        <v-img
          @mouseover="hover_creater = true"
          @mouseleave="hover_creater = false"
          class="hover"
          :src="create"
          aspect-ratio="1"
        >
        </v-img>
        <p></p>
      </v-col>
      <v-col class="child-flex pa-2" cols="6" sm="3" md="2" v-if="$store.state.loading">
        <v-img
          aspect-ratio="1"
        >
          <template v-slot>
            <v-row
              class="fill-height ma-0"
              align="center"
              justify="center"
            >
            <v-overlay :absolute="true">
              <v-progress-circular
                indeterminate
                color="grey lighten-5"
              ></v-progress-circular>
            </v-overlay>
            </v-row>
          </template>
        </v-img>
      </v-col>
      <v-col
        v-for="(music, index) in filteredAlbum"
        :key="index"
        class=" child-flex pa-2"
        cols="6" sm="3" md="2"
      >
        <v-img
          :lazy-src="music.image_url.match(/images%2F(.+)\?/)[1] !== 'undefined' ? music.image_url: undefined_image"
          :src="music.image_url.match(/images%2F(.+)\?/)[1] !== 'undefined' ? music.image_url: undefined_image"
          aspect-ratio="1"
          class="hover"
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
        <p class="text-caption ma-0 mt-1">{{ music.title }}</p>
        <p class="text-caption ma-0">{{ music.artist }}</p>
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
      create: 'https://default-image-bucket.s3.ap-northeast-1.amazonaws.com/create-song.jpg',
      undefined_image: 'https://default-image-bucket.s3.ap-northeast-1.amazonaws.com/undefined.jpeg',
      hoverFlag: false,
      album: [],
      filteredAlbum: [],
      audio: new Audio(),
      hover_creater: false,
      album_title: '',
      album_id: ''
    }
  },
  created () {
    if (this.$route.params.album_id) {
      this.album_id = this.$route.params.album_id
      this.album = this.$store.state.album.filter(music => music.album_id.includes(this.album_id))
      this.album_title = this.$store.state.albums.filter(album => album.id === this.album_id)[0].title
    } else {
      this.album = this.$store.state.album
    }
      this.filteredAlbum = this.album
      this.putFilteredAlbum(this.album)
  },
  watch: {
    keyword: function (newVal) {
      if (!newVal) {
        this.filteredAlbum = this.album
        this.putFilteredAlbum(this.filteredAlbum)
      }
    },
    myAlbum () {
      this.stopLoading()
      if (this.album_id) {
        this.reloadAlbum()
      }
    },
    music_tmp () {
      if (this.album_id) {
        this.reloadAlbum()
      }
    },
    myAlbums () {
      this.stopLoadingAlbum()
      if (this.album_id) {
        this.reloadAlbums()
      }
    }
  },
  computed: {
    myAlbum () {
      return this.$store.getters.album
    },
    music_tmp () {
      return this.$store.getters.music_tmp
    },
    myAlbums () {
      return this.$store.getters.albums
    }
  },
  methods: {
    reloadAlbum () {
      this.album = this.$store.state.album.filter(music => music.album_id.includes(this.album_id))
      this.filteredAlbum = this.album
      this.putFilteredAlbum(this.album)
    },
    reloadAlbums () {
      this.album_title = this.$store.state.albums.filter(album => album.id === this.album_id)[0].title
    },
    clearKeyword () {
      this.keyword = ''
      this.blur()
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
        this.hoverIndex = null
      }, 100)
    },
    play (music) {
      this.switchBarContent(music)
      this.switchPlayerBar()
    },
    ...mapActions(['switchDialog','switchDialogUpdate','setMusicTemp','switchPlayerBar','switchBarContent','switchCommentState','setMusicActive','putFilteredAlbum', 'stopLoading', 'stopLoadingAlbum'])
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
  .v-chip--disabled {
    opacity: 1;
  }
</style>