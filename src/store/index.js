import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'
import axios from 'axios'
import algoliasearch from 'algoliasearch'
import login from './modules/login.js'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    login
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

    create_music_dialog: false,
    update_music_dialog: false,
    music_dialog_key: 0,
    
    create_album_dialog: false,
    update_album_dialog: false,
    album_dialog_key: 0,
    
    comment_dialog: false,
    comment_dialog_key: 0,
    
    update_profile_dialog: false,
    profile_dialog_key: 0,
    
    player_bar: false,
    player_bar_content_key: 0,

    favorite_comment: [],
    liked_comments: [],
    api_like: 'https://vxg2x6u5ck.execute-api.ap-northeast-1.amazonaws.com/favorite-comment',
    
    my_followee: [],
    my_follower: [],
    api_follow: 'https://fr93ff6r0j.execute-api.ap-northeast-1.amazonaws.com/follow-function',
    
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

    switchCreateMusicDialog (state) {
      state.create_music_dialog = !state.create_music_dialog
      state.music_dialog_key++
    },
    switchUpdateMusicDialog (state) {
      state.update_music_dialog = !state.update_music_dialog
      state.music_dialog_key++
    },

    switchCreateAlbumDialog (state) {
      state.create_album_dialog = !state.create_album_dialog
      state.album_dialog_key++
    },
    switchUpdateAlbumDialog (state) {
      state.update_album_dialog = !state.update_album_dialog
      state.album_dialog_key++
    },
    
    switchCommentDialog (state) {
      state.comment_dialog = !state.comment_dialog
      state.comment_dialog_key++
    },
    
    switchProfileDialog (state) {
      state.update_profile_dialog = !state.update_profile_dialog
      state.profile_dialog_key++
    },
    
    switchPlayerBar (state) {
      state.player_bar = true
    },
    switchPlayerBarContent (state, music) {
      state.music_active = music
      state.player_bar_content_key++
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

    switchCreateMusicDialog ({commit}) {
      commit('switchCreateMusicDialog')
    },
    switchUpdateMusicDialog ({commit}) {
      commit('switchUpdateMusicDialog')
    },

    switchCreateAlbumDialog ({commit}) {
      commit('switchCreateAlbumDialog')
    },
    switchUpdateAlbumDialog ({commit}) {
      commit('switchUpdateAlbumDialog')
    },

    switchCommentDialog ({commit}) {
      commit('switchCommentDialog')
    },

    switchProfileDialog ({commit}) {
      commit('switchProfileDialog')
    },
    
    switchPlayerBar ({commit}) {
      commit('switchPlayerBar')
    },
    switchPlayerBarContent ({commit}, music) {
      commit('switchPlayerBarContent', music)
    },

    addLike ({ state, getters, commit }, {music_id, creater_id}) {
      axios.post(state.api_like, { fan_id: getters.uid, music_id: music_id, creater_id: creater_id }, {headers: getters.headers})
      
      commit('addLike', music_id)
    },
    deleteLike ({ state, getters, commit }, music_id) {
      axios.delete(state.api_like, {data: { user_id: getters.uid, music_id: music_id }, headers: getters.headers})
      
      commit('deleteLike', music_id)
    },
    fetchFavoriteComments ({ state, getters, commit }) {
      axios.get(state.api_like, {params: { user_id: getters.uid }, headers: getters.headers}).then(
        response => {
          JSON.parse(response.data.body).forEach(item => commit('addLike', item.music_id))
        }
      )
    },
    fetchLikedComments ({ state, getters, commit }) {
      axios.get(state.api_like + '/own-comment', {params: {
      user_id: getters.uid}, headers: getters.headers}).then(
        response => {
          JSON.parse(response.data.body).forEach(item => commit('addLikedComment', item.music_id))
        }
      )
    },
    deleteLikedComment ({ state, getters, commit }, id) {
      axios.delete(state.api_like + '/own-comment', {data: {music_id: id}, headers: getters.headers})

      commit('deleteLikedComment', id)
    },

    
    addFollowee ({ state, getters, commit }, user_id) {
      axios.post(state.api_follow, {follower_id: getters.uid, followee_id: user_id}, {headers: getters.headers})
      commit('addFollowee', user_id)
    },
    deleteFollowee ({ state, getters, commit }, user_id) {
      axios.delete(state.api_follow, {data: {follower_id: getters.uid, followee_id: user_id}, headers: getters.headers})
      commit('deleteFollowee', user_id)
    },
    fetchFollowee ({ state, getters, commit }) {
      axios.get(state.api_follow + '/followee', {params: { user_id: getters.uid }, headers: getters.headers}).then(
        response => {
          JSON.parse(response.data.body).forEach(item => commit('addFollowee', item.followee))
        }
      )
    },
    fetchFollower ({ state, getters, commit }) {
      axios.get(state.api_follow + '/follower', {params: { user_id: getters.uid }, headers: getters.headers}).then(
        response => {
          JSON.parse(response.data.body).forEach(item => commit('addFollower', item.follower))
        }
      )
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
