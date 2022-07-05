import axios from 'axios'

export default {
    state: {
        favorite_comment: [],
        liked_comments: [],
        api_like: 'https://vxg2x6u5ck.execute-api.ap-northeast-1.amazonaws.com/favorite-comment'
    },
    mutations: {
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
    },
    actions: {
        addLike ({ state, rootGetters, commit }, {music_id, creater_id}) {
            axios.post(state.api_like, { fan_id: rootGetters.uid, music_id: music_id, creater_id: creater_id }, {headers: rootGetters.headers})
            
            commit('addLike', music_id)
          },
          deleteLike ({ state, rootGetters, commit }, music_id) {
            axios.delete(state.api_like, {data: { user_id: rootGetters.uid, music_id: music_id }, headers: rootGetters.headers})
            
            commit('deleteLike', music_id)
          },
          fetchFavoriteComments ({ state, rootGetters, commit }) {
            axios.get(state.api_like, {params: { user_id: rootGetters.uid }, headers: rootGetters.headers}).then(
              response => {
                JSON.parse(response.data.body).forEach(item => commit('addLike', item.music_id))
              }
            )
          },
          fetchLikedComments ({ state, rootGetters, commit }) {
            axios.get(state.api_like + '/own-comment', {params: {
            user_id: rootGetters.uid}, headers: rootGetters.headers}).then(
              response => {
                JSON.parse(response.data.body).forEach(item => commit('addLikedComment', item.music_id))
              }
            )
          },
          deleteLikedComment ({ state, rootGetters, commit }, id) {
            axios.delete(state.api_like + '/own-comment', {data: {music_id: id}, headers: rootGetters.headers})
      
            commit('deleteLikedComment', id)
          }
    }
}