
<template>
  <div class="app">
    <!-- 顶部导航 -->
    <nav class="nav">
      <div class="nav-container">
        <div class="logo">
          <img src="https://ai-public.mastergo.com/ai/img_res/f8701189dbc317491d835f05a7315386.jpg" alt="logo" />
          <span>Notes</span>
        </div>
        <div class="nav-links">
          <a href="#" class="nav-link">新世界</a>
          <a href="#" class="nav-link active">笔记</a>
          <a href="#" class="nav-link">网盘</a>
          <a href="#" class="nav-link">AI</a>
        </div>
        <div class="nav-actions">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" placeholder="搜索" />
          </div>
          <button class="user-button">
            <i class="fas fa-user"></i>
          </button>
        </div>
      </div>
    </nav>

    <!-- 主体内容 -->
    <main class="main">
      <!-- 功能按钮组 -->
      <div class="action-buttons">
        <h1>我的网盘</h1>
        <div class="buttons">
          <button class="btn-primary">
            <i class="fas fa-cloud-upload-alt"></i>
            <span>上传文件</span>
          </button>
          <button class="btn-secondary">
            <i class="fas fa-folder-plus"></i>
            <span>新建文件夹</span>
          </button>
          <button class="btn-secondary">
            <i class="fas fa-sync"></i>
            <span>同步</span>
          </button>
        </div>
      </div>

      <!-- 存储空间指示器 -->
      <div class="storage-indicator">
        <div class="storage-header">
          <div class="storage-info">
            <i class="fas fa-hdd"></i>
            <div>
              <h3>存储空间</h3>
              <p>总容量 2TB，已使用 258.5GB</p>
            </div>
          </div>
          <button class="btn-upgrade">升级容量</button>
        </div>
        <div class="storage-bar">
          <div class="storage-progress"></div>
        </div>
      </div>

      <!-- 文件导航 -->
      <div class="file-grid">
        <div v-for="file in files" :key="file.id" class="file-card">
          <div class="file-icon" :class="file.iconColor">
            <i :class="['fas', file.icon]"></i>
          </div>
          <div class="file-info">
            <h3>{{ file.name }}</h3>
            <div class="file-details">
              <span>{{ file.size }}</span>
              <span>{{ file.modified }}</span>
            </div>
          </div>
          <div class="file-actions">
            <button><i class="fas fa-download"></i></button>
            <button><i class="fas fa-share-alt"></i></button>
            <button><i class="fas fa-ellipsis-h"></i></button>
          </div>
        </div>
      </div>

      <!-- 快速访问 -->
      <div class="quick-access">
        <h2>快速访问</h2>
        <div class="shortcut-grid">
          <div v-for="shortcut in shortcuts" :key="shortcut.id" class="shortcut-card">
            <div class="shortcut-cover">
              <img :src="shortcut.cover" :alt="shortcut.name" />
            </div>
            <h3>{{ shortcut.name }}</h3>
            <p>{{ shortcut.count }}</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
