<template>
  <div class="app">
    <!-- 主体内容 -->
    <main class="main">
      
      <!-- 顶部功能按钮 -->
      <div class="action-buttons">
        <div class="buttons">
          <button class="btn-primary" @click="showUploadDialog = true">
            <i class="fas fa-cloud-upload-alt"></i>
            <span>上传文件</span>
          </button>
          <button class="btn-secondary" @click="handleNewFolder">
            <i class="fas fa-folder-plus"></i>
            <span>新建文件夹</span>
          </button>
          <button class="btn-secondary" @click="handleSync">
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
              <p>总容量 {{allSize}}GB，已使用 {{usedSize}}GB</p>
            </div>
          </div>
          <button class="btn-upgrade" @click="handleUpgrade">升级容量</button>
        </div>
        <div class="storage-bar">
          <div class="storage-progress" :style="{ width: storagePercentage }"></div>
        </div>
      </div>

      <!-- 文件列表 -->
      <div class="file-grid">
        <div class="file-card" @click="goBack()">
          <div class="file-icon">
            <i class="fas fa-arrow-left"></i>
          </div>
          <div class="file-info">
            <h3>返回上一级</h3>
            <div class="file-details">
              <span>{{ formatFileSize(0) }}</span>
              <span>{{ formatDate(0) }}</span>
            </div>
          </div>
        </div>
        <div
          v-for="file in files"
          :key="file.id"
          class="file-card"
          @click="handleFileClick(file)"
        >
          <div class="file-icon" :class="getFileIconColor(file)">
            <!-- <i :class="['fas', file.icon]"></i> -->
            <!-- <i :class="this.getFileIcon(file)"></i> -->
             <i :class="getFileIcon(file)"></i>
          </div>
          <div class="file-info">
            <h3>{{ file.name }}</h3>
            <div class="file-details">
              <span>{{ formatFileSize(file.size) }}</span>
              <span>{{ formatDate(file.createTime) }}</span>
            </div>
          </div>
          <div class="file-actions">
            <button @click.stop="handleDownload(file)">
              <i class="fas fa-download"></i>
            </button>
            <button @click.stop="handleShare(file)">
              <i class="fas fa-share-alt"></i>
            </button>
            <button @click.stop="handleEdit(file)">
              <i class="fas fa-edit action-icon"></i>
            </button>
            <button @click.stop="handleDelete(file)">
              <i class="fas fa-trash"></i>
            </button>
            <button @click.stop="handleMore(file)">
              <i class="fas fa-ellipsis-h"></i>
            </button>
            
          </div>
        </div>
      </div>

      <!-- 最近上传 -->
      <div class="recent-uploads">
        <h2>最近上传</h2>
        <div class="recent-grid">
          <div
            v-for="file in recentFiles"
            :key="file.id"
            class="recent-card"
            @click="handleFileClick(file)"
          >
            <div class="recent-icon" :class="file.iconColor">
              <i :class="['fas', file.icon]"></i>
            </div>
            <div class="recent-info">
              <h3>{{ file.name }}</h3>
              <p>{{ file.size }} · {{ file.modified }}</p>
            </div>
          </div>
        </div>
      </div>



    </main>

        <!-- 新建文件夹弹窗 -->
        <el-dialog
        :visible="showNewFolderDialog"
        title="新建文件夹"
        width="400px"
        :before-close="handleCloseNewFolderDialog"
      >
        <el-input
          v-model="newFolderName"
          placeholder="请输入文件夹名称"
          clearable
        ></el-input>
        <template #footer>
          <el-button @click="showNewFolderDialog = false">取消</el-button>
          <el-button type="primary" @click="handleCreateFolder">创建文件夹</el-button>
        </template>
      </el-dialog>


        <!-- 修改文件，文件夹弹窗 -->
        <el-dialog
        :visible="showUpdateFolderDialog"
        title="请输入新名称"
        width="400px"
      >
        <el-input
          v-model="updateFolderName"
          placeholder="请输入新名称"
          clearable
        ></el-input>
        <template #footer>
          <el-button @click="showUpdateFolderDialog = false">取消</el-button>
          <el-button type="primary" @click="handleUpdateFolder">确认</el-button>
        </template>
      </el-dialog>

    <!-- 上传文件弹窗 -->
    <el-dialog
      :visible="showUploadDialog"
      title="上传文件"
      width="600px"
      :before-close="handleCloseDialog"
    >
      <uploader
        ref="uploader"
        :options="uploaderOptions"
        :autoStart="false"
        @file-added="onFileAdded"
        
        @file-success="onFileSuccess"
        @file-error="onFileError"
        class="uploader-example"
      >
        <uploader-unsupport></uploader-unsupport>
        <uploader-drop>
          <p>将文件拖放到此处上传</p>
          <uploader-btn>选择文件</uploader-btn>
        </uploader-drop>
        <uploader-list></uploader-list>
      </uploader>
      <template #footer>
        <el-button @click="showUploadDialog = false">取消</el-button>
        <el-button type="primary" @click="handleUpload">开始上传</el-button>
      </template>
    </el-dialog>

    <!-- 预览弹窗 -->
    <el-dialog
      :visible="showPreviewDialog"
      title="文件预览"
      width="80%"
      :before-close="handleClosePreviewDialog"
    >
      <iframe
        :src="previewUrl"
        class="preview-iframe"
        frameborder="0"
        allowfullscreen
      ></iframe>
      <template #footer>
        <el-button @click="showPreviewDialog = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import SparkMD5 from 'spark-md5'; // 引入 MD5 计算库
