<template>
  <div class="notes-dashboard">
    <!-- 主体内容 -->
    <main class="main-content">
      <!-- 操作按钮组 -->
      <div class="action-buttons">
        <h1 class="main-title">我的笔记</h1>
        <div class="action-buttons">
          <div class="buttons-container">
            <button @click="openAddDialog" class="btn-primary">
              <i class="fas fa-book"></i>
              <span>新建笔记本</span>
            </button>
            <button @click="openCollaborationDialog" class="btn-secondary">
              <i class="fas fa-users"></i>
              <span>协作</span>
            </button>
            <button @click="createEssay" class="btn-secondary">
              <i class="fas fa-pencil-alt"></i>
              <span>随笔</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 笔记本分类选项 -->
      <div class="notebook-tabs">
        <button
          :class="['tab-button', activeTab === 'created' ? 'active' : '']"
          @click="changeTab('created')"
        >
          我创作的
        </button>
        <button
          :class="['tab-button', activeTab === 'collaboration' ? 'active' : '']"
          @click="changeTab('collaboration')"
        >
          协作
        </button>
        <button
          :class="['tab-button', activeTab === 'collected' ? 'active' : '']"
          @click="changeTab('collected')"
        >
          收藏
        </button>
      </div>

      <!-- 笔记本列表 -->
    <!-- 笔记本列表 -->
    <div class="notebook-grid">
        <div
          v-for="notebook in filteredNotebooks"
          :key="notebook.id"
          class="notebook-card"
          @click="viewNotebook(notebook)"
        >
          <div class="notebook-cover">
            <img :src="notebook.cover" :alt="notebook.title" />
          </div>
          <div class="notebook-info">
            <h3 class="notebook-title">{{ notebook.title }}</h3>
            <p class="notebook-description">{{ notebook.description }}</p>
          </div>
          <div class="notebook-actions">
            <button
              v-if="isCurrentUser(notebook)"
              @click.stop="openEditDialog(notebook)"
              class="btn-icon"
            >
              <i class="fas fa-edit"></i>
            </button>
            <button @click.stop="deleteNotebook(notebook)" class="btn-icon">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- 协作笔记列表 -->
      <div v-if="activeTab === 'collaboration'" class="coop-notes-grid">
        <div
          v-for="note in coopNotes"
          :key="note.id"
          class="coop-note-card"
          @click="viewCoopNote(note)"
        >
          <div class="coop-note-header">
            <i class="fas fa-file-alt text-blue-600"></i>
            <h3 class="coop-note-title">{{ note.title }}</h3>
          </div>
          <p class="coop-note-preview">{{ note.description }}</p>
          <div class="coop-note-footer">
            <span class="coop-note-notebook">
              <i class="fas fa-book"></i>
              {{ note.notebook }}
            </span>
            <span class="coop-note-date">{{ note.createTime }}</span>
          </div>
        </div>
      </div>

  
<!-- 随笔列表 -->
<div class="essay-section">
  <h2 class="section-title">最近随笔</h2>
  <button class="btn-filter">
    <i class="fas fa-filter"></i>
    <span>筛选</span>
  </button>
</div>
<div class="essay-grid">
  <div
    v-for="essay in essays"
    :key="essay.id"
    class="essay-card"
    @click="viewEssay(essay)"
  >
    <div class="essay-content">
      <h3 class="essay-title">{{ essay.title }}</h3>
      <p class="essay-text">{{ truncateText(essay.content, 100)  }}</p>
    </div>
    <div class="essay-footer">
      <div class="essay-meta">
        <span class="essay-time">
          <i class="fas fa-clock"></i>
          {{ formatDate(essay.createTime) }}
        </span>
        <span class="essay-update-time" v-if="essay.updateTime">
          <i class="fas fa-sync"></i>
          更新于 {{ formatDate(essay.updateTime) }}
        </span>
      </div>
      <button @click.stop="deleteEssay(essay.id)" class="btn-icon">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  </div>
</div>
    </main>

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

    <!-- 协作弹窗 -->
<el-dialog
  title="加入协作"
  :visible.sync="collaborationDialogVisible"
  width="30%"
  @close="resetCollaborationForm"
>
  <el-form :model="collaborationForm" :rules="collaborationRules" ref="collaborationForm">
    <!-- 选择加入类型 -->
    <el-form-item label="加入类型" prop="type">
      <el-radio-group v-model="collaborationForm.type">
        <el-radio label="note">加入笔记</el-radio>
        <el-radio label="notebook">加入笔记本</el-radio>
      </el-radio-group>
    </el-form-item>

    <!-- 邀请码 -->
    <el-form-item label="邀请码" prop="code">
      <el-input v-model="collaborationForm.code" placeholder="请输入邀请码"></el-input>
    </el-form-item>

    <!-- 密码 -->
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
import { getNotebooks, saveOrUpdateNote, deleteNoteBook1, joinNoteBook ,joinNote,getCoopNote,getEssays,deleteEssay} from '@/utils/api';

