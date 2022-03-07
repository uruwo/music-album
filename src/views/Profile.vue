<template>
  <div :class="[{'media': $vuetify.breakpoint.xs}, 'container']">
    <MyStatus></MyStatus>
    <router-view :follower="follower" :followee="followee" :profile="$store.state.profile" :artists_album="artists_album" :titles_album="titles_album" :comments="comments"></router-view>
  </div>
</template>

<script>
import MyStatus from '../components/MyStatus.vue'

export default {
  components: {
    MyStatus
  },
  data () {
    return {
      followee: [],
      follower: [],
      album: []
    }
  },
  created () {
    this.followee = this.$store.state.my_followee
    this.follower = this.$store.state.my_follower
    this.album = this.$store.state.album
  },
  computed: {
    artists_album: function () {
      return (this.album.filter((music, index, self) => self.findIndex(e => e.artist === music.artist) === index))
    },
    titles_album: function () {
      return (this.album.filter((music, index, self) => self.findIndex(e => e.title === music.title) === index))
    },
    comments: function () {
      return this.album.filter(music => music.comment)
    }
  }
}
</script>

<style scoped>
  .container {
    display: flex;
    justify-content: center;
    margin-top: 40px;
    align-items: flex-start;
  }
  .media {
    justify-content: center;
    margin-top: 20px;
    flex-direction: column;
  }
</style>