<template>
  <div>
    <v-overlay>
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
import firebase from 'firebase'
export default {
  mounted () {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.$router.push({name: 'Home'})
      }
    })
  }
}
</script>