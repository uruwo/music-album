import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'
import axios from 'axios'
import algoliasearch from 'algoliasearch'
import login from './modules/login.js'
import dialog from './modules/dialog.js'
import follow from './modules/follow.js'
import like from './modules/like.js'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    login,
    dialog,
    follow,
    like
  },

  state: {
    album: [],
    filtered_album: [],
    albums: [],
    commented_tracks: [],
    everyones_commented_tracks: [],

    profile: {},

    music_tmp: {},
    album_tmp: {},
    music_active: {},

    drawer: false,
    
    player_bar: false,
    player_bar_content_key: 0,
    
    new_music_is_loading: false,
    new_album_is_loading: false,
    
    last_page: null,
    
    spotify_playlist: []
  },
  mutations: {
    addMusic (state, {id, music}) {
      music.id = id
      state.album.unshift(music)
      if ('comment' in music) {
        state.commented_tracks.unshift(music)
        state.commented_tracks.sort((a,b) => {
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

    updateMusic (state, {id, music}) {
      const index = state.album.findIndex( music => music.id === id)
      state.album[index] = music
    },
    deleteMusic (state, {id}) {
      const index = state.album.findIndex( music => music.id === id)
      state.album.splice(index, 1)
    },

    putFilteredAlbum (state, album) {
      state.filtered_album = album
    },
    
    addAlbum (state, {id, album}) {
      album.id = id
      state.albums.unshift(album)
    },
    updateAlbum (state, {id, album}) {
      const index = state.albums.findIndex( album => album.id === id)
      state.albums[index] = album
    },
    deleteAlbum (state, {id}) {
      const index = state.albums.findIndex( album => album.id === id)
      state.albums.splice(index, 1)
    },
    
    addMusicToEveryones (state, {id, music}) {
      music.id = id
      if (music.comment) {
        state.everyones_commented_tracks.push(music)
      }
    },
    updateMusicInEveryones (state, {id, music}) {
      const index = state.everyones_commented_tracks.findIndex(music => music.id === id)
      if (index !== -1) {
        state.everyones_commented_tracks[index] = music
      }
    },
    deleteMusicInEveryones (state, {id}) {
      const index = state.everyones_commented_tracks.findIndex(music => music.id === id)
      if (index !== -1) {
        state.everyones_commented_tracks.splice(index, 1)
      }
    },
    addTmpMusicToEveryones (state, music) {
      state.everyones_commented_tracks.unshift(music)
    },
  
    updateComment (state, {id, music}) {
      const index = state.commented_tracks.findIndex(music => music.id === id)
      if (index === -1) {
        state.commented_tracks.unshift(music)
      } else {
        state.commented_tracks[index] = music
      }
    },
    deleteCommentView (state, {id}) {
      const index = state.commented_tracks.findIndex( music => music.id === id)
      if (index !== -1) {
        state.commented_tracks.splice(index, 1)
      }
    },

    deleteComment (state, {id}) {
      const index = state.album.findIndex( music => music.id === id)
      delete state.album[index].comment
    },
    
    addProfile (state, {id, profile}) {
      profile.id = id
      state.profile = profile
    },
    updateProfile (state, profile) {
      state.profile = profile
    },
    updateCommentImage (state, {id, image_url}) {
      const index = state.everyones_commented_tracks.findIndex(music => music.id === id)
      state.everyones_commented_tracks[index].profile_image = image_url
    },
    updateCommentUserName (state, {id, user_name}) {
      const index = state.everyones_commented_tracks.findIndex(music => music.id === id)
      state.everyones_commented_tracks[index].profile_name = user_name
    },

    setMusicTemp (state, music) {
      state.music_tmp = music
    },
    setAlbumTemp (state, album) {
      state.album_tmp = album
    },
    setMusicActive (state, music) {
      state.music_active = music
    },

    toggleSideMenu (state) {
      state.drawer = !state.drawer
    },
    
    switchPlayerBar (state) {
      state.player_bar = true
    },
    switchPlayerBarContent (state, music) {
      state.music_active = music
      state.player_bar_content_key++
    },

    startLoadingNewMusic (state) {
      state.new_music_is_loading = true
    },
    stopLoadingNewMusic (state) {
      state.new_music_is_loading = false
    },
    startLoadingNewAlbum (state) {
      state.new_album_is_loading = true
    },
    stopLoadingNewAlbum (state) {
      state.new_album_is_loading = false
    },
    
    setFirstPage (state) {
      state.last_page = 1
    },
    updateLastPage (state) {
      state.last_page++
    },
    
    fetchPlaylist (state, music) {
      state.spotify_playlist.push(music)
    },
  },
  actions: {
    addMusic ({ getters, commit }, music) {
      if (getters.uid) {
        firebase.firestore().collection(`users/${getters.uid}/album`).add(music).then(doc => {
          commit('addMusic', { id: doc.id, music })
          commit('addMusicToEveryones', { id: doc.id, music})
        })
      }
    },
    fetchMusic ({ getters, commit }) {
      firebase.firestore().collection(`users/${getters.uid}/album`).orderBy("created_date").get().then(snapshot => {
        snapshot.forEach(doc => commit('addMusic', { id: doc.id, music: doc.data() }))
      })
    },
    updateMusic ({ getters, commit }, {id, music}) {
      if (getters.uid) {
        firebase.firestore().collection(`users/${getters.uid}/album`).doc(id).update(music).then(() => {
          commit('updateMusic', { id, music })
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
    
    putFilteredAlbum ({commit}, album) {
      commit('putFilteredAlbum', album)
    },
    
    addAlbum ({ getters, commit }, album) {
      if (getters.uid) {
        firebase.firestore().collection(`users/${getters.uid}/albums`).add(album).then(doc => {
          commit('addAlbum', { id: doc.id, album })
        })
      }
    },
    fetchAlbums ({ getters, commit }) {
      firebase.firestore().collection(`users/${getters.uid}/albums`).orderBy("created_date").get().then(snapshot => {
        snapshot.forEach(doc => commit('addAlbum', { id: doc.id, album: doc.data() }))
      })
    },
    updateAlbum ({ getters, commit }, {id, album}) {
      if (getters.uid) {
        firebase.firestore().collection(`users/${getters.uid}/albums`).doc(id).update(album).then(() => {
          commit('updateMusic', { id, album })
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
    
    updateCommentView ({ commit }, {id, music}) {
      commit('updateComment', { id, music })
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
    
    fetchEveryonesCommentedTracks ({ commit }) {
      const client = algoliasearch(process.env.VUE_APP_ALGOLIA_APPLICATION_ID, process.env.VUE_APP_ALGOLIA_API_KEY)
      const index = client.initIndex(process.env.VUE_APP_ALGOLIA_INDEX_NAME)
      
      index.search('', {
        page: 0,
        filters: `public=1 AND NOT date=0`
      }).then(snapshot => {
        snapshot.hits.forEach(doc => {
          commit('addMusicToEveryones', {id: doc.id, music: doc})
          commit('setFirstPage')
        })
      })
    },

    updateMusicInEveryones ({ commit }, {id, music}) {
      commit('updateMusicInEveryones', { id, music })
    },
    deleteMusicInEveryones ({ commit }, {id}) {
      commit('deleteMusicInEveryones', {id})
    },
    addTmpMusicToEveryones ({ commit }, music) {
      commit('addTmpMusicToEveryones', music)
    },
    
    fetchProfile ({ getters, commit }) {
      firebase.firestore().collection(`users/${getters.uid}/profile`).get().then(snapshot => {
        if (snapshot.docs.length !== 0) {
          snapshot.forEach(doc => commit('addProfile', { id: doc.id, profile: doc.data() }))
        } else {
          const default_profile = {
            name: 'ユーザー',
            profile_image: '../../default_user_icon.png',
            comment: 'Write something you want to appeal.',
            user_id: getters.uid
          }
          firebase.firestore().collection(`users/${getters.uid}/profile`).add(default_profile).then(doc => commit('addProfile', { id: doc.id, profile: default_profile }))
        }
      })
    },
    updateProfile ({ getters, commit }, {id, profile}) {
      if (getters.uid) {
        firebase.firestore().collection(`users/${getters.uid}/profile`).doc(id).update(profile).then(() => {
          commit('updateProfile', profile)
        })
      }
    },
    updateCommentImage ({ getters, commit }, {id, image_url}) {
      firebase.firestore().collection(`users/${getters.uid}/album`).doc(id).set({profile_image: image_url}, {merge: true}).then(() => {
        commit('updateCommentImage', { id, image_url})
      })
    },
    updateCommentUserName ({ getters, commit }, {id, user_name}) {
      firebase.firestore().collection(`users/${getters.uid}/album`).doc(id).set({profile_name: user_name}, {merge: true}).then(() => {
        commit('updateCommentUserName', { id, user_name })
      })
    },
    
    setMusicTemp ({commit}, music) {
      commit('setMusicTemp', music)
    },
    setAlbumTemp ({commit}, album) {
      commit('setAlbumTemp', album)
    },
    setMusicActive ({commit}, music) {
      commit('setMusicActive', music)
    },
    
    toggleSideMenu ({commit}) {
      commit('toggleSideMenu')
    },
    
    switchPlayerBar ({commit}) {
      commit('switchPlayerBar')
    },
    switchPlayerBarContent ({commit}, music) {
      commit('switchPlayerBarContent', music)
    },
    
    startLoadingNewMusic ({ commit }) {
      commit('startLoadingNewMusic')
    },
    stopLoadingNewMusic ({ commit }) {
      commit('stopLoadingNewMusic')
    },
    startLoadingNewAlbum ({ commit }) {
      commit('startLoadingNewAlbum')
    },
    stopLoadingNewAlbum ({ commit }) {
      commit('stopLoadingNewAlbum')
    },

    updateLastPage ({ commit }) {
      commit('updateLastPage')
    },
    
    fetchPlaylist ({ commit, getters }) {
      const request = require('request')
      
      const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
          'Authorization': 'Basic ' + process.env.VUE_APP_SPOTIFY_ENCODED_SECRET
        },
        form: {
          grant_type: 'refresh_token',
          refresh_token: process.env.VUE_APP_SPOTIFY_REFLESH_TOKEN
        },
        json: true
      }
      
      request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
          const access_token = body.access_token
          const spotify = require('spotify-web-api-js')
          const spotify_api = new spotify()
    
          spotify_api.setAccessToken(access_token)
    
          spotify_api.getPlaylistTracks('4duES3gDWrtRqL8GvvxCWw').then(data => {
            const items = data.items
            items.forEach(item => {
              const music = {
                title: item.track.name,
                artist: item.track.artists[0].name,
                image_url: item.track.album.images[0].url,
                preview_audio: item.track.preview_url,
                preview_image: item.track.album.images[0].url,
                audio_url: item.track.preview_url,
                spotify_url: item.track.external_urls.spotify
              }
              commit('fetchPlaylist', music)
            })
          })

          axios.post('https://fy393u9qvd.execute-api.ap-northeast-1.amazonaws.com/access-token', {user_id: getters.uid, access_token: access_token}, {headers: getters.headers})
        }
      })
    }
  },
  getters: {
    photo_url: rootState => rootState.login.login_user ? rootState.login.login_user.photoURL : 'default_user_icon.png',
    
    uid: rootState => rootState.login.login_user ? rootState.login.login_user.uid : null,
    
    album: state => state.album,
    
    albums: state => state.albums,
    
    music_tmp: state => state.music_tmp.album_id,
    
    everyones_commented_tracks: state => state.everyones_commented_tracks,

    headers: rootState => {
      return {'Authorization': rootState.login.firebase_auth_token}
    }
  }
})
