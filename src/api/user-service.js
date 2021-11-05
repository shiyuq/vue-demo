import { createInstance } from './general'
import config from '../config'

const baseUrl = config.customerService

const getUserInfo = async(params) => {
  const { data } = await createInstance(baseUrl).post('/user/github-login', params)
  return data
}

const getUserList = async(params) => {
  const { data } = await createInstance(baseUrl).post('/user/user-list', params)
  return data
}

const userLogin = async (params) => {
  const { data } = await createInstance(baseUrl).post('/user/user-login', params)
  return data
}

export default {
  getUserInfo,
  getUserList,
  userLogin
}
