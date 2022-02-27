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
import { mapActions } from 'vuex'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      profile: {},
      comment: ''
    }
  },
  created () {
    this.profile = this.$store.state.profile
    this.comment = this.$store.state.profile.comment
  },
  methods: {
    cancel () {
      this.profile.comment = this.comment
      this.switchDialogProfile()
    },
    saveComment () {
      this.$set(this.profile, 'user_id', this.uid)
      if (this.$store.state.profile.id) {
        this.updateProfile({id: this.$store.state.profile.id, profile: this.profile})
      } else {
        this.addProfile(this.profile)
      }
      this.switchDialogProfile()
    },
    ...mapActions(['switchDialogProfile', 'addProfile', 'updateProfile'])
  },
  computed: {
    ...mapGetters(['uid'])
  }
}
</script>