import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/home.vue'
import NotesDashboard from '../views/NotesIndex.vue'
import NoteBookDetail from '@/views/NotebookDetail.vue'
import NoteDetail from '@/views/NoteDetail.vue'
import CloudIndex from '@/views/CloudIndex.vue'
import AuthIndex from '@/views/Login.vue'
import EssayEditor from '@/views/EssayEditor.vue'
import MyNoteBooks from '@/views/notes/MyNoteBooks.vue'
import MyEssay from '@/views/notes/MyEssay.vue'
import QuickStart from '@/views/notes/QuickStart.vue'
import MyJoinBooks from '@/views/notes/MyJoinBooks.vue'
import MyCollectBooks from '@/views/notes/MyCollectBooks.vue'
import RecycleBin from '@/views/recycle.vue'
import NotFoundPage from '@/views/NotFound.vue'
import UserInfo from '@/views/UserInfo.vue'
import IntroductionIndex from '@/views/IntroductionIndex.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: IntroductionIndex,
    meta: {
      title: 't-notes - 你的高效笔记与云存储工具',
      description: 't-notes 是一个集笔记与云存储于一体的高效工具，帮助你随时随地记录灵感、管理文件。',
      keywords: 't-notes,笔记,云存储,AI助手,协作工具,文件管理'
    }
  },
  {
    path: '/introduction',
    name: 'Introduction',
    component: IntroductionIndex,
    meta: {
      title: 't-notes - 功能介绍',
      description: '了解 t-notes 的功能，包括笔记管理、云存储和 AI 助手，提升你的工作效率。',
      keywords: 't-notes,笔记功能,云存储功能,AI助手,协作工具'
    }
  },
  {
    path: '/login',
    name: 'Auth',
    component: AuthIndex,
    meta: {
      title: 't-notes - 登录',
      description: '登录 t-notes，开始使用高效的笔记和云存储工具。',
      keywords: '登录,t-notes,笔记工具,云存储'
    }
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: {
      title: 't-notes - 主页',
      description: 't-notes 主页，管理你的笔记、云存储和协作项目。',
      keywords: 't-notes,主页,笔记管理,云存储,协作工具'
    },
    children: [
      {
        path: 'mine',
        name: 'mine',
        component: MyNoteBooks,
        meta: {
          title: 't-notes - 我的笔记本',
          description: '管理你的个人笔记本，随时随地记录灵感。',
          keywords: 't-notes,笔记本,笔记管理,个人笔记'
        }
      },
      {
        path: 'essay',
        name: 'MyEssay',
        component: MyEssay,
        meta: {
          title: 't-notes - 我的随笔',
          description: '记录和查看你的随笔，随时随地捕捉灵感。',
          keywords: 't-notes,随笔,灵感记录,个人随笔'
        }
      },
      {
        path: 'quickstart',
        name: 'QuickStart',
        component: QuickStart,
        meta: {
          title: 't-notes - 快速开始',
          description: '快速上手 t-notes,快速记录笔记以及协作工具。',
          keywords: 't-notes,快速开始,笔记工具,云存储'
        }
      },
      {
        path: 'joinbooks',
        name: 'MyJoinBooks',
        component: MyJoinBooks,
        meta: {
          title: 't-notes - 我参与的笔记本',
          description: '查看和管理你参与的协作笔记本。',
          keywords: 't-notes,协作笔记本,团队协作,笔记管理'
        }
      },
      {
        path: 'collectbooks',
        name: 'MyCollectBooks',
        component: MyCollectBooks,
        meta: {
          title: 't-notes - 我收藏的笔记本',
          description: '查看和管理你收藏的笔记本。',
          keywords: 't-notes,收藏笔记本,笔记管理,个人收藏'
        }
      },
      {
        path: 'notebook',
        name: 'NotesDashboard',
        component: NotesDashboard,
        meta: {
          title: 't-notes - 笔记本管理',
          description: '创建和管理你的笔记本，随时随地记录灵感。',
          keywords: 't-notes,笔记本管理,笔记工具,灵感记录'
        }
      },
      {
        path: 'notebook/detail:notebookId',
        name: 'NotebookDetail',
        component: NoteBookDetail,
        meta: {
          title: 't-notes - 笔记本详情',
          description: '查看和管理笔记本的详细内容。',
          keywords: 't-notes,笔记本详情,笔记管理,协作工具'
        }
      },
      {
        path: 'notebook/essayeditor:essayId',
        name: 'EssayEditor',
        component: EssayEditor,
        meta: {
          title: 't-notes - 随笔编辑',
          description: '编辑你的随笔，随时随地记录灵感。',
          keywords: 't-notes,随笔编辑,灵感记录,笔记工具'
        }
      },
      {
        path: 'cloud/index',
        name: 'CloudIndex',
        component: CloudIndex,
        meta: {
          title: 't-notes - 云存储',
          description: '安全存储和共享你的文件，随时随地访问。',
          keywords: 't-notes,云存储,文件管理,文件共享'
        }
      },
      {
        path: 'cloud/recycle',
        name: 'RecycleBin',
        component: RecycleBin,
        meta: {
          title: 't-notes - 回收站',
          description: '查看和管理已删除的笔记。',
          keywords: 't-notes,回收站,文件恢复'
        }
      }
    ]
  },
  {
    path: '/home/note:noteId',
    name: 'NoteDetail',
    component: NoteDetail,
    meta: {
      title: 't-notes - 笔记详情',
      description: '查看和管理笔记的详细内容。',
      keywords: '笔记详情,笔记管理,协作工具'
    }
  },
  {
    path: '/userinfo',
    name: 'UserInfo',
    component: UserInfo,
    meta: {
      title: 't-notes - 用户信息',
      description: '查看和编辑你的用户信息。',
      keywords: '用户信息,个人资料,账户管理'
    }
  },
  {
    path: '*',
    name: 'NotFound',
    component: NotFoundPage,
    meta: {
      title: 't-notes - 页面未找到',
      description: '抱歉，您访问的页面不存在。',
      keywords: '404,页面未找到,错误页面'
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 全局前置守卫，动态设置页面标题和 meta 信息
router.beforeEach((to, from, next) => {
  const title = to.meta.title || 't-notes'
  const description = to.meta.description || 't-notes 是一个集笔记与云存储于一体的高效工具。'
  const keywords = to.meta.keywords || '笔记,云存储,AI助手,协作工具'

  // 设置页面标题
  document.title = title

  // 动态更新 meta 标签
  let metaDescription = document.querySelector('meta[name="description"]')
  let metaKeywords = document.querySelector('meta[name="keywords"]')

  if (!metaDescription) {
    metaDescription = document.createElement('meta')
    metaDescription.setAttribute('name', 'description')
    document.head.appendChild(metaDescription)
  }
  metaDescription.setAttribute('content', description)

  if (!metaKeywords) {
    metaKeywords = document.createElement('meta')
    metaKeywords.setAttribute('name', 'keywords')
    document.head.appendChild(metaKeywords)
  }
  metaKeywords.setAttribute('content', keywords)

  next()
})
function getRoutesList(routes, pre) {
  return routes.reduce((array, route) => {
    const path = `${pre}${route.path}`;
 
    if (route.path !== '*') {
      array.push(path);
    }
 
    if (route.children) {
      array.push(...getRoutesList(route.children, `${path}/`));
    }
 
    return array;
  }, []);
}
 
 
// getRoutesList(router.options.routes, 'https://zigamiklic.com');
function getRoutesXML() {
  const list = getRoutesList(router.options.routes, 'https://notes.t-music.cn')
    .map(route => `<url><loc>${route} </loc></url>`)
    .join('\r\n');
  return `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
    ${list}
  </urlset>`;
}
 
console.log(getRoutesXML())

export default router