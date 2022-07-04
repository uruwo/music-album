import axios from 'axios'

export default {
    state: {
        my_followee: [],
        my_follower: [],
        api_follow: 'https://fr93ff6r0j.execute-api.ap-northeast-1.amazonaws.com/follow-function'
    },
    mutations: {
        addFollowee (state, user_id) {
            state.my_followee.push(user_id)
          },
          deleteFollowee (state, user_id) {
            const index = state.my_followee.findIndex(id => id === user_id)
            state.my_followee.splice(index, 1)
          },
          addFollower (state, user_id) {
            state.my_follower.push(user_id)
          }
    },
    actions: {
        addFollowee ({ state, rootGetters, commit }, user_id) {
            axios.post(state.api_follow, {follower_id: rootGetters.uid, followee_id: user_id}, {headers: rootGetters.headers})
            commit('addFollowee', user_id)
          },
          deleteFollowee ({ state, rootGetters, commit }, user_id) {
            axios.delete(state.api_follow, {data: {follower_id: rootGetters.uid, followee_id: user_id}, headers: rootGetters.headers})
            commit('deleteFollowee', user_id)
          },
          fetchFollowee ({ state, rootGetters, commit }) {
            axios.get(state.api_follow + '/followee', {params: { user_id: rootGetters.uid }, headers: rootGetters.headers}).then(
              response => {
                JSON.parse(response.data.body).forEach(item => commit('addFollowee', item.followee))
              }
            )
          },
          fetchFollower ({ state, rootGetters, commit }) {
            axios.get(state.api_follow + '/follower', {params: { user_id: rootGetters.uid }, headers: rootGetters.headers}).then(
              response => {
                JSON.parse(response.data.body).forEach(item => commit('addFollower', item.follower))
              }
            )
          }
    }
}