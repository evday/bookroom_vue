// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import FullCalendar from 'vue-fullcalendar'
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
import store from './store/store'

Vue.prototype.$axios = axios
Vue.component('full-calendar', FullCalendar)
Vue.config.productionTip = false
Vue.use(ElementUI)

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
      if (store.state.userInfo.token) {  // 通过vuex state获取当前的token是否存在
          next();
      }
      else {
          next({
              path: '/',
              query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
          })
      }
  }
  else {
      next();
  }
})


/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
