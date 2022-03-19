<template>
  <v-card>
    <v-card-title>
      <span class="text-h5">楽曲編集</span>
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
              <v-btn color="#555" @click="pushAlbums()">アルバムを作成</v-btn>
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
        @click="cancel"
      >
        キャンセル
      </v-btn>
      <v-btn
        color="blue darken-1"
        text
        @click="fileUpdate"
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
      this.album_id = this.music.album_id
      const image_name = decodeURI(this.music.image_url.match(/images%2F(.+)\?/)[1])
      const audio_name = decodeURI(this.music.audio_url.match(/audios%2F(.+)\?/)[1])
      fetch(this.file_image).then(response => response.blob()).then(blob => new File([blob], image_name)).then(file => this.file_image = file)
      fetch(this.file_audio).then(response => response.blob()).then(blob => new File([blob], audio_name)).then(file => this.file_audio = file)
    },
    computed: {
      ...mapGetters(['uid'])
    },
    methods: {
      pushAlbums () {
        this.$router.push({name: 'Albums'})
        this.scrollTop()
        this.switchDialogUpdate()
      },
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
      deleteConfirm (id) {
        if (confirm('この楽曲を削除してよろしいですか?')) {
          this.deleteMusic({id})
          this.deleteCommentInAll({id})
          this.deleteLikedComment(id)
          this.switchDialogUpdate()
        }
      },
      cancel () {
        if (!this.$refs.form.validate()) {
          return
        }
        this.switchDialogUpdate()
      },
      async fileUpdate () {
        if (!this.$refs.form.validate()) {
          return
        }
        this.switchDialogUpdate()
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
        this.updateMusic({id: this.$store.state.music_tmp.id, music: this.music})
        this.music = {}
        this.show = false
        this.$nextTick(function () {
          this.show = true
        })
      },
      ...mapActions(['switchDialogUpdate','updateMusic','deleteMusic', 'deleteCommentInAll', 'deleteLikedComment'])
    }
  }
</script>