<template>
  <v-card>
    <v-card-title class="subtitle-1">{{ music.title }}</v-card-title>
    <v-card-subtitle class="py-0">{{ music.artist }}</v-card-subtitle>
    <v-card-text class="pb-0">
      <v-textarea
        background-color="grey darken-4"
        v-model="music.comment"
        auto-grow
        clearable
        clear-icon="mdi-close-circle"
        placeholder="自由にご記述ください"
        rows="12"></v-textarea>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        color="blue darken-1"
        text
        @click="switchCommentState"
      >
        キャンセル
      </v-btn>
      <v-btn
        color="blue darken-1"
        text
        @click="switchCommentState(); updateComment()"
      >
        保存
      </v-btn>
      <v-btn
        color="red darken-1"
        text
        @click="switchCommentState(); deleteMusicComment()"
      >
        削除
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
      music: {}
    }
  },
  created () {
    this.music = this.$store.state.music_active
  },
  methods: {
    deleteMusicComment () {
      delete this.music.comment
      this.deleteComment({id: this.music.id, music: this.music})
      this.deleteCommentInAll({id: this.music.id, music: this.music})
    },
    updateComment () {
      if (!this.music.date) {
        this.$set(this.music, 'date', Date.now())
      }
      this.updateMusic({id: this.music.id, music: this.music})
      this.updateMusicInAll({id: this.music.id, music: this.music})
    },
    ...mapActions(['switchCommentState','updateMusic', 'deleteComment','updateMusicInAll', 'deleteCommentInAll'])
  },
  computed: {
    ...mapGetters(['uid'])
  }
}
</script>