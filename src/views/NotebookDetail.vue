<template>
  <div class="notebook-detail">
    <!-- 笔记本信息 -->
    <div class="notebook-info">
      <img :src="notebook.cover" alt="笔记本封面" class="notebook-cover" />
      <div class="notebook-meta">
        <h1>{{ notebook.title }}</h1>
        <p class="notebook-description">{{ notebook.description }}</p>
        <div class="notebook-details">
          <div class="notebook-user">
            <i class="fas fa-user"></i> <!-- 用户图标 -->
            <span>{{ notebook.user }}</span>
          </div>
          <div class="notebook-status">
            <span v-if="notebook.status === 1" class="status-collab">
              <i class="fas fa-users"></i> 协作
            </span>
            <span v-else class="status-private">
              <i class="fas fa-lock"></i> 仅自己
            </span>
            <span v-if="notebook.visible === 1" class="status-public">
              <i class="fas fa-globe"></i> 公开到新世界
            </span>
            <span v-else class="status-private">
              <i class="fas fa-eye-slash"></i> 不公开
            </span>
          </div>
          <div class="notebook-dates">
            <span>创建时间：{{ formatDate(notebook.createTime) }}</span>
            <span>更新时间：{{ formatDate(notebook.updateTime) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 笔记列表 -->
    <div class="notes-section">
      <h2>笔记列表</h2>
      <div class="notes-list">
        <div
          v-for="note in notes"
          :key="note.id"
          class="note-item"
          @click="viewNote(note)"
        >
          <div class="note-content">
            <h3>{{ note.title }}</h3>
            <p class="note-description">{{ note.description || '暂无描述' }}</p>
            <div class="note-details">
              <div class="note-meta">
                <span>创建时间：{{ formatDate(note.createTime) }}</span>
                <span>更新时间：{{ formatDate(note.updateTime) }}</span>
              </div>
              <div class="note-status">
                <span v-if="note.visible === 1" class="status-public">
                  <i class="fas fa-globe"></i> 公开到新世界
                </span>
                <span v-else class="status-private">
                  <i class="fas fa-eye-slash"></i> 不公开
                </span>
                <span v-if="note.status === 2" class="status-collab">
                  <i class="fas fa-users"></i> 协作
                </span>
              </div>
            </div>
          </div>
          <div class="note-actions">
            <button @click.stop="editNote(note)" class="btn-icon">
              <i class="fas fa-edit"></i>
            </button>
            <button @click.stop="deleteNote(note.id)" class="btn-icon">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
        <button @click="showCreateNoteDialog" class="btn-add-note">
          <i class="fas fa-plus"></i> 新建笔记
        </button>
      </div>
    </div>

    <!-- 新建笔记弹窗 -->
    <el-dialog
      title="新建笔记"
      :visible.sync="createNoteDialogVisible"
      width="30%"
      @close="resetForm"
    >
      <el-form :model="newNoteForm" :rules="newNoteRules" ref="newNoteForm">
        <el-form-item label="标题" prop="title">
          <el-input v-model="newNoteForm.title"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input type="textarea" v-model="newNoteForm.description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createNoteDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitNewNote">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getNotes, getNoteBook, addNote } from '../utils/api';

export default {
  name: 'NotebookDetail',
  data() {
    return {
      // 当前笔记本数据
      notebook: {
        id: null,
        title: '',
        cover: '',
        description: '',
        user: '',
        status: 0,
        visible: 0,
        createTime: null,
        updateTime: null,
      },
      notes: [], // 笔记列表
      createNoteDialogVisible: false, // 控制新建笔记弹窗的显示
      newNoteForm: {
        notebookId: this.$route.params.notebookId,
        title: '',
        description: '',
      },
      newNoteRules: {
        title: [
          { required: true, message: '请输入笔记标题', trigger: 'blur' },
        ],
        description: [
          { required: true, message: '请输入笔记描述', trigger: 'blur' },
        ],
      },
    };
  },
  methods: {
    // 查看笔记
    viewNote(note) {
      // 跳转到笔记详情页，传递笔记 ID
      this.$router.push({
        name: 'NoteDetail',
        params: { noteId: note.id },
      });
    },
    // 显示新建笔记弹窗
    showCreateNoteDialog() {
      this.createNoteDialogVisible = true;
    },
    // 提交新建笔记
    submitNewNote() {
      this.$refs.newNoteForm.validate(async (valid) => {
        if (valid) {
          try {
            const res = await addNote(this.newNoteForm);
            if (res.data.code == 200) {
              this.$message.success('笔记创建成功');
              this.createNoteDialogVisible = false;
              this.getNotesData(); // 刷新笔记列表
              this.$router.push({
                name: 'NoteDetail',
                params: { noteId: res.data.data },
              });
            } else {
              this.$message.error('笔记创建失败');
            }
          } catch (error) {
            console.error('创建笔记失败:', error);
            this.$message.error('创建笔记失败，请稍后重试');
          }
        } else {
          return false;
        }
      });
    },
    // 重置表单
    resetForm() {
      this.$refs.newNoteForm.resetFields();
    },
    // 编辑笔记
    editNote(note) {
      const newTitle = prompt('请输入新的笔记标题', note.title);
      if (newTitle) {
        note.title = newTitle;
        // 这里可以调用 API 更新笔记标题
      }
    },
    // 删除笔记
    deleteNote(noteId) {
      if (confirm('确定删除该笔记吗？')) {
        this.notes = this.notes.filter((note) => note.id !== noteId);
        // 这里可以调用 API 删除笔记
      }
    },
    // 格式化日期
    formatDate(date) {
      if (!date) return '未知时间';
      return new Date(date).toLocaleString();
    },
    // 获取笔记本中的所有笔记数据
    async getNotesData() {
      const notebookId = this.$route.params.notebookId;
      try {
        const res = await getNotes(notebookId,2);
        this.notes = res.data.data;
      } catch (error) {
        console.error('获取笔记本数据失败:', error);
        alert('获取笔记本数据失败，请稍后重试');
      }
    },
    // 获取笔记本的数据
    async getNoteBookData() {
      const notebookId = this.$route.params.notebookId;
      try {
        const res = await getNoteBook(notebookId,2);
        this.notebook = res.data.data;
        this.getNotesData();
      } catch (error) {
        console.error('获取笔记本数据失败:', error);
        alert('获取笔记本数据失败，请稍后重试');
      }
    },
  },
  mounted() {
    this.getNoteBookData();
  },
};
</script>

<style scoped>
.notebook-detail {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

/* 笔记本信息 */
.notebook-info {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.notebook-cover {
  width: 150px;
  height: 200px;
  border-radius: 5px;
  object-fit: cover;
}

.notebook-meta {
  flex: 1;
}

.notebook-meta h1 {
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
}

.notebook-description {
  font-size: 14px;
  color: #666;
  margin-bottom: 15px;
}

.notebook-details {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.notebook-user {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
}

.notebook-user i {
  color: #1e90ff;
}

.notebook-status {
  display: flex;
  gap: 10px;
  font-size: 14px;
  color: #666;
}

.notebook-dates {
  font-size: 14px;
  color: #666;
}

.status-public {
  color: #28a745; /* 绿色 */
}

.status-private {
  color: #dc3545; /* 红色 */
}

.status-collab {
  color: #007bff; /* 蓝色 */
}

/* 笔记列表 */
.notes-section {
  margin-top: 20px;
}

h2 {
  font-size: 20px;
  color: #333;
  margin-bottom: 15px;
}

.notes-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.note-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.note-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.note-content {
  flex: 1;
}

.note-content h3 {
  font-size: 16px;
  color: #333;
  margin-bottom: 5px;
}

.note-description {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}

.note-details {
  display: flex;
  gap: 20px;
  font-size: 12px;
  color: #666;
}

.note-meta {
  display: flex;
  gap: 10px;
}

.note-status {
  display: flex;
  gap: 10px;
}

.note-status i {
  margin-right: 4px;
}

.note-actions {
  display: flex;
  gap: 8px;
}

.btn-icon {
  background: none;
  border: none;
  color: #1e90ff;
  cursor: pointer;
}

.btn-icon:hover {
  color: #0077cc;
}

.btn-add-note {
  width: 100%;
  padding: 10px;
  background-color: #1e90ff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.btn-add-note:hover {
  background-color: #0077cc;
}
</style>