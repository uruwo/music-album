import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'
import axios from 'axios'
import algoliasearch from 'algoliasearch'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    album: [],
    albums: [],
    commented_album: [],
    all_album: [],
    login_user: null,
    drawer: false,
    dialog: false,
    dialog_update: false,
    dialog_profile: false,
    dialog_album: false,
    album_update: false,
    music_tmp: {},
    album_tmp: {},
    player_bar: false,
    key: 0,
    keyForm: 0,
    keyNewForm: 0,
    album_key: 0,
    music_active: {},
    isPlay: false,
    comment: false,
    comment_key: 0,
    filtered_album: [],
    profile: {},
    profile_key: 0,
    favorite_comment: [],
    liked_comments: [],
    my_followee: [],
    my_follower: [],
    last_page: null,
    api_like: 'https://vxg2x6u5ck.execute-api.ap-northeast-1.amazonaws.com/favorite-comment',
    api_follow: 'https://fr93ff6r0j.execute-api.ap-northeast-1.amazonaws.com/follow-function',
    loading: false,
    loading_album: false,
    token: null
  },
  mutations: {
    async setLoginUser (state, user) {
      state.login_user = user
      state.token = await firebase.auth().currentUser.getIdToken(true)
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
    switchAlbumDialog (state) {
      state.dialog_album = !state.dialog_album
      state.album_key++
    },
    switchAlbumUpdate (state) {
      state.album_update = !state.album_update
      state.album_key++
    },
    addMusic (state, {id, music}) {
      music.id = id
      state.album.unshift(music)
      if ('comment' in music) {
        state.commented_album.unshift(music)
        state.commented_album.sort((a,b) => {
          const dateA = a.date
          const dateB = b.date
          if (dateA > dateB) {
            return -1
          }
          if (dateA < dateB) {
            return 1
          }
          return 0
        })
      }
    },
    addAlbum (state, {id, album}) {
      album.id = id
      state.albums.unshift(album)
    },
    putInAlbum (state, {id, music_id}) {
      const index = state.albums.findIndex(album => album.id === id)
      state.albums[index].music_id.push(music_id)
    },
    addAllMusic (state, {id, music}) {
      music.id = id
      if (music.comment) {
        state.all_album.push(music)
      }
    },
    startLoading (state) {
      state.loading = true
    },
    stopLoading (state) {
      state.loading = false
    },
    startLoadingAlbum (state) {
      state.loading_album = true
    },
    stopLoadingAlbum (state) {
      state.loading_album = false
    },
    setFirstPage (state) {
      state.last_page = 1
    },
    updateLastPage (state) {
      state.last_page++
    },
    addProfile (state, {id, profile}) {
      profile.id = id
      state.profile = profile
    },
    updateMusic (state, {id, music}) {
      const index = state.album.findIndex( music => music.id === id)
      state.album[index] = music
    },
    updateAlbum (state, {id, album}) {
      const index = state.albums.findIndex( album => album.id === id)
      state.albums[index] = album
    },
    updateComment (state, {id, music}) {
      const index = state.commented_album.findIndex(music => music.id === id)
      if (index === -1) {
        state.commented_album.unshift(music)
      } else {
        state.commented_album[index] = music
      }
    },
    updateMusicInAll (state, {id, music}) {
      const index = state.all_album.findIndex(music => music.id === id)
      if (index !== -1) {
        state.all_album[index] = music
      }
    },
    addMusicInAll (state, music) {
      state.all_album.unshift(music)
    },
    updateCommentImage (state, {id, image_url}) {
      const index = state.all_album.findIndex(music => music.id === id)
      state.all_album[index].profile_image = image_url
    },
    updateCommentUser (state, {id, user_name}) {
      const index = state.all_album.findIndex(music => music.id === id)
      state.all_album[index].profile_name = user_name
    },
    updateProfile (state, profile) {
      state.profile = profile
    },
    deleteMusic (state, {id}) {
      const index = state.album.findIndex( music => music.id === id)
      state.album.splice(index, 1)
    },
    deleteAlbum (state, {id}) {
      const index = state.albums.findIndex( album => album.id === id)
      state.albums.splice(index, 1)
    },
    deleteCommentInAll (state, {id}) {
      const index = state.all_album.findIndex(music => music.id === id)
      if (index !== -1) {
        state.all_album.splice(index, 1)
      }
    },
    deleteComment (state, {id}) {
      const index = state.album.findIndex( music => music.id === id)
      delete state.album[index].comment
    },
    deleteCommentView (state, {id}) {
      const index = state.commented_album.findIndex( music => music.id === id)
      if (index !== -1) {
        state.commented_album.splice(index, 1)
      }
    },
    addFollowee (state, user_id) {
      state.my_followee.push(user_id)
    },
    deleteFollowee (state, user_id) {
      const index = state.my_followee.findIndex(id => id === user_id)
      state.my_followee.splice(index, 1)
    },
    addFollower (state, user_id) {
      state.my_follower.push(user_id)
    },
    addLike (state, music_id) {
      state.favorite_comment.push(music_id)
    },
    deleteLike (state, music_id) {
      const index = state.favorite_comment.findIndex(id => id === music_id)
      state.favorite_comment.splice(index, 1)
    },
    addLikedComment (state, music_id) {
      state.liked_comments.push(music_id)
    },
    deleteLikedComment (state, music_id) {
      const array = state.liked_comments.filter(comment => comment !== music_id)
      state.liked_comments = array
    },
    setMusicTemp (state, music) {
      state.music_tmp = music
    },
    setAlbumTemp (state, album) {
      state.album_tmp = album
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
    async logout ({state, getters}) {
      if (state.login_user.isAnonymous) {
        const uid = getters.uid
        axios.delete(state.api_follow + '/user', {data: {user_id: uid}})
        await firebase.firestore().collection(`users/${uid}/profile`).get().then(snapshot => snapshot.forEach(doc => {
          firebase.firestore().collection(`users/${uid}/profile`).doc(doc.id).delete()
        }))
        await firebase.firestore().collection(`users/${uid}/album`).get().then(snapshot => snapshot.forEach(doc => {
          firebase.firestore().collection(`users/${uid}/album`).doc(doc.id).delete()
        }))
        await firebase.firestore().collection(`users/${uid}/albums`).get().then(snapshot => snapshot.forEach(doc => {
          firebase.firestore().collection(`users/${uid}/albums`).doc(doc.id).delete()
        }))
      }
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
    switchAlbumDialog ({commit}) {
      commit('switchAlbumDialog')
    },
    switchAlbumUpdate ({commit}) {
      commit('switchAlbumUpdate')
    },
    addMusic ({ getters, commit }, music) {
      if (getters.uid) {
        firebase.firestore().collection(`users/${getters.uid}/album`).add(music).then(doc => {
        commit('addMusic', { id: doc.id, music })
        commit('addAllMusic', { id: doc.id, music})
        })
      }
    },
    addAlbum ({ getters, commit }, album) {
      if (getters.uid) {
        firebase.firestore().collection(`users/${getters.uid}/albums`).add(album).then(doc => {
        commit('addAlbum', { id: doc.id, album })
        })
      }
    },
    startLoading ({ commit }) {
      commit('startLoading')
    },
    stopLoading ({ commit }) {
      commit('stopLoading')
    },
    startLoadingAlbum ({ commit }) {
      commit('startLoadingAlbum')
    },
    stopLoadingAlbum ({ commit }) {
      commit('stopLoadingAlbum')
    },
    addFollowee ({ state, getters, commit }, user_id) {
      axios.post(state.api_follow, {
      follower_id: getters.uid, followee_id: user_id})
      commit('addFollowee', user_id)
    },
    deleteFollowee ({ state, getters, commit }, user_id) {
      axios.delete(state.api_follow, {data: {
      follower_id: getters.uid, followee_id: user_id}})
      commit('deleteFollowee', user_id)
    },
    fetchFollowee ({ state, getters, commit }) {
      axios.get(state.api_follow + '/followee', {params: { user_id: getters.uid }}).then(
        response => {
          JSON.parse(response.data.body).forEach(item => commit('addFollowee', item.followee))
        }
      )
    },
    fetchFollower ({ state, getters, commit }) {
      axios.get(state.api_follow + '/follower', {params: { user_id: getters.uid }}).then(
        response => {
          JSON.parse(response.data.body).forEach(item => commit('addFollower', item.follower))
        }
      )
    },
    addLike ({ state, getters, commit }, {music_id, creater_id}) {
      axios.post(state.api_like, { fan_id: getters.uid, music_id: music_id, creater_id: creater_id })
      commit('addLike', music_id)
    },
    deleteLike ({ state, getters, commit }, music_id) {
      axios.delete(state.api_like, {data: { user_id: getters.uid, music_id: music_id }})
      commit('deleteLike', music_id)
    },
    fetchFavoriteComments ({ state, getters, commit }) {
      axios.get(state.api_like, {params: { user_id: getters.uid }}).then(
        response => {
          JSON.parse(response.data.body).forEach(item => commit('addLike', item.music_id))
        }
      )
    },
    fetchLikedComments ({ state, getters, commit }) {
      axios.get(state.api_like + '/own-comment', {params: {
      user_id: getters.uid}}).then(
        response => {
          JSON.parse(response.data.body).forEach(item => commit('addLikedComment', item.music_id))
        }
      )
    },
    deleteLikedComment ({ state, commit }, id) {
      axios.delete(state.api_like + '/own-comment', {data: {music_id: id}})
      commit('deleteLikedComment', id)
    },
    fetchAlbum ({ getters, commit }) {
      firebase.firestore().collection(`users/${getters.uid}/album`).orderBy("created_date").get().then(snapshot => {
        snapshot.forEach(doc => commit('addMusic', { id: doc.id, music: doc.data() }))
      })
    },
    fetchAlbums ({ getters, commit }) {
      firebase.firestore().collection(`users/${getters.uid}/albums`).orderBy("created_date").get().then(snapshot => {
        snapshot.forEach(doc => commit('addAlbum', { id: doc.id, album: doc.data() }))
      })
    },
    fetchAllAlbum ({ commit }) {
      const client = algoliasearch(process.env.VUE_APP_ALGOLIA_APPLICATION_ID, process.env.VUE_APP_ALGOLIA_API_KEY)
      const index = client.initIndex(process.env.VUE_APP_ALGOLIA_INDEX_NAME)
      index.search('', {
        page: 0,
        filters: `public=1 AND NOT date=0`
      }).then(snapshot => {
        snapshot.hits.forEach(doc => {
          commit('addAllMusic', {id: doc.id, music: doc})
          commit('setFirstPage')
        })
      })
    },
    updateLastPage ({ commit }) {
      commit('updateLastPage')
    },
    fetchProfile ({ getters, commit }) {
      firebase.firestore().collection(`users/${getters.uid}/profile`).get().then(snapshot => {
        if (snapshot.docs.length !== 0) {
          snapshot.forEach(doc => commit('addProfile', { id: doc.id, profile: doc.data() }))
        } else {
          const default_profile = {
            name: 'ユーザー',
            profile_image: 'https://default-image-bucket.s3.ap-northeast-1.amazonaws.com/default_user_icon.png',
            comment: 'Write something you want to appeal.',
            user_id: getters.uid
          }
          firebase.firestore().collection(`users/${getters.uid}/profile`).add(default_profile).then(doc => commit('addProfile', { id: doc.id, profile: default_profile }))
        }
      })
    },
    updateMusic ({ getters, commit }, {id, music}) {
      if (getters.uid) {
        firebase.firestore().collection(`users/${getters.uid}/album`).doc(id).update(music).then(() => {
        commit('updateMusic', { id, music })
        })
      }
    },
    updateAlbum ({ getters, commit }, {id, album}) {
      if (getters.uid) {
        firebase.firestore().collection(`users/${getters.uid}/albums`).doc(id).update(album).then(() => {
        commit('updateMusic', { id, album })
        })
      }
    },
    updateCommentView ({ commit }, {id, music}) {
      commit('updateComment', { id, music })
    },
    updateCommentImage ({ getters, commit }, {id, image_url}) {
      firebase.firestore().collection(`users/${getters.uid}/album`).doc(id).set({profile_image: image_url}, {merge: true}).then(() => {
        commit('updateCommentImage', { id, image_url})
      })
    },
    updateCommentUser ({ getters, commit }, {id, user_name}) {
      firebase.firestore().collection(`users/${getters.uid}/album`).doc(id).set({profile_name: user_name}, {merge: true}).then(() => {
        commit('updateCommentUser', { id, user_name })
      })
    },
    updateMusicInAll ({ commit }, {id, music}) {
      commit('updateMusicInAll', { id, music })
    },
    addMusicInAll ({ commit }, music) {
      commit('addMusicInAll', music)
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
        commit('deleteCommentView', { id })
        })
      }
    },
    deleteAlbum ({ getters, commit }, {id}) {
      if (getters.uid) {
        firebase.firestore().collection(`users/${getters.uid}/albums`).doc(id).delete().then(() => {
        commit('deleteAlbum', { id })
        })
      }
    },
    deleteCommentInAll ({ commit }, {id}) {
      commit('deleteCommentInAll', {id})
    },
    deleteComment ({ getters, commit }, {id}) {
      if (getters.uid) {
        firebase.firestore().collection(`users/${getters.uid}/album`).doc(id).update(
          {
            comment: firebase.firestore.FieldValue.delete(),
            date: false
          }
        ).then(() => {
          commit('deleteComment', { id })
          commit('deleteCommentView', { id })
        })
      }
    },
    setMusicTemp ({commit}, music) {
      commit('setMusicTemp', music)
    },
    setAlbumTemp ({commit}, album) {
      commit('setAlbumTemp', album)
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
    album: state => state.album,
    albums: state => state.albums,
    music_tmp: state => state.music_tmp.album_id,
    all_album: state => state.all_album
  }
})
