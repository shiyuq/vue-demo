import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'
import _ from 'lodash'
import userService from '../api/user-service'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userId: '',
    messages: [],
    socketClient: null,
    users: [],
    selectedUser: ''
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
    setSelectedUser (state, userId) {
      state.selectedUser = userId
      state.messages = []
    },
    appendNewMessage (state, message) {
      state.messages.push(message)
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
    async initUsers ({ state }) {
      const { data } = await userService.getUserList()
      state.users = _.filter(data, item => item.id !== state.userId)
    },
    async sendMessage ({ state, commit }, content) {
      const now = moment().format('YYYY-MM-DD HH:mm:ss')
      const request = {
        timestamp: now,
        sourceUser: state.userId,
        targetUser: state.selectedUser,
        content
      }
      commit('appendNewMessage', request)
      state.socketClient.sendMessage(request)
    },
    async receiveMessage ({ commit }, message) {
      commit('appendNewMessage', message)
    },
  },
  modules: {
  }
})
