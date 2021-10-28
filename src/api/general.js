import _ from 'lodash'
import axios from 'axios'

const okayHttpStatuses = [
  200,
  201,
  204,
  304
]

const errorParser = async response => {
  const { status, data } = response
  if (_.some(okayHttpStatuses, s => s === status)) {
    return response
  }
  this.$notify.error({
    title: '查询出错',
    message: data.message
  })
  return Promise.reject(new Error(data.message))
}

export const createInstance = baseUrl => {
  const timeout = 10 * 1000
  const headers = {}
  const instance = axios.create({
    baseURL: baseUrl,
    timeout,
    headers,
    validateStatus: () => true
  })
  instance.interceptors.response.use(errorParser)
  return instance
}