export default {
  name: 'NotesDashboard',
  data() {
    return {
      viewMode: 'grid',
      notebooks: [],
      filteredNotebooks: [],
      essays: [
        {
          id: 1,
          title: '关于 Vue3 Composition API 的思考',
          content: '今天深入研究了 Vue3 的 Composition API...',
          time: '2 小时前',
          tag: '技术思考'
        },
        {
          id: 2,
          title: '设计系统的标准化探索',
          content: '在最近的项目中，我们开始着手建立设计系统...',
          time: '4 小时前',
          tag: '设计系统'
        }
      ],
      coopNotes: [
        {
          id: 1,
          title: 'Java 多线程编程要点总结',
          preview: '本文总结了Java多线程编程中的重要概念和实践经验...',
          notebook: 'Java学习笔记',
          date: '2024-01-15',
          updateTime: '3小时前'
        },
        {
          id: 2,
          title: '神经网络基础架构解析',
          preview: '深入探讨了神经网络的基本组成部分...',
          notebook: '机器学习笔记',
          date: '2024-01-14',
          updateTime: '昨天'
        }
      ],
      dialogVisible: false,
      collaborationDialogVisible: false,
      dialogTitle: '新增笔记本',
      activeTab: 'created',
      currentUser: JSON.parse(localStorage.getItem('userInfo'))?.name || '',
      notebookForm: {
        id: null,
        title: '',
        cover: '',
        description: '',
        visible: 1,
      },
      collaborationForm: {
        type: 'note', // 默认选择加入笔记
        code: '',
        password: '',
      },
      formRules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        cover: [{ required: true, message: '请输入封面链接', trigger: 'blur' }],
        description: [{ required: true, message: '请输入描述', trigger: 'blur' }],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }],
      },
      collaborationRules: {
        type: [{ required: true, message: '请选择加入类型', trigger: 'change' }],
        code: [{ required: true, message: '请输入邀请码', trigger: 'blur' }],
      },
    };
  },
  methods: {
    changeTab(tab) {
      this.activeTab = tab;
      this.filterNotebooks();
    },
    filterNotebooks() {
      if (this.activeTab === 'created') {
        this.filteredNotebooks = this.notebooks.filter(
          (notebook) => notebook.resType === 1
        );
      } else if (this.activeTab === 'collaboration') {
        this.filteredNotebooks = this.notebooks.filter(
          (notebook) => notebook.resType === 2
        );
      } else if (this.activeTab === 'collected') {
        this.filteredNotebooks = this.notebooks.filter(
          (notebook) => notebook.resType === 3
        );
      }
    },
    openCollaborationDialog() {
      this.collaborationDialogVisible = true;
    },
 // 提交协作表单
 submitCollaborationForm() {
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
    resetCollaborationForm() {
      this.collaborationForm = {
        code: '',
        password: '',
      };
      this.$refs.collaborationForm.resetFields();
    },
    isCurrentUser(notebook) {
      if (notebook.permission >= 3 || notebook.permission == 0) {
        return true;
      }
      return false;
    },
     // 截断文本，超出部分用省略号表示
  truncateText(text, maxLength) {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + '...';
    }
    return text;
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
    toggleViewMode() {
      this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
    },
    viewNotebook(notebook) {
      this.$router.push({ name: 'NotebookDetail', params: { notebookId: notebook.id } });
    },
    openAddDialog() {
      this.dialogTitle = '新增笔记本';
      this.dialogVisible = true;
    },
    openEditDialog(notebook) {
      this.dialogTitle = '编辑笔记本';
      this.notebookForm = { ...notebook };
      this.dialogVisible = true;
    },
    submitForm() {
      this.$refs.notebookForm.validate((valid) => {
        if (valid) {
          if (this.notebookForm.id) {
            this.updateNotebook();
          } else {
            this.addNotebook();
          }
        } else {
          return false;
        }
      });
    },
    async addNotebook() {
      try {
        const res = await saveOrUpdateNote(this.notebookForm);
        if (res.data.code === 200) {
          this.$message.success('新增成功');
          this.getData();
          this.dialogVisible = false;
        }
      } catch (error) {
        this.$message.error('新增失败');
      }
    },
    async updateNotebook() {
      try {
        const res = await saveOrUpdateNote(this.notebookForm);
        if (res.data.code === 200) {
          this.$message.success('更新成功');
          this.getData();
          this.dialogVisible = false;
        }
      } catch (error) {
        this.$message.error('更新失败');
      }
    },
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
    async deleteNotebook(notebook) {
      try {
        await this.$confirm('确定要删除该笔记本吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        });
        const res = await deleteNoteBook1(notebook.id, notebook.resType);
        if (res.data.code === 200) {
          this.$message.success('删除成功');
          this.getData();
        }
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('删除失败');
        }
      }
    },
    viewEssay(essay) {
      this.$router.push({ name: 'EssayEditor', params: { essayId: essay.id } });
    },
    createEssay() {
      this.$router.push({ name: 'EssayEditor' })
    },
    async deleteEssay(essayId) {
      const res = await deleteEssay(essayId);

      if (res.data.code == 200) {
        this.$message.success('删除成功');
        this.getData();
      }else{
      this.$message.error('删除失败');
    }
    },
    async getData() {
      const res = await getNotebooks();
      this.notebooks = res.data.data;
      this.filteredNotebooks = this.notebooks;
      this.filterNotebooks();
      const res1 = await getCoopNote()
      this.coopNotes = res1.data.data
      const res2 = await getEssays()
      this.essays = res2.data.data
    },
    viewCoopNote(note) {
      this.$router.push({ name: 'NoteDetail', params: { noteId: note.id } });
    },

  },
  mounted() {
    this.getData();
  },
};
</script>
<style scoped>
/* 全局样式 */
.notes-dashboard {
  font-family: 'Roboto';
  min-height: 100vh;
  background: linear-gradient(to bottom right, #f0f4ff, #ffffff);
  padding: 20px;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 20px;
}

/* 操作按钮组 */
.action-buttons {
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

}


.main-title {
  font-family: Roboto;
font-size: 24px;
font-weight: 500;
line-height: 32px;
letter-spacing: 0px;

}

.buttons-container {
  display: flex;
  gap: 10px;

}

.btn-primary {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  /* background-color: #2563eb;
  color: white; */
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  font-family: Roboto;
font-size: 16px;
font-weight: normal;
line-height: 24px;
text-align: center;
letter-spacing: 0px;
}





/* 笔记本列表 */
.notebook-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); /* 动态调整列数，最小宽度 200px */
  gap: 16px; /* 卡片之间的间距 */
  margin-bottom: 20px;
}

