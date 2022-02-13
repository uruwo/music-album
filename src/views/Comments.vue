<template>
  <div class="container">
    <MyStatus></MyStatus>
    <v-card width="600" class="ml-4" min-height="100">
      <v-row>
        <v-col class="d-none d-sm-flex">
          <v-card-title class="subtitle-1 py-3">みんなの感想</v-card-title>
        </v-col>
        <v-col>
          <v-card-title class="pa-0 px-4">
            <v-text-field
            single-line
            class="pt-0 mt-3"
            v-model="keyword"
            dense
            placeholder="曲名・アーティスト名"
            type="text"
            @keyup.enter.exact="firstFilter"
            >
            <template v-slot:append>
              <v-btn icon plain :ripple="false" @click="firstFilter">
                <v-icon color="grey darken-1">mdi-magnify</v-icon>
              </v-btn>
            </template>
            </v-text-field>
          </v-card-title>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <div
        v-for="(music, index) in all_album"
        :key="index"
      >
        <div class="flex mt-2 ml-2">
          <div>
            <v-avatar tile rounded="sm" @click="watchProfile(music)">
              <v-img :src="music.profile_image" aspect-ratio="1"></v-img>
            </v-avatar>
          </div>
          <div class="flex-grow">
            <p class="ml-2 mb-2">{{ music.profile_name }}</p>
            <v-card color="grey darken-4" class="ma-2">
              <div class="flex">
                <div>
              <v-card-title class="subtitle-1 pt-2">{{ music.title }}</v-card-title>
              <v-card-subtitle class="pt-0 pb-2">{{ music.artist }}</v-card-subtitle>
                </div>
                <v-spacer></v-spacer>
                <div>
                  <v-card-title :class="[{ 'pr-10': $vuetify.breakpoint.smAndUp }, 'pl-0']">
                    <v-btn icon @click="play(music)" v-if="music.audio_url && music.audio_url.match(/audios%2F(.+)\?/)[1] !== 'undefined'">
                      <v-icon large>mdi-play-circle-outline</v-icon>
                    </v-btn>
                    <v-btn icon v-else-if="music.audio_url && music.audio_url.match(/audios%2F(.+)\?/)[1] == 'undefined'" class="d-none">
                    </v-btn>
                    <v-btn icon @click="addLike({music_id: music.id, creater_id: music.user_id})" v-else-if="!music.audio_url && !favorite_comment.includes(music.id)">
                      <v-icon>mdi-thumb-up-outline</v-icon>
                    </v-btn>
                    <v-btn icon v-else @click="deleteLike(music.id)">
                      <v-icon color="blue">mdi-thumb-up</v-icon>
                    </v-btn>
                  </v-card-title>
                </div>
              </div>
              <v-card-text class="pb-0 pt-0 mt-n2">
                <v-textarea
                  class="mt-0"
                  background-color="#1E1E1E"
                  v-model="music.comment"
                  loading="false"
                  readonly
                >
                </v-textarea>
              </v-card-text>
            </v-card>
          </div>
        </div>
        <v-divider></v-divider>
      </div>
      <v-card min-height="2000px" v-if="!$store.state.last_comment"></v-card>
      <v-card min-height="2000px" v-if="dummy"></v-card>
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
import firebase from 'firebase'
import MyStatus from '../components/MyStatus.vue'
import InfiniteLoading from 'vue-infinite-loading'

export default {
  components: {
    MyStatus,
    InfiniteLoading
  },
  data () {
    return {
      all_album: [],
      favorite_comment: [],
      keyword: '',
      last_comment: null,
      infinite_id: 0,
      dummy: false
    }
  },
  created () {
    this.all_album = this.$store.state.all_album
    this.putFilteredAlbum(this.$store.state.album)
    this.favorite_comment = this.$store.state.favorite_comment
  },
  watch: {
    keyword: function (newVal) {
      if (!newVal) {
        this.all_album = this.$store.state.all_album
        this.last_comment = null
        this.infinite_id += 1
      }
    }
  },
  methods: {
    firstFilter () {
      this.infinite_id += 1
      this.last_comment = null
      this.all_album = []
      this.firstFilterFetch('artist')
      this.firstFilterFetch('title')
      this.dummy = true
      setTimeout(() => {
        this.dummy = false
      },1000)
    },
    firstFilterFetch (field) {
      firebase.firestore().collectionGroup('album').where("date", "!=", null).where(field, '==', this.keyword).orderBy('date', 'desc').limit(5).get().then(snapshot => {
        if (snapshot.docs.length !== 0) {
          this.last_comment = snapshot.docs[snapshot.docs.length - 1]
          snapshot.forEach(doc => {
            const music = doc.data()
            if (music.user_id !== this.uid) {
              delete music.audio_url
              delete music.image_url
            }
            this.all_album.push(music)
          })
        }
      })
    },
    blur () {
      this.$refs.blurThis.blur()
    },
    play (music) {
      this.switchBarContent(music)
      this.switchPlayerBar()
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
      firebase.firestore().collectionGroup('album').where("date", "!=", null).orderBy("date", "desc").startAfter(this.$store.state.last_comment).limit(5).get().then(snapshot => {
        snapshot.forEach(doc => {
          const music = doc.data()
          if (music.user_id !== this.uid) {
            delete music.audio_url
            delete music.image_url
          }
          this.all_album.push(music)
        })
        if (snapshot.docs.length === 5) {
          setTimeout(() => {
            this.setLastComment(snapshot.docs[snapshot.docs.length - 1])
            $state.loaded()
          }, 1000)
        } else {
          $state.complete()
        }
      })
    },
    filterHandler ($state) {
      this.nextFilterFetch('artist', $state)
      this.nextFilterFetch('title', $state)
    },
    nextFilterFetch (field, $state) {
      firebase.firestore().collectionGroup('album').where("date", "!=", null).where(field, '==', this.keyword).orderBy('date', 'desc').startAfter(this.last_comment).limit(5).get().then(snapshot => {
        if (snapshot.docs.length !== 0) {
          snapshot.forEach(doc => {
            const music = doc.data()
            if (music.user_id !== this.uid) {
              delete music.audio_url
              delete music.image_url
            }
            this.all_album.push(music)
          })
          if (snapshot.docs.length === 5) {
            setTimeout(() => {
              this.last_comment = snapshot.docs[snapshot.docs.length - 1]
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
    ...mapActions(['fetchAllProfile', 'switchBarContent', 'switchPlayerBar', 'putFilteredAlbum', 'addLike', 'deleteLike', 'setLastComment'])
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
</style>