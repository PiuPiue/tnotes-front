<template>
  <div class="home-page">
    <!-- 侧边栏 -->
    <SideBar :activeTab="activeTab" @change-tab="changeTab" />

    <!-- 主体内容 -->
    <div class="main-content">
        <router-view></router-view>
    </div>
  </div>
</template>

<script>
import SideBar from '@/components/SlideBar.vue';


export default {
  name: 'HomeIndex',
  components: { SideBar },
  data() {
    return {
    
    };
  },
  methods: {
  },
};
</script>

<style scoped>
/* 整体布局 */
.home-page {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background-color: #f8f9fa; /* 背景颜色 */
}

/* 隐藏滚动条 */
.home-page::-webkit-scrollbar {
  width: 0;
}

/* 侧边栏区域 */
.sidebar-area {
  /* width: 280px; 侧边栏宽度 */
  flex-shrink: 0; /* 防止侧边栏被压缩 */
  background-color: rgba(255, 255, 255, 0.9); /* 背景颜色 */
  backdrop-filter: blur(20px); /* 毛玻璃效果 */
  border-right: 1px solid rgba(0, 0, 0, 0.1); /* 右侧边框 */
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05); /* 阴影 */
}

/* 主体内容 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 内容区域 */
.content-area {
  flex: 1;
  overflow-y: auto; /* 支持滚动 */
  
  background-color: #ffffff; /* 背景颜色 */
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.05); /* 内阴影 */
}

/* 隐藏内容区域的滚动条 */
.content-area::-webkit-scrollbar {
  width: 0;
}
</style>