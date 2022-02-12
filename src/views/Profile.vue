<template>
  <div class="container">
    <MyStatus></MyStatus>
    <router-view :follower="follower" :followee="followee" :profile="$store.state.profile"></router-view>
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
      follower: []
    }
  },
  created () {
    this.followee = this.$store.state.my_followee
    this.follower = this.$store.state.my_follower
  },
}
</script>

<style scoped>
  .container {
    display: flex;
    justify-content: center;
    margin-top: 40px;
    align-items: flex-start;
  }
</style>