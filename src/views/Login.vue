<template>
  <v-container>
    <v-row class="mt-14">
      <v-col align="center" justify="center">
        <h1>Music Album</h1>
        <p>ご利用の方はログインしてください</p>
      </v-col>
    </v-row>
    <v-row>
      <v-col align="center" justify="center">
        <v-btn
          height="48px"
          tile
          @click="login(); load()"
          class="px-8"
          
        >
            <v-avatar size="24" class="mr-4">
              <img
                src="https://madeby.google.com/static/images/google_g_logo.svg"
              />
            </v-avatar>
            Googleアカウントでログイン
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col align="center" justify="center">
        <v-btn
          height="48px"
          tile
          class="px-10"
          @click="guestLogin()"
        >
          <v-avatar size="24" class="mr-4">
            <img
              src="default_user_icon.png"
            />
          </v-avatar>
          ゲストアカウントでログイン
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import firebase from 'firebase'
import { mapActions } from 'vuex'
  export default {
    methods: {
      guestLogin () {
        firebase.auth().signInAnonymously()
      },
      load () {
        this.$router.push({name: 'Loading'})
      },
      ...mapActions(['login'])
    }
  }
</script>
