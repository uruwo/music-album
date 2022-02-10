<template>
  <RelationalUser :profile="profile" :user="follower"></RelationalUser>
</template>

<script>
import RelationalUser from '../components/RelationalUser.vue'

export default {
  components: {
    RelationalUser
  },
  props: [
    'follower',
    'profile'
  ]
}
</script>