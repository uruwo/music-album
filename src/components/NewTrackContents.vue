<template>
  <v-card>
    <v-card-title>
      <span class="text-h5">楽曲追加</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-form ref="form">
          <v-row>
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
            <v-col cols="12" sm="6">
              <v-file-input accept="audio/*" label="楽曲を選択" :value="file_audio" @change="inputAudioFile" v-if="show" small-chips prepend-icon="mdi-file-music-outline"></v-file-input>
            </v-col>
            <v-col cols="12" sm="6">
              <v-file-input accept="image/*" label="画像を選択" :value="file_image" @change="inputImageFile" v-if="show" small-chips prepend-icon="mdi-file-image-outline"></v-file-input>
            </v-col>
            <v-col cols="6" sm="8" class="pt-0">
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
            <v-col cols="6" sm="4" class="mt-2" v-if="!$route.params.album_id">
              <v-btn color="#555" @click="switchAlbumDialog()">アルバムを作成</v-btn>
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
        @click="cancel(); scrollTop()"
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
        album_id: [],
        albums: [],
        file_image: '',
        file_audio: '',
        show: true,
      }
    },
    created () {
      this.albums = this.$store.state.albums
      this.music = this.$store.state.music_tmp
      const image_name = this.getUniqueStr() + '.jpeg'
      const audio_name = this.music.audio_url ? this.getUniqueStr() + '.mp3' : 'undefined'
      fetch(this.music.image_url).then(response => response.blob()).then(blob => new File([blob], image_name)).then(file => this.file_image = file)
      fetch(this.music.audio_url).then(response => response.blob()).then(blob => new File([blob], audio_name)).then(file => this.file_audio = file)
    },
    computed: {
      ...mapGetters(['uid'])
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
      inputAudioFile (event) {
        this.file_audio = event
      },
      cancel () {
        this.switchDialog()
      },
      getUniqueStr(myStrong){
        var strong = 1000;
        if (myStrong) strong = myStrong;
        return new Date().getTime().toString(16)  + Math.floor(strong*Math.random()).toString(16)
      },
      async fileUpload () {
        if (!this.$refs.form.validate()) {
          return
        }
        this.switchDialog()
        this.startLoading()
        this.$set(this.music, 'user_id', this.uid)
        this.$set(this.music, 'created_date', Date.now())
        this.$set(this.music, 'date', false)
        this.$set(this.music, 'public', true)
        this.$set(this.music, 'album_id', this.album_id)
        const storageImage = firebase.storage().ref(`users/${this.uid}/images/` + this.file_image.name)
        const storageAudio = firebase.storage().ref(`users/${this.uid}/audios/` + this.file_audio.name)
        const that = this
        await storageImage.getDownloadURL().then(onResolveImage, onRejectImage)
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
      ...mapActions(['switchDialog', 'addMusic', 'switchAlbumDialog', 'startLoading'])
    }
  }
</script>