<script>
export default {
  name: 'App',
  data() {
    return {
      files: [
        {
          id: 1,
          name: '产品设计规范 2024.pdf',
          size: '8.5 MB',
          modified: '2024-01-15 14:30',
          icon: 'fa-file-pdf',
          iconColor: 'text-red',
        },
        {
          id: 2,
          name: '项目进度表.xlsx',
          size: '2.1 MB',
          modified: '2024-01-14 09:15',
          icon: 'fa-file-excel',
          iconColor: 'text-green',
        },
        {
          id: 3,
          name: '团队周报汇总',
          size: '196.5 MB',
          modified: '2024-01-13 18:20',
          icon: 'fa-folder',
          iconColor: 'text-yellow',
        },
        {
          id: 4,
          name: '产品原型设计.sketch',
          size: '45.8 MB',
          modified: '2024-01-12 11:40',
          icon: 'fa-file-image',
          iconColor: 'text-blue',
        },
        {
          id: 5,
          name: '需求分析报告.docx',
          size: '3.2 MB',
          modified: '2024-01-11 16:55',
          icon: 'fa-file-word',
          iconColor: 'text-blue',
        },
        {
          id: 6,
          name: '营销策略方案.pptx',
          size: '12.4 MB',
          modified: '2024-01-10 10:25',
          icon: 'fa-file-powerpoint',
          iconColor: 'text-orange',
        },
        {
          id: 7,
          name: '品牌资产素材',
          size: '1.2 GB',
          modified: '2024-01-09 15:30',
          icon: 'fa-folder',
          iconColor: 'text-yellow',
        },
        {
          id: 8,
          name: '用户研究报告.pdf',
          size: '5.7 MB',
          modified: '2024-01-08 17:45',
          icon: 'fa-file-pdf',
          iconColor: 'text-red',
        },
      ],
      shortcuts: [
        {
          id: 1,
          name: '设计资源',
          count: '125 个文件',
          cover: 'https://ai-public.mastergo.com/ai/img_res/092cd0bf35a197e96cb1ff093ad805f3.jpg',
        },
        {
          id: 2,
          name: '开发文档',
          count: '83 个文件',
          cover: 'https://ai-public.mastergo.com/ai/img_res/b1a0e8eb3841c66532a3ebd0ae4453de.jpg',
        },
        {
          id: 3,
          name: '项目管理',
          count: '56 个文件',
          cover: 'https://ai-public.mastergo.com/ai/img_res/7ebca1f9d2344e52984ca17cc5767eeb.jpg',
        },
        {
          id: 4,
          name: '市场营销',
          count: '94 个文件',
          cover: 'https://ai-public.mastergo.com/ai/img_res/648fbdb0c6d77c5c46ba9fcd633eae94.jpg',
        },
        {
          id: 5,
          name: '用户研究',
          count: '42 个文件',
          cover: 'https://ai-public.mastergo.com/ai/img_res/003e0475c3511454c71f17cc44da04bd.jpg',
        },
        {
          id: 6,
          name: '产品规划',
          count: '67 个文件',
          cover: 'https://ai-public.mastergo.com/ai/img_res/4dc1d8c41a3e38911692479b7bf80733.jpg',
        },
      ],
    };
  },
};
</script>
<style scoped>
/* 全局样式 */
.app {
  min-height: 100vh;
  background: linear-gradient(to bottom right, #f0f4ff, #ffffff);
  font-family: Arial, sans-serif;
}

/* 顶部导航 */
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid #e5e7eb;
  z-index: 50;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo img {
  height: 24px;
  width: 24px;
}

.logo span {
  font-size: 18px;
  font-weight: 500;
  color: #1e293b;
}

.nav-links {
  display: flex;
  gap: 48px;
}

.nav-link {
  color: #4b5563;
  text-decoration: none;
  transition: color 0.3s;
}

.nav-link:hover {
  color: #2563eb;
}

.nav-link.active {
  color: #2563eb;
  font-weight: 500;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-box {
  position: relative;
}

.search-box i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
}

.search-box input {
  width: 192px;
  padding: 8px 8px 8px 32px;
  border-radius: 9999px;
  border: none;
  background: #f3f4f6;
  font-size: 14px;
}

.user-button {
  width: 32px;
  height: 32px;
  border-radius: 9999px;
  background: #2563eb;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

/* 主体内容 */
.main {
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 80px;
  padding-bottom: 48px;
  padding-left: 16px;
  padding-right: 16px;
}

.action-buttons {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
}

.action-buttons h1 {
  font-size: 24px;
  font-weight: 500;
  color: #1e293b;
}

.buttons {
  display: flex;
  gap: 16px;
}

.btn-primary,
.btn-secondary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-primary {
  background: #2563eb;
  color: white;
  border: none;
}

.btn-primary:hover {
  background: #1e4bb5;
}

.btn-secondary {
  background: white;
  border: 1px solid #e5e7eb;
  color: #4b5563;
}

.btn-secondary:hover {
  background: #f3f4f6;
}

/* 存储空间指示器 */
.storage-indicator {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.storage-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.storage-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.storage-info i {
  font-size: 24px;
  color: #2563eb;
}

.storage-info h3 {
  font-size: 18px;
  font-weight: 500;
  color: #1e293b;
}

.storage-info p {
  font-size: 14px;
  color: #6b7280;
}

.btn-upgrade {
  padding: 8px 16px;
  border-radius: 8px;
  background: transparent;
  color: #2563eb;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-upgrade:hover {
  background: #f0f4ff;
}

.storage-bar {
  height: 8px;
  background: #f3f4f6;
  border-radius: 9999px;
  overflow: hidden;
}

.storage-progress {
  height: 100%;
  width: 25%;
  background: #2563eb;
  border-radius: 9999px;
}

/* 文件导航 */
.file-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 32px;
}

.file-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s;
  cursor: pointer;
}

.file-card:hover {
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
}

.file-icon {
  height: 128px;
  background: #f3f4f6;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.file-icon i {
  font-size: 48px;
}

.text-red {
  color: #ef4444;
}

.text-green {
  color: #22c55e;
}

.text-yellow {
  color: #eab308;
}

.text-blue {
  color: #2563eb;
}

.text-orange {
  color: #f97316;
}

.file-info h3 {
  font-size: 16px;
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 8px;
}

.file-details {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #6b7280;
}

.file-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.file-actions button {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: transparent;
  border: none;
  color: #6b7280;
  cursor: pointer;
  transition: background-color 0.3s;
}

.file-actions button:hover {
  background: #f3f4f6;
}

/* 快速访问 */
.quick-access {
  margin-bottom: 32px;
}

.quick-access h2 {
  font-size: 20px;
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 16px;
}

.shortcut-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
}

.shortcut-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s;
  cursor: pointer;
}

.shortcut-card:hover {
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
}

.shortcut-cover {
  position: relative;
  padding-bottom: 66.666667%;
  margin-bottom: 12px;
}

.shortcut-cover img {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.shortcut-card h3 {
  font-size: 16px;
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 4px;
}

.shortcut-card p {
  font-size: 14px;
  color: #6b7280;
}
</style>