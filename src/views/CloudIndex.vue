<template>
    <div>
      <h3>全部文件</h3>
      <!-- 文件列表 -->
      <div class="file-list">
        <div v-for="file in files" :key="file.name" class="card">
          <!-- 图片 -->
          <img
            :src="file.type === 'folder' ? folderImage : fileImage"
            alt="file-icon"
            class="file-icon"
          />
          <!-- 文件名 -->
          <div class="file-name">{{ file.name }}</div>
          <!-- 时间 -->
          <div class="file-time">{{ file.modified }}</div>
        </div>
      </div>
  
      <!-- 右下角圆形加号按钮 -->
      <div class="add-button" @click="toggleAddMenu">
        <i class="fas fa-plus"></i>
      </div>
  
      <!-- 添加菜单 -->
      <div v-if="showAddMenu" class="add-menu">
        <div class="menu-item" @click="addFolder">
          <i class="fas fa-folder"></i>
          <span>添加文件夹</span>
        </div>
        <div class="menu-item" @click="uploadFile">
          <i class="fas fa-file-upload"></i>
          <span>上传文件</span>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        // 文件夹和文件的图片路径
        folderImage: require('@/assets/images/filelist.png'),
        fileImage: require('@/assets/images/file.png'),
        // 文件列表数据
        files: [
          { name: '第1章课程介绍', type: 'folder', modified: '2024/09/22 23:24' },
          { name: '第2章搭建数据库', type: 'folder', modified: '2024/09/22 23:24' },
          { name: '第3章基于微服务', type: 'folder', modified: '2024/09/22 23:24' },
          { name: '第4章乘客下单与.png', type: 'file', modified: '2024/09/22 23:24' },
          { name: '第5章订单执行与.mp4', type: 'file', modified: '2024/09/22 23:24' },
          { name: '第6章Al分析与订.mp3', type: 'file', modified: '2024/09/22 23:24' },
          { name: '第7章订单支付与.pdf', type: 'file', modified: '2024/09/22 23:24' },
          { name: '第8章订单评价与.jpg', type: 'file', modified: '2024/09/22 23:24' },
          { name: '第9章代金券管理.mp4', type: 'file', modified: '2024/09/22 23:24' },
          { name: '第10章在线发布代.mp3', type: 'file', modified: '2024/09/22 23:24' },
          { name: '第11章课程总结.pdf', type: 'file', modified: '2024/09/22 23:24' },
          { name: '课件.exe', type: 'file', modified: '2024/09/22 23:24' },
        ],
        // 是否显示添加菜单
        showAddMenu: false,
      };
    },
    methods: {
      // 切换添加菜单的显示状态
      toggleAddMenu() {
        this.showAddMenu = !this.showAddMenu;
      },
      // 添加文件夹
      addFolder() {
        const folderName = prompt('请输入文件夹名称');
        if (folderName) {
          this.files.push({
            name: folderName,
            type: 'folder',
            modified: new Date().toLocaleString(),
          });
          this.showAddMenu = false; // 关闭菜单
        }
      },
      // 上传文件
      uploadFile() {
        alert('上传文件功能待实现');
        this.showAddMenu = false; // 关闭菜单
      },
    },
  };
  </script>
  
  <style scoped>
  .file-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: flex-start;
    margin-top: 20px;
    padding: 0 20px;
    gap: 20px;
  }
  
  .card {
    width: 150px;
    padding: 10px;
    
    border-radius: 8px;
    text-align: center;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  
  .card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
  
  .file-icon {
    width: 80px;
    height: 80px;
    margin-bottom: 10px;
  }
  
  .file-name {
    font-size: 14px;
    color: #333;
    margin-bottom: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .file-time {
    font-size: 12px;
    color: #666;
  }
  
  /* 右下角圆形加号按钮 */
  .add-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    background-color: #637dff;
    color: white;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    transition: background-color 0.3s ease;
  }
  
  .add-button:hover {
    background-color: #0077cc;
  }
  
  .add-button i {
    font-size: 20px;
  }
  
  /* 添加菜单 */
  .add-menu {
    position: fixed;
    bottom: 80px;
    right: 20px;
    background-color: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 10px;
    z-index: 100;
  }
  
  .menu-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    cursor: pointer;
    color: #333;
    transition: background-color 0.3s ease;
  }
  
  .menu-item:hover {
    background-color: #f5f7fa;
    border-radius: 5px;
  }
  
  .menu-item i {
    font-size: 16px;
    color: #1e90ff;
  }
  </style>