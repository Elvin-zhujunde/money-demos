const state = {
  currentSong: null,
  playing: false,
  playlist: [],
  playMode: 'sequence'
}

const mutations = {
  SET_CURRENT_SONG(state, song) {
    state.currentSong = song
  },
  SET_PLAYING(state, playing) {
    state.playing = playing
  },
  SET_PLAYLIST(state, list) {
    state.playlist = list
  },
  ADD_TO_PLAYLIST(state, song) {
    if (!state.playlist.find(item => item.id === song.id)) {
      state.playlist.push(song)
    }
  },
  REMOVE_FROM_PLAYLIST(state, songId) {
    const index = state.playlist.findIndex(item => item.id === songId)
    if (index > -1) {
      state.playlist.splice(index, 1)
    }
  },
  PAUSE_SONG(state) {
    state.playing = false
  },
  CLEAR_PLAYLIST(state) {
    state.playlist = []
    state.currentSong = null
    state.playing = false
  },
  SET_PLAY_MODE(state, mode) {
    state.playMode = mode
  }
}

const actions = {
  async play({ commit, state }, song) {
    try {
      // 如果正在播放其他歌曲，先停止
      if (state.playing) {
        commit('SET_PLAYING', false);
      }
      
      commit('ADD_TO_PLAYLIST', song);
      commit('SET_CURRENT_SONG', song);
      commit('SET_PLAYING', true);
    } catch (error) {
      console.error('播放失败:', error);
      commit('SET_PLAYING', false);
    }
  },

  pauseSong({ commit }) {
    commit('SET_PLAYING', false);
  },
  playAll({ commit }, songs) {
    commit('SET_PLAYLIST', songs)
    commit('SET_CURRENT_SONG', songs[0])
    commit('SET_PLAYING', true)
  },
  addToPlaylist({ commit }, song) {
    commit('ADD_TO_PLAYLIST', song)
  },
  removeFromPlaylist({ commit, state }, songId) {
    commit('REMOVE_FROM_PLAYLIST', songId)
    if (state.currentSong?.id === songId) {
      commit('SET_CURRENT_SONG', state.playlist[0] || null)
    }
  },
  clearPlaylist({ commit }) {
    commit('CLEAR_PLAYLIST')
  },
  setPlayMode({ commit }, mode) {
    commit('SET_PLAY_MODE', mode)
  }
}

const getters = {
  currentSong: state => state.currentSong,
  playing: state => state.playing,
  playlist: state => state.playlist,
  playMode: state => state.playMode
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
} 