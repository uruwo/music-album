<template>
  <v-card>
    <v-card-title>
      <span class="text-h5">楽曲追加</span>
    </v-card-title>

    <v-card-text>
      <v-container>
        <v-form ref="form">
          <v-row>
            <v-col cols="12" sm="6">
              <v-file-input 
                accept="audio/*" 
                label="楽曲を選択" 
                @change="getAudioFileTags" 
                v-if="show" 
                small-chips 
                prepend-icon="mdi-file-music-outline" 
                hint="入力すると他の項目が自動入力されます"
                persistent-hint
              ></v-file-input>
            </v-col>

            <v-col cols="12" sm="6">
              <v-file-input
                accept="image/*"
                label="画像を選択"
                @change="inputImageFile"
                v-if="show" small-chips
                prepend-icon="mdi-file-image-outline"
                v-model="file_image"
              ></v-file-input>
            </v-col>

            <v-col cols="12">
              <v-text-field
                label="曲名"
                v-model="music.title"
                :rules="[!!music.title]"
                hint="必須"
                persistent-hint
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-text-field
                label="アーティスト名"
                v-model="music.artist"
                :rules="[!!music.artist]"
                hint="必須"
                persistent-hint
              ></v-text-field>
            </v-col>

            <v-col cols="8" class="pt-0" v-if="!$route.params.album_id && $vuetify.breakpoint.smAndUp">
              <v-select
                v-model="album_id"
                :items="albums"
                item-text="title"
                item-value="id"
                :menu-props="{ maxHeight: '200' }"
                multiple
                chips
                label="アルバムを選択"
                prepend-icon="mdi-plus-box-multiple">
              </v-select>
            </v-col>

            <v-col cols="4" class="mt-2" v-if="!$route.params.album_id && $vuetify.breakpoint.smAndUp">
              <v-btn color="#555" @click="switchCreateAlbumDialog()">アルバムを作成</v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-container>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>

      <v-btn
        color="blue darken-1"
        text
        @click="switchCreateMusicDialog(); scrollTop()"
      >
        キャンセル
      </v-btn>

      <v-btn
        color="blue darken-1"
        text
        @click="fileUpload(); scrollTop()"
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
        album_id: [],
        albums: [],
        file_image: null,
        file_audio: '',
        show: true,
        overlay: false,
      }
    },
    created () {
      this.albums = this.$store.state.albums
    },
    methods: {
      scrollTop () {
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        })
      },
      inputImageFile (event) {
        this.file_image = event
      },
      async getAudioFileTags (event) {
        if (!event || (!event.name.includes('.m4a') && !event.name.includes('.mp3'))) {
          return
        }

        this.overlay = true

        this.file_audio = event

        //S3の署名付きURLを取得
        const res_signed_url = await axios.get('https://1rmi1fy2z8.execute-api.ap-northeast-1.amazonaws.com/createPresignedUrl', {
          headers: this.headers
        })

        const pre_signed_url = (JSON.parse(res_signed_url.data.body)).put_url
        const uuid = (JSON.parse(res_signed_url.data.body)).uuid

        //署名付きURLに音声ファイルをアップロード
        await axios.put(
          pre_signed_url,
          event,
          {
            headers: {
              'Content-Type': event.type
            }
          }
        )

        //S3上の音声ファイルから曲名・アーティスト名・アートワークを取得
        const res_audio_info = await axios.post('https://ij6adayafg.execute-api.ap-northeast-1.amazonaws.com/getAudioInfo', { uuid: uuid, name: event.name }, {headers: this.headers})

        if (!res_audio_info.data.body) {
          this.overlay = false
          return
        }

        const audio_info = JSON.parse(res_audio_info.data.body)

        this.$set(this.music, 'title', audio_info.title)
        this.$set(this.music, 'artist', audio_info.artist)

        fetch('data:image/jpeg;base64,' + audio_info.image)
        .then(response => response.blob())
        .then(blob => new File([blob], audio_info.album + '.jpeg'))
        .then(file => this.file_image = file)
      },
      async fileUpload () {
        if (!this.$refs.form.validate()) {
          return
        }

        if (this.file_image === null) {
          this.file_image = ''
        }

        this.switchCreateMusicDialog()

        this.startLoadingNewMusic()

        this.$set(this.music, 'user_id', this.uid)
        this.$set(this.music, 'created_date', Date.now())
        this.$set(this.music, 'date', false)
        this.$set(this.music, 'public', true)

        if (this.$route.params.album_id) {
          this.$set(this.music, 'album_id', [this.$route.params.album_id])
        } else {
          this.$set(this.music, 'album_id', this.album_id)
        }

        const that = this

        const storageImage = firebase.storage().ref(`users/${this.uid}/images/` + this.file_image.name)
        await storageImage.getDownloadURL().then(onResolveImage, onRejectImage)

        const storageAudio = firebase.storage().ref(`users/${this.uid}/audios/` + this.file_audio.name)
        await storageAudio.getDownloadURL().then(onResolveAudio, onRejectAudio)

        this.addMusic(this.music)
        
        this.music = {}
        this.show = false
        this.$nextTick(function () {
          this.show = true
        })

        function onResolveImage(url) {
          that.$set(that.music, 'image_url', url)
        }
        async function onRejectImage () {
          const metadata = {
            cacheControl: 'public,max-age=604800'
          }
          await storageImage.put(that.file_image, metadata)
          await storageImage.getDownloadURL().then(url => {
            that.$set(that.music, 'image_url', url)
          })
        }

        function onResolveAudio(url) {
          that.$set(that.music, 'audio_url', url)
        }
        async function onRejectAudio () {
          await storageAudio.put(that.file_audio)
          await storageAudio.getDownloadURL().then(url => {
            that.$set(that.music, 'audio_url', url)
          })
        }
      },
      ...mapActions(['switchCreateMusicDialog','addMusic', 'startLoadingNewMusic', 'switchCreateAlbumDialog'])
    },
    computed: {
      ...mapGetters(['uid', 'headers'])
    },
    watch: {
      file_image () {
        this.overlay = false
      }
    }
  }
</script>