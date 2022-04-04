<template>
  <v-container>
    <section>
      <v-row>
        <v-img
          src="undefined.jpeg"
          height="100vh"
        >
          <v-theme-provider dark>
            <v-container fill-height>
              <v-row
                align="center"
                class="white--text mx-auto"
                justify="center"
              >
                <v-col
                  class="white--text text-center"
                  cols="12"
                  tag="h1"
                >
                  <span
                    :class="[$vuetify.breakpoint.smAndDown ? 'text-h5': 'text-h4']"
                    class="font-weight-bold"
                  >
                    音楽の「記録・比較・共有」アプリ
                  </span>

                  <br>

                  <span
                    :class="[$vuetify.breakpoint.smAndDown ? 'display-3': 'display-4']"
                    class="font-weight-black"
                  >
                    Music Album
                  </span>

                  <br>

                  <span>
                    <v-btn
                      class="align-self-end mt-9"
                      outlined
                      width="200px"
                      x-large
                      to="/login"
                    >
                      Sign in
                    </v-btn>
                  </span>
                </v-col>

                <v-btn
                  class="align-self-end mt-16"
                  outlined
                  fab
                  @click="$vuetify.goTo('#about-me')"
                >
                  <v-icon>mdi-chevron-double-down</v-icon>
                </v-btn>
              </v-row>
            </v-container>
          </v-theme-provider>
        </v-img>
      </v-row>
    </section>

    <section id="about-me">
      <div class="py-12"></div>

      <v-container class="text-center">
        <h2 class="h6 font-weight-bold mb-3">音楽をアルバムにしませんか？</h2>

        <v-responsive
          class="mx-auto mb-8"
          width="56"
        >
          <v-divider class="mb-1"></v-divider>

          <v-divider></v-divider>
        </v-responsive>

        <v-responsive
          class="mx-auto sub-title font-weight-light mb-8"
          max-width="720"
        >
          アルバムのように、お気に入りの画像やコメントと共に<br>音楽を記録することができるサービスです。
        </v-responsive>
        <v-responsive
          class="mx-auto sub-title font-weight-light mb-8"
          max-width="720"
        >
          「感想を見ながら音楽を聴く」「他の人の感想と比較する」「音楽に画像をつける」等々、<br>能動的に音楽を楽しむことができます。
        </v-responsive>
        <v-responsive
          class="mx-auto sub-title font-weight-light mb-8"
          max-width="720"
        >
          いつもなんとなく音楽を聴いている方や、演奏者ごとの違いを知りたい方、<br>好きな音楽への想いを形にしたい方などにおすすめです。
        </v-responsive>
        <v-responsive
          class="mx-auto mb-12"
          width="56"
        >
          <v-divider class="mb-1"></v-divider>

          <v-divider></v-divider>
        </v-responsive>
        <v-row class="function mx-auto">
          <v-col
            v-for="({ src, text, title }, i) in articles"
            :key="i"
            cols="12"
            md="4"
          >
            <v-img
              :src="src"
              class="mb-4"
              max-width="100%"
              height="275"
            ></v-img>

            <h3
              class="font-weight-black mb-4"
              v-text="title"
            ></h3>

            <div
              class="sub-title font-weight-light mb-5 text"
              :class="{'text-left': $vuetify.breakpoint.mdAndUp}"
              v-text="text"
            ></div>
          </v-col>
        </v-row>
        <v-btn
          class="align-self-end mt-14"
          outlined
          width="200px"
          x-large
          to="/login"
        >
          Sign in
        </v-btn>
      </v-container>

      <div class="py-16"></div>
    </section>
    <footer>
      <p>© 2022 Music Album</p>
    </footer>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      articles: [
        {
          src: 'album.png',
          title: 'アルバムのように記録',
          text: 'アルバムに写真を貼るように、お好きな画像をジャケットにして音楽を保存することができます。\nまた、思い出を書き留めた付箋を貼るように、いつでも感想をつけることができます。',
        },
        {
          src: 'comments.png',
          title: '感想を共有',
          text: '感想は全ユーザーで共有されます。好きな感想をストックしたり、お気に入りのユーザーをフォローすることができます。\n他の人の感想が新たな音楽との出会いにつながるかもしれません。',
        },
        {
          src: 'comment.png',
          title: '感想をもとに比較',
          text: '自分や他の人が残した感想を見ながら音楽を聴くことで、その音楽に対する理解をより一層深めることができます。\nまた、演奏者ごとの違いなどを比較しやすくなります。',
        },
      ],
    }
  },
  watch: {
    uid () {
      this.$router.push({name: 'Home'})
    }
  },
  computed: {
    uid () {
      return this.$store.getters.uid
    } 
  }
}
</script>

<style lang="scss" scoped>
  .container {
    padding: 0;
  }
  .function {
    max-width: 900px;
  }
  .text {
    white-space: pre-wrap;
  }
  footer {
    text-align: center;
  }
</style>