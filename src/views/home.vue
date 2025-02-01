<template>
  <div class="home-page">
    <!-- 顶部栏 -->
    <div class="topbar">
      <TopBar></TopBar>
    </div>

    <!-- 主体内容 -->
    <div class="main-content">
      <!-- 内容区域 -->
      <div class="content-area">
        <router-view></router-view> <!-- 动态加载内容 -->
      </div>
    </div>
  </div>
</template>

<script>
import TopBar from '@/components/topbar.vue';

export default {
  components: { TopBar },
  name: 'HomePage',
};
</script>

<style scoped>
/* 整体布局 */
.home-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

/* 隐藏滚动条 */
.home-page::-webkit-scrollbar {
  width: 0;
}

/* 顶部栏 */
.topbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 63px; /* 高度 */
  background-color: rgba(255, 255, 255, 0.8); /* 半透明白色背景 */
  backdrop-filter: blur(12px); /* 毛玻璃效果 */
  border-bottom: 1px solid rgba(0, 0, 0, 0.1); /* 底部边框 */
  z-index: 1000; /* 确保在最上层 */
}

/* 主体内容 */
.main-content {
  
  flex: 1;
  display: flex;
  overflow: hidden;
  margin-top: 38px;
}

/* 内容区域 */
.content-area {
  flex: 1;
  overflow-y: auto; /* 支持滚动 */
}

/* 隐藏内容区域的滚动条 */
.content-area::-webkit-scrollbar {
  width: 0;
}
</style>