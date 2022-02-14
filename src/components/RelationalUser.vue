<template>
  <v-card width="600" class="ml-4" min-height="100">
    <v-card-title class="subtitle-1 py-3" v-if="this.$route.path.includes('followee')">{{ profile.name }}さんがフォロー</v-card-title>
    <v-card-title class="subtitle-1 py-3" v-else>{{ profile.name }}さんのフォロワー</v-card-title>
    <v-divider></v-divider>
    <div
      v-for="(user, index) in users"
      :key="index"
    >
      <div class="flex mt-2 ml-2">
        <div>
          <v-avatar tile rounded="sm" @click="watchProfile(user)">
            <v-img :src="user.profile_image" aspect-ratio="1"></v-img>
          </v-avatar>
        </div>
        <div class="flex-grow">
          <p class="ml-2 mb-2">{{ user.name }}</p>
          <v-card color="grey darken-4" class="ma-2">
            <v-card-text class="pb-0 pt-0 mt-n2">
              <v-textarea
                class="mt-0"
                background-color="#1E1E1E"
                v-model="user.comment"
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
      users: [],
    }
  },
  props: [
    'user',
    'profile'
  ],
  created () {
    firebase.firestore().collectionGroup('profile')
      .where('user_id',
      'in',
      this.user
      )
      .get().then(snapshot => snapshot.forEach(
        doc => this.users.push(doc.data())
        )
      )
  },
  methods: {
    watchProfile (user) {
      if (user.user_id === this.uid) {
        this.$router.push({name: 'MyComment'})
      } else {
        this.$router.push({name: 'OthersComment', params: {user_id: user.user_id}})
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