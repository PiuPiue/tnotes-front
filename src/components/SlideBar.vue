<template>
  <div class="sidebar">
    <!-- 上半部分：导航菜单 -->
    <div class="sidebar-top">
      <div class="logo-section">
        <!-- <img src="https://ai-public.mastergo.com/ai/img_res/f8701189dbc317491d835f05a7315386.jpg" alt="Logo" class="logo" /> -->
        <img src="../assets/images/logo-svg.svg" alt="Logo" class="logo" />
        
        <span class="app-name">t-notes</span>
      </div>
      <!-- 动态导航菜单 -->
      <nav class="nav-links" v-if="activeView === 'notes'">
        <router-link
          to="/home/quickstart"
          class="nav-link"
          :class="{ active: $route.path === '/home/quickstart' }"
        >
          <i class="fas fa-rocket"></i>
          <span>快速开始</span>
        </router-link>
        <router-link
          to="/home/mine"
          class="nav-link"
          :class="{ active: $route.path === '/home/mine' }"
        >
          <i class="fas fa-book"></i>
          <span>我的笔记</span>
        </router-link>
        <router-link
          to="/home/essay"
          class="nav-link"
          :class="{ active: $route.path === '/home/essay' }"
        >
          <i class="fas fa-pen"></i>
          <span>随笔</span>
        </router-link>
        <router-link
          to="/home/joinbooks"
          class="nav-link"
          :class="{ active: $route.path === '/home/joinbooks' }"
        >
          <i class="fas fa-users"></i>
          <span>协作</span>
        </router-link>
        <router-link
          to="/home/collectbooks"
          class="nav-link"
          :class="{ active: $route.path === '/home/collectbooks' }"
        >
          <i class="fas fa-star"></i>
          <span>收藏</span>
        </router-link>
      </nav>
      <nav class="nav-links" v-else-if="activeView === 'cloud'">
        <router-link
          to="/home/cloud/index"
          class="nav-link"
          :class="{ active: $route.path === '/home/cloud/index' }"
        >
        <i class="fas fa-folder-open"></i> <!-- 更新为更美观的图标 -->
        <span>我的文件</span>
      </router-link>
      <router-link
        @click = "this.$message.warning('还在开发中')"
        to=""
        class="nav-link"
        :class="{ active: $route.path === '/shared' }"
      >
        <i class="fas fa-users-cog"></i> 
        <span>共享管理</span>
      </router-link>
      <router-link
        to="/home/cloud/recycle"
        class="nav-link"
        :class="{ active: $route.path === '/home/cloud/recycle' }"
      >
        <i class="fas fa-trash-restore"></i> <!-- 更新为更美观的图标 -->
        <span>回收站</span>
      </router-link>
      </nav>
      <nav class="nav-links" v-else-if="activeView === 'ai'">
        <router-link
          to="/assistant"
          class="nav-link"
          :class="{ active: $route.path === '/assistant' }"
        >
          <i class="fas fa-robot"></i>
          <span>AI助手</span>
        </router-link>
        <router-link
          to="/settings"
          class="nav-link"
          :class="{ active: $route.path === '/settings' }"
        >
          <i class="fas fa-cog"></i>
          <span>设置</span>
        </router-link>
      </nav>
    </div>

    <!-- 下半部分：滑块和用户信息 -->
    <div class="sidebar-bottom">
      <!-- 滑块 -->
      <div class="slider">
        
        <button
          @click="changeTab(1)"
          :class="['slider-btn', activeView === 'notes' ? 'active' : '']"
        >
          笔记
        </button>
        <button
          @click="changeTab(2)"
          :class="['slider-btn', activeView === 'cloud' ? 'active' : '']"
        >
          资源
        </button>
        <button
          @click="changeTab(3)"
          :class="['slider-btn', activeView === 'ai' ? 'active' : '']"
        >
          AI
        </button>
      </div>

      <!-- 用户信息 -->
      <div class="user-info" @click="toggleUserMenu">
        <img :src="userInfo.avatar" alt="用户头像" class="avatar" />
        <div class="user-details">
          <span class="username">{{ userInfo.name }}</span>
          <span class="user-status">{{ userInfo.isVip ? '专业版用户' : '普通用户' }} </span>
        </div>
        <!-- 用户菜单 -->
        <div v-if="isUserMenuOpen" class="user-menu">
          <div class="menu-item" v-if="!userInfo.isVip" style="color: #FFD700">升级至专业版</div>
          <router-link to="/userInfo" class="menu-item">个人资料</router-link>
          <div class="menu-item" @click="handleLogout">退出登录</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { logout } from '@/utils/api';
