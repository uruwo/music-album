<template>
  <v-card width="600" class="ml-4" min-height="100">
    <v-row>
      <v-col class="d-none d-sm-flex">
        <v-card-title class="subtitle-1 py-3">{{ profile.name }}さんのお気に入り</v-card-title>
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
          >
          <template v-slot:append>
          <v-icon color="grey darken-1">mdi-magnify</v-icon>
          </template>
          </v-text-field>
        </v-card-title>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <div
      v-for="(music, index) in filteredAlbum"
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
                <v-card-subtitle class="py-0">{{ music.artist }}</v-card-subtitle>
              </div>
              <v-spacer></v-spacer>
              <div>
                <v-card-title :class="[{ 'pr-10': $vuetify.breakpoint.smAndUp }, 'pl-0']">
                  <v-btn v-if="music.audio_url" class="d-none"></v-btn>
                  <v-btn icon @click="addLike({music_id: music.id, creater_id: music.user_id})" v-else-if="!$store.state.favorite_comment.includes(music.id)">
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
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import firebase from 'firebase'

export default {
  data () {
    return {
      album: [],
      keyword: '',
    }
  },
  props: [
    "favorite_comment",
    "profile"
  ],
  created () {
    if (!this.$route.params.user_id) {
      this.fetchFavoriteComments(this.$store.state.favorite_comment)
    } else {
      this.fetchFavoriteComments(this.favorite_comment)
    }
  },
  methods: {
    fetchFavoriteComments (favorite_comments) {
      for (const i in favorite_comments) {
        const favorite_comment = favorite_comments[i]
        firebase.firestore().collectionGroup('album').where('id', '==', favorite_comment).orderBy('date', 'desc').get().then(snapshot => snapshot.forEach(doc => {
          const music = doc.data()
          if (music.user_id !== this.uid) {
            delete music.audio_url
            delete music.image_url
          }
          this.album.push(music)
        }))
      }
    },
    watchProfile (music) {
      if (music.user_id === this.uid) {
        this.$router.push({name: 'MyComment'})
      } else {
        this.$router.push({name: 'OthersComment', params: {user_id: music.user_id}})
      }
    },
    ...mapActions(['addLike', 'deleteLike'])
  },
  computed: {
    filteredAlbum: function () {
      const album = []
      for (const i in this.album) {
        const music = this.album[i]
        if (music.title.indexOf(this.keyword) !== -1 ||
            music.artist.indexOf(this.keyword) !== -1) {
            album.push(music)
        }
      }
      return album.filter(music => music.comment).sort((a,b) => {
        let titleA = a.title.toUpperCase()
        let titleB = b.title.toUpperCase()
        if (titleA < titleB) {
          return -1
        }
        if (titleA > titleB) {
          return 1
        }
        return 0
      })
    },
    ...mapGetters(['uid'])
  }
}
</script>

<style scoped>
  .flex {
    display: flex;
  }
  .flex-grow {
    flex-grow: 1;
  }
</style>