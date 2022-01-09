<template>
  <div class="container">
    <v-card width="300">
      <v-list-item>
        <v-list-item-content class="py-2">
          <v-list-item-title class="text-center mb-2">
            {{ $store.state.profile.name }}
          </v-list-item-title>
          <v-list-item-title class="mb-2">
            <v-img width="128" :src="myImage" aspect-ratio="1" class="mx-auto"></v-img>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list dense class="py-0">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>鑑賞データ</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>演奏者</v-list-item-title>
          </v-list-item-content>
          <p class="text-body-2 my-2" >{{ artists }}人</p>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>曲</v-list-item-title>
          </v-list-item-content>
          <p class="text-body-2 my-2" >{{ album.length }}曲</p>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>感想</v-list-item-title>
          </v-list-item-content>
          <p class="text-body-2 my-2" >{{ comments }}曲</p>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>プロフィール</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-divider></v-divider>
        <v-list-item>
          <v-list-item-title>自己紹介</v-list-item-title>
        </v-list-item>
        <p class="font-size px-4">{{ $store.state.profile.comment }}</p>
      </v-list>
    </v-card>
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
            @change="putFilteredAlbum(filteredAlbum.filter(music => music.user_id === uid))"
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
            <v-avatar tile rounded="sm" @click="music.user_id === uid ? $router.push({name: 'Profile'}) : $router.push({name: 'OtherProfile', params: {user_id: music.user_id}})">
              <v-img :src="profileImage(music.user_id)" aspect-ratio="1"></v-img>
            </v-avatar>
          </div>
          <div class="flex-grow">
            <p class="ml-2 mb-2">{{ profileName(music.user_id) }}</p>
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
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { mapGetters } from 'vuex'
import "firebase/storage"
export default {
  data () {
    return {
      album: [],
      all_album: [],
      all_profile: [],
      profile: {name: 'ユーザー', profile_image: 'default_user_icon.png', comment: 'Write something you want to appeal.'},
      keyword: '',
    }
  },
  created () {
    if (!this.$store.state.all_profile.length) {
      this.fetchAllProfile()
    }
    this.album = this.$store.state.album
    this.all_album = this.$store.state.all_album
    this.all_profile = this.$store.state.all_profile
    this.putFilteredAlbum(this.filteredAlbum.filter(music => music.user_id === this.uid))
  },
  methods: {
    play (music) {
      this.switchBarContent(music)
      this.switchPlayerBar()
    },
    ...mapActions(['fetchAllProfile', 'switchBarContent', 'switchPlayerBar', 'putFilteredAlbum'])
  },
  computed: {
    artists: function () {
      return (this.album.filter((music, index, self) => self.findIndex(e => e.artist === music.artist) === index)).length
    },
    comments: function () {
      return (this.album.filter(music => music.comment)).length
    },
    filteredAlbum: function () {
      const album = []
      for (const i in this.all_album) {
        const music = this.all_album[i]
        if (music.title.indexOf(this.keyword) !== -1 ||
            music.artist.indexOf(this.keyword) !== -1) {
            album.push(music)
        }
      }
      return album.filter(music => music.comment).sort((a,b) => {
        let dateA = a.date
        let dateB = b.date
        if (dateA > dateB) {
          return -1
        }
        if (dateA < dateB) {
          return 1
        }
        return 0
      })
    },
    myImage: function () {
      if (this.$store.state.profile.profile_image) {
        return this.$store.state.profile.profile_image
      } else {
        return 'default_user_icon.png'
      }
    },
    profileImage: function () {
      return function(id) {
        const all_profile = this.$store.state.all_profile
        const index = all_profile.findIndex(profile => profile.user_id === id)
        if (index === -1) {
          return 'default_user_icon.png'
        } else {
          if (all_profile[index].profile_image) {
            return all_profile[index].profile_image
          } else {
            return 'default_user_icon.png'
          }
        }
      }
    },
    profileName: function () {
      return function(id) {
        const all_profile = this.$store.state.all_profile
        const index = all_profile.findIndex(profile => profile.user_id === id)
        if (index === -1) {
          return 'ユーザー'
        } else {
          if (all_profile[index].name) {
            return all_profile[index].name
          } else {
            return 'ユーザー'
          }
        }
      }
    },
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
  .font-size {
    font-size: 0.8125rem;
  }
  input {
    outline: none;
    color: white;
    text-align: center;
  }
  .v-input {
    font-size: 1rem;
    font-weight: 400;
  }
  .v-text-field .v-label {
    font-size: 1rem;
  }
</style>