<template>
  <listening-data :album="artists_album" :profile="profile" :comments="comments"></listening-data>
</template>

<script>
import ListeningData from '../components/ListeningData.vue'

export default {
  components: {
    ListeningData
  },
  props: [
    'artists_album',
    'profile',
    'comments'
  ]
}
</script>