<template>
  <v-app>
    <header>
      <AppBar></AppBar>
      <SideNav></SideNav>
    </header>
    <v-content>
      <SongForm></SongForm>
      <UpdateForm></UpdateForm>
      <AlbumForm></AlbumForm>
      <UpdateAlbum></UpdateAlbum>
      <ProfileComment></ProfileComment>
      <PlayerBar v-if="$store.state.login_user"></PlayerBar>
      <CommentField></CommentField>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-content>
    <footer>
    </footer>
  </v-app>
</template>

<script>
import firebase from 'firebase'
import SideNav from './components/SideNav.vue'
import AppBar from './components/AppBar.vue'
import SongForm from './components/SongForm.vue'
import UpdateForm from './components/UpdateForm.vue'
import PlayerBar from './components/PlayerBar.vue'
import CommentField from './components/CommentField.vue'
import ProfileComment from './components/ProfileComment.vue'
import AlbumForm from './components/AlbumForm.vue'
import UpdateAlbum from './components/UpdateAlbum.vue'
import { mapActions } from 'vuex'
import { mapGetters } from 'vuex'

export default {
  name: 'App',
  components: {
    SideNav,
    AppBar,
    SongForm,
    UpdateForm,
    PlayerBar,
    CommentField,
    ProfileComment,
    AlbumForm,
    UpdateAlbum
  },
  created () {
    firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        const auth_token = await user.getIdToken()
        this.setLoginUser({user: user, token:auth_token})
        this.fetchAlbum()
        this.fetchAlbums()
        this.fetchProfile()
        this.fetchAllAlbum()
        this.fetchFavoriteComments()
        this.fetchLikedComments()
        this.fetchFollowee()
        this.fetchFollower()
        this.fetchPlaylist()

        if (user.isAnonymous) {
          this.$router.push({name: 'Explore'})
          return
        }

        firebase.auth().getRedirectResult().then(result => {
          const is_new_user = result.additionalUserInfo?.isNewUser
          if (this.$router.currentRoute.name === 'Login') {
            if (is_new_user) {
              this.$router.push({name: 'Explore'})
            } else {
              this.$router.push({name: 'Home'})
            }
          }
        })
      } else {
        this.deleteLoginUser()
        this.$router.push({name: 'Top'})
      }
    })
  },
  methods: {
    ...mapActions(['setLoginUser','deleteLoginUser','fetchAlbum','fetchProfile', 'fetchAllAlbum', 'fetchFavoriteComments', 'fetchLikedComments', 'fetchFollowee', 'fetchFollower', 'fetchAlbums', 'fetchPlaylist'])
  },
  computed: {
    ...mapGetters(['photoURL'])
  }
};
</script>

<style lang="scss" scoped>
  footer {
    height: 100px;
  }
  .container {
    max-width: 100%;
  }
  .v-toolbar__title {
    overflow: visible !important;
    margin-right: 50px !important;
    margin-left: 50px !important;
  }

  .v-app-bar__nav-icon {
    @include display_pc {
      display: none !important;
    }
  }

  .v-tabs {
    display: none;

    @include display_pc {
      display: block !important;
    }
  }
</style>
