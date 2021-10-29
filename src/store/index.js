import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userId: '',
    messages: [],
    socketClient: null
  },
  mutations: {
    setUserId (state, userId) {
      state.userId = userId
    },
    initMessages (state) {
      state.messages = []
    },
    setSocketClient (state, socketClient) {
      state.socketClient = socketClient
    },
  },
  actions: {
    async connectSocket ({ state }) {
      await state.socketClient.connect()
    },
    async sendConnected ({ state }) {
      const now = moment().format('YYYY-MM-DD HH:mm:ss')
      const request = {
        timestamp: now
      }
      await state.socketClient.sendConnected(request)
    },
  },
  modules: {
  }
})
