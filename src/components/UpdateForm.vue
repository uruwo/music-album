<template>
  <v-row justify="center">
    <v-dialog
      v-model="$store.state.dialog_update"
      persistent
      max-width="600px"
    >
      <FormContents :key="$store.state.keyForm"></FormContents>
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