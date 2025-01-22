<template>
  <div class="notes-dashboard">
    <h2>开始</h2>
    <div>
      <div class="action-buttons">
        <button @click="openAddDialog" class="btn-action">
          <i class="fas fa-book"></i> 新建笔记本
        </button>
        <button @click="createEssay" class="btn-action">
          <i class="fas fa-pen"></i> 新建随笔
        </button>
        <button class="btn-action">
          <i class="fas fa-robot"></i> AI总结帮写
        </button>
      </div>
    </div>

    <div class="divider"></div>

    <!-- 笔记本展示 -->
    <div class="notebooks-section">
      <div class="section-header">
        <h3>笔记本</h3>
        <!-- 切换展示模式按钮 -->
        <button @click="toggleViewMode" class="btn-view-mode">
          <i :class="viewMode === 'grid' ? 'fas fa-th-list' : 'fas fa-th-large'"></i>
        </button>
      </div>

      <!-- Tab 筛选 -->
      <el-tabs v-model="activeTab" @tab-click="filterNotebooks">
        <el-tab-pane label="全部" name="all"></el-tab-pane>
        <el-tab-pane label="我收藏的" name="collected"></el-tab-pane>
        <el-tab-pane label="我创作的" name="created"></el-tab-pane>
      </el-tabs>

      <!-- 卡片模式 -->
      <div v-if="viewMode === 'grid'" class="bookshelf">
        <div
          v-for="notebook in filteredNotebooks"
          :key="notebook.id"
          class="book"
          @click="viewNotebook(notebook)"
        >
          <div class="book-cover">
            <img :src="notebook.cover" alt="笔记本封面" class="cover-image" />
            <div class="book-title">{{ notebook.title }}</div>
            <div class="book-status">
              <i v-if="notebook.status === 0" class="fas fa-lock" title="仅自己可见"></i>
              <i v-else class="fas fa-globe" title="互联网公开"></i>
            </div>
          </div>
          <div class="book-actions">
            <!-- 仅显示当前用户创作的笔记本的编辑和删除按钮 -->
            <button
              v-if="isCurrentUser(notebook.user)"
              @click.stop="openEditDialog(notebook)"
              class="btn-icon"
            >
              <i class="fas fa-edit"></i> <!-- 修改图标 -->
            </button>
            <button
              v-if="isCurrentUser(notebook.user)"
              @click.stop="deleteNotebook(notebook.id)"
              class="btn-icon"
            >
              <i class="fas fa-trash"></i> <!-- 删除图标 -->
            </button>
          </div>
        </div>
        <button @click="openAddDialog" class="btn-add-book">
          <i class="fas fa-plus"></i> 新建笔记本
        </button>
      </div>

      <!-- 列表模式 -->
      <div v-else class="notebook-list">
        <div
          v-for="notebook in filteredNotebooks"
          :key="notebook.id"
          class="notebook-item"
          @click="viewNotebook(notebook)"
        >
          <div class="notebook-info">
            <img :src="notebook.cover" alt="笔记本封面" class="list-cover" />
            <div class="notebook-details">
              <h5>{{ notebook.title }}</h5>
              <p class="notebook-description">{{ notebook.description }}</p>
              <div class="notebook-meta">
                <span class="meta-item">{{ notebook.user }}</span>
                <span class="meta-item">{{ formatDate(notebook.createTime) }}</span>
                <i v-if="notebook.status === 0" class="fas fa-lock meta-item" title="仅自己可见"></i>
                <i v-else class="fas fa-globe meta-item" title="互联网公开"></i>
              </div>
            </div>
          </div>
          <div class="notebook-actions">
            <!-- 仅显示当前用户创作的笔记本的编辑和删除按钮 -->
            <button
              v-if="isCurrentUser(notebook.user)"
              @click.stop="openEditDialog(notebook)"
              class="btn-icon"
            >
              <i class="fas fa-edit"></i> <!-- 修改图标 -->
            </button>
            <button
              v-if="isCurrentUser(notebook.user)"
              @click.stop="deleteNotebook(notebook.id)"
              class="btn-icon"
            >
              <i class="fas fa-trash"></i> <!-- 删除图标 -->
            </button>
          </div>
        </div>
        <button @click="openAddDialog" class="btn-add-list">
          <i class="fas fa-plus"></i> 新建笔记本
        </button>
      </div>
    </div>

    <div class="divider"></div>

    <!-- 随笔展示 -->
    <div class="essays-section">
      <h3>随笔</h3>
      <div class="essay-grid">
        <div
          v-for="essay in essays"
          :key="essay.id"
          class="essay-card"
          @click="viewEssay(essay)"
        >
          <h3>{{ essay.title }}</h3>
          <p>{{ essay.content }}</p>
          <div class="essay-actions">
            <button @click.stop="deleteEssay(essay.id)" class="btn-icon">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
        <button @click="createEssay" class="btn-add-essay">
          <i class="fas fa-plus"></i> 新建随笔
        </button>
      </div>
    </div>

    <!-- 新增/修改笔记本弹窗 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="30%"
      @close="resetForm"
    >
      <el-form :model="notebookForm" :rules="formRules" ref="notebookForm" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="notebookForm.title" placeholder="请输入笔记本标题"></el-input>
        </el-form-item>
        <el-form-item label="封面" prop="cover">
          <el-input v-model="notebookForm.cover" placeholder="请输入封面图片链接"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            type="textarea"
            v-model="notebookForm.description"
            placeholder="请输入笔记本描述"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="notebookForm.status" placeholder="请选择状态">
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
  </div>
