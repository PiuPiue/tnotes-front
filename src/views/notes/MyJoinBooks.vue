
<template>
   <div class="content-area">
    <div class="header">
      <h2>协作空间</h2>
      <button class="create-notebook-btn" @click="openCollaborationModal">
        <i class="fas fa-plus"></i> 新建协作
      </button>
    </div>

    <div class="notebooks-masonry">
    

      <!-- 展示笔记本 -->
      <div v-for="notebook in notebooks" :key="notebook.id" class="notebook-card" @click="viewNotebook(notebook)">
        <div class="notebook-actions-wrapper">
          <i class="fas fa-edit action-icon" @click="openEditModal(notebook)" v-if="notebook.permission == 3"></i>
          <i class="fas fa-trash action-icon" @click="confirmDelete(notebook)"></i>
        </div>
        <img :src="notebook.cover" alt="笔记本封面" class="notebook-cover-image" />
        <div class="notebook-content">
          <h3>{{ notebook.title }}</h3>
          <div class="notebook-info">
            <div class="info-item">
              <i class="far fa-file-alt"></i>
              <span>{{ notebook.noteCount }} 个笔记</span>
            </div>
            <div class="info-item">
              <i class="far fa-clock"></i>
              <span>{{ formatDate(notebook.createTime) }}</span>
            </div>
          </div>
        </div>
      </div>

        <!-- 展示笔记 -->
        <div v-for="note in notes" :key="note.id" class="note-card" :style="{ background: generateGradient(note.title) }" @click="viewNote(note)">
        <div class="note-icon">
          <i class="fas fa-file-alt"></i>
        </div>
        <div class="note-content">
          <h3>{{ note.title }}</h3>
          <div class="note-description">
            <p>{{ note.description.length > 50 ? note.description.slice(0, 50) + '...' : note.description }}</p>
          </div>
          <div class="note-info">
            <div class="info-item">
              <i class="far fa-clock"></i>
              <span>{{ formatDate(note.createTime) }}</span>
            </div>
          </div>
          
        </div>
      </div>

      <!-- 创建协作卡片 -->
      <div class="create-notebook-card" @click="openCollaborationModal">
        <div class="create-icon">
          <i class="fas fa-plus"></i>
        </div>
        <p>创建协作</p>
      </div>
    </div>

    <!-- 删除确认弹窗 -->
    <el-dialog title="确认取消协作" :visible.sync="deleteDialogVisible" width="30%" @close="resetDeleteDialog">
      <span>确定要退出协作吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="deleteNotebook">确定</el-button>
      </span>
    </el-dialog>

    <!-- 加入协作弹窗 -->
    <el-dialog
      title="加入协作"
      :visible.sync="collaborationDialogVisible"
      width="30%"
      @close="resetCollaborationForm"
    >
      <el-form :model="collaborationForm" :rules="collaborationRules" ref="collaborationForm">
        <el-form-item label="加入类型" prop="type">
          <el-radio-group v-model="collaborationForm.type">
            <el-radio label="note">加入笔记</el-radio>
            <el-radio label="notebook">加入笔记本</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="邀请码" prop="code">
          <el-input v-model="collaborationForm.code" placeholder="请输入邀请码"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="collaborationForm.password"
            type="password"
            placeholder="请输入密码（可选）"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="collaborationDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitCollaborationForm">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { saveOrUpdateNote, deleteNoteBook1, getNotebooks, joinNote, joinNoteBook ,getCoopNote ,deleteCoopNote} from '@/utils/api';