.notebook-card {
  width: 294px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.notebook-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
}

.notebook-cover {
  position: relative;
  height: 196px;
  background-color: #f3f4f6;
}

.notebook-cover img {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.notebook-info {
  height: 80px;
  padding: 16px;
}

.notebook-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  font-family: Roboto;
font-size: 16px;
font-weight: 500;
line-height: 24px;
letter-spacing: 0px;
}

.notebook-description {
  font-size: 14px;
  color: #6b7280;
  font-family: Roboto;
font-size: 14px;
font-weight: normal;
line-height: 20px;
letter-spacing: 0px;
}

.notebook-actions {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 8px;
}

.btn-icon {
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
}

.btn-icon:hover {
  background-color: white;
}

/* 随笔列表 */
.essay-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-family: Roboto;
font-size: 24px;
font-weight: 500;
line-height: 32px;
letter-spacing: 0px;
}

.btn-filter {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background-color: white;
  border: 1px solid #e5e7eb;
  color: #4b5563;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-filter:hover {
  background-color: #f3f4f6;
}

.essay-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.essay-card {
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.essay-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
}

.essay-content {
  margin-bottom: 16px;
}

.essay-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.essay-text {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.essay-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}


/* 笔记本卡片 */
.notebook-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); /* 动态调整列数，最小宽度 200px */
  gap: 16px; /* 卡片之间的间距 */
  margin-bottom: 20px;
}

.notebook-card {
  width: 100%; /* 卡片宽度自适应 */
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.notebook-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
}

.notebook-cover {
  position: relative;
  height: 120px; /* 缩小封面高度 */
  background-color: #f3f4f6;
}

.notebook-cover img {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.notebook-info {
  padding: 12px; /* 缩小内边距 */
}

.notebook-title {
  font-size: 14px; /* 缩小标题字体 */
  font-weight: 600;
  margin-bottom: 4px; /* 缩小标题与描述的间距 */
  color: #333;
}

.notebook-description {
  font-size: 12px; /* 缩小描述字体 */
  color: #6b7280;
}

.notebook-actions {
  position: absolute;
  top: 8px; /* 调整操作按钮的位置 */
  right: 8px;
  display: flex;
  gap: 8px;
}

.btn-icon {
  background-color: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 28px; /* 缩小按钮大小 */
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-icon:hover {
  background-color: white;
}

/* 随笔卡片 */
.essay-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); /* 动态调整列数 */
  gap: 16px; /* 卡片之间的间距 */
}

.essay-card {
  background-color: white;
  border-radius: 12px;
  padding: 12px; /* 缩小内边距 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

}

.essay-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
}

.essay-content {
  margin-bottom: 12px; /* 缩小内容与操作按钮的间距 */
}

