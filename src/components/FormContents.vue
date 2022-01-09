<template>
  <v-card>
    <v-card-title>
      <span class="text-h5">楽曲編集</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-text-field
              label="曲名" v-model="music.title"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              label="アーティスト名" v-model="music.artist"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-file-input accept="audio/*" label="楽曲を選択" :value="file_audio" @change="inputAudioFile" v-if="show" small-chips prepend-icon="mdi-file-music-outline"></v-file-input>
          </v-col>
          <v-col cols="12" sm="6">
            <v-file-input accept="image/*" label="画像を選択" :value="file_image" @change="inputImageFile" v-if="show" small-chips prepend-icon="mdi-file-image-outline"></v-file-input>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        color="blue darken-1"
        text
        @click="switchDialogUpdate"
      >
        キャンセル
      </v-btn>
      <v-btn
        color="blue darken-1"
        text
        @click="fileUpdate(); switchDialogUpdate()"
      >
        作成
      </v-btn>
      <v-btn
        color="red darken-1"
        text
        @click="deleteConfirm($store.state.music_tmp.id)"
      >
        削除
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import firebase from 'firebase'
import "firebase/storage"
import { mapActions } from 'vuex'
import { mapGetters } from 'vuex'
  export default {
    data () {
      return {
        music: {},
        file_image: '',
        file_audio: '',
        show: true,
      }
    },
    created () {
      this.music = this.$store.state.music_tmp
      const image_url = this.music.image_url.match(/images%2F(.+)\?/)[1]
      const audio_url = this.music.audio_url.match(/audios%2F(.+)\?/)[1]
      fetch(this.music.file_image).then(response => response.blob()).then(blob => new File([blob], image_url)).then(file => this.file_image = file)
      fetch(this.music.file_audio).then(response => response.blob()).then(blob => new File([blob], audio_url)).then(file => this.file_audio = file)
    },
    computed: {
      ...mapGetters(['uid'])
    },
    methods: {
      inputImageFile (event) {
        this.file_image = event
      },
      inputAudioFile (event) {
        this.file_audio = event
      },
      deleteConfirm (id) {
        if (confirm('この楽曲を削除してよろしいですか?')) {
          this.deleteMusic({id})
          this.switchDialogUpdate()
        }
      },
      async fileUpdate () {
        const storageImage = firebase.storage().ref(`users/${this.uid}/images/` + this.file_image.name)
        const storageAudio = firebase.storage().ref(`users/${this.uid}/audios/` + this.file_audio.name)
        const that = this
        await storageImage.getDownloadURL().then(onResolveImage, onRejectImage)
        function onResolveImage(url) {
          that.$set(that.music, 'image_url', url)
        }
        async function onRejectImage () {
          await storageImage.put(that.file_image)
          await storageImage.getDownloadURL().then(url => {
            that.$set(that.music, 'image_url', url)
          })
        }
        await storageAudio.getDownloadURL().then(onResolveAudio, onRejectAudio)
        function onResolveAudio(url) {
          that.$set(that.music, 'audio_url', url)
        }
        async function onRejectAudio () {
          await storageAudio.put(that.file_audio)
          await storageAudio.getDownloadURL().then(url => {
            that.$set(that.music, 'audio_url', url)
          })
        }
        this.updateMusic({id: this.$store.state.music_tmp.id, music: this.music})
        this.music = {}
        this.show = false
        this.$nextTick(function () {
          this.show = true
        })
      },
      ...mapActions(['switchDialogUpdate','updateMusic','deleteMusic'])
    }
  }
</script>