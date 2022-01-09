<template>
  <div class="text-center">
    <v-bottom-sheet
     ref="sheet"
     v-model="$store.state.player_bar"
     hide-overlay
     persistent
     no-click-animation
     :retain-focus="false">
      <BarContents :key="$store.state.key"></BarContents>
    </v-bottom-sheet>
  </div>
</template>

<script>
import BarContents from './BarContents.vue'
export default {
  components: {
    BarContents
  },
  computed: {
    bar() {
      return this.$store.getters.playerBar
    }
  },
  watch: {
    bar() {
      this.$nextTick(() => {
        this.$refs.sheet.showScroll()
      })
    }
  }
}
</script>