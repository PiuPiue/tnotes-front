<template>
  <div class="topbar">
    <!-- 左侧图标 -->
    <div class="top-left">
      <img src="@/assets/logo.png" alt="Logo" class="logo" />
      <span class="app-name">t-notes</span>
    </div>

    <!-- 右侧功能 -->
    <div class="top-right">
      <!-- 搜索框 -->
      <div class="search-box">
        <input
          type="text"
          placeholder="搜索"
          class="search-input"
          v-model="searchQuery"
        />
        <button class="search-button" @click="handleSearch">
          <i class="fas fa-search"></i>
        </button>
      </div>

      <!-- 主题切换 -->
      <button class="theme-toggle" @click="toggleTheme">
        <i :class="themeIcon"></i>
      </button>

      <!-- 用户头像 -->
      <div class="user-avatar" @click="toggleUserMenu">
        <img :src="userInfo.avatar" alt="用户头像" class="avatar" />
        <div v-if="isUserMenuOpen" class="user-menu">
          <div class="menu-item" @click="handleProfile">个人资料</div>
          <div class="menu-item" @click="handleLogout">退出登录</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { logout } from '@/utils/api';
export default {
  name: 'TopBar',
  data() {
    return {
      userInfo: JSON.parse(localStorage.getItem('userInfo')),
      searchQuery: '', // 搜索框内容
      isDarkTheme: false, // 当前主题
      isUserMenuOpen: false // 用户菜单是否打开
    };
  },
  computed: {
    // 根据主题切换图标
    themeIcon() {
      return this.isDarkTheme ? 'fas fa-moon' : 'fas fa-sun';
    }
  },
  methods: {
    // 处理搜索
    handleSearch() {
      if (this.searchQuery) {
        alert(`搜索内容: ${this.searchQuery}`);
      }
    },
    // 切换主题
    toggleTheme() {
      this.isDarkTheme = !this.isDarkTheme;
      document.body.classList.toggle('dark-theme', this.isDarkTheme);
    },
    // 切换用户菜单
    toggleUserMenu() {
      this.isUserMenuOpen = !this.isUserMenuOpen;
    },
    // 处理个人资料
    handleProfile() {
      alert('打开个人资料');
    },
    // 处理退出登录
    handleLogout() {
      logout().then(response => {
        if (response.data.code == 200) {
          this.$message.success('退出成功');
          localStorage.removeItem('userInfo');
          this.$router.push('/login')
        } else {
          this.$message.error('退出失败');
        }
      });
    }
  }
};
</script>

<style scoped>
/* 顶部栏样式 */
.topbar {
  width: 98%;
  height: 60px;
  background-color: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 左侧图标 */
.top-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo {
  height: 30px;
  cursor: pointer;
}

.app-name {
  font-size: 18px;
  font-weight: bold;
  color: #1E90FF;
}

/* 右侧功能 */
.top-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

/* 搜索框 */
.search-box {
  display: flex;
  align-items: center;
  background-color: #f5f7fa;
  border-radius: 25px;
  padding: 5px 10px;
  border: 1px solid #e0e0e0;
}

.search-input {
  border: none;
  background: transparent;
  outline: none;
  padding: 5px;
  width: 150px;
}

.search-button {
  border: none;
  background: transparent;
  cursor: pointer;
  color: #1E90FF;
}

/* 主题切换按钮 */
.theme-toggle {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 18px;
  color: #1E90FF;
}

/* 用户头像 */
.user-avatar {
  position: relative;
  cursor: pointer;
}

.avatar {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  border: 2px solid #1E90FF;
}

/* 用户菜单 */
.user-menu {
  position: absolute;
  top: 50px;
  right: 0;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 10px;
  z-index: 100;
}

.menu-item {
  padding: 10px;
  cursor: pointer;
  color: #333;
  width: 100px;
}

.menu-item:hover {
  background-color: #f5f7fa;
  border-radius: 5px;
}
</style>