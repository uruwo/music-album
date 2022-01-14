<template>
  <v-card :key="$store.state.keyNewForm">
    <v-card-title>
      <span class="text-h5">楽曲追加</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12" sm="6">
            <v-file-input accept="audio/*" label="楽曲を選択" @change="inputAudioFile" v-if="show" small-chips prepend-icon="mdi-file-music-outline"></v-file-input>
          </v-col>
          <v-col cols="12" sm="6">
            <v-file-input accept="image/*" label="画像を選択" @change="inputImageFile" v-if="show" small-chips prepend-icon="mdi-file-image-outline" v-model="file_image"></v-file-input>
          </v-col>
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
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        color="blue darken-1"
        text
        @click="switchDialog"
      >
        キャンセル
      </v-btn>
      <v-btn
        color="blue darken-1"
        text
        @click="fileUpload()"
      >
        作成
      </v-btn>
    </v-card-actions>
    <v-overlay :value="overlay" :absolute="true">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-card>
</template>

<script>
import firebase from 'firebase'
import "firebase/storage"
import axios from 'axios'
import { mapActions } from 'vuex'
import { mapGetters } from 'vuex'
  export default {
    data () {
      return {
        music: {},
        file_image: null,
        file_audio: '',
        show: true,
        overlay: false,
      }
    },
    methods: {
      inputImageFile (event) {
        this.file_image = event
      },
      async inputAudioFile (event) {
        this.overlay = true
        this.file_audio = event
        const res_signed_url = await axios.get('https://1rmi1fy2z8.execute-api.ap-northeast-1.amazonaws.com/createPresignedUrl')
        const pre_signed_url = (JSON.parse(res_signed_url.data.body)).put_url
        const uuid = (JSON.parse(res_signed_url.data.body)).uuid
        await axios.put(
          pre_signed_url,
          event,
          {
            headers: {
              'Content-Type': event.type
            }
          }
        )
        const res_audio_info = await axios.post('https://ij6adayafg.execute-api.ap-northeast-1.amazonaws.com/getAudioInfo', { uuid: uuid })
        const audio_info = JSON.parse(res_audio_info.data.body)
        this.$set(this.music, 'title', audio_info.title)
        this.$set(this.music, 'artist', audio_info.artist)
        const image_url = 'https://audio-tmp-bucket.s3.ap-northeast-1.amazonaws.com/image/' + audio_info.image_name
        fetch(image_url).then(response => response.blob()).then(blob => new File([blob], audio_info.image_name)).then(file => this.file_image = file)
      },
      async fileUpload () {
        if (!this.music.title || !this.music.artist) {
          alert('曲名・アーティスト名を入力してください。')
          return
        }
        if (this.file_image === null) {
          this.file_image = ''
        }
        this.switchDialog()
        this.$set(this.music, 'user_id', this.uid)
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
        this.addMusic(this.music)
        this.music = {}
        this.show = false
        this.$nextTick(function () {
          this.show = true
        })
      },
      ...mapActions(['switchDialog','addMusic'])
    },
    computed: {
      ...mapGetters(['uid'])
    },
    watch: {
      file_image () {
        this.overlay = false
      }
    }
  }
</script>