export default {
  name: 'SideBar',
  data() {
    return {
      
      userInfo: JSON.parse(localStorage.getItem('userInfo')),
      isUserMenuOpen: false,
    };
  },
  computed: {
    activeView() {
  const path = this.$route.path; // 获取当前路由的路径

  if (path.includes('/cloud')) {
    return 'cloud';
  } else if (path.includes('/ai')) {
    return 'ai';
  } else {
    return 'notes';
  }
}
  },
  methods: {
    changeTab(num) {
      if (num === 1) {
        if(this.$route.path !== '/home/quickstart')
          this.$router.push('/home/quickstart')
      
      } else if (num === 2) {
        if(this.$route.path !== '/home/cloud/index')
          this.$router.push('/home/cloud/index')
        
      } else if (num === 3) {
        this.$message.warning("还在开发中")
     
      }
    },
    toggleUserMenu() {
      this.isUserMenuOpen = !this.isUserMenuOpen;
    },
    async handleLogout() {
      const res = await logout();
      if (res.data.code === 200) {
        localStorage.removeItem('userInfo');
        this.$message.success('退出成功');
        this.$router.push('/login');
      }
    },
  },
};
</script>
<style scoped>
/* 样式部分保持不变 */
.sidebar {
  width: 210px;
  height: 100vh;
  background-color: #f8f9ff; /* 浅紫色调，与主内容区域渐变协调 */
  /* background: linear-gradient(to bottom right, #f0f4ff, #ffffff); */
  /* backdrop-filter: blur(25px); */
  border-right: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 4px 0 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 28px;
  transition: all 0.3s ease;
  border-left: 1px solid #e0e7ff; /* 浅蓝色边框，与渐变背景呼应 */
  background-color: #f8f9ff; /* 浅紫色背景 */
  border-left: 1px solid #e0e7ff; /* 浅蓝色边框 */
  padding: 16px;
 
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 36px;
}

.logo {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.app-name {
  font-family: 'Inter', sans-serif; /* 使用 Inter 字体 */
  font-size: 24px;
  font-weight: 600;
  color: #6366F1; /* 主色调：科技蓝 */
  letter-spacing: -0.5px;
  text-shadow: 2px 2px 4px rgba(99, 102, 241, 0.2); /* 文字阴影 */
}
.nav-links {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border-radius: 10px;
  color: #4b5563;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 15px;
  background: transparent;
}

.nav-link:hover {
  background: rgba(239, 246, 255, 0.8);
  color: #6366F1;
  transform: translateX(6px);
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
}

.nav-link.active {
  background: rgba(239, 246, 255, 0.8);
  color: #6366F1;
  font-weight: 500;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
}

.nav-link i {
  font-size: 18px;
  color: inherit;
}

.sidebar-bottom {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.slider {
  display: flex;
  background-color: rgba(243, 244, 246, 0.8);
  border-radius: 12px;
  padding: 8px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
}

.slider-btn {
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  border: none;
  background: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  color: #6366F1;
  text-decoration: none;
  text-align: center;
}

.slider-btn.active {
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  color: #6366F1;
  font-weight: 500;
}

.slider-btn:hover {
  color: #6366F1;
  transform: scale(1.05);
}

.user-info {
  margin-bottom: 50px;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px;
  border-radius: 10px;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.user-info:hover {
  background: rgba(239, 246, 255, 0.9);
  transform: translateY(-2px);
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.user-details {
  display: flex;
  flex-direction: column;
}

.username {
  font-size: 15px;
  font-weight: 500;
  color: #1a1a1a;
}

.user-status {
  font-size: 13px;
  color: #6b7280;
}

.user-menu {
  position: absolute;
  bottom: 70px;
  right: 0;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 10px;
  z-index: 100;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
}

.user-info:hover .user-menu {
  opacity: 1;
  transform: translateY(0);
}

.menu-item {
  padding: 10px 16px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
  text-decoration: none;
}

.menu-item:hover {
  background-color: #f3f4f6;
  color: #4b83ee;
}


</style>