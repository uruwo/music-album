<template>
  <v-card width="600" class="ml-4" min-height="100">
    <v-card-title class="subtitle-1 py-3">{{ profile.name }}さんのフォロワー</v-card-title>
    <v-divider></v-divider>
    <div
      v-for="(follower, index) in followers"
      :key="index"
    >
      <div class="flex mt-2 ml-2">
        <div>
          <v-avatar tile rounded="sm" @click="watchProfile(follower)">
            <v-img :src="follower.profile_image" aspect-ratio="1"></v-img>
          </v-avatar>
        </div>
        <div class="flex-grow">
          <p class="ml-2 mb-2">{{ follower.name }}</p>
          <v-card color="grey darken-4" class="ma-2">
            <v-card-text class="pb-0 pt-0 mt-n2">
              <v-textarea
                class="mt-0"
                background-color="#1E1E1E"
                v-model="follower.comment"
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
import firebase from 'firebase'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      followers: [],
    }
  },
  props: [
    'follower',
    'profile'
  ],
  created () {
    firebase.firestore().collectionGroup('profile')
      .where('user_id',
      'in',
      this.follower
      )
      .get().then(snapshot => snapshot.forEach(
        doc => this.followers.push(doc.data())
        )
      )
  },
  methods: {
    watchProfile (follower) {
      if (follower.user_id === this.uid) {
        this.$router.push({name: 'MyComment'})
      } else {
        this.$router.push({name: 'OthersComment', params: {user_id: follower.user_id}})
      }
    },
  },
  computed: {
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