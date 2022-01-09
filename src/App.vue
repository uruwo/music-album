<template>
  <v-app>
    <header>
      <AppBar></AppBar>
      <SideNav></SideNav>
    </header>
    <v-content>
      <SongForm></SongForm>
      <UpdateForm></UpdateForm>
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
    ProfileComment
  },
  created () {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setLoginUser(user)
        this.fetchAlbum()
        this.fetchProfile()
        this.fetchAllAlbum()
        if ( this.$router.currentRoute.name === 'Login') this.$router.push({name: 'Home'})
      } else {
        this.deleteLoginUser()
        this.$router.push({name: 'Login'})
      }
    })
  },
  methods: {
    ...mapActions(['setLoginUser','deleteLoginUser','fetchAlbum','fetchProfile', 'fetchAllAlbum'])
  },
  computed: {
    ...mapGetters(['userName', 'photoURL'])
  }
};
</script>

<style lang="scss" scoped>
  footer {
    height: 100px;
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
