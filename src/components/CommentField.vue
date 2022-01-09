<template>
  <v-row justify="center">
    <v-dialog
      v-model="$store.state.comment"
      max-width="500px"
      persistent
      hide-overlay
      no-click-animation
    >
      <CommentContent :key="$store.state.comment_key"></CommentContent>
    </v-dialog>
  </v-row>
</template>

<script>
import CommentContent from './CommentContent.vue'
export default {
  components: {
    CommentContent
  },
}
</script>