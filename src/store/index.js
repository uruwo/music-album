import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    album: [],
    all_album: [],
    login_user: null,
    drawer: false,
    dialog: false,
    dialog_update: false,
    dialog_profile: false,
    music_tmp: {},
    player_bar: false,
    key: 0,
    keyForm: 0,
    keyNewForm: 0,
    music_active: {},
    isPlay: false,
    comment: false,
    comment_key: 0,
    filtered_album: [],
    profile: {name: 'ユーザー', profile_image: 'default_user_icon.png', comment: 'Write something you want to appeal.'},
    all_profile: [],
    profile_key: 0
  },
  mutations: {
    setLoginUser (state, user) {
      state.login_user = user
    },
    deleteLoginUser (state) {
      state.login_user = null
    },
    toggleSideMenu (state) {
      state.drawer = !state.drawer
    },
    switchDialog (state) {
      state.dialog = !state.dialog
      state.keyNewForm++
    },
    switchDialogUpdate (state) {
      state.dialog_update = !state.dialog_update
      state.keyForm++
    },
    switchDialogProfile (state) {
      state.dialog_profile = !state.dialog_profile
      state.profile_key++
    },
    addMusic (state, {id, music}) {
      music.id = id
      state.album.unshift(music)
    },
    addAllMusic (state, {id, music}) {
      music.id = id
      if (music.user_id !== state.login_user.uid) {
        delete music.audio_url
        delete music.image_url
      }
      state.all_album.unshift(music)
    },
    addProfile (state, {id, profile}) {
      profile.id = id
      state.profile = profile
    },
    addProfileInAll (state, profile) {
      state.all_profile.push(profile)
    },
    updateProfileInAll (state, {id, profile}) {
      const index = state.all_profile.findIndex(profile => profile.user_id === id)
      state.all_profile[index] = profile
    },
    addAllProfile (state, {id, profile}) {
      profile.id = id
      state.all_profile.push(profile)
    },
    updateMusic (state, {id, music}) {
      const index = state.album.findIndex( music => music.id === id)
      state.album[index] = music
    },
    updateMusicInAll (state, {id, music}) {
      const index = state.all_album.findIndex(music => music.id === id)
      state.all_album[index] = music
    },
    updateProfile (state, profile) {
      state.profile = profile
    },
    deleteMusic (state, {id}) {
      const index = state.album.findIndex( music => music.id === id)
      state.album.splice(index, 1)
    },
    deleteCommentInAll (state, {id}) {
      const index = state.all_album.findIndex(music => music.id === id)
      delete state.all_album[index].comment
    },
    deleteComment (state, {id}) {
      const index = state.album.findIndex( music => music.id === id)
      delete state.album[index].comment
    },
    setMusicTemp (state, music) {
      state.music_tmp = music
    },
    switchPlayerBar (state) {
      state.player_bar = true
    },
    switchBarContent (state, music) {
      state.music_active = music
      state.key++
    },
    switchCommentState (state) {
      state.comment = !state.comment
      state.comment_key++
    },
    setMusicActive (state, music) {
      state.music_active = music
    },
    putFilteredAlbum (state, album) {
      state.filtered_album = album
    }
  },
  actions: {
    login () {
      const google_auth_provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().signInWithRedirect(google_auth_provider)
    },
    logout () {
      firebase.auth().signOut()
    },
    setLoginUser ({ commit }, user) {
      commit('setLoginUser', user)
    },
    deleteLoginUser ({commit}) {
      commit('deleteLoginUser')
    },
    toggleSideMenu ({commit}) {
      commit('toggleSideMenu')
    },
    switchDialog ({commit}) {
      commit('switchDialog')
    },
    switchDialogUpdate ({commit}) {
      commit('switchDialogUpdate')
    },
    switchDialogProfile ({commit}) {
      commit('switchDialogProfile')
    },
    addMusic ({ getters, commit }, music) {
      if (getters.uid) {
        firebase.firestore().collection(`users/${getters.uid}/album`).add(music).then(doc => {
        commit('addMusic', { id: doc.id, music })
        })
      }
    },
    addProfile ({ getters, commit }, profile) {
      if (getters.uid) {
        firebase.firestore().collection(`users/${getters.uid}/profile`).add(profile).then(doc => {
          commit('addProfile', { id: doc.id, profile })
        })
      }
    },
    addProfileInAll ({ commit }, profile) {
      commit('addProfileInAll', profile)
    },
    updateProfileInAll ({ commit }, {id, profile}) {
      commit('updateProfileInAll', {id, profile})
    },
    fetchAlbum ({ getters, commit }) {
      firebase.firestore().collection(`users/${getters.uid}/album`).get().then(snapshot => {
        snapshot.forEach(doc => commit('addMusic', { id: doc.id, music: doc.data() }))
      })
    },
    fetchAllAlbum ({ commit }) {
      firebase.firestore().collectionGroup('album').get().then(snapshot => {
        snapshot.forEach(doc => commit('addAllMusic', {id: doc.id, music: doc.data()}))
      })
    },
    fetchProfile ({ getters, commit }) {
      firebase.firestore().collection(`users/${getters.uid}/profile`).get().then(snapshot => {
        snapshot.forEach(doc => commit('addProfile', { id: doc.id, profile: doc.data() }))
      })
    },
    fetchAllProfile ({ commit }) {
      firebase.firestore().collectionGroup('profile').get().then(snapshot => snapshot.forEach(doc => commit('addAllProfile', {id: doc.id, profile: doc.data()})))
    },
    updateMusic ({ getters, commit }, {id, music}) {
      if (getters.uid) {
        firebase.firestore().collection(`users/${getters.uid}/album`).doc(id).update(music).then(() => {
        commit('updateMusic', { id, music })
        })
      }
    },
    updateMusicInAll ({ commit }, {id, music}) {
      commit('updateMusicInAll', { id, music })
    },
    updateProfile ({ getters, commit }, {id, profile}) {
      if (getters.uid) {
        firebase.firestore().collection(`users/${getters.uid}/profile`).doc(id).update(profile).then(() => {
          commit('updateProfile', profile)
        })
      }
    },
    deleteMusic ({ getters, commit }, {id}) {
      if (getters.uid) {
        firebase.firestore().collection(`users/${getters.uid}/album`).doc(id).delete().then(() => {
        commit('deleteMusic', { id })
        })
      }
    },
    deleteCommentInAll ({ commit }, {id}) {
      commit('deleteCommentInAll', {id})
    },
    deleteComment ({ getters, commit }, {id}) {
      if (getters.uid) {
        firebase.firestore().collection(`users/${getters.uid}/album`).doc(id).update({comment: firebase.firestore.FieldValue.delete()}).then(() => {
          commit('deleteComment', { id })
        })
      }
    },
    setMusicTemp ({commit}, music) {
      commit('setMusicTemp', music)
    },
    switchPlayerBar ({commit}) {
      commit('switchPlayerBar')
    },
    switchBarContent ({commit}, music) {
      commit('switchBarContent', music)
    },
    switchPlayState ({commit}) {
      commit('switchPlayState')
    },
    switchCommentState ({commit}) {
      commit('switchCommentState')
    },
    setMusicActive ({commit}, music) {
      commit('setMusicActive', music)
    },
    putFilteredAlbum ({commit}, album) {
      commit('putFilteredAlbum', album)
    }
  },
  getters: {
    userName: state => state.login_user ? state.login_user.displayName : '',
    photoURL: state => state.login_user ? state.login_user.photoURL : 'default_user_icon.png',
    uid: state => state.login_user ? state.login_user.uid : null,
    playerBar: state => {
      return state.player_bar
    }
  }
})
