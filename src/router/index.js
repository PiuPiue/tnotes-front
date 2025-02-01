import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/home.vue'
import NotesDashboard from '../views/NotesIndex.vue'

import NoteBookDetail from '@/views/NotebookDetail.vue'
import NoteDetail from '@/views/NoteDetail.vue'

import CloudIndex from '@/views/CloudIndex.vue'
import AuthIndex from '@/views/Login.vue'
import NewWorldIndex from '@/views/NewWorldIndex.vue'
import EssayEditor from '@/views/EssayEditor.vue'

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
            path: 'newworld',
            name: 'NewWorldIndex',
            component: NewWorldIndex
          },
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
            path: 'notebook/essayeditor:essayId',
            name: 'EssayEditor',
            component: EssayEditor
          },
        
          {
            path: 'cloud',
            name: 'CloudIndex',
            component: CloudIndex
          }
        ]
      },
      {
        path: '/home/note:noteId',
        name: 'NoteDetail',
        component: NoteDetail
      }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
