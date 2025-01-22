<template>
  <div class="home-page">
    <!-- 顶部栏 -->
    <div class="topbar">
      <TopBar></TopBar>
    </div>

    <!-- 主体内容 -->
    <div class="main-content">
      <!-- 侧边栏 -->
      <div class="sliderbar">
        <SliderBar></SliderBar>
 
      </div>

      <!-- 内容区域 -->
      <div class="content-area">
        <router-view></router-view> <!-- 动态加载内容 -->
      </div>
    </div>
  </div>
</template>

<script>
import TopBar from '@/components/topbar.vue'
import SliderBar from '@/components/sliderbar.vue';

export default {
  components: { TopBar, SliderBar },
  name: 'HomePage'
};
</script>

<style scoped>
.home-page {
 
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  height: 100vh;
}
.home-page::-webkit-scrollbar {
  width: 0px;
}

.topbar {
  
  height: 60px;
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.main-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.sliderbar {
  overflow-x: auto;
  background-color: #ffffff;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  overflow-y: auto; /* 支持滚动 */
}

/* home.vue */
.content-area {
  flex: 1;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa, #e2e6ee);
  overflow-y: auto;
}

.content-area::-webkit-scrollbar{
  width: 0;
}
</style>