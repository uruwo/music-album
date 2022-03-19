<template>
  <v-row justify="center">
    <v-dialog
      v-model="$store.state.dialog_album"
      persistent
      max-width="600px"
    >
      <AlbumFormContents :key="$store.state.album_key"></AlbumFormContents>
    </v-dialog>
  </v-row>
</template>

<script>
import AlbumFormContents from './AlbumFormContents.vue'
export default {
  components: {
    AlbumFormContents
  }
}
</script>