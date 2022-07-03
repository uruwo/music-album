<template>
  <v-row justify="center">
    <v-dialog
      v-model="$store.state.dialog.update_music_dialog"
      persistent
      max-width="600px"
    >
      <FormContents :key="$store.state.dialog.music_dialog_key"></FormContents>
    </v-dialog>
  </v-row>
</template>

<script>
import FormContents from './FormContents.vue'
export default {
  components: {
    FormContents
  }
}
</script>