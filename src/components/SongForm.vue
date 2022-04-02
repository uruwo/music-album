<template>
  <v-row justify="center">
    <v-dialog
      v-model="$store.state.dialog"
      persistent
      max-width="600px"
    >
      <NewTrackContents :key="$store.state.key_new_form" v-if="$route.path.includes('explore')"></NewTrackContents>
      <SongFormContents :key="$store.state.key_new_form" v-else></SongFormContents>
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