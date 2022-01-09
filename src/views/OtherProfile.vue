<template>
  <div class="container">
    <v-card width="300">
      <v-list-item>
        <v-list-item-content class="py-2">
          <v-list-item-title class="text-center mb-2">
            {{ profileName }}
          </v-list-item-title>
          <v-list-item-title class="mb-2">
            <v-img width="128" :src="profileImage" aspect-ratio="1" class="mx-auto"></v-img>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list dense class="py-0">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>鑑賞データ</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>演奏者</v-list-item-title>
          </v-list-item-content>
          <p class="text-body-2 my-2" >{{ artists }}人</p>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>曲</v-list-item-title>
          </v-list-item-content>
          <p class="text-body-2 my-2" >{{ album.length }}曲</p>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>感想</v-list-item-title>
          </v-list-item-content>
          <p class="text-body-2 my-2" >{{ comments }}曲</p>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>プロフィール</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-divider></v-divider>
        <v-list-item>
          <v-list-item-title>自己紹介</v-list-item-title>
        </v-list-item>
        <p class="font-size px-4">{{ profileComment }}</p>
      </v-list>
    </v-card>
    <v-card width="600" class="ml-4" min-height="100">
      <v-row>
        <v-col class="d-none d-sm-flex">
          <v-card-title class="subtitle-1 py-3">{{ profileName }}さんの感想</v-card-title>
        </v-col>
        <v-col>
          <v-card-title class="pa-0 px-4">
            <v-text-field
            single-line
            class="pt-0 mt-3"
            v-model="keyword"
            dense
            placeholder="曲名・アーティスト名"
            type="text"
            >
            <template v-slot:append>
            <v-icon color="grey darken-1">mdi-magnify</v-icon>
            </template>
            </v-text-field>
          </v-card-title>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <div
        v-for="(music, index) in filteredAlbum"
        :key="index"
      >
        <div class="flex mt-2 ml-2">
          <div>
            <v-avatar tile rounded="sm">
              <v-img :src="profileImage" aspect-ratio="1"></v-img>
            </v-avatar>
          </div>
          <div class="flex-grow">
            <p class="ml-2 mb-2">{{ profileName }}</p>
            <v-card color="grey darken-4" class="ma-2">
              <div class="flex">
                <div>
                  <v-card-title class="subtitle-1 pt-2">{{ music.title }}</v-card-title>
                  <v-card-subtitle class="py-0">{{ music.artist }}</v-card-subtitle>
                </div>
                <v-spacer></v-spacer>
                <div>
                  <v-card-title :class="{ 'pr-10': $vuetify.breakpoint.smAndUp }">
                  </v-card-title>
                </div>
              </div>
              <v-card-text class="pb-0 pt-0 mt-n2">
                <v-textarea
                  class="mt-0"
                  background-color="#1E1E1E"
                  v-model="music.comment"
                  loading="false"
                  readonly
                >
                </v-textarea>
              </v-card-text>
            </v-card>
          </div>
        </div>
        <v-divider></v-divider>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      album: [],
      keyword: '',
    }
  },
  created () {
    this.album = this.$store.state.all_album.filter(music => music.user_id === this.$route.params.user_id)
  },
  computed: {
    artists: function () {
      return (this.album.filter((music, index, self) => self.findIndex(e => e.artist === music.artist) === index)).length
    },
    comments: function () {
      return (this.album.filter(music => music.comment)).length
    },
    filteredAlbum: function () {
      const album = []
      for (const i in this.album) {
        const music = this.album[i]
        if (music.title.indexOf(this.keyword) !== -1 ||
            music.artist.indexOf(this.keyword) !== -1) {
            album.push(music)
        }
      }
      return album.filter(music => music.comment).sort((a,b) => {
        let titleA = a.title.toUpperCase()
        let titleB = b.title.toUpperCase()
        if (titleA < titleB) {
          return -1
        }
        if (titleA > titleB) {
          return 1
        }
        return 0
      })
    },
    profileImage: function () {
        const all_profile = this.$store.state.all_profile
        const index = all_profile.findIndex(profile => profile.user_id === this.$route.params.user_id)
        if (index === -1) {
          return 'default_user_icon.png'
        } else {
          if (all_profile[index].profile_image) {
            return all_profile[index].profile_image
          } else {
            return 'default_user_icon.png'
          }
        }
    },
    profileName: function () {
        const all_profile = this.$store.state.all_profile
        const index = all_profile.findIndex(profile => profile.user_id === this.$route.params.user_id)
        if (index === -1) {
          return 'ユーザー'
        } else {
          if (all_profile[index].name) {
            return all_profile[index].name
          } else {
            return 'ユーザー'
          }
        }
    },
    profileComment: function () {
        const all_profile = this.$store.state.all_profile
        const index = all_profile.findIndex(profile => profile.user_id === this.$route.params.user_id)
        if (index === -1) {
          return '自己紹介がありません'
        } else {
          if (all_profile[index].comment) {
            return all_profile[index].comment
          } else {
            return '自己紹介がありません'
          }
        }
    },
  }
}
</script>

<style scoped>
  .container {
    display: flex;
    justify-content: center;
    margin-top: 40px;
    align-items: flex-start;
  }
  .flex {
    display: flex;
  }
  .flex-grow {
    flex-grow: 1;
  }
  .font-size {
    font-size: 0.8125rem;
  }
  input {
    outline: none;
    color: white;
    text-align: center;
  }
  .v-input {
    font-size: 1rem;
    font-weight: 400;
  }
  .v-text-field .v-label {
    font-size: 1rem;
  }
</style>