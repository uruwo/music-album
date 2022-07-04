import firebase from 'firebase'
import axios from 'axios'

export default {
    state: {
        login_user: null,
        firebase_auth_token: ''
    },
    mutations: {
        async setLoginUser (state, {user, token}) {
            state.login_user = user
            state.firebase_auth_token = token
        },
        deleteLoginUser (state) {
            state.login_user = null
        }
    },
    actions: {
        login () {
            const google_auth_provider = new firebase.auth.GoogleAuthProvider()
            firebase.auth().signInWithRedirect(google_auth_provider)
        },
      
        async logout ({state, rootState, rootGetters}) {
            if (state.login_user.isAnonymous) {
                const uid = rootGetters.uid
        
                axios.delete(rootState.follow.api_follow + '/user', {data: {user_id: uid}, headers: rootGetters.headers})
        
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
    
        setLoginUser ({ commit }, {user, token}) {
            commit('setLoginUser', {user: user, token: token})
        },
        deleteLoginUser ({commit}) {
            commit('deleteLoginUser')
        }
    }
}