<template>
  <v-row justify="center">
    <v-dialog
      v-model="$store.state.update_album_dialog"
      persistent
      max-width="600px"
      :key="$store.state.album_dialog_key"
    >
      <UpdateAlbumContents></UpdateAlbumContents>
    </v-dialog>
  </v-row>
</template>

<script>
import UpdateAlbumContents from './UpdateAlbumContents.vue'
export default {
  components: {
    UpdateAlbumContents
  }
}
</script>