</template>

<script>
import { getNotebooks, saveOrUpdateNote, deleteNote } from '@/utils/api';

export default {
  name: 'NotesDashboard',
  data() {
    return {
      viewMode: 'grid', // 默认展示模式：grid（卡片模式）或 list（列表模式）
      notebooks: [], // 笔记本列表
      filteredNotebooks: [], // 筛选后的笔记本列表
      essays: [], // 随笔列表
      dialogVisible: false, // 控制弹窗显示
      dialogTitle: '新增笔记本', // 弹窗标题
      activeTab: 'all', // 当前选中的 Tab
      currentUser: JSON.parse(localStorage.getItem('userInfo'))?.name || '', // 当前用户
      notebookForm: {
        id: null,
        title: '',
        cover: '',
        description: '',
        status: 1, // 默认状态为互联网公开
      },
      formRules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        cover: [{ required: true, message: '请输入封面链接', trigger: 'blur' }],
        description: [{ required: true, message: '请输入描述', trigger: 'blur' }],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }],
      },
    };
  },
  methods: {
    // 判断是否是当前用户
    isCurrentUser(author) {
      return author === this.currentUser;
    },
    // 筛选笔记本
    filterNotebooks() {
      if (this.activeTab === 'all') {
        this.filteredNotebooks = this.notebooks;
      } else if (this.activeTab === 'created') {
        this.filteredNotebooks = this.notebooks.filter(
          (notebook) => notebook.user === this.currentUser
        );
      } else if (this.activeTab === 'collected') {
        // 假设收藏的笔记本有一个 collected 字段
        this.filteredNotebooks = this.notebooks.filter((notebook) => notebook.user != this.currentUser);
      }
    },
    // 格式化日期
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    },
    // 切换展示模式
    toggleViewMode() {
      this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
    },
    // 查看笔记本
    viewNotebook(notebook) {
      this.$router.push({ name: 'NotebookDetail', params: { notebookId: notebook.id } });
    },
    // 打开新增笔记本弹窗
    openAddDialog() {
      this.dialogTitle = '新增笔记本';
      this.dialogVisible = true;
    },
    // 打开编辑笔记本弹窗
    openEditDialog(notebook) {
      this.dialogTitle = '编辑笔记本';
      this.notebookForm = { ...notebook }; // 填充表单数据
      this.dialogVisible = true;
    },
    // 提交表单
    submitForm() {
      this.$refs.notebookForm.validate((valid) => {
        if (valid) {
          if (this.notebookForm.id) {
            // 更新笔记本
            this.updateNotebook();
          } else {
            // 新增笔记本
            this.addNotebook();
          }
        } else {
          return false;
        }
      });
    },
    // 新增笔记本
    async addNotebook() {
      try {
        const res = await saveOrUpdateNote(this.notebookForm);
        if (res.data.code === 200) {
          this.$message.success('新增成功');
          this.getData(); // 刷新数据
          this.dialogVisible = false;
        }
      } catch (error) {
        this.$message.error('新增失败');
      }
    },
    // 更新笔记本
    async updateNotebook() {
      try {
        const res = await saveOrUpdateNote(this.notebookForm);
        if (res.data.code === 200) {
          this.$message.success('更新成功');
          this.getData(); // 刷新数据
          this.dialogVisible = false;
        }
      } catch (error) {
        this.$message.error('更新失败');
      }
    },
    // 重置表单
    resetForm() {
      this.notebookForm = {
        id: null,
        title: '',
        cover: '',
        description: '',
        status: 1,
      };
      this.$refs.notebookForm.resetFields();
    },
    // 删除笔记本
    async deleteNotebook(notebookId) {
      try {
        // 使用 Element UI 的 MessageBox 确认弹窗
        await this.$confirm('确定要删除该笔记本吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning', // 弹窗类型为警告
        });

        // 如果用户点击“确定”，执行删除操作
        const res = await deleteNote(notebookId);
        if (res.data.code === 200) {
          this.$message.success('删除成功');
          this.getData(); // 刷新数据
        }
      } catch (error) {
        if (error !== 'cancel') {
          // 如果用户点击“取消”，不执行任何操作
          this.$message.error('删除失败');
        }
      }
    },
    // 查看随笔
    viewEssay(essay) {
      alert(`查看随笔: ${essay.title}`);
    },
    // 新建随笔
    createEssay() {
      const title = prompt('请输入随笔标题');
      if (title) {
        this.essays.push({
          id: this.essays.length + 1,
          title,
          content: '这里是随笔的内容。',
        });
      }
    },
    // 删除随笔
    deleteEssay(essayId) {
      this.essays = this.essays.filter((essay) => essay.id !== essayId);
    },
    // 获取初始数据
    async getData() {
      const res = await getNotebooks();
      this.notebooks = res.data.data;
      this.filteredNotebooks = this.notebooks; // 初始化筛选后的笔记本列表
    },
  },
  mounted() {
    this.getData();
  },
};
</script>
<style scoped>
.notes-dashboard {
  padding: 20px;
}

