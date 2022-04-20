<template>
  <v-row justify="center">
    <v-dialog
      v-model="$store.state.comment_dialog"
      max-width="500px"
      persistent
      hide-overlay
      no-click-animation
      scrollable
      :key="$store.state.comment_dialog_key"
    >
      <CommentContent></CommentContent>
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