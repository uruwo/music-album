<template>
  <RelationalUser :profile="profile" :user="followee"></RelationalUser>
</template>

<script>
import RelationalUser from '../components/RelationalUser.vue'

export default {
  components: {
    RelationalUser
  },
  props: [
    'followee',
    'profile'
  ]
}
</script>