import {mergeFile,getRootDir,getDir,addDir,previewFile,getBaseInfo,updateFileName,deleteFile} from '@/utils/api'

export default {
  name: 'App',
  
  data() {
    return {
      updateFolderId:null,
      showPreviewDialog:false,
      previewUrl:'',
      pathStack: [], 
      currentPath: null, 
      current1:null,
      showUploadDialog: false, // 控制弹窗显示
      showNewFolderDialog:false,
      showUpdateFolderDialog:false,
      newFolderName:null,
      updateFolderName:null,
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
     
      recentFiles: [
        
        // 最近上传文件数据
      ],
      allSize: '0 B',
      usedSize: '0 B',
      storagePercentage: '12.5%', // 存储空间使用百分比
      uploaderOptions: {
        target: 'https://notes.t-music.cn/api/tcloud/upload', // 上传接口地址
        chunkSize: 6 * 1024 * 1024, // 分片大小，6MB
        testChunks: true, // 是否开启分片校验
        //分片校验函数
        checkChunkUploadedByResponse: function (chunk, message) {
            
            let objMessage = JSON.parse(message);
            if(message.error){
              this.$message.error(objMessage.message);
            }
            if (objMessage.skipUpload) {
                return true;
            }
            return (objMessage.uploaded || []).indexOf(chunk.offset + 1) >= 0;
        },
        simultaneousUploads: 3, // 并发上传数
        headers: {
          Authorization: localStorage.getItem('Authorization'), // 如果需要身份验证
        },
      },
    };
  },

  methods: {
   
    async goBack() {
  if (this.pathStack.length > 1) {
    const res = await getDir(this.currentPath);
    const previousPath = this.pathStack.pop(); // 弹出最后一个路径
    this.current1 = this.currentPath
    this.currentPath = previousPath; // 更新当前路径
    
    if (res.data.code === 200) {
      this.files = res.data.data;
    }
  } else {
    // 如果路径栈为空，表示已经在根目录，加载根目录文件
    const res = await getRootDir();
    if (res.data.code === 200) {
      this.files = res.data.data;
    }
    this.$message.warning('已经在根目录');
  }
},
    //事件格式化
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

      // 计算文件的 MD5 值
      calculateFileMD5(file) {
      return new Promise((resolve, reject) => {
        const chunkSize = 2 * 1024 * 1024; // 每次读取 2MB
        const chunks = Math.ceil(file.size / chunkSize);
        const spark = new SparkMD5.ArrayBuffer();
        const fileReader = new FileReader();

        let currentChunk = 0;

        fileReader.onload = (e) => {
          spark.append(e.target.result); // 追加数据到 MD5 计算器
          currentChunk++;

          if (currentChunk < chunks) {
            loadNext(); // 继续读取下一个分片
          } else {
            const md5 = spark.end(); // 完成 MD5 计算
            resolve(md5);
          }
        };

        fileReader.onerror = () => {
          reject(new Error('文件读取失败'));
        };

        const loadNext = () => {
          const start = currentChunk * chunkSize;
          const end = Math.min(start + chunkSize, file.size);
          fileReader.readAsArrayBuffer(file.file.slice(start, end));
        };

        loadNext(); // 开始读取第一个分片
      });
      },
      handleEdit(file){
        this.showUpdateFolderDialog = true;
        this.updateFolderName = file.name;
        this.updateFolderId = file.id;
      },
      handleDelete(file) {
        this.$confirm('确定删除该文件吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        }).then(async () => {
          const res = await deleteFile(file.id);
          if (res.data.code === 200) {
            this.$message.success('文件删除成功');
            const res = await getDir(this.current1);
          if (res.data.code === 200) {
            this.files = res.data.data;
          }
          } else {
            this.$message.error('文件删除失败');
          }
        }).catch(() => {});
      },
      handleCreateFolder() {
      if (this.newFolderName.trim() === '') {
        this.$message.error('文件夹名称不能为空');
        return;
      }
      addDir(this.current1,this.newFolderName).then(res=>{
        if(res.data.code===200){
          this.$message.success('文件夹创建成功');
          this.getData();
        }else{
          this.$message.error('文件夹创建失败');
        }
      })
      this.showNewFolderDialog = false;
      this.newFolderName = ''; // 清空输入框
    },
    async handleUpdateFolder(){
        const res = await updateFileName(this.updateFolderId,this.updateFolderName);
        if(res.data.code===200){
          this.$message.success('文件夹修改成功');
          this.showUpdateFolderDialog = false;
          const res = await getDir(this.current1);
          if (res.data.code === 200) {
            this.files = res.data.data;
          }
        }else{
          this.$message.error('文件夹修改失败');
        }
        this.updateFolderId = null
        this.updateFolderName = null
      

    },

    handleCloseNewFolderDialog(done) {
      this.$confirm('确定关闭新建文件夹弹窗吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        done();
        this.showNewFolderDialog = false;
      }).catch(() => {});
    },

    


    handleUpload() {
      this.$refs.uploader.uploader.upload(); // 手动触发上传
    },
    onFileAdded(file) {
      this.calculateFileMD5(file).then(md5 => {
          console.log(this.$refs.uploader)
          file.uniqueIdentifier = md5; // 将 MD5 值设置为文件的唯一标识
          this.$refs.uploader.uploader.upload(); // 使用 upload() 方法手动触发上传
        });
    },
    async onFileSuccess(rootFile, file) {
      console.log('跟文件'+rootFile)
      //此时需要合并文件
      console.log('开始合并文件:', file);
      await mergeFile({
          fileName: file.name,
          identifier: file.uniqueIdentifier,
          totalChunks: file.chunks.length,
          fileSize: rootFile.size,
          parentId: this.current1
      });
      
      const res = await getDir(this.current1)
      this.files = res.data.data
    },
    onFileError(rootFile, file, message) {
      console.error('文件上传失败:', file, message);
    },
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
    getFileIcon(file) {
      const ext = file.name.split('.').pop().toLowerCase();
      if (ext === 'pdf') return 'fas fa-file-pdf';
      if (ext === 'xlsx' || ext === 'xls') return 'fas fa-file-excel';
      if (ext === 'docx' || ext === 'doc') return 'fas fa-file-word';
      if (ext === 'pptx' || ext === 'ppt') return 'fas fa-file-powerpoint';
      if(ext === 'rar'|| ext === 'zip') return 'fas fa-file-archive';
      if(ext === 'mp4') return 'fas fa-file-video';
      if(ext === 'mp3') return 'fas fa-file-audio'; 
      if (ext === 'jpg' || ext === 'jpeg' || ext === 'png' || ext === 'gif') return 'fas fa-file-image';
      return 'fas fa-file';
    },
    getFileIconColor(file) {
      const ext = file.name.split('.').pop().toLowerCase();
      if (ext === 'pdf') return 'text-red';
      if (ext === 'xlsx' || ext === 'xls') return 'text-green';
      if (ext === 'docx' || ext === 'doc') return 'text-blue';
      if (ext === 'pptx' || ext === 'ppt') return 'text-orange';
      if(ext === 'rar'|| ext === 'zip') return 'text-red';
      if(ext === 'mp4') return 'text-red';
      if(ext === 'mp3') return 'text-red';
      if (ext === 'jpg' || ext === 'jpeg' || ext === 'png' || ext === 'gif') return 'text-blue';
      return 'text-yellow';
    },
    handleCloseDialog() {
      // 关闭弹窗前确认
      this.showUploadDialog = false;
    },
    handleNewFolder() {
      this.showNewFolderDialog = true
    },
    handleSync() {
      this.$message.warning('正在开发中，敬请期待~~~')
    },
    handleUpgrade() {
      this.$message.warning('容量暂不支持扩容呢~~~')
    },
    async handleFileClick(file) {
    if (file.type == 1) {
      const res = await getDir(file.id);
      if (res.data.code == 200) {
        this.current1 = file.id
        this.currentPath = this.files[0].parentId;
        this.pathStack.push(this.files[0].parentId); // 将当前路径压入栈
        this.files = res.data.data;
      }
    } else {
      const res = await previewFile(file.id);
      const base64Data = btoa(res.data.data);
      this.previewUrl = `https://preview.t-music.cn/onlinePreview?url=${base64Data}&watermark=t-music.cn`;
      this.showPreviewDialog = true; // 显示预览弹窗
    }
  },
  handleClosePreviewDialog() {
    this.showPreviewDialog = false;
  },

    async handleDownload(file) {
      if(file.type==1){
        this.$message.warning('正在开发中，敬请期待~~~')
        return
      }
      const res = await previewFile(file.id);
      //进行下载
      window.open(res.data.data)
      this.$message.success('正在下载')
    },
    handleShare() {
      this.$message.warning('正在开发中，敬请期待~~~')
    },
    handleMore(file) {
      alert(`更多操作：${file.name}`);
    },
    async getData(){
      const res = await getRootDir();
      const res1 = await getBaseInfo()
      this.allSize = res1.data.data.allSize/1024/1024/1024
      this.usedSize = (res1.data.data.usedSize / 1024 / 1024 / 1024).toFixed(2);
      this.storagePercentage = `${((this.usedSize / this.allSize) * 100).toFixed(2)}%`; // 计算百分
      this.pathStack.push(res1.data.data.rootId)
      this.currentPath = res1.data.data.rootId;
      this.current1 = res1.data.data.rootId;
      this.files = res.data.data
    }
  },
   mounted() {
    this.getData();
  
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
  /* 设置可滑动 */
  overflow-y: auto;
}
.app::-webkit-scrollbar{
  display: none;
}

