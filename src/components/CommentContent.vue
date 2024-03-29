<template>
  <v-card>
    <div class="header">
      <div class="pl-2">
        <v-card-title class="subtitle-1">{{ music.title }}</v-card-title>
        <v-card-subtitle class="py-0">{{ music.artist }}</v-card-subtitle>
      </div>

      <v-spacer></v-spacer>

      <div>
      <v-switch
        inset
        class="pr-6 pt-4"
        label="公開"
        v-model="music.public"
        hide-details color="#1976D2"
      ></v-switch>
      </div>
    </div>

    <v-card-text class="pb-0">
      <v-form ref="form">
        <v-textarea
          background-color="grey darken-4"
          v-model="music.comment"
          auto-grow
          clearable
          clear-icon="mdi-close-circle"
          placeholder="自由にご記述ください"
          counter="255"
          :rules="[text => text == undefined || text.length <= 255]"
          rows="10"></v-textarea>
      </v-form>
    </v-card-text>

    <v-card-actions>
      <v-btn
        v-if="$vuetify.breakpoint.xs"
        color="red darken-1"
        text
        @click="deleteConfirm(music.id)"
      >
        曲削除
      </v-btn>

      <v-spacer></v-spacer>

      <v-btn
        color="blue darken-1"
        text
        @click="switchCommentDialog"
      >
        キャンセル
      </v-btn>

      <v-btn
        color="blue darken-1"
        text
        @click="updateComment()"
      >
        保存
      </v-btn>

      <v-btn
        color="red darken-1"
        text
        @click="switchCommentDialog(); deleteMusicComment()"
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
      music: {},
      comment: null,
      public: false
    }
  },
  created () {
    this.music = this.$store.state.music_active
    this.comment = this.music.comment
    this.public = this.music.public
  },
  methods: {
    deleteMusicComment () {
      if (confirm('この感想を削除してよろしいですか?')) {
        delete this.music.comment
        this.music.date = false
        this.deleteComment({id: this.music.id})
        this.deleteMusicInEveryones({id: this.music.id})
        this.deleteLikedComment(this.music.id)
      }
    },
    updateComment () {
      if (!this.$refs.form.validate()) {
        return
      }

      this.switchCommentDialog()

      if (!this.music.profile_name) {
        this.$set(this.music, 'profile_name', this.$store.state.profile.profile.name)
        this.$set(this.music, 'profile_image', this.$store.state.profile.profile.profile_image)
      }

      if (!this.music.date) {
        this.$set(this.music, 'date', Date.now())
      }

      if (!this.music.public) {
        this.deleteMusicInEveryones({id: this.music.id})
      }
      
      this.updateMusic({id: this.music.id, music: this.music})
      this.updateCommentView({id: this.music.id, music: this.music})

      if (this.music.public) {
        if (!this.comment || !this.public) {
          this.addTmpMusicToEveryones(this.music)
        } else {
          this.updateMusicInEveryones({id: this.music.id, music: this.music})
        }
      }
    },
    deleteConfirm (id) {
      if (confirm('この楽曲を削除してよろしいですか?')) {
        this.deleteMusic({id})
        this.deleteMusicInEveryones({id})
        this.deleteLikedComment(id)
        this.switchCommentDialog()
      }
    },
    ...mapActions(['switchCommentDialog','updateMusic', 'deleteComment','updateMusicInEveryones', 'deleteMusicInEveryones', 'deleteLikedComment', 'updateCommentView', 'deleteMusic', 'addTmpMusicToEveryones'])
  },
  computed: {
    ...mapGetters(['uid'])
  }
}
</script>

<style scoped>
  .header {
    display: flex;
  }
</style>