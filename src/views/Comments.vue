<template>
  <div :class="[{'media': $vuetify.breakpoint.xs}, 'container']">
    <MyStatus></MyStatus>

    <v-card
      width="700"
      :class="[{'ml-4': $vuetify.breakpoint.smAndUp}, {'mt-4': $vuetify.breakpoint.xs}]"
      min-height="100"
    >
      <v-row>
        <v-col class="d-none d-sm-flex">
          <v-card-title class="subtitle-1 py-3">みんなの感想</v-card-title>
        </v-col>

        <v-col>
          <v-card-title class="pa-0 px-4">
            <v-text-field
            ref="blurThis"
            single-line
            class="pt-0 mt-3"
            v-model="keyword"
            dense
            placeholder="曲名・アーティスト名"
            type="text"
            @keyup.enter.exact="firstFilterFetch"
            >
            <template v-slot:append>
              <v-btn icon plain :ripple="false" @click="clearKeyword" v-if="keyword">
                <v-icon color="grey darken-1">mdi-close-circle</v-icon>
              </v-btn>

              <v-btn icon plain :ripple="false" @click="firstFilterFetch">
                <v-icon color="grey darken-1">mdi-magnify</v-icon>
              </v-btn>
            </template>
            </v-text-field>
          </v-card-title>
        </v-col>
      </v-row>

      <v-divider></v-divider>

      <div
        v-for="(music, index) in everyones_commented_tracks"
        :key="index"
      >
        <div class="flex mt-2 ml-2">
          <div>
            <v-avatar tile rounded="sm" @click="watchProfile(music)">
              <v-img :src="music.profile_image" aspect-ratio="1" class="hover"></v-img>
            </v-avatar>
          </div>

          <div class="flex-grow">
            <p class="ml-2 mb-2">{{ music.profile_name }}</p>
            <v-card color="grey darken-4" class="ma-2">
              <div class="flex">
                <v-img
                  :class="[{'d-none': $vuetify.breakpoint.xs}]"
                  :src="music.preview_image ? music.preview_image : 'album.png'"
                  aspect-ratio="1"
                  class="mt-3 mb-2 ml-4"
                  max-width="60"
                  min-width="60"
                  height="60"
                >
                  <template>
                    <v-row
                      class="fill-height ma-0"
                      align="center"
                      justify="center"
                    >
                      <v-btn
                        icon
                        @click.stop="play_preview(music, index)"
                        v-if="music.preview_audio && index !== is_play"
                      >
                        <v-icon large class="preview">mdi-play-circle-outline</v-icon>
                      </v-btn>

                      <v-btn
                        icon
                        @click.stop="pause_preview()"
                        v-if="index === is_play"
                      >
                        <v-icon large color="blue">mdi-stop-circle-outline</v-icon>
                      </v-btn>
                    </v-row>
                  </template>
                </v-img>

                <div>
                  <v-card-title class="subtitle-1 pt-2">{{ music.title }}</v-card-title>
                  <v-card-subtitle class="pt-0 pb-2">{{ music.artist }}</v-card-subtitle>
                </div>

                <v-spacer></v-spacer>

                <v-card-title class="pa-0 mr-6">
                  <v-btn icon v-if="music.user_id === uid" class="d-none">
                  </v-btn>

                  <v-btn
                    icon
                    @click="addLike({music_id: music.id, creater_id: music.user_id})"
                    v-else-if="!favorite_comment.includes(music.id)"
                  >
                    <v-icon>mdi-thumb-up-outline</v-icon>
                  </v-btn>

                  <v-btn icon v-else @click="deleteLike(music.id)">
                    <v-icon color="blue">mdi-thumb-up</v-icon>
                  </v-btn>
                </v-card-title>

                <v-card-title class="pa-0 mr-6" v-if="music.spotify_url">
                  <v-btn icon @click="openSpotify(music.spotify_url)">
                    <v-img src="spotify_icon.png" max-width="29"></v-img>
                  </v-btn>
                </v-card-title>
              </div>

              <v-card-text class="pb-0 pt-0 mt-n2">
                <v-textarea
                  class="mt-0"
                  background-color="#1E1E1E"
                  v-model="music.comment"
                  loading="false"
                  readonly
                  auto-grow
                >
                </v-textarea>
              </v-card-text>
            </v-card>
          </div>
        </div>

        <v-divider></v-divider>
      </div>

      <v-card min-height="2000px" v-if="!$store.state.last_page"></v-card>
      
      <infinite-loading spinner="spiral" @infinite="infiniteHandler" :identifier="infinite_id">
        <template slot="no-more">No more message</template>
        <template slot="no-results">No more message</template>
      </infinite-loading>
    </v-card>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { mapGetters } from 'vuex'