.essay-title {
  font-size: 14px; /* 缩小标题字体 */
  font-weight: 600;
  color: #333;
  margin-bottom: 4px; /* 缩小标题与内容的间距 */
}

.essay-text {
  font-size: 12px; /* 缩小内容字体 */
  color: #666;
  line-height: 1.5;
}

.essay-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 12px; /* 缩小操作按钮的上边距 */
  border-top: 1px solid #e5e7eb;

}
/* 协作按钮样式 */
.btn-secondary {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-family: Roboto;
  font-size: 16px;
  font-weight: normal;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0px;
}



.notebook-tabs {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.tab-button {
  font-family: Roboto;
  font-size: 16px;
  font-weight: normal;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0px;
  font-feature-settings: "kern" on;
  color: #4b5563;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 8px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.tab-button:hover {
  background-color: #f3f4f6;
}

.tab-button.active {
  color: #2563eb;
  background-color: #e0f2fe;
}


/* 操作按钮组样式 */
.buttons-container {
  display: flex;
  gap: 16px; /* 按钮之间的间距 */
}

/* 新建笔记本按钮样式 */
.btn-primary {
  display: flex;
  align-items: center;
  padding: 3px 10px;
  background: none; /* 去掉背景颜色 */
  border: none; /* 去掉边框 */
  color: #4b5563; /* 文字颜色 */
  cursor: pointer;
  font-family: Roboto;
  font-size: 16px;
  font-weight: normal;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0px;
  transition: color 0.3s ease;
}

.btn-primary:hover {
  color: #2563eb; /* 鼠标悬停时文字颜色变为蓝色 */
}

/* 协作和随笔按钮样式 */
.btn-secondary {
  display: flex;
  align-items: center;
  padding: 3px 10px;
  background: none; /* 去掉背景颜色 */
  border: none; /* 去掉边框 */
  color: #4b5563; /* 文字颜色 */
  cursor: pointer;
  font-family: Roboto;
  font-size: 16px;
  font-weight: normal;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0px;
  transition: color 0.3s ease;
}

.btn-secondary:hover {
  color: #2563eb; /* 鼠标悬停时文字颜色变为蓝色 */
}

/* 图标样式 */
.btn-primary i,
.btn-secondary i {
  margin-right: 8px; /* 图标与文字之间的间距 */
  font-size: 16px; /* 图标大小 */
}

.coop-notes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.coop-note-card {
  background-color: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.coop-note-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
}

.coop-note-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.coop-note-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.coop-note-preview {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 12px;
}

.coop-note-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #999;
}

.coop-note-notebook {
  display: flex;
  align-items: center;
  gap: 4px;
}

.coop-note-date {
  font-size: 12px;
  color: #999;
}

/* 随笔列表 */
.essay-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-family: Roboto;
  font-size: 24px;
  font-weight: 500;
  line-height: 32px;
  letter-spacing: 0px;
}

.btn-filter {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background-color: white;
  border: 1px solid #e5e7eb;
  color: #4b5563;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-filter:hover {
  background-color: #f3f4f6;
}

/* 随笔列表 */
.essay-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-family: Roboto;
  font-size: 24px;
  font-weight: 500;
  line-height: 32px;
  letter-spacing: 0px;
}

.btn-filter {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background-color: white;
  border: 1px solid #e5e7eb;
  color: #4b5563;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-filter:hover {
  background-color: #f3f4f6;
}

.essay-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.essay-card {
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.essay-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
}

.essay-content {
  margin-bottom: 16px;
}

.essay-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.essay-text {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 3; /* 限制显示 3 行 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.essay-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.essay-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.essay-time,
.essay-update-time {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #999;
}

.essay-time i,
.essay-update-time i {
  font-size: 12px;
}

.btn-icon {
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
}

.btn-icon:hover {
  background-color: #f3f4f6;
}

/* 随笔列表 - 长条状样式 */
.essay-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-family: Roboto;
  font-size: 24px;
  font-weight: 500;
  line-height: 32px;
  letter-spacing: 0px;
}

.btn-filter {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background-color: white;
  border: 1px solid #e5e7eb;
  color: #4b5563;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-filter:hover {
  background-color: #f3f4f6;
}

/* 随笔列表 - 长条状布局 */
.essay-grid {
  display: flex;
  flex-direction: column;
  gap: 12px; /* 随笔之间的间距 */
}

.essay-card {
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.essay-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.essay-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.essay-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.essay-text {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 限制显示 2 行 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.essay-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #e5e7eb;
}

.essay-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: #999;
}

.essay-time,
.essay-update-time {
  display: flex;
  align-items: center;
  gap: 4px;
}

.essay-time i,
.essay-update-time i {
  font-size: 12px;
}

.btn-icon {
  background-color: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-icon:hover {
  background-color: #f3f4f6;
}
</style>