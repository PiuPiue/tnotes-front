import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/home.vue'
import NotesDashboard from '../views/NotesIndex.vue'

import NoteBookDetail from '@/views/NotebookDetail.vue'
import NoteDetail from '@/views/NoteDetail.vue'

import CloudIndex from '@/views/CloudIndex.vue'
import AuthIndex from '@/views/Login.vue'


Vue.use(VueRouter)

const routes = [
      //设置默认路由
      {
        path: '/',
        redirect: '/home',
        component: Home
      },
      {
        path: '/login',
        name: 'Auth',
        component: AuthIndex
      },
      {
        path: '/home',
        name: 'Home',
        component: Home,
        children: [
          {
            path: 'notebook',
            name: 'NotesDashboard',
            component: NotesDashboard
          },
          
          {
            path: 'notebook/detail:notebookId',
            name: 'NotebookDetail',
            component: NoteBookDetail
          },
        
          {
            path: 'note:noteId',
            name: 'NoteDetail',
            component: NoteDetail
          }
          ,
          {
            path: 'cloud',
            name: 'CloudIndex',
            component: CloudIndex
          }
        ]
      },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