.notes-dashboard::-webkit-scrollbar {
  width: 0;
}

h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
  font-weight: bold;
}

.divider {
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, #1e90ff, #ff6b6b);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  margin: 20px 0;
}

/* 操作按钮样式 */
.action-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.btn-action {
  padding: 10px 20px;
  background-color: transparent;
  border: 2px solid #1e90ff;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #1e90ff;
  transition: background-color 0.3s ease, color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-action:hover {
  background-color: #1e90ff;
  color: white;
}

/* 笔记本标题和切换按钮 */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.section-header h3 {
  font-size: 20px;
  color: #333;
  margin: 0;
}

.btn-view-mode {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: #666;
  transition: color 0.3s ease;
}

.btn-view-mode:hover {
  color: #1e90ff;
}

/* 卡片模式样式 */
.bookshelf {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 30px;
}

.book {
  position: relative;
  width: 150px;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.book:hover {
  transform: translateY(-10px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.book-cover {
  position: relative;
  width: 150px;
  height: 200px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
  background-color: #fff;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.book-title {
  position: absolute;
  bottom: 0px;
  left: 0;
  width: 100%;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 14px;
  text-align: center;
}

.book-description {
  position: absolute;
  bottom: 10px;
  left: 0;
  width: 100%;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 12px;
  text-align: center;
}

.book-status {
  position: absolute;
  top: 10px;
  right: 10px;
  color: white;
  font-size: 14px;
}

.book-actions {
  position: absolute;
  top: 10px;
  left: 5px;
  display: flex;
  gap: 5px;
}

.btn-icon {
  background: none;
  border: none;
  color: #1e90ff;
  cursor: pointer;
  font-size: 16px;
  transition: color 0.3s ease;
}

.btn-icon:hover {
  color: #ff1a1a;
}

.btn-add-book {
  width: 150px;
  height: 200px;
  background-color: #f8f9fa;
  border: 2px dashed #6c757d;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  color: #6c757d;
  transition: background-color 0.3s ease, border-color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-add-book:hover {
  background-color: #e9ecef;
  border-color: #495057;
}

/* 列表模式样式 */
.notebook-list {
  display: flex;
  flex-direction: column;
  gap: 10px; /* 增加间距 */
}

.notebook-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.notebook-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.notebook-info {
  display: flex;
  align-items: center;
  gap: 16px; /* 封面和内容之间的间距 */
  flex: 1; /* 占据剩余空间 */
}

.list-cover {
  width: 60px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
}

.notebook-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px; /* 标题、描述和元信息之间的间距 */
}

.notebook-details h5 {
  font-size: 16px;
  color: #333;
  margin: 0;
}

.notebook-description {
  font-size: 14px;
  color: #666;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 限制描述显示两行 */
  -webkit-box-orient: vertical;
}

.notebook-meta {
  display: flex;
  align-items: center;
  gap: 12px; /* 元信息之间的间距 */
  font-size: 12px;
  color: #888;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.notebook-actions {
  display: flex;
  gap: 8px; /* 操作按钮之间的间距 */
}

.btn-add-list {
  width: 100%;
  padding: 12px;
  background-color: #f8f9fa;
  border: 2px dashed #6c757d;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #6c757d;
  transition: background-color 0.3s ease, border-color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-add-list:hover {
  background-color: #e9ecef;
  border-color: #495057;
}

/* 随笔卡片样式 */
.essay-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.essay-card {
  background-color: #f5f5dc;
  border: none;
  border-radius: 10px;
  padding: 20px;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.essay-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.essay-card h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 10px;
  font-weight: bold;
}

.essay-card p {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}

.essay-actions {
  text-align: right;
}

.btn-add-essay {
  width: 100%;
  padding: 15px;
  background-color: #f8f9fa;
  border: 2px dashed #6c757d;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  color: #6c757d;
  transition: background-color 0.3s ease, border-color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-add-essay:hover {
  background-color: #e9ecef;
  border-color: #495057;
}

/* 弹窗样式 */
.el-dialog__header {
  border-bottom: 1px solid #e0e0e0;
}

.el-dialog__body {
  padding: 20px;
}

.el-dialog__footer {
  border-top: 1px solid #e0e0e0;
  padding: 10px 20px;
  text-align: right;
}
</style>