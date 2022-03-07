<template>
  <v-card width="600" :class="[{'ml-4': $vuetify.breakpoint.smAndUp}, {'mt-4': $vuetify.breakpoint.xs}]" min-height="100">

    <v-card-title class="subtitle-1 py-3" v-if="$route.path.includes('artists')">{{ profile.name }}さんが聴いたアーティスト</v-card-title>
    <v-card-title class="subtitle-1 py-3" v-else>{{ profile.name }}さんが聴いた曲</v-card-title>

    <v-divider></v-divider>

    <div
      v-for="(music, index) in album"
      :key="index"
    >
      <v-card v-if="$route.path.includes('artists')" :color="commented_artists.includes(music.artist) ? 'grey darken-3' : 'grey darken-4'" class="ma-2">
        <v-card-title
          :class="[{'disabled': !commented_artists.includes(music.artist)},'subtitle-1 pt-2']"
          @click="$route.path.includes('other_profile') ? $router.push({name: 'OthersComment', params: {user_id: $route.params.user_id, keyword: music.artist}}) : $router.push({name: 'MyComment', params: {keyword: music.artist}})"
        >{{ music.artist }}</v-card-title>
      </v-card>

      <v-card v-else :color="commented_titles.includes(music.title) ? 'grey darken-3' : 'grey darken-4'" class="ma-2">
        <v-card-title
          :class="[{'disabled': !commented_titles.includes(music.title)},'subtitle-1 pt-2']"
          @click="$route.path.includes('other_profile') ? $router.push({name: 'OthersComment', params: {user_id: $route.params.user_id, keyword: music.title}}) : $router.push({name: 'MyComment', params: {keyword: music.title}})"
        >{{ music.title }}</v-card-title>
      </v-card>
    </div>
  </v-card>
</template>

<script>
export default {
  props: [
    'album',
    'profile',
    'comments'
  ],
  data () {
    return {
      commented_artists: [],
      commented_titles: []
    }
  },
  created () {
    this.comments.forEach(comment => this.commented_artists.push(comment.artist))
    this.comments.forEach(comment => this.commented_titles.push(comment.title))
  },
  // methods : {
  //   watchComment (music) {
  //     if (this.$route.path.includes('other_profile')) {
  //       this.$router.push({name: 'OthersComment', params: {user_id: $route.params.user_id, keyword: music.artist}})
  //     }
  //   }
  // }
}
</script>

<style scoped>
  .disabled {
    pointer-events: none;
  }
</style>