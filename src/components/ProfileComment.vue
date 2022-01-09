<template>
  <v-row justify="center">
    <v-dialog
      v-model="$store.state.dialog_profile"
      max-width="500px"
      persistent
      hide-overlay
      no-click-animation
    >
      <ProfileContent :key="$store.state.profile_key"></ProfileContent>
    </v-dialog>
  </v-row>
</template>

<script>
import ProfileContent from './ProfileContent.vue'
export default {
  components: {
    ProfileContent
  },
}
</script>