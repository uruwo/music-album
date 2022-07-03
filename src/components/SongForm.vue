<template>
  <v-row justify="center">
    <v-dialog
      v-model="$store.state.dialog.create_music_dialog"
      persistent
      max-width="600px"
    >
      <NewTrackContents :key="$store.state.dialog.music_dialog_key" v-if="$route.path.includes('explore')"></NewTrackContents>
      <SongFormContents :key="$store.state.dialog.music_dialog_key" v-else></SongFormContents>
    </v-dialog>
  </v-row>
</template>

<script>
import SongFormContents from './SongFormContents.vue'
import NewTrackContents from './NewTrackContents.vue'
export default {
  components: {
    SongFormContents,
    NewTrackContents
  }
}
</script>