.preview-iframe {
  width: 100%;
  height: 70vh; /* 根据需要调整高度 */
  border: none;
  border-radius: 12px;
  background-color: #ffffff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
/* 主体内容 */
.main {
  max-width: 1200px;
  margin: 0 auto;
}

/* 顶部功能按钮 */
.action-buttons {
  margin-bottom: 24px;
}

.buttons {
  display: flex;
  gap: 12px;
}

.btn-primary,
.btn-secondary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #6366f1;
  color: white;
  border: none;
}

.btn-primary:hover {
  background: #4f46e5;
}

.btn-secondary {
  background: white;
  border: 1px solid #e0e7ff;
  color: #4b5563;
}

.btn-secondary:hover {
  background: #f8f9ff;
}

/* 存储空间指示器 */
.storage-indicator {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
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
  gap: 12px;
}

.storage-info i {
  font-size: 24px;
  color: #6366f1;
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
  background: #f0f4ff;
  color: #6366f1;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-upgrade:hover {
  background: #e0e7ff;
}

.storage-bar {
  height: 8px;
  background: #f3f4f6;
  border-radius: 9999px;
  overflow: hidden;
}

.storage-progress {
  height: 100%;
  background: #6366f1;
  border-radius: 9999px;
  transition: width 0.5s ease;
}

/* 文件上传组件 */
.uploader-example {
  margin-bottom: 24px;
}

.uploader-drop {
  border: 2px dashed #e0e7ff;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  color: #6b7280;
  cursor: pointer;
}

.uploader-drop p {
  margin: 0;
}

.uploader-btn {
  margin-top: 10px;
  padding: 8px 16px;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.uploader-btn:hover {
  background: #4f46e5;
}

.uploader-list {
  margin-top: 16px;
}

/* 文件列表 */
.file-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.file-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.file-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
}

.file-icon {
  height: 100px;
  background: #f8f9ff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.file-icon i {
  font-size: 36px;

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
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e0e7ff;
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
  background: #f8f9ff;
}

/* 最近上传 */
.recent-uploads {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.recent-uploads h2 {
  font-size: 18px;
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 16px;
}

.recent-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
}

.recent-card {
  background: #f8f9ff;
  border-radius: 8px;
  padding: 12px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.recent-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.recent-icon {
  height: 80px;
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.recent-icon i {
  font-size: 24px;
}

.recent-info h3 {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 4px;
}

.recent-info p {
  font-size: 12px;
  color: #6b7280;
}
</style>