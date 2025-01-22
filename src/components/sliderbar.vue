<template>
  <div class="slider-bar">
    <!-- 左侧菜单栏 -->
    <div class="slider-bar-left">
      <!-- 收起/展开按钮 -->
      <div class="toggle-button" @click="toggleSidebar">
        <i :class="isSidebarCollapsed ? 'fas fa-bars' : 'fas fa-times'"></i>
      </div>

      <div class="slider-bar-menu">
        <div
          v-for="item in menuItems"
          :key="item.text"
          class="menu-item"
          :class="{ active: item.active }"
          @click="handleMenuClick(item)"
        >
          <i :class="item.icon"></i>
          <span>{{ item.text }}</span>
        </div>
      </div>
    </div>

    <!-- 不同模块对应侧边栏 -->
    <div class="slider-bar-right" :class="{ 'slider-bar-right1': isSidebarCollapsed }">
      <!-- 二级栏内容 -->
      <transition name="slide">
        <div v-show="!isSidebarCollapsed" class="sidebar-content">
          <component :is="currentComponent"></component>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import NewWorld from '@/components/NewWorld.vue';
import Notes from '@/components/Notes.vue';
import Cloud from '@/components/Cloud.vue';
import AI from '@/components/AI.vue';

export default {
  name: 'SliderBar',
  components: { NewWorld, Notes, Cloud, AI },
  data() {
    return {
      // 菜单项
      menuItems: [
        { icon: 'fas fa-globe', text: '新世界', active: true, component: 'NewWorld' },
        { icon: 'fas fa-file-alt', text: '笔记', active: false, component: 'Notes' },
        { icon: 'fas fa-cloud', text: '网盘', active: false, component: 'Cloud' },
        { icon: 'fas fa-robot', text: 'AI', active: false, component: 'AI' }
      ],
      // 当前显示的组件
      currentComponent: 'NewWorld',
      // 是否收起二级栏
      isSidebarCollapsed: false
    };
  },
  methods: {
    // 处理菜单点击
    handleMenuClick(item) {
      this.menuItems.forEach(menu => (menu.active = menu === item));
      this.currentComponent = item.component;
      // 路由跳转
      if (item.component === 'Notes') {
        this.$router.push('/home/notebook');
      } else if (item.component === 'Cloud') {
        this.$router.push('/home/cloud');
      } else if (item.component === 'AI') {
        this.$router.push('/home/ai');
      } else if (item.component === 'NewWorld') {
        this.$router.push('/');
      }
    },
    // 切换二级栏的收起/展开状态
    toggleSidebar() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
    }
  }
};
</script>

<style scoped>
/* 侧边栏整体样式 */
.slider-bar {
  display: flex;
  height: 100%;
  background-color: #ffffff;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
}

/* 左侧菜单栏 */
.slider-bar-left {
  width: 80px;
  background-color: #f5f7fa;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 收起/展开按钮 */
.toggle-button {
  width: 40px;
  height: 40px;
  background-color: #1e90ff;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease, transform 0.3s ease;
  margin-bottom: 20px; /* 与菜单项保持距离 */
}

.toggle-button:hover {
  background-color: #0077cc;
  transform: scale(1.1); /* 悬停时放大按钮 */
}

.toggle-button i {
  font-size: 16px;
  transition: transform 0.3s ease;
}

.toggle-button:hover i {
  transform: rotate(90deg); /* 悬停时旋转图标 */
}

/* 菜单项 */
.slider-bar-menu {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 10px;
  cursor: pointer;
  color: #333;
  border-radius: 8px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.menu-item:hover {
  background-color: #e0e0e0;
}

.menu-item.active {
  background-color: #1e90ff;
  color: white;
}

.menu-item i {
  font-size: 20px;
  color: #333;
  transition: color 0.3s ease;
}

.menu-item.active i {
  color: white;
}

.menu-item:hover i {
  color: #1e90ff;
}

/* 右侧内容区域 */
.slider-bar-right {
  width: 250px;
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: #ffffff;
  position: relative;
  transition: width 0.3s ease, padding 0.3s ease; /* 添加宽度和 padding 的过渡效果 */
}

/* 收起时的样式 */
.slider-bar-right1 {
  width: 0;
  padding: 20px 0; /* 收起时 padding 调整为 0 */
  overflow: hidden; /* 隐藏内容 */
}

/* 二级栏内容 */
.sidebar-content {
  width: 100%;
  height: 100%;
  transition: opacity 0.3s ease;
}

/* 收起时的动画效果 */
.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateX(-20px); /* 内容向左滑动消失 */
}

/* 消除滚动条 */
::-webkit-scrollbar {
  width: 0;
}


/* 右侧内容区域 */
.slider-bar-right {
  width: 250px;
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa, #e2e6ee); /* 渐变背景 */
  position: relative;
  transition: width 0.3s ease, padding 0.3s ease; /* 添加宽度和 padding 的过渡效果 */
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1); /* 增加阴影 */
}

/* 收起时的样式 */
.slider-bar-right1 {
  width: 0;
  padding: 20px 0; /* 收起时 padding 调整为 0 */
  overflow: hidden; /* 隐藏内容 */
  background: linear-gradient(135deg, #f5f7fa, #e2e6ee); /* 保持一致的渐变背景 */
}

/* 二级栏内容 */
.sidebar-content {
  width: 100%;
  height: 100%;
  transition: opacity 0.3s ease;
  background: transparent; /* 内容区域透明，显示背景渐变 */
}

/* 菜单项样式调整 */
.menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 10px;
  cursor: pointer;
  color: #333;
  border-radius: 8px;
  transition: background-color 0.3s ease, color 0.3s ease;
  background-color: rgba(255, 255, 255, 0.8); /* 半透明白色背景 */
}

.menu-item:hover {
  background-color: rgba(255, 255, 255, 1); /* 悬停时背景更白 */
}

.menu-item.active {
  background-color: #1e90ff;
  color: white;
}

.menu-item.active i {
  color: white;
}

.menu-item:hover i {
  color: #1e90ff;
}
</style>