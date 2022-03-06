<template>
  <listening-data :album="titles_album" :profile="profile"></listening-data>
</template>

<script>
import ListeningData from '../components/ListeningData.vue'

export default {
  components: {
    ListeningData
  },
  props: [
    'titles_album',
    'profile'
  ]
}
</script>