<template>
    <div class="content">
      <h3>网盘</h3>
  
      <!-- 功能菜单 -->
      <div class="menu">
        <div
          class="menu-item"
          :class="{ active: currentSection === 'files' }"
          @click="navigateTo('files')"
        >
          <i class="fas fa-folder"></i>
          <span>文件</span>
        </div>
        <div
          class="menu-item"
          :class="{ active: currentSection === 'favorites' }"
          @click="navigateTo('favorites')"
        >
          <i class="fas fa-star"></i>
          <span>收藏</span>
        </div>
        <div
          class="menu-item"
          :class="{ active: currentSection === 'recycle' }"
          @click="navigateTo('recycle')"
        >
          <i class="fas fa-trash"></i>
          <span>回收站</span>
        </div>
        <div
          class="menu-item"
          :class="{ active: currentSection === 'shares' }"
          @click="navigateTo('shares')"
        >
          <i class="fas fa-share-alt"></i>
          <span>分享</span>
        </div>
      </div>
  
      <!-- 剩余空间 -->
      <div class="storage">
        <p>剩余空间：{{ usedSpace }} GB / {{ totalSpace }} GB</p>
        <div class="storage-bar">
          <div
            class="storage-progress"
            :style="{ width: storagePercentage + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'CloudIndex',
    data() {
      return {
        currentSection: 'files', // 当前选中的功能项
        usedSpace: 25, // 已用空间
        totalSpace: 100, // 总空间
      };
    },
    computed: {
      storagePercentage() {
        return (this.usedSpace / this.totalSpace) * 100;
      },
    },
    methods: {
      navigateTo(section) {
        this.currentSection = section;
      },
    },
  };
  </script>
  
  <style scoped>
  .content {
    padding: 10px;
  }
  
  /* 功能菜单 */
  .menu {
    gap: 20px;
    margin-bottom: 20px;
  }
  
  .menu-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px;
    cursor: pointer;
    color: #333;
    transition: all 0.3s ease;
  }
  
  .menu-item:hover {
    color: #1e90ff;
  }
  
  .menu-item.active {
    color: #1e90ff;
    border-bottom: 2px solid #1e90ff;
  }
  
  .menu-item i {
    font-size: 16px;
  }
  
  .menu-item span {
    font-size: 14px;
  }
  
  /* 剩余空间 */
  .storage {
    margin-bottom: 20px;
  }
  
  .storage p {
    font-size: 14px;
    color: #666;
    margin-bottom: 5px;
  }
  
  .storage-bar {
    width: 100%;
    height: 6px;
    background-color: #e0e0e0;
    border-radius: 3px;
    overflow: hidden;
  }
  
  .storage-progress {
    height: 100%;
    background-color: #1e90ff;
    border-radius: 3px;
    transition: width 0.3s ease;
  }
  </style>