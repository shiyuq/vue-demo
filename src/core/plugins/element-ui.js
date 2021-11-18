// 按需全局引入 ant design vue 组件
import Vue from 'vue'
import {
  Notification,
  Button,
  Form,
  FormItem,
  Input,
  Message
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.prototype.$notify = Notification
Vue.prototype.$message = Message

