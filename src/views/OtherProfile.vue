<template>
  <div class="container">
    <v-card width="300">
      <v-list-item>
        <v-list-item-content class="py-2">
          <v-list-item-title class="text-center mb-2">
            {{ profile.name }}
          </v-list-item-title>
          <v-list-item-title class="mb-2">
            <v-img width="128" :src="profile.profile_image" aspect-ratio="1" class="mx-auto"></v-img>
          </v-list-item-title>
          <v-list-item-title class="text-center">
            <v-btn v-if="!my_followee.includes($route.params.user_id)" @click="follow($route.params.user_id)">
              フォローする
            </v-btn>
            <v-btn v-else color="blue" @click="remove($route.params.user_id)">
              フォローを外す
            </v-btn>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list dense class="py-0">
        <v-list-item class="title-color">
          <v-list-item-content>
            <v-list-item-title>鑑賞データ</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
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
        <v-list-item class="title-color">
          <v-list-item-content>
            <v-list-item-title>プロフィール</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>フォロー</v-list-item-title>
          </v-list-item-content>
          <p class="text-body-2 my-2" >{{ followee.length }}人</p>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>フォロワー</v-list-item-title>
          </v-list-item-content>
          <p class="text-body-2 my-2">{{ follower.length }}人</p>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item>
          <v-list-item-title>自己紹介</v-list-item-title>
        </v-list-item>
        <p class="font-size px-4">{{ profile.comment }}</p>
      </v-list>
    </v-card>
    <v-card width="600" class="ml-4" min-height="100">
      <v-row>
        <v-col class="d-none d-sm-flex">
          <v-card-title class="subtitle-1 py-3">{{ profile.name }}さんの感想</v-card-title>
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
            <v-avatar tile rounded="sm">
              <v-img :src="profile.profile_image" aspect-ratio="1"></v-img>
            </v-avatar>
          </div>
          <div class="flex-grow">
            <p class="ml-2 mb-2">{{ profile.name }}</p>
            <v-card color="grey darken-4" class="ma-2">
              <div class="flex">
                <div>
                  <v-card-title class="subtitle-1 pt-2">{{ music.title }}</v-card-title>
                  <v-card-subtitle class="py-0">{{ music.artist }}</v-card-subtitle>
                </div>
                <v-spacer></v-spacer>
                <div>
                  <v-card-title :class="{ 'pr-10': $vuetify.breakpoint.smAndUp }">
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
import firebase from 'firebase'
import { mapActions } from 'vuex'
import { mapGetters } from 'vuex'
import axios from 'axios'

export default {
  data () {
    return {
      album: [],
      follower: [],
      followee: [],
      my_followee: [],
      profile: {
        name: 'ユーザー',
        comment: 'Write something you want to appeal.',
        profile_image:'https://default-image-bucket.s3.ap-northeast-1.amazonaws.com/default_user_icon.png'
      },
      keyword: '',
    }
  },
  created () {
    const user_id = this.$route.params.user_id
    firebase.firestore().collection(`users/${user_id}/profile`).get().then(snapshot => snapshot.forEach(doc => this.profile = doc.data()))
    this.album = this.$store.state.all_album.filter(music => music.user_id === user_id)

    axios.get('http://52.69.186.157:8000/followee/' + user_id).then(
      response => {
        response.data.forEach(item => this.followee.push(item.followee_id))
      }
    )
    axios.get('http://52.69.186.157:8000/follower/' + user_id).then(
      response => {
        response.data.forEach(item =>this.follower.push(item.follower_id))
      }
    )

    this.my_followee = this.$store.state.my_followee
  },
  methods: {
    follow (user_id) {
      this.follower.push(this.uid)
      this.addFollowee(user_id)
    },
    remove (user_id) {
      const index = this.follower.findIndex(id => id === this.uid)
      this.follower.splice(index, 1)
      this.deleteFollowee(user_id)
    },
    ...mapActions(['addFollowee', 'deleteFollowee'])
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
  .title-color {
    background-color: #272727 !important;
  }
</style>