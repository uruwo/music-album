<template>
  <v-card width="600" :class="[{'ml-4': $vuetify.breakpoint.smAndUp}, {'mt-4': $vuetify.breakpoint.xs}]" min-height="100">
    <v-card-title class="subtitle-1 py-3" v-if="$route.path.includes('artists')">{{ profile.name }}さんが聴いたアーティスト</v-card-title>
    <v-card-title class="subtitle-1 py-3" v-else>{{ profile.name }}さんが聴いた曲</v-card-title>
    <v-divider></v-divider>
    <div
      v-for="(music, index) in album"
      :key="index"
    >
      <v-card color="grey darken-4" class="ma-2">
        <v-card-title 
          class="subtitle-1 pt-2" 
          v-if="$route.path.includes('artists')" 
          @click="$route.path.includes('other_profile') ? $router.push({name: 'OthersComment', params: {user_id: $route.params.user_id, keyword: music.artist}}) : $router.push({name: 'MyComment', params: {keyword: music.artist}})"
        >{{ music.artist }}</v-card-title>
        <v-card-title 
          class="subtitle-1 pt-2" 
          v-else @click="$route.path.includes('other_profile') ? $router.push({name: 'OthersComment', params: {user_id: $route.params.user_id, keyword: music.title}}) : $router.push({name: 'MyComment', params: {keyword: music.title}})"
        >{{ music.title }}</v-card-title>
      </v-card>
    </div>
  </v-card>
</template>

<script>
export default {
  props: [
    'album',
    'profile'
  ]
}
</script>