import "firebase/storage"
import MyStatus from '../components/MyStatus.vue'
import InfiniteLoading from 'vue-infinite-loading'

export default {
  components: {
    MyStatus,
    InfiniteLoading
  },
  data () {
    return {
      everyones_commented_tracks: [],
      favorite_comment: [],
      keyword: '',
      infinite_id: 0,
      page: 0,
      audio: new Audio(),
      is_play: null
    }
  },
  created () {
    this.everyones_commented_tracks = this.$store.state.everyones_commented_tracks
    this.putFilteredAlbum(this.$store.state.album)
    this.favorite_comment = this.$store.state.favorite_comment
  },
  mounted () {
    this.audio.addEventListener('ended', () => {
      this.is_play = null
    })
  },
  watch: {
    keyword: function (newVal) {
      if (!newVal) {
        this.everyones_commented_tracks = this.$store.state.everyones_commented_tracks
        this.page = 0
        this.infinite_id += 1
      }
    }
  },
  methods: {
    clearKeyword () {
      this.keyword = ''
      this.blur()
    },
    firstFilterFetch () {
      this.blur()
      this.page = 0
      this.everyones_commented_tracks = []
      this.$algolia_index.search(this.keyword, {
        page: this.page,
        filters: `public=1 AND NOT date=0`
      }).then(snapshot => {
        if (snapshot.hits.length !== 0) {
          this.page++
          snapshot.hits.forEach(doc => {
            this.everyones_commented_tracks.push(doc)
          })
        }
      })
      setTimeout(() => {
        this.infinite_id += 1
      },1000)
    },
    blur () {
      this.$refs.blurThis.blur()
    },
    play (music) {
      this.switchPlayerBarContent(music)
      this.switchPlayerBar()
    },
    play_preview (music, index) {
      this.is_play = index
      this.audio.src = music.preview_audio
      this.audio.play()
    },
    pause_preview () {
      this.is_play = null
      this.audio.pause()
    },
    openSpotify (url) {
      window.open(url, '_blank')
    },
    watchProfile (music) {
      if (music.user_id === this.uid) {
        this.$router.push({name: 'MyComment'})
      } else {
        this.$router.push({name: 'OthersComment', params: {user_id: music.user_id}})
      }
    },
    infiniteHandler ($state) {
      if (!this.keyword) {
        this.normalHandler($state)
      } else {
        this.filterHandler($state)
      }
    },
    normalHandler ($state) {
      this.$algolia_index.search('', {
        page: this.$store.state.last_page,
        filters: 'public=1 AND NOT date=0'
      }).then(snapshot => {
        snapshot.hits.forEach(doc => {
          const music = doc
          this.everyones_commented_tracks.push(music)
        })
        if (snapshot.hits.length === 5) {
          setTimeout(() => {
            this.updateLastPage()
            $state.loaded()
          }, 1000)
        } else {
          this.updateLastPage()
          $state.complete()
        }
      })
    },
    filterHandler ($state) {
      this.$algolia_index.search(this.keyword, {
        page: this.page,
        filters: 'public=1 AND NOT date=0'
      }).then(snapshot => {
        if (snapshot.hits.length !== 0) {
          snapshot.hits.forEach(doc => {
            const music = doc
            this.everyones_commented_tracks.push(music)
          })
          if (snapshot.hits.length === 5) {
            setTimeout(() => {
              this.infinite_id += 1
              this.page++
              $state.loaded()
            }, 1000)
          } else {
            $state.complete()
          }
        } else {
          $state.complete()
        }
      })
    },
    ...mapActions(['fetchAllProfile', 'switchPlayerBarContent', 'switchPlayerBar', 'putFilteredAlbum', 'addLike', 'deleteLike', 'updateLastPage'])
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
  .media {
    justify-content: center;
    margin-top: 20px;
    flex-direction: column;
  }
  .spotify-button {
    text-transform: none;
  }
  .preview {
    opacity: 0.6;
  }
</style>