module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  css: {
    loaderOptions: {
      scss: {
        additionalData: '@import "./src/styles/common/common.scss";'
      }
    }
  }
}
