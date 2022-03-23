<template>
  <div class="text-center">
    <v-bottom-sheet
     v-model="$store.state.player_bar"
     hide-overlay
     persistent
     no-click-animation
     :retain-focus="false"
     :key="$store.state.player_bar"
     scrollable
     >
      <BarContents :key="$store.state.key"></BarContents>
    </v-bottom-sheet>
  </div>
</template>

<script>
import BarContents from './BarContents.vue'
export default {
  components: {
    BarContents
  }
}
</script>