<template>
  <div class="content-area">
    <div class="header">
      <h2>收藏空间</h2>
    </div>

    <div class="notebooks-grid">
      <div v-for="notebook in notebooks" :key="notebook.id" class="notebook-cover" @click="viewNotebook(notebook)">
        <div class="notebook-actions-wrapper">
          <i class="fas fa-star action-icon" @click="toggleFavorite(notebook)"></i>
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
              <span>{{ formatDate(notebook.createTime) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 删除确认弹窗 -->
    <el-dialog title="确认取消收藏" :visible.sync="deleteDialogVisible" width="30%" @close="resetDeleteDialog">
      <span>确定要取消收藏该笔记本吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="deleteNotebook">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getNotebooks, deleteNoteBook1 } from '@/utils/api'

export default {
  name: 'NotebookPage',
  data() {
    return {
      notebooks: [],
      deleteDialogVisible: false,
      notebookForm: {
        id: null,
        resType: null,
      },
    }
  },
  mounted() {
    this.loadNotebooks()
  },
  methods: {
    async loadNotebooks() {
      try {
        const response = await getNotebooks()
        this.notebooks = response.data.data
        this.notebooks = this.notebooks.filter((notebook) => notebook.resType === 3);
      } catch (error) {
        console.error('Error fetching notebooks:', error)
      }
    },
    toggleFavorite(notebook) {
      event.stopPropagation(); // 阻止事件冒泡
      this.notebookForm = { ...notebook }
      this.deleteDialogVisible = true
    },
    async deleteNotebook() {
      event.stopPropagation();  // 阻止事件传播，防止触发其他操作
      try {
        await deleteNoteBook1(this.notebookForm.id, this.notebookForm.resType)
        this.loadNotebooks()
        this.resetDeleteDialog()
      } catch (error) {
        console.error('Error deleting notebook:', error)
      }
    },
    resetDeleteDialog() {
      this.deleteDialogVisible = false
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

.notebooks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
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
  height: 140px;
  object-fit: cover;
  border-bottom: 1px solid #e5e7eb;
}

.notebook-body {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.notebook-body h3 {
  font-size: 1.125rem;
  font-weight: bold;
  margin-bottom: 12px;
  color: #2d3748;
}

.notebook-info {
  font-size: 0.875rem;
  color: #6b7280;
}

.notebook-info .info-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.notebook-info .info-item i {
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

.notebook-cover:hover .notebook-actions-wrapper {
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
  transition: background-color 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.action-icon:hover {
  color: #6366F1;
  background-color: rgba(64, 158, 255, 0.1);
}
</style>