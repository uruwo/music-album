<template>
  <v-row justify="center">
    <v-dialog
      v-model="$store.state.album_update"
      persistent
      max-width="600px"
      :key="$store.state.album_key"
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