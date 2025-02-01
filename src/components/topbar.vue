<template>
  <div class="sidebar">
    <!-- 上半部分：导航菜单 -->
    <div class="sidebar-top">
      <div class="logo-section">
        <img src="https://ai-public.mastergo.com/ai/img_res/f8701189dbc317491d835f05a7315386.jpg" alt="Logo" class="logo" />
        <span class="app-name">Notes</span>
      </div>
      <!-- 动态导航菜单 -->
      <nav class="nav-links" v-if="activeView === 'notes'">
        <router-link to="/home/notebook/my-notes" class="nav-link" active-class="active">
          <i class="fas fa-book"></i>
          <span>我创建的</span>
        </router-link>
        <router-link to="/home/notebook/collaboration" class="nav-link" active-class="active">
          <i class="fas fa-users"></i>
          <span>协作</span>
        </router-link>
        <router-link to="/home/notebook/favorites" class="nav-link" active-class="active">
          <i class="fas fa-star"></i>
          <span>收藏</span>
        </router-link>
        <router-link to="/home/notebook/essays" class="nav-link" active-class="active">
          <i class="fas fa-pen"></i>
          <span>随笔</span>
        </router-link>
        <router-link to="/home/notebook/quick-start" class="nav-link" active-class="active">
          <i class="fas fa-rocket"></i>
          <span>快速开始</span>
        </router-link>
      </nav>
      <nav class="nav-links" v-else-if="activeView === 'cloud'">
        <router-link to="/home/cloud/files" class="nav-link" active-class="active">
          <i class="fas fa-folder"></i>
          <span>文件</span>
        </router-link>
        <router-link to="/home/cloud/shared" class="nav-link" active-class="active">
          <i class="fas fa-share-alt"></i>
          <span>共享</span>
        </router-link>
      </nav>
      <nav class="nav-links" v-else-if="activeView === 'ai'">
        <router-link to="/home/ai/assistant" class="nav-link" active-class="active">
          <i class="fas fa-robot"></i>
          <span>AI助手</span>
        </router-link>
        <router-link to="/home/ai/settings" class="nav-link" active-class="active">
          <i class="fas fa-cog"></i>
          <span>设置</span>
        </router-link>
      </nav>
    </div>

    <!-- 下半部分：滑块和用户信息 -->
    <div class="sidebar-bottom">
      <!-- 滑块 -->
      <div class="slider">
        <button @click="switchView('notes')" :class="['slider-btn', activeView === 'notes' ? 'active' : '']">
          笔记
        </button>
        <button @click="switchView('cloud')" :class="['slider-btn', activeView === 'cloud' ? 'active' : '']">
          资源
        </button>
        <button @click="switchView('ai')" :class="['slider-btn', activeView === 'ai' ? 'active' : '']">
          AI
        </button>
      </div>

      <!-- 用户信息 -->
      <div class="user-info" @click="toggleUserMenu">
        <img :src="userInfo.avatar" alt="用户头像" class="avatar" />
        <div class="user-details">
          <span class="username">{{ userInfo.name }}</span>
          <span class="user-status">{{ userInfo.status }}</span>
        </div>
        <!-- 用户菜单 -->
        <div v-if="isUserMenuOpen" class="user-menu">
          <div class="menu-item" @click="handleProfile">个人资料</div>
          <div class="menu-item" @click="handleLogout">退出登录</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SideBar',
  data() {
    return {
      userInfo: {
        avatar: 'https://ai-public.mastergo.com/ai/img_res/fb856d64165cec894ea306ef7bf32a89.jpg',
        name: '陈思远',
        status: '专业版用户',
      },
      isUserMenuOpen: false,
      activeView: 'notes', // 当前视图
    };
  },
  methods: {
    toggleUserMenu() {
      this.isUserMenuOpen = !this.isUserMenuOpen;
    },
    handleProfile() {
      alert('打开个人资料');
    },
    handleLogout() {
      alert('退出登录');
    },
    switchView(view) {
      this.activeView = view;
    },
  },
};
</script>

<style scoped>
.sidebar {
  width: 200px; /* 加宽侧边栏 */
  height: 95vh;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.95),
    rgba(245, 245, 245, 0.95)
  ); /* 渐变背景 */
  backdrop-filter: blur(25px); /* 更强的模糊效果 */
  border-right: 1px solid rgba(0, 0, 0, 0.08); /* 更细的边框 */
  box-shadow: 4px 0 12px rgba(0, 0, 0, 0.1); /* 更强的阴影 */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 28px;
  transition: all 0.3s ease;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 36px; /* 增加间距 */
}

.logo {
  width: 32px; /* 放大图标 */
  height: 32px;
  border-radius: 8px; /* 圆角 */
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1); /* 图标阴影 */
}

.app-name {
  font-size: 22px; /* 放大字体 */
  font-weight: 600;
  color: #1a1a1a; /* 深色 */
  letter-spacing: -0.5px; /* 字间距调整 */
}

.nav-links {
  display: flex;
  flex-direction: column;
  gap: 10px; /* 调整间距 */
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px; /* 增加内边距 */
  border-radius: 10px; /* 更大的圆角 */
  color: #4b5563;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 15px;
  background: transparent; /* 默认透明背景 */
}

.nav-link:hover {
  background: rgba(239, 246, 255, 0.8); /* 半透明背景 */
  color: #4b83ee;
  transform: translateX(6px); /* 右移效果 */
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1); /* 悬停阴影 */
}

.nav-link.active {
  background: rgba(239, 246, 255, 0.8); /* 半透明背景 */
  color: #4b83ee;
  font-weight: 500;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1); /* 选中阴影 */
}

.nav-link i {
  font-size: 18px; /* 放大图标 */
  color: inherit; /* 继承父元素颜色 */
}

.sidebar-bottom {
  display: flex;
  flex-direction: column;
  gap: 24px; /* 增加间距 */
}

.slider {
  display: flex;
  background-color: rgba(243, 244, 246, 0.8); /* 半透明背景 */
  border-radius: 12px;
  padding: 8px; /* 增加内边距 */
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05); /* 内阴影 */
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
  color: #6b7280;
}

.slider-btn.active {
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* 更强的阴影 */
  color: #4b83ee;
  font-weight: 500;
}

.slider-btn:hover {
  color: #4b83ee;
  transform: scale(1.05); /* 轻微放大 */
}

.user-info {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px;
  border-radius: 10px;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.8); /* 半透明背景 */
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1); /* 用户信息阴影 */
}

.user-info:hover {
  background: rgba(239, 246, 255, 0.9); /* 悬停背景 */
  transform: translateY(-2px); /* 上移效果 */
}

.avatar {
  width: 40px; /* 放大头像 */
  height: 40px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.9); /* 白色边框 */
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1); /* 头像阴影 */
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
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* 更强的阴影 */
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
}

.menu-item:hover {
  background-color: #f3f4f6;
  color: #4b83ee;
}
</style>