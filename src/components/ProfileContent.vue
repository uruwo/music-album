<template>
  <v-card>
    <v-card-title class="subtitle-1 pb-0">自己紹介</v-card-title>

    <v-card-text class="pb-0">
      <v-textarea
        background-color="grey darken-4"
        v-model="profile.comment"
        auto-grow
        clearable
        clear-icon="mdi-close-circle">
        </v-textarea>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>

      <v-btn
        color="blue darken-1"
        text
        @click="cancel"
      >
        キャンセル
      </v-btn>

      <v-btn
        color="blue darken-1"
        text
        @click="saveComment"
      >
        保存
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  data () {
    return {
      profile: {},
      comment: ''
    }
  },
  created () {
    this.profile = this.$store.state.profile.profile
    this.comment = this.$store.state.profile.profile.comment
  },
  methods: {
    cancel () {
      this.profile.comment = this.comment
      this.switchProfileDialog()
    },
    saveComment () {
      this.$set(this.profile, 'user_id', this.uid)
      this.updateProfile({id: this.$store.state.profile.profile.id, profile: this.profile})
      this.switchProfileDialog()
    },
    ...mapActions(['switchProfileDialog', 'updateProfile'])
  },
  computed: {
    ...mapGetters(['uid'])
  }
}
</script>