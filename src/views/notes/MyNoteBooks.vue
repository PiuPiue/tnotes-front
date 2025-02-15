<template>
    <div class="content-area">
      <div class="header">
        <h2>我的笔记本</h2>
        <button class="create-notebook-btn" @click="openCreateModal">
          <i class="fas fa-plus"></i> 新建笔记本
        </button>
      </div>
  
      <div class="notebooks-grid">
        <div v-for="notebook in notebooks" :key="notebook.id" class="notebook-cover"
        @click="viewNotebook(notebook)
        ">
          <div class="notebook-actions-wrapper">
            <i class="fas fa-edit action-icon" @click="openEditModal(notebook)"></i>
            <i class="fas fa-trash action-icon" @click="confirmDelete(notebook)"></i>
          </div>
          <img :src="notebook.cover" alt="笔记本封面" class="notebook-header" />
          <div class="notebook-body">
            <h3>{{ notebook.title }}</h3>
            <div class="notebook-info">
              <div class="info-item">
                <i class="far fa-file-alt"></i>
                <span>{{ notebook.noteCount }} 个笔记</span>
              </div>
              <div class="info-item">
                <i class="far fa-clock"></i>
                <span>{{formatDate(notebook.createTime)  }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="create-notebook" @click="openCreateModal">
          <div class="create-icon">
            <i class="fas fa-plus"></i>
          </div>
          <p>创建新笔记本</p>
        </div>
      </div>
  
      <!-- 新建/编辑笔记本弹窗 -->
      <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="30%" @close="resetForm">
        <el-form :model="notebookForm" :rules="formRules" ref="notebookForm" label-width="80px">
          <el-form-item label="标题" prop="title">
            <el-input v-model="notebookForm.title" placeholder="请输入笔记本标题"></el-input>
          </el-form-item>
          <el-form-item label="封面" prop="cover">
            <el-upload
              action="https://notes.t-music.cn/api/minio/upload"
              :on-success="handleUploadSuccess"
              :on-error="handleUploadError"
              :before-upload="beforeUpload"
              :show-file-list="false"
            >
              <el-button type="primary">点击上传封面</el-button>
            </el-upload>
            <div v-if="notebookForm.cover">
              <img :src="notebookForm.cover" alt="封面预览" style="max-width: 100px; margin-top: 10px;" />
            </div>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input type="textarea" v-model="notebookForm.description" placeholder="请输入笔记本描述"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="notebookForm.visible" placeholder="请选择状态">
              <el-option label="仅自己可见" :value="0"></el-option>
              <el-option label="互联网公开" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </span>
      </el-dialog>
  
      <!-- 删除确认弹窗 -->
      <el-dialog title="确认删除" :visible.sync="deleteDialogVisible" width="30%" @close="resetDeleteDialog">
        <span>确定要删除该笔记本吗？删除后无法恢复。</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="deleteNotebook">删除</el-button>
        </span>
      </el-dialog>

      
    </div>
  </template>
  <script>
  import { saveOrUpdateNote, getNotebooks, deleteNoteBook1 } from '@/utils/api'
  
  export default {
    name: 'NotebookPage',
    data() {
      return {
        notebooks: [],
        dialogVisible: false,
        dialogTitle: '创建新笔记本',
        deleteDialogVisible: false,
        notebookForm: {
          id: null,
          title: '',
          cover: '',
          description: '',
          visible: 0,  // 默认状态为仅自己可见
        },
        formRules: {
          title: [{ required: true, message: '笔记本标题不能为空', trigger: 'blur' }],
          cover: [{ required: true, message: '封面图片链接不能为空', trigger: 'blur' }],
          description: [{ required: true, message: '笔记本描述不能为空', trigger: 'blur' }],
          status: [{ required: false, message: '请选择笔记本状态', trigger: 'change' }],
        },
      }
    },
    mounted() {
      this.loadNotebooks()
    },
    methods: {
        // 上传成功回调
  handleUploadSuccess(response) {
    if (response.path) {
      this.notebookForm.cover = response.path; // 将返回的图片 URL 赋值给表单的 cover 字段
      this.$message.success('封面图片上传成功');
    } else {
      this.$message.error('上传失败：服务器返回的 URL 无效');
    }
  },

  // 上传失败回调
  handleUploadError(error) {
    this.$message.error('封面图片上传失败：' + error.message);
  },

  // 上传前的校验
  beforeUpload(file) {
    const isImage = file.type.startsWith('image/');
    const isLt2M = file.size / 1024 / 1024 < 10; // 限制文件大小为 10MB

    if (!isImage) {
      this.$message.error('只能上传图片文件');
    }
    if (!isLt2M) {
      this.$message.error('图片大小不能超过 2MB');
    }

    return isImage && isLt2M;
  },
      async loadNotebooks() {
        try {
          const response = await getNotebooks()
          this.notebooks = response.data.data
          this.notebooks = this.notebooks.filter(
          (notebook) => notebook.resType === 1
        );
        } catch (error) {
          console.error('Error fetching notebooks:', error)
        }
      },
      openCreateModal() {
        this.dialogVisible = true
        this.dialogTitle = '创建新笔记本'
        this.resetForm()
      },
      openEditModal(notebook) {
        event.stopPropagation();  // 阻止事件传播，防止触发其他操作
        this.dialogVisible = true
        this.dialogTitle = '编辑笔记本'
        this.notebookForm = { ...notebook }
      },
      closeCreateModal() {
        this.dialogVisible = false
      },
      resetForm() {
        this.notebookForm = {
          id: null,
          title: '',
          cover: '',
          description: '',
          visible: 0,
        }
        this.$refs.notebookForm.resetFields()
      },
      resetDeleteDialog() {
        this.deleteDialogVisible = false
      },
      async submitForm() {
        this.$refs.notebookForm.validate(async (valid) => {
          if (valid) {
            try {
              await saveOrUpdateNote(this.notebookForm)
              this.loadNotebooks()
              this.closeCreateModal()
            } catch (error) {
              console.error('Error saving notebook:', error)
            }
          }
        })
      },
      confirmDelete(notebook) {
        event.stopPropagation();
        this.notebookForm = { ...notebook }
        this.deleteDialogVisible = true
      },
      async deleteNotebook() {
        event.stopPropagation();  // 阻止事件传播，防止触发其他操作
        try {
          await deleteNoteBook1(this.notebookForm.id,this.notebookForm.resType)
          this.loadNotebooks()
          this.resetDeleteDialog()
        } catch (error) {
          console.error('Error deleting notebook:', error)
        }
      },
      formatDate(date) {
      if (!date) return '未知时间';
      return new Date(date).toLocaleString();
    },
    viewNotebook(notebook) {
      this.$router.push({ name: 'NotebookDetail', params: { notebookId: notebook.id } });
    },
    },
  }
  </script>

<style scoped>
.content-area {
  background: linear-gradient(to bottom right, #f0f4ff, #ffffff);
flex: 1;
overflow-y: auto;
padding: 20px 40px;
background-color: #ffffff;
box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.05);
}

.header {
display: flex;
justify-content: space-between;
align-items: center;
margin-bottom: 24px;
}

.header h2 {
font-size: 1.75rem;
font-weight: bold;
color: #2d3748;
}

.create-notebook-btn {
display: flex;
align-items: center;
background-color: #4f46e5;
color: white;
padding: 8px 16px;
border-radius: 8px;
cursor: pointer;
transition: background-color 0.3s;
height: 40px;
font-size: 0.875rem;
}

.create-notebook-btn:hover {
background-color: #4338ca;
}

.notebooks-grid {
display: grid;
grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
gap: 20px;
}

.create-notebook {
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
cursor: pointer;
background-color: #f9fafb;
border-radius: 8px;
padding: 20px;
transition: background-color 0.3s;
border: 2px dashed #e5e7eb;
}

.create-notebook:hover {
background-color: #e5e7eb;
border-color: #4338ca;
}

.create-icon {
width: 40px;
height: 40px;
background-color: rgba(79, 70, 229, 0.1);
display: flex;
align-items: center;
justify-content: center;
border-radius: 50%;
margin-bottom: 12px;
}

.create-notebook p {
color: #4b5563;
font-size: 0.875rem;
}

.notebook-cover {
background-color: white;
border-radius: 8px;
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
overflow: hidden;
transition: transform 0.3s, box-shadow 0.3s;
position: relative;
display: flex;
flex-direction: column;
}

.notebook-cover:hover {
transform: translateY(-4px);
box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.notebook-header {
width: 100%;
height: 140px; /* 封面高度适当增加，使其更突出 */
object-fit: cover;
border-bottom: 1px solid #e5e7eb; /* 添加分割线，使封面和信息区域更分明 */
}

.notebook-body {
padding: 16px;
flex: 1; /* 让信息区域填充剩余空间 */
display: flex;
flex-direction: column;
justify-content: space-between; /* 信息区域内容均匀分布 */
}

.notebook-body h3 {
font-size: 1.125rem; /* 标题字体稍大，突出重点 */
font-weight: bold;
margin-bottom: 12px; /* 增加标题与下方信息的间距 */
color: #2d3748;
}

.notebook-info {
font-size: 0.875rem; /* 信息字体稍大，提升可读性 */
color: #6b7280;
}

.notebook-info .info-item {
display: flex;
align-items: center;
margin-bottom: 8px; /* 增加信息项之间的间距 */
}

.notebook-info .info-item i {
margin-right: 8px; /* 图标与文字的间距 */
color: #4f46e5; /* 图标颜色与主题色一致 */
}

.notebook-actions-wrapper {
position: absolute;
top: 12px; /* 调整操作图标的位置 */
right: 12px;
display: none;
flex-direction: column;
gap: 8px;
}

.notebook-cover:hover .notebook-actions-wrapper {
display: flex;
}

.action-icon {
background-color: rgba(255, 255, 255, 0.9);
border: none;
border-radius: 50%;
width: 32px; /* 操作图标稍大，便于点击 */
height: 32px;
display: flex;
align-items: center;
justify-content: center;
cursor: pointer;
transition: background-color 0.3s ease;
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 添加阴影，提升层次感 */
}

.action-icon:hover {
color: #6366F1;
background-color: rgba(64, 158, 255, 0.1); /* 悬停时背景色变化 */
}



.notebook-cover {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
  position: relative;
  display: flex;
  flex-direction: column;
  background: linear-gradient(to bottom right, #f0f4ff, #ffffff);
}

.notebook-cover:hover {
  transform: scale(1.05); /* 仅放大，不旋转 */
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2);
  background: linear-gradient(to bottom right, #e0e7ff, #ffffff);
}

/* 保证操作图标在悬停时可见 */
.notebook-actions-wrapper {
  position: absolute;
  top: 12px;
  top: 12px;
  right: 12px;
  display: none;
  flex-direction: column;
  gap: 8px;
  z-index: 10; /* 确保图标不被覆盖 */
}

.notebook-cover:hover .notebook-actions-wrapper {
  display: flex;
}

/* 操作图标样式 */
.action-icon {
  background-color: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.action-icon:hover {
  background-color: rgba(64, 158, 255, 0.1);
  color: #6366F1;
  transform: scale(1.1); /* 鼠标悬停时放大操作图标 */
}

</style>