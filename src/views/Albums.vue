<template>
  <v-container :class="[{'px-10': $vuetify.breakpoint.mdAndUp}]">
    <v-row>
      <v-col cols="9" sm="5">
        <v-text-field
        v-model="keyword"
        label="アルバム名"
        type="text"
        :class="[{'mt-2': $vuetify.breakpoint.xs}, {'mt-16': $vuetify.breakpoint.smAndUp}]"
        @blur="filterAlbums"
        ref="blur_this"
        @keyup.enter.exact="blur"
        >
          <template v-slot:append>
            <v-btn icon plain :ripple="false" @click="clearKeyword" v-if="keyword">
              <v-icon color="grey darken-1">mdi-close-circle</v-icon>
            </v-btn>
            
            <v-btn icon plain :ripple="false" @click="filterAlbums">
              <v-icon color="grey darken-1">mdi-magnify</v-icon>
            </v-btn>
          </template>
        </v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col @click="switchCreateAlbumDialog" class="child-flex pa-2" cols="6" sm="3" md="2">
        <v-img
          class="hover"
          :src="create"
          aspect-ratio="1"
        >
        </v-img>
        <p></p>
      </v-col>

      <v-col class="child-flex pa-2" cols="6" sm="3" md="2" v-if="$store.state.new_album_is_loading">
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
        v-for="(album, index) in filtered_albums"
        :key="index"
        class=" child-flex pa-2"
        cols="6" sm="3" md="2"
      >
        <v-img
          @mouseover="hover(index)"
          @mouseleave="leave()"
          :class="{hover: hover_index === index}"
          :lazy-src="album.image_url.match(/images%2F(.+)\?/)[1] !== 'undefined' ? album.image_url: 'undefined.jpeg'"
          :src="album.image_url.match(/images%2F(.+)\?/)[1] !== 'undefined' ? album.image_url: 'undefined.jpeg'"
          aspect-ratio="1"
          @click="$router.push({name: 'Album', params: {album_id: album.id}})"
          @click.right.prevent="switchUpdateAlbumDialog(); setAlbumTemp(album)"
        >
        </v-img>

        <p class="text-caption ma-0 mt-1">{{ album.title }}</p>
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
      albums: [],
      filtered_albums: [],
      hover_index: null,
      hover_creater: false
    }
  },
  created () {
    this.albums = this.$store.state.albums
    this.filtered_albums = this.albums
  },
  watch: {
    keyword: function (newVal) {
      if (!newVal) {
        this.filtered_albums = this.albums
      }
    },
    myAlbums () {
      this.stopLoadingNewAlbum()
    }
  },
  computed: {
    myAlbums () {
      return this.$store.getters.albums
    }
  },
  methods: {
    hover (index) {
      this.hover_index = index
    },
    leave () {
      this.hover_index = null
    },
    clearKeyword () {
      this.keyword = ''
      this.blur()
    },
    blur () {
      this.$refs.blur_this.blur()
    },
    filterAlbums () {
      const albums = []
      for (const i in this.albums) {
        let album = this.albums[i]
        if (album.title.indexOf(this.keyword) !== -1) {
            albums.push(album)
        }
      }
      this.filtered_albums = albums
    },
    ...mapActions(['switchCreateAlbumDialog','switchUpdateAlbumDialog','setAlbumTemp', 'stopLoadingNewAlbum'])
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
  .v-image {
    border-radius: 10px;
  }
  .hover {
    opacity: 0.9;
    cursor: pointer;
  }
</style>