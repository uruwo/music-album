import axios from 'axios'

export default {
    state: {
        spotify_playlist: []
    },
    mutations: {
        fetchPlaylist (state, music) {
            state.spotify_playlist.push(music)
        }
    },
    actions: {
        fetchPlaylist ({ commit, rootGetters }) {
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
        
                    axios.post('https://fy393u9qvd.execute-api.ap-northeast-1.amazonaws.com/access-token', {user_id: rootGetters.uid, access_token: access_token}, {headers: rootGetters.headers})
                }
            })
        }
    }
}