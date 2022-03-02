<template>
  <v-card :class="[{'card-xs': $vuetify.breakpoint.xs}, {'card-sm-up': $vuetify.breakpoint.smAndUp}]">
    <v-list-item>
      <v-list-item-content class="py-2">
        <v-list-item-title v-if="!edit" class="text-center mb-2 ml-4">
          {{ $store.state.profile.name }}
          <v-icon small @click="doEdit">mdi-pencil</v-icon>
        </v-list-item-title>
        <v-list-item-title v-else class="text-center mb-2">
          <input type="text" v-model="profile.name" @blur="changeName" v-focus ref="blurThis" @keyup.enter.exact="blur">
        </v-list-item-title>
        <input style="display: none" ref="input" type="file" accept="image/*" @change="fileUpload">
        <v-list-item-title class="mb-2">
          <v-img width="128" :src="profileImage" aspect-ratio="1" class="mx-auto" @click="$refs.input.click(); setProfile()"></v-img>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <div :class="{'media': $vuetify.breakpoint.xs }">
      <v-list dense class="py-0">
        <v-list-item class="title-color">
          <v-list-item-content>
            <v-list-item-title>鑑賞データ</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>アーティスト</v-list-item-title>
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
        <v-list-item @click="$router.push({name: 'MyComment'})">
          <v-list-item-content>
            <v-list-item-title>感想</v-list-item-title>
          </v-list-item-content>
          <p class="text-body-2 my-2" >{{ comments }}曲</p>
        </v-list-item>
        <v-divider :class="{'d-none': $vuetify.breakpoint.smAndUp}"></v-divider>
      </v-list>
      <v-list dense class="py-0">
        <v-list-item class="title-color">
          <v-list-item-content>
            <v-list-item-title>プロフィール</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="$router.push({name: 'MyFollowee'})">
          <v-list-item-content>
            <v-list-item-title>フォロー</v-list-item-title>
          </v-list-item-content>
          <p class="text-body-2 my-2" >{{ followee.length }}人</p>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item @click="$router.push({name: 'MyFollower'})">
          <v-list-item-content>
            <v-list-item-title>フォロワー</v-list-item-title>
          </v-list-item-content>
          <p class="text-body-2 my-2">{{ follower.length }}人</p>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item @click="$router.push({name: 'MyFavoriteComment'})">
          <v-list-item-content>
            <v-list-item-title>いいねした感想</v-list-item-title>
          </v-list-item-content>
          <p class="text-body-2 my-2">{{ $store.state.favorite_comment.length }}編</p>
        </v-list-item>
        <v-divider></v-divider>
      </v-list>
    </div>
    <v-list dense class="py-0">
      <v-list-item>
        <v-list-item-title>自己紹介</v-list-item-title>
        <v-icon small @click="switchDialogProfile">mdi-pencil</v-icon>
      </v-list-item>
    </v-list>
    <p class="font-size px-4">{{ $store.state.profile.comment }}</p>
  </v-card>
</template>

<script>
import firebase from 'firebase'
import "firebase/storage"
import { mapActions } from 'vuex'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      album: [],
      profile: {},
      edit: false,
      followee: [],
      follower: []
    }
  },
  created () {
    this.album = this.$store.state.album
    this.followee = this.$store.state.my_followee
    this.follower = this.$store.state.my_follower
  },
  directives: {
    focus: {
      inserted: function (el) {
        el.focus()
      }
    }
  },
  methods: {
    blur () {
      this.$refs.blurThis.blur()
    },
    setProfile () {
      this.profile = this.$store.state.profile
    },
    doEdit () {
      this.edit = true
      this.setProfile()
    },
    changeName () {
      this.$set(this.profile, 'user_id', this.uid)
      this.updateProfile({id: this.$store.state.profile.id, profile: this.profile})
      this.$store.state.commented_album.forEach(music => this.updateCommentUser({id: music.id, user_name: this.profile.name}))
      this.edit = false
    },
    async fileUpload (event) {
      this.$set(this.profile, 'user_id', this.uid)
      let file = event.target.files[0]
      const storageImage = firebase.storage().ref(`users/${this.uid}/profile_images/` + file.name)
      const that = this
      await storageImage.getDownloadURL().then(onResolve, onReject)
      function onResolve(url) {
        that.$set(that.profile, 'profile_image', url)
      }
      async function onReject () {
        await storageImage.put(file)
        await storageImage.getDownloadURL().then(url => {
          that.$set(that.profile, 'profile_image', url)
        })
      }
      this.$store.state.album.forEach(music => this.updateCommentImage({id: music.id, image_url: this.profile.profile_image}))
      this.updateProfile({id: this.$store.state.profile.id, profile: this.profile})
    },
    ...mapActions(['updateProfile', 'switchDialogProfile', 'updateCommentImage', 'updateCommentUser'])
  },
  computed: {
    artists: function () {
      return (this.album.filter((music, index, self) => self.findIndex(e => e.artist === music.artist) === index)).length
    },
    comments: function () {
      return (this.album.filter(music => music.comment)).length
    },
    profileImage: function () {
      if (this.$store.state.profile.profile_image) {
        return this.$store.state.profile.profile_image
      } else {
        return 'https://default-image-bucket.s3.ap-northeast-1.amazonaws.com/default_user_icon.png'
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
  .media {
    display: flex;
    width: 100%;
  }
  .card-xs {
    width: 600px;
  }
  .card-sm-up {
    width: 300px;
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
  .v-list {
    width: 100%;
  }
</style>