import io from 'socket.io-client'
// import moment from 'moment'
import qs from 'qs'

class SocketClient {
  constructor (url, $store, options = {}) {
    this.gatewayUrl = url
    this.$store = $store
    this.socket = null

    this.options = options
    this.userId = options.userId
    this.groupId = options.userId

    this.reset()
  }

  reset () {
    this.connecting = false
    this.connected = false
  }

  async connect () {
    if (this.connecting || this.connected) {
      return
    }
    this.connecting = true

    const queryString = qs.stringify({
      userId: this.userId,
      groupId: this.userId
    })
    this.targetUrl = `${this.gatewayUrl}?${queryString}`

    console.log(`connecting socket: ${this.targetUrl}`)

    this.socket = io(this.targetUrl)

    this.socket.on('connect', () => { this.socketConnectEventHandler() })
    this.socket.on('connected', () => {})
    this.socket.on('disconnect', (reason) => { this.socketDisconnectEventHandler(reason) })
    this.socket.on('reconnect', (attemptNumber) => { this.socketReconnectEventHandler(attemptNumber) })

    this.socket.on('connect_error', (error) => { console.log(`connect_error: ${error}`) })
    this.socket.on('connect_timeout', (error) => { console.log(`connect_timeout: ${error}`) })
    this.socket.on('error', (error) => { console.log(`error: ${error}`) })
    this.socket.on('reconnect_attempt', (error) => { console.log(`reconnect_attempt: ${error}`) })
    this.socket.on('reconnecting', (error) => { console.log(`reconnecting: ${error}`) })
    this.socket.on('reconnect_error', (error) => { console.log(`reconnect_error: ${error}`) })
    this.socket.on('reconnect_failed', (error) => { console.log(`reconnect_failed: ${error}`) })
    this.socket.on('ping', () => { console.log(`ping`) })
    this.socket.on('pong', (error) => { console.log(`pong: ${error}`) })

    // from server side
    this.socket.on('messageToUser', (message) => { this.messageToUserEventHandler(message) })
    this.socket.on('getConversationMessages', (message) => { this.getConversationMessagesEventHandler(message) })
    this.socket.on('endConversationBySystem', (message) => { this.endConversationBySystemEventHandler(message) })
    this.socket.on('eventToUser', (message) => { this.eventToUserHandler(message) })
  }

  async disconnect () {
    if (this.socket !== null) {
      console.log(`closing socket: ${this.targetUrl}`)
      // 客户端发起关闭
      this.socket.close()
      this.socket = null
    }
    this.reset()
  }

  async socketConnectEventHandler () {
    await this.$store.dispatch('sendConnected')
    this.connecting = false
    this.connected = true
    // this.$store.commit('setHasConnectedServer', true)
    // this.$store.commit('setConnectedTimestamp', moment.utc().toISOString())
    console.log(`Event[connect]: with socket id [${this.socket.id}]`)
  }

  async socketDisconnectEventHandler (reason) {
    console.log(`Event[disconnect]: with reason [${reason}]`)
    switch (reason) {
      case 'io client disconnect': {
        // Possible scenarios:
        // 1. client side execute disconnect, this.socket.close()
        // this.$store.dispatch('disconnectSocketStatus')
        break
      }
      case 'transport close': {
        // Possible scenarios:
        // 1. Server is down
        // 2. Token is invalid, server close this client socket
        if (this.$store.state.hasConnectedServer) {
          // the connection has been established, so the token is valid, server close this socket for some reason
          // do nothing, then it will reconnect automatically
        } else {
          // server close connection while connecting, so this is invalid token
          // this.$store.commit('setConnectionError', '请确认您使用了合法的Client Token')
          this.disconnect()
        }
        break
      }
      case 'io server disconnect': {
        // Possible scenarios:
        // 1. Server disconnect this socket with disconnect(true) or disconnect(false) method after connection is established
        // this.$store.dispatch('disconnectSocketStatus')
        this.disconnect()
        break
      }
      case 'ping timeout': {
        // Possible scenarios:
        // 1. network issue
        // will reconnect automatically
        break
      }
      default: {
        // will reconnect automatically
        this.disconnect()
        break
      }
    }

    // TODO: add business logic
  }

  async socketReconnectEventHandler (attemptNumber) {
    console.log(`Event[reconnect]: socket id [${this.socket.id}] retries ${attemptNumber} times`)
    // TODO: add business logic
  }

  // receive message from server
  async messageToUserEventHandler (message) {
    // message sourceType: user, agent, system
    console.log(`Event[messageToUser] from server: ${JSON.stringify(message)}`)
    this.$store.dispatch('receiveMessage', message)
  }

  async getConversationMessagesEventHandler (message) {
    console.log(`Event[getConversationMessages] from server: ${JSON.stringify(message)}`)
    this.$store.dispatch('getConversationMessages', message)
  }

  async endConversationBySystemEventHandler (message) {
    this.$store.commit('setEndTag', message.endTag)
    console.log(`Event[endConversationBySystem] from server: ${JSON.stringify(message)}`)
    this.disconnect()
  }

  async eventToUserHandler (message) {
    console.log(`Event[eventToUser]: with type [${message}]`)
    switch (message.type) {
      case 'startNoticeUserLocation': {
        this.$store.dispatch('startNoticeUserLocation')
        break
      }
      case 'changeConversationState': {
        this.$store.dispatch('changeConversationState', message)
        break
      }
      default: {
        break
      }
    }
  }

  // send message to server
  async sendConnected (request = {}) {
    if (this.socket !== null) {
      console.log('Event[connected] to server')
      this.socket.emit('connected', request)
    }
  }

  async sendMessage (request = {}) {
    if (this.socket !== null) {
      console.log('Event[messageFromUser] to server')
      this.socket.emit('messageFromUser', request, response => {
        console.log(`Event[messageFromUser] with response: ${JSON.stringify(response)}`)
        // TODO: add business logic
      })
    }
  }

  async sendMessageFeedback (request = {}) {
    if (this.socket !== null) {
      console.log('Event[messageFeedbackFromUser] to server')
      this.socket.emit('messageFeedbackFromUser', request, response => {
        console.log(`Event[messageFeedbackFromUser] with response: ${JSON.stringify(response)}`)
        // TODO: add business logic
      })
    }
  }

  async sendThumbDownTwiceFromUser (request = {}) {
    if (this.socket !== null) {
      console.log('Event[thumbDownTwiceFromUser] to server')
      this.socket.emit('thumbDownTwiceFromUser', request, response => {
        console.log(`Event[thumbDownTwiceFromUser] with response: ${JSON.stringify(response)}`)
      })
    }
  }

  async sendRequestDisconnect (request = {}) {
    if (this.socket !== null) {
      console.log('Event[requestDisconnect] to server')
      this.socket.emit('requestDisconnect', request, response => {
        console.log(`Event[requestDisconnect] with response: ${JSON.stringify(response)}`)
      })
    }
  }

  async sendMessageWithoutCustomerReply (request = {}) {
    if (this.socket !== null) {
      console.log('Event[userEvent] to server')
      this.socket.emit('userEvent', request, response => {
        console.log(`Event[userEvent] with response: ${JSON.stringify(response)}`)
      })
    }
  }
}

export default SocketClient
