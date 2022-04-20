<template>
  <v-card>
    <v-card-title>
      <span class="text-h5">アルバム追加</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-form ref="form">
          <v-row>
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
        @click="switchCreateAlbumDialog(); scrollTop()"
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
        album: {},
        file_image: null,
        show: true,
      }
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
      async fileUpload () {
        if (!this.$refs.form.validate()) {
          return
        }

        if (this.file_image === null) {
          this.file_image = ''
        }

        this.switchCreateAlbumDialog()

        this.startLoadingNewAlbum()

        this.$set(this.album, 'created_date', Date.now())

        const that = this
        const storageImage = firebase.storage().ref(`users/${this.uid}/images/` + this.file_image.name)
        await storageImage.getDownloadURL().then(onResolveImage, onRejectImage)

        this.addAlbum(this.album)

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
      ...mapActions(['switchCreateAlbumDialog','addAlbum', 'startLoadingNewAlbum'])
    },
    computed: {
      ...mapGetters(['uid'])
    },
  }
</script>