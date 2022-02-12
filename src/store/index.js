import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'
import axios from 'axios'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    album: [],
    commented_album: [],
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
    profile: {name: 'ユーザー', profile_image: 'https://default-image-bucket.s3.ap-northeast-1.amazonaws.com/default_user_icon.png', comment: 'Write something you want to appeal.'},
    profile_key: 0,
    favorite_comment: [],
    liked_comments: [],
    my_followee: [],
    my_follower: [],
    last_comment: null,
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
    addAllMusic (state, {id, music}) {
      music.id = id
      if (music.user_id !== state.login_user.uid) {
        delete music.audio_url
        delete music.image_url
      }
      if (music.comment) {
        state.all_album.push(music)
      }
    },
    setLastComment (state, comment) {
      state.last_comment = comment
    },
    addProfile (state, {id, profile}) {
      profile.id = id
      state.profile = profile
    },
    updateMusic (state, {id, music}) {
      const index = state.album.findIndex( music => music.id === id)
      state.album[index] = music
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
      if (index === -1) {
        state.all_album.unshift(music)
      } else {
        state.all_album[index] = music
      }
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
        commit('addAllMusic', { id: doc.id, music})
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
    addFollowee ({ getters, commit }, user_id) {
      axios.post('http://52.69.186.157:8000/follows/', {
      follower_id: getters.uid, followee_id: user_id})
      commit('addFollowee', user_id)
    },
    deleteFollowee ({ getters, commit }, user_id) {
      axios.delete('http://52.69.186.157:8000/follows/', {data: {
      follower_id: getters.uid, followee_id: user_id}})
      commit('deleteFollowee', user_id)
    },
    fetchFollowee ({ getters, commit }) {
      axios.get('http://52.69.186.157:8000/followee/' + getters.uid).then(
        response => {
          response.data.forEach(item => commit('addFollowee', item.followee_id))
        }
      )
    },
    fetchFollower ({ getters, commit }) {
      axios.get('http://52.69.186.157:8000/follower/' + getters.uid).then(
        response => {
          response.data.forEach(item => commit('addFollower', item.follower_id))
        }
      )
    },
    addLike ({ getters, commit }, {music_id, creater_id}) {
      axios.post('https://vxg2x6u5ck.execute-api.ap-northeast-1.amazonaws.com/favorite-comment', { fan_id: getters.uid, music_id: music_id, creater_id: creater_id })
      commit('addLike', music_id)
    },
    deleteLike ({ getters, commit }, music_id) {
      axios.delete('https://vxg2x6u5ck.execute-api.ap-northeast-1.amazonaws.com/favorite-comment', {data: { user_id: getters.uid, music_id: music_id }})
      commit('deleteLike', music_id)
    },
    fetchFavoriteComments ({ getters, commit }) {
      axios.get('https://vxg2x6u5ck.execute-api.ap-northeast-1.amazonaws.com/favorite-comment', {params: { user_id: getters.uid }}).then(
        response => {
          JSON.parse(response.data.body).forEach(item => commit('addLike', item.music_id))
        }
      )
    },
    fetchLikedComments ({ getters, commit }) {
      axios.get('https://vxg2x6u5ck.execute-api.ap-northeast-1.amazonaws.com/favorite-comment/own-comment', {params: {
      user_id: getters.uid}}).then(
        response => {
          JSON.parse(response.data.body).forEach(item => commit('addLikedComment', item.music_id))
        }
      )
    },
    fetchAlbum ({ getters, commit }) {
      firebase.firestore().collection(`users/${getters.uid}/album`).orderBy("created_date").get().then(snapshot => {
        snapshot.forEach(doc => commit('addMusic', { id: doc.id, music: doc.data() }))
      })
    },
    fetchAllAlbum ({ commit },) {
      firebase.firestore().collectionGroup('album').where("date", "!=", null).orderBy("date", "desc").limit(5).get().then(snapshot => {
        snapshot.forEach(doc => commit('addAllMusic', {id: doc.id, music: doc.data()}))
        const last_comment = snapshot.docs[snapshot.docs.length - 1]
        commit('setLastComment', last_comment)
      })
    },
    setLastComment ({ commit }, comment) {
      commit('setLastComment', comment)
    },
    fetchProfile ({ getters, commit }) {
      firebase.firestore().collection(`users/${getters.uid}/profile`).get().then(snapshot => {
        snapshot.forEach(doc => commit('addProfile', { id: doc.id, profile: doc.data() }))
      })
    },
    updateMusic ({ getters, commit }, {id, music}) {
      if (getters.uid) {
        firebase.firestore().collection(`users/${getters.uid}/album`).doc(id).update(music).then(() => {
        commit('updateMusic', { id, music })
        commit('updateComment', { id, music })
        })
      }
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
    deleteCommentInAll ({ commit }, {id}) {
      commit('deleteCommentInAll', {id})
    },
    deleteComment ({ getters, commit }, {id}) {
      if (getters.uid) {
        firebase.firestore().collection(`users/${getters.uid}/album`).doc(id).update(
          {
            comment: firebase.firestore.FieldValue.delete(),
            date: null
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
