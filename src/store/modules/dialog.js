export default {
    state: {
        create_music_dialog: false,
        update_music_dialog: false,
        music_dialog_key: 0,
        
        create_album_dialog: false,
        update_album_dialog: false,
        album_dialog_key: 0,
        
        comment_dialog: false,
        comment_dialog_key: 0,
        
        update_profile_dialog: false,
        profile_dialog_key: 0
    },
    mutations: {
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
          }
    },
    actions: {
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
          }
    }
}