import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'
import _ from 'lodash'
import userService from '../api/user-service'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userId: '',
    messages: {},
    socketClient: null,
    users: [],
    selectedUser: '',
    unReadMessages: {}
  },
  mutations: {
    setUserId (state, userId) {
      state.userId = userId
    },
    initMessages (state) {
      state.messages = {}
    },
    setSocketClient (state, socketClient) {
      state.socketClient = socketClient
    },
    setSelectedUser (state, userId) {
      state.selectedUser = userId
      if (state.unReadMessages[userId]) {
        const unReadMessages = state.unReadMessages
        state.messages[userId] = [...(state.messages[userId] || []), ...unReadMessages[userId]]
        delete unReadMessages[userId]
        state.unReadMessages = unReadMessages
      } else {
        state.messages[userId] = state.messages[userId] || []
      }
    },
    appendNewMessage (state, message) {
      if (message.sourceUser === state.userId) {
        state.messages[message.targetUser].push(message)
      } else {
        // 收到的消息并不是当前选中的用户，需要加入未读消息提醒
        if (message.sourceUser !== state.selectedUser) {
          if (!state.unReadMessages[message.sourceUser]) {
            state.unReadMessages[message.sourceUser] = [message]
          } else {
            state.unReadMessages[message.sourceUser].push(message)
          }
          state.unReadMessages = Object.assign({}, state.unReadMessages)
          return
        }
        if (!state.messages[message.sourceUser]) {
          state.messages[message.sourceUser] = [message]
        } else {
          state.messages[message.sourceUser].push(message)
        }
      }
      state.messages = Object.assign({}, state.messages)
    },
    appendGroupMessage (state, message) {
      if (message.targetUser !== state.selectedUser) {
        if (!state.unReadMessages[message.targetUser]) {
          state.unReadMessages[message.targetUser] = [message]
        } else {
          state.unReadMessages[message.targetUser].push(message)
        }
        state.unReadMessages = Object.assign({}, state.unReadMessages)
        return;
      }
      if (!state.messages[message.targetUser]) {
        state.messages[message.targetUser] = [message]
      } else {
        state.messages[message.targetUser].push(message)
      }
      state.messages = Object.assign({}, state.messages)
    },
    getConversationMessages (state, message) {
      state.unReadMessages = message
    }
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
      if (message && message.type === 'groupChat') {
        commit('appendGroupMessage', message)
      } else {
        commit('appendNewMessage', message)
      }
    },
    async getConversationMessages ({ commit }, message) {
      commit('getConversationMessages', message)
    }
  },
  modules: {
  }
})
