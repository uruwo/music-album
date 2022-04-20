<template>
  <v-card>
    <v-card-title>
      <span class="text-h5">アルバム編集</span>
    </v-card-title>

    <v-card-text>
      <v-container>
        <v-form ref="form">
          <v-row>
            <v-col cols="12" sm="6">
              <v-file-input
                accept="image/*"
                label="画像を選択"
                :value="file_image"
                @change="inputImageFile"
                v-if="show"
                small-chips
                prepend-icon="mdi-file-image-outline"
              ></v-file-input>
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field
                label="アルバム名"
                v-model="album.title"
                :rules="[!!album.title]"
                hint="必須"
                persistent-hint
              ></v-text-field>
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
        @click="deleteConfirm($store.state.album_tmp.id)"
      >
        削除
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import firebase from 'firebase'
import "firebase/storage"
import { mapActions, mapGetters } from 'vuex'

  export default {
    data () {
      return {
        album: {},
        file_image: '',
        show: true,
      }
    },
    created () {
      this.album = this.$store.state.album_tmp

      const image_name = decodeURI(this.album.image_url.match(/images%2F(.+)\?/)[1])
      fetch(this.file_image).then(response => response.blob()).then(blob => new File([blob], image_name)).then(file => this.file_image = file)
    },
    computed: {
      ...mapGetters(['uid'])
    },
    methods: {
      inputImageFile (event) {
        this.file_image = event
      },
      deleteConfirm (id) {
        if (confirm('このアルバムを削除してよろしいですか?')) {
          this.deleteAlbum({id})
          this.switchUpdateAlbumDialog()
        }
      },
      cancel () {
        if (!this.$refs.form.validate()) {
          return
        }
        this.switchUpdateAlbumDialog()
      },
      async fileUpdate () {
        if (!this.$refs.form.validate()) {
          return
        }

        this.switchUpdateAlbumDialog()

        const that = this
        const storageImage = firebase.storage().ref(`users/${this.uid}/images/` + this.file_image.name)
        await storageImage.getDownloadURL().then(onResolveImage, onRejectImage)

        this.updateAlbum({id: this.$store.state.album_tmp.id, album: this.album})

        this.album = {}
        this.show = false
        this.$nextTick(function () {
          this.show = true
        })
        
        function onResolveImage(url) {
          that.$set(that.album, 'image_url', url)
        }
        async function onRejectImage () {
          const metadata = {
            cacheControl: 'public,max-age=604800'
          }
          await storageImage.put(that.file_image, metadata)
          await storageImage.getDownloadURL().then(url => {
            that.$set(that.album, 'image_url', url)
          })
        }
      },
      ...mapActions(['switchUpdateAlbumDialog','updateAlbum','deleteAlbum'])
    }
  }
</script>