export default {
  name: 'NotebookPage',
  data() {
    return {
      notebooks: [],
      notes: [], // 新增：存储单个笔记
      dialogVisible: false,
      dialogTitle: '创建新笔记本',
      deleteDialogVisible: false,
      collaborationDialogVisible: false, // 控制加入协作弹窗的显示
      notebookForm: {
        id: null,
        title: '',
        cover: '',
        description: '',
        visible: 0,
      },
      collaborationForm: { // 加入协作表单数据
        type: 'note', // 默认选择加入笔记
        code: '', // 邀请码
        password: '', // 密码
      },
      formRules: {
        title: [{ required: true, message: '笔记本标题不能为空', trigger: 'blur' }],
        cover: [{ required: true, message: '封面图片链接不能为空', trigger: 'blur' }],
        description: [{ required: true, message: '笔记本描述不能为空', trigger: 'blur' }],
        status: [{ required: false, message: '请选择笔记本状态', trigger: 'change' }],
      },
      collaborationRules: { // 加入协作表单验证规则
        type: [{ required: true, message: '请选择加入类型', trigger: 'change' }],
        code: [{ required: true, message: '请输入邀请码', trigger: 'blur' }],
        password: [{ required: false, message: '请输入密码', trigger: 'blur' }],
      },
    };
  },
  mounted() {
    this.loadNotebooks();
    this.loadNotes(); // 新增：加载单个笔记
  },
  methods: {
    async loadNotes() {
      try {
        const response = await getCoopNote();
        this.notes = response.data.data; // 假设返回的数据格式与笔记本类似
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    },
    viewNote(note) {
      window.open(`/home/note${note.id}`, '_blank');
    },
    async confirmDeleteNote(note) {
      event.stopPropagation();
      //弹窗确认
      this.$confirm('确定要删除该笔记吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          // 删除笔记
          const res = await deleteCoopNote(note.id);
          if (res.data.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功',
            });
          } else {
            this.$message({
              type: 'error',
              message: '删除失败',
            });
          }
          this.loadNotes();
        })
        .catch(() => {})
    },
    // 原有的方法
    async loadNotebooks() {
      try {
        const response = await getNotebooks();
        this.notebooks = response.data.data;
        this.notebooks = this.notebooks.filter((notebook) => notebook.resType === 2);
      } catch (error) {
        console.error('Error fetching notebooks:', error);
      }
    },
    openEditModal(notebook) {
      event.stopPropagation();
      this.dialogVisible = true;
      this.dialogTitle = '编辑笔记本';
      this.notebookForm = { ...notebook };
    },
    resetForm() {
      this.notebookForm = {
        id: null,
        title: '',
        cover: '',
        description: '',
        visible: 0,
      };
      this.$refs.notebookForm.resetFields();
    },
    resetDeleteDialog() {
      this.deleteDialogVisible = false;
    },
    async submitForm() {
      this.$refs.notebookForm.validate(async (valid) => {
        if (valid) {
          try {
            await saveOrUpdateNote(this.notebookForm);
            this.loadNotebooks();
            this.closeCreateModal();
          } catch (error) {
            console.error('Error saving notebook:', error);
          }
        }
      });
    },
    confirmDelete(notebook) {
      event.stopPropagation();
      this.notebookForm = { ...notebook };
      this.deleteDialogVisible = true;
    },
    async deleteNotebook() {
      try {
        await deleteNoteBook1(this.notebookForm.id, this.notebookForm.resType);
        this.loadNotebooks();
        this.resetDeleteDialog();
      } catch (error) {
        console.error('Error deleting notebook:', error);
      }
    },
    formatDate(date) {
      if (!date) return '未知时间';
      return new Date(date).toLocaleString();
    },
    viewNotebook(notebook) {
      
      this.$router.push({ name: 'NotebookDetail', params: { notebookId: notebook.id } });
    },

    // 新增的加入协作相关方法
    openCollaborationModal() {
      this.collaborationDialogVisible = true;
    },

    generateGradient(title) {
      const hash = title.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
      const hue = hash % 360;
      return `linear-gradient(135deg, hsl(${hue}, 70%, 80%), hsl(${hue + 30}, 70%, 80%))`;
    },

    resetCollaborationForm() {
      this.collaborationForm = {
        type: 'note',
        code: '',
        password: '',
      };
      this.$refs.collaborationForm.resetFields();
    },
    async submitCollaborationForm() {
      this.$refs.collaborationForm.validate(async (valid) => {
        if (valid) {
          try {
            let res;
            if (this.collaborationForm.type === 'note') {
              res = await joinNote(this.collaborationForm);
            } else if (this.collaborationForm.type === 'notebook') {
              res = await joinNoteBook(this.collaborationForm);
            }
            if (res.data.code === 200) {
              this.$message.success('加入协作成功');
              this.collaborationDialogVisible = false;
              this.resetCollaborationForm();
              this.loadNotebooks()
            } else {
              this.$message.error(res.data.message || '加入协作失败');
            }
          } catch (error) {
            console.error('加入协作失败:', error);
            this.$message.error('加入协作失败，请稍后重试');
          }
        }
      });
    },
  },
};
</script>
<style scoped>
.content-area {
  background: linear-gradient(to bottom right, #f0f4ff, #ffffff);
  padding: 20px 40px;
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
}

.create-notebook-btn:hover {
  background-color: #4338ca;
}

.notebooks-masonry {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.notebook-card, .note-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  width: 267px;
  position: relative;
}

.notebook-card:hover, .note-card:hover {
  transform: translateY(-5px) rotate(5deg);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.notebook-cover-image {
  width: 100%;
  height: 140px;
  object-fit: cover;
  border-bottom: 1px solid #e5e7eb;
}

.notebook-content, .note-content {
  padding: 16px;
}

.notebook-content h3, .note-content h3 {
  font-size: 1.125rem;
  font-weight: bold;
  margin-bottom: 12px;
  color: #2d3748;
}

.notebook-info, .note-info {
  font-size: 0.875rem;
  color: #6b7280;
}

.notebook-info .info-item, .note-info .info-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  margin-left: 25px;
}

.notebook-info .info-item i, .note-info .info-item i {
  margin-right: 8px;
  color: #4f46e5;
}

.notebook-actions-wrapper {
  position: absolute;
  top: 12px;
  right: 12px;
  display: none;
  flex-direction: column;
  gap: 8px;
}

.notebook-card:hover .notebook-actions-wrapper {
  display: flex;
}

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
  transform: scale(1.1);
}

.create-notebook-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: #f9fafb;
  border-radius: 12px;
  padding: 20px;
  transition: background-color 0.3s;
  border: 2px dashed #e5e7eb;
  width: 269px;
}

.create-notebook-card:hover {
  background-color: #e5e7eb;
  border-color: #4338ca;
  transform: translateY(-5px) rotate(5deg);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
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

.create-notebook-card p {
  color: #4b5563;
  font-size: 0.875rem;
}

.note-card {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  width: 267px;
  position: relative;
  padding: 16px;
  text-align: center;
}

.note-card:hover {
  transform: translateY(-5px) rotate(5deg);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.note-icon {
  margin-top: 20px;
  font-size: 3rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 10px;
}

.note-content h3 {
  
  font-size: 1.125rem;
  font-weight: bold;
  margin-bottom: 10px;
  color: #fff;
}

.note-info {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
}

.note-description {
  margin-top: 12px;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
}
</style>