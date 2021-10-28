import { createInstance } from './general'
import config from '../config'

const baseUrl = config.customerService

const getUserInfo = async(params) => {
  const { data } = await createInstance(baseUrl).post('/user/github-login', params)
  return data
}

export default {
  getUserInfo,
}
