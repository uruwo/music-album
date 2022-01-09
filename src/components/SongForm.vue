<template>
  <v-row justify="center">
    <v-dialog
      v-model="$store.state.dialog"
      persistent
      max-width="600px"
    >
      <SongFormContents :key="$store.state.keyNewForm"></SongFormContents>
    </v-dialog>
  </v-row>
</template>

<script>
import SongFormContents from './SongFormContents.vue'
export default {
  components: {
    SongFormContents
  }
}
</script>