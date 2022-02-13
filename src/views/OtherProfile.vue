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
              フォロー中
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
        <v-list-item @click="$router.push({name: 'OthersComment', params: {user_id: $route.params.user_id}})">
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
        <v-list-item @click="$router.push({name: 'OthersFollowee', params: {user_id: $route.params.user_id}})">
          <v-list-item-content>
            <v-list-item-title>フォロー</v-list-item-title>
          </v-list-item-content>
          <p class="text-body-2 my-2" >{{ followee.length }}人</p>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item @click="$router.push({name: 'OthersFollower', params: {user_id: $route.params.user_id}})">
          <v-list-item-content>
            <v-list-item-title>フォロワー</v-list-item-title>
          </v-list-item-content>
          <p class="text-body-2 my-2">{{ follower.length }}人</p>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item @click="$router.push({name: 'OthersFavoriteComment', params: {user_id: $route.params.user_id}})">
          <v-list-item-content>
            <v-list-item-title>いいねした感想</v-list-item-title>
          </v-list-item-content>
          <p class="text-body-2 my-2">{{ favorite_comment.length }}編</p>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item>
          <v-list-item-title>自己紹介</v-list-item-title>
        </v-list-item>
        <p class="font-size px-4">{{ profile.comment }}</p>
      </v-list>
    </v-card>
    <router-view :profile="profile" :follower="follower" :followee="followee" :album="album" :favorite_comment="favorite_comment"></router-view>
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
      favorite_comment: []
    }
  },
  beforeRouteUpdate (to, from , next) {
    const to_user = to.path.substring(to.path.lastIndexOf('/') + 1)
    const from_user = from.path.substring(from.path.lastIndexOf('/') + 1)
    if (to.name === 'OthersComment' && to_user !== from_user) {
      this.fetchData(to.params.user_id)
    }
    next()
  },
  created () {
    this.fetchData(this.$route.params.user_id)
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
    fetchData (user_id) {
      firebase.firestore().collection(`users/${user_id}/profile`).get().then(snapshot => snapshot.forEach(doc => this.profile = doc.data()))
      firebase.firestore().collection(`users/${user_id}/album`).get().then(
        snapshot => {
          this.album = []
          snapshot.forEach(doc => this.album.push(doc.data()))
        }
      )
      axios.get('http://52.69.186.157:8000/followee/' + user_id).then(
        response => {
          this.followee = []
          response.data.forEach(item => this.followee.push(item.followee_id))
        }
      )
      axios.get('http://52.69.186.157:8000/follower/' + user_id).then(
        response => {
          this.follower = []
          response.data.forEach(item =>this.follower.push(item.follower_id))
        }
      )
      axios.get(this.$store.state.api_like, {params: { user_id: user_id }}).then(
        response => {
          JSON.parse(response.data.body).forEach(item => this.favorite_comment.push(item.music_id))
        }
      )
      this.my_followee = this.$store.state.my_followee
    },
    ...mapActions(['addFollowee', 'deleteFollowee'])
  },
  computed: {
    artists: function () {
      return (this.album.filter((music, index, self) => self.findIndex(e => e.artist === music.artist) === index)).length
    },
    comments: function () {
      return this.album.filter(music => music.comment).length
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