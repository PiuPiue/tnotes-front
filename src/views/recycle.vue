<template>
    <div class="app">
      <!-- 主体内容 -->
      <main class="main">
        <!-- 顶部标题和操作按钮 -->
        <div class="recycle-header">
          <h1>回收站</h1>
          <div class="recycle-actions">
            <button class="btn-danger" @click="handleEmptyRecycle">
              <i class="fas fa-trash"></i>
              <span>清空回收站</span>
            </button>
          </div>
        </div>
  
        <!-- 回收站文件列表 -->
        <div class="recycle-list">
          <div
            v-for="item in recycleItems"
            :key="item.id"
            class="recycle-item"
            :class="{ 'folder-item': item.type === 1 }"
          >
            <div class="item-icon">
              <i :class="getFileIcon(item)"></i>
            </div>
            <div class="item-info">
              <h3>{{ item.name }}</h3>
              <p>删除时间：{{ formatDate(item.deleteTime) }}</p>
              <p >大小：{{ formatFileSize(item.size) }}</p>
            </div>
            <div class="item-actions">
              <button class="btn-restore" @click.stop="handleRestore(item)">
                <i class="fas fa-undo"></i>
                <span>恢复</span>
              </button>
              <button class="btn-delete" @click.stop="handleDelete(item)">
                <i class="fas fa-trash"></i>
                <span>彻底删除</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  </template>
  
  <script>
  import {getRecycleFile,recoverFile,deleteFileCompletely,clearRecycleBin} from '@/utils/api'
  
  export default {
    name: 'RecycleBin',
    data() {
      return {
        recycleItems: [
  {
    id: 1,
    name: '项目进度表.xlsx',
    type: 0, // 0 表示文件，1 表示文件夹
    size: 2097152, // 2MB
    deleteTime: '2024-01-15T14:30:00',
  },
  {
    id: 2,
    name: '设计素材',
    type: 1,
    deleteTime: '2024-01-14T09:15:00',
  },
],
      };
    },
    methods: {
      // 获取回收站数据
      async fetchRecycleItems() {
        const res = await getRecycleFile();
        if (res.data.code === 200) {
          this.recycleItems = res.data.data;
        }
      },
      // 恢复文件或文件夹
      async handleRestore(item) {
        const res = await recoverFile(item.id);
        if (res.data.code === 200) {
          this.$message.success('恢复成功');
          this.fetchRecycleItems(); // 刷新列表
        } else {
          this.$message.error('恢复失败');
        }
      },
      // 彻底删除文件或文件夹
      async handleDelete(item) {
        this.$confirm('确定彻底删除该文件吗？此操作不可恢复', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(async () => {
          const res = await deleteFileCompletely(item.id);
          if (res.data.code === 200) {
            this.$message.success('彻底删除成功');
            this.fetchRecycleItems(); // 刷新列表
          } else {
            this.$message.error('彻底删除失败');
          }
        }).catch(() => {});
      },
      // 清空回收站
      async handleEmptyRecycle() {
        this.$confirm('确定清空回收站吗？此操作不可恢复', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(async () => {
          const res = await clearRecycleBin();
          if (res.data.code === 200) {
            this.$message.success('回收站已清空');
            this.fetchRecycleItems(); // 刷新列表
          } else {
            this.$message.error('清空回收站失败');
          }
        }).catch(() => {});
      },
      // 格式化日期
      formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        });
      },
      // 格式化文件大小
      formatFileSize(size) {
        if (size < 1024) {
          return size + ' B';
        } else if (size < 1024 * 1024) {
          return (size / 1024).toFixed(2) + ' KB';
        } else if (size < 1024 * 1024 * 1024) {
          return (size / (1024 * 1024)).toFixed(2) + ' MB';
        } else {
          return (size / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
        }
      },
      // 获取文件图标
      getFileIcon(item) {
        if (item.type === 1) return 'fas fa-folder';
        const ext = item.name.split('.').pop().toLowerCase();
        if (ext === 'pdf') return 'fas fa-file-pdf';
        if (ext === 'xlsx' || ext === 'xls') return 'fas fa-file-excel';
        if (ext === 'docx' || ext === 'doc') return 'fas fa-file-word';
        if (ext === 'pptx' || ext === 'ppt') return 'fas fa-file-powerpoint';
        if (ext === 'jpg' || ext === 'jpeg' || ext === 'png' || ext === 'gif') return 'fas fa-file-image';
        return 'fas fa-file';
      },
    },
    mounted() {
      this.fetchRecycleItems(); // 加载回收站数据
    },
  };
  </script>
  
  <style scoped>
  /* 全局样式 */
  .app {
    min-height: 100vh;
    background: linear-gradient(to bottom right, #f0f4ff, #ffffff);
    font-family: Arial, sans-serif;
    padding: 24px;
  }
  
  /* 主体内容 */
  .main {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  /* 回收站头部 */
  .recycle-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
  }
  
  .recycle-header h1 {
    font-size: 24px;
    font-weight: 600;
    color: #1e293b;
  }
  
  .recycle-actions .btn-danger {
    background: #6366f1;
    color: white;
    border: none;
    padding: 10px 16px;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .recycle-actions .btn-danger:hover {
    background: #dc2626;
  }
  
  /* 回收站列表 */
  .recycle-list {
    background: white;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .recycle-item {
    display: flex;
    align-items: center;
    padding: 12px;
    border-bottom: 1px solid #e0e7ff;
    transition: all 0.3s ease;
  }
  
  .recycle-item:last-child {
    border-bottom: none;
  }
  
  .recycle-item:hover {
    background: #f8f9ff;
    transform: translateX(6px);
  }
  
  .item-icon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 16px;
  }
  
  .item-icon i {
    font-size: 24px;
    color: #6366f1;
  }
  
  .item-info {
    flex: 1;
  }
  
  .item-info h3 {
    font-size: 16px;
    font-weight: 500;
    color: #1e293b;
    margin-bottom: 4px;
  }
  
  .item-info p {
    font-size: 14px;
    color: #6b7280;
    margin: 0;
  }
  
  .item-actions {
    display: flex;
    gap: 8px;
  }
  
  .item-actions button {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .item-actions .btn-restore {
    background: #6366f1;
    color: white;
    border: none;
  }
  
  .item-actions .btn-restore:hover {
    background: #6366f1;
  }
  
  .item-actions .btn-delete {
    background: #ef4444;
    color: white;
    border: none;
  }
  
  .item-actions .btn-delete:hover {
    background: #dc2626;
  }
  </style>