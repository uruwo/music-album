import firebase from 'firebase'

export default {
    state: {
        profile: {},
    },
    mutations: {
        addProfile (state, {id, profile}) {
            profile.id = id
            state.profile = profile
        },
        updateProfile (state, profile) {
            state.profile = profile
        },
    },
    actions: {
        fetchProfile ({ rootGetters, commit }) {
            firebase.firestore().collection(`users/${rootGetters.uid}/profile`).get().then(snapshot => {
                if (snapshot.docs.length !== 0) {
                    snapshot.forEach(doc => commit('addProfile', { id: doc.id, profile: doc.data() }))
                } else {
                    const default_profile = {
                        name: 'ユーザー',
                        profile_image: '../../default_user_icon.png',
                        comment: 'Write something you want to appeal.',
                        user_id: rootGetters.uid
                    }

                    firebase.firestore().collection(`users/${rootGetters.uid}/profile`).add(default_profile).then(doc => commit('addProfile', { id: doc.id, profile: default_profile }))
                }
            })
        },
        updateProfile ({ rootGetters, commit }, {id, profile}) {
            if (rootGetters.uid) {
                firebase.firestore().collection(`users/${rootGetters.uid}/profile`).doc(id).update(profile).then(() => {
                    commit('updateProfile', profile)
                })
            }
        }
    }
}