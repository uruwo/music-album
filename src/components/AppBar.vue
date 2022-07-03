<template>
  <v-app-bar app color="#121212" flat>
    <v-avatar size="30">
      <img :src="photo_url ? photo_url : 'default_user_icon.png'">
    </v-avatar>

    <v-toolbar-title>
      Music Album
    </v-toolbar-title>

    <v-toolbar-items v-if="$store.state.login.login_user">
      <v-btn class="visible" text @click="logout">ログアウト</v-btn>
    </v-toolbar-items>

    <v-tabs v-if="$store.state.login.login_user" right optional>
      <v-tab to="/home">ホーム</v-tab>
      <v-tab to="/explore">探索</v-tab>
      <v-tab to="/albums">アルバム</v-tab>
      <v-tab to="/profile/comment">マイページ</v-tab>
      <v-tab to="/comments">みんなの感想</v-tab>
    </v-tabs>

    <v-spacer></v-spacer>

    <v-toolbar-items v-if="!$store.state.login.login_user && this.$route.path === '/'">
      <v-btn text to="/login">ログイン</v-btn>
    </v-toolbar-items>

    <v-app-bar-nav-icon @click="toggleSideMenu" v-if="$store.state.login.login_user"></v-app-bar-nav-icon>
  </v-app-bar>
</template>

<script>
import { mapActions } from 'vuex'
import { mapGetters } from 'vuex'

export default {
  methods: {
    ...mapActions(['logout', 'toggleSideMenu'])
  },
  computed: {
    ...mapGetters(['photo_url'])
  }
}
</script>

<style lang="scss" scoped>
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

  .visible {
    display: none;

    @include display_pc {
      display: block !important;
    }
  }
</style>