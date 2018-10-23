import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import Main from '@/views/Main.vue'
import Table from '@/views/nav1/Table.vue'
import User from '@/views/nav1/User.vue'
import Form from '@/views/nav1/Form.vue'
import Equipment from '@/views/nav1/Equipment.vue'

Vue.use(Router)

export default new Router({
  mode:'history',
  routes: [
    {
      path: '/',
      name: '',
      component: Login,
      hidden:true,
    },
    {
      path: '/',
      name: '基础管理',
      component: Home,
      iconCls:'el-icon-setting',
      children:[
        { path: 'main', component: Main, name: '主页',meta:{requireAuth: true,}, hidden: true },
        { path: 'table', component: Table, iconCls:'el-icon-date',meta:{requireAuth: true,}, name: '会议列表' },
        { path: 'form', component: Form, iconCls:'el-icon-news',meta:{requireAuth: true,}, name: '会议室管理' },
        { path: 'user', component: User, iconCls:'el-icon-edit-outline',meta:{requireAuth: true,}, name: '用户管理' },
        { path: 'equipment', component: Equipment, iconCls:'el-icon-edit-outline',meta:{requireAuth: true,}, name: '设备管理' },
      ]
    }
  ]
})

