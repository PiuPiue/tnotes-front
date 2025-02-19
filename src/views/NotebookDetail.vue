<template>
  <div style="width: 100%;">
    <div class="notebook-detail">
      <!-- 笔记本封面及元信息 -->
      <div class="notebook-cover1">

        <img :src="notebook.cover" class="cover-image" alt="笔记本封面" />
        <div class="notebook-overlay"></div>
        <div class="notebook-meta">
          <div style="display: flex; align-items: center;">
          <h1>{{ notebook.title }}</h1>
          <div class="visibility" >
              <i :class="notebook.visible == 1 ? 'fas fa-globe' : 'fas fa-lock'"></i>
              <span>{{ notebook.visible ==1 ? '公开' : '私密' }}</span>
            </div>
          </div>
          <div class="meta-info">
            <div class="author">
              <img src="https://haowallpaper.com/link/common/file/previewFileImg/15798746313888064" style="width: 24px; height: 24px; border-radius: 50%;" />
              <span class="author-name">{{ notebook.user }}</span>
            </div>
            <span>创建于 {{ formatDate(notebook.createTime) }}</span>
            <span>{{ notes.length }} 篇笔记</span>
            
          </div>
        </div>
      </div>

      <!-- 笔记本内容区域 -->
      <main class="notebook-content">
        <div class="notes-section">
          <div class="notes-header">
            <h2>所有笔记</h2>
            <div class="notes-actions">
              <button class="btn-new-note" @click="showCreateNoteDialog">
                <i class="fas fa-plus"></i>
                <span>新建笔记</span>
              </button>
              <button class="btn-sort">
                <i class="fas fa-sort-amount-down"></i>
              </button>
            </div>
          </div>
          <div class="notes-list">
            <div
              v-for="note in notes"
              :key="note.id"
              class="note-item"
              @click="viewNote(note)"
            >
              <div class="note-content">
                <h3>{{ note.title }}</h3>
                <div class="note-description" style="margin-top: 10px;">
                  {{ note.description.length > 100 ? note.description.slice(0, 100) + '...' : note.description }}
                  </div>
                <div class="note-details">
                 
                  <div class="note-meta">
                    <span><i class="fas fa-clock"></i> {{ formatDate(note.createTime) }}</span>
                    <span><i class="fas fa-file-alt"></i> {{ note.wordCount || '0' }} 字</span>
                  </div>
                </div>
              </div>
              <div class="note-actions">
                <button class="btn-more" @click.stop="toggleNoteMenu(note.id)">
                  <i class="fas fa-ellipsis-h"></i>
                </button>
                <div v-if="activeNoteMenu === note.id" class="note-menu">
                  <button @click.stop="editNote(note)">编辑</button>
                  <button @click.stop="deleteNote(note.id)">删除</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧信息栏 -->
        <div class="sidebar" style="margin-top: 80px;">
          <div class="collaborators">
  <h3>协作者</h3>
  <div class="collaborator-list">
    <div v-for="member in notebook.coopUser" :key="member.id" class="collaborator-item">
      <div class="collaborator-info">
        <el-avatar :src="member.avatar" :size="32"></el-avatar>
        <div class="collaborator-details">
          <p class="collaborator-name">{{ member.name }}</p>
          <span class="collaborator-role">{{ getCoopTypeText(member.coopType) }}</span>
        </div>
      </div>
      <div class="collaborator-actions">
        <el-select
          v-model="member.coopType"
          @change="setCollaboratorRole(member.id, $event)"
          size="mini"
          class="role-select"
          placeholder="权限"
        >
          <el-option label="可管理" :value="3"></el-option>
          <el-option label="可编辑" :value="2"></el-option>
          <el-option label="仅阅读" :value="1"></el-option>
        </el-select>
        <el-button
          type="text"
          icon="el-icon-delete"
          size="mini"
          @click.stop="removeCollaborator(member.id)"
        ></el-button>
      </div>
      
    </div>
  </div>
  <button class="btn-add-collaborator" @click="openAddCollaboratorDialog">
    <i class="fas fa-plus"></i>
    添加协作者
  </button>
</div>
          <div class="statistics">
            <h3>统计信息</h3>
            <div class="stat-item">
              <span>创建时间</span>
              <span>{{ formatDate(notebook.createTime) }}</span>
            </div>
            <div class="stat-item">
              <span>最后修改</span>
              <span>{{ formatDate(notebook.updateTime) }}</span>
            </div>
            <div class="stat-item">
              <span>笔记数量</span>
              <span>{{ notes.length  }} 篇</span>
            </div>
            <div class="stat-item">
              <span>总字数</span>
              <span>{{ notebook.totalWords }}</span>
            </div>
          </div>
        </div>
      </main>

      <!-- 新建笔记弹窗 -->
      <el-dialog
        :title="isEditMode ? '编辑笔记' : '新建笔记'"
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
          <el-button type="primary" @click="submitNoteForm">{{ isEditMode ? '保存' : '确 定' }}</el-button>
        </span>
      </el-dialog>

      <!-- 添加协作者弹窗 -->
      <el-dialog
        title="添加协作者"
        :visible.sync="addCollaboratorDialogVisible"
        width="30%"
        @close="resetCollaboratorForm"
      >
        <el-form :model="collaboratorForm" :rules="collaboratorRules" ref="collaboratorForm">
          <el-form-item label="分享类型" prop="type">
            <el-select v-model="collaboratorForm.type" placeholder="请选择分享类型">
              <el-option label="仅阅读" :value="1"></el-option>
              <el-option label="可编辑" :value="2"></el-option>
              <el-option label="可管理" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设置密码" prop="enablePassword">
            <el-switch v-model="collaboratorForm.enablePassword"></el-switch>
          </el-form-item>
          <el-form-item v-if="collaboratorForm.enablePassword" label="密码" prop="password">
            <el-input v-model="collaboratorForm.password" type="password"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addCollaboratorDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitCollaboratorForm">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getNotes, getNoteBook, addNote, updateNote, getShareCode, deleteNote, changeUserPermission, deleteCoopUser } from '../utils/api';

export default {
  name: 'NotebookDetail',
  data() {
    return {
      activeCollaboratorMenu: null,
      notebook: {
        id: null,
        title: '',
        cover: '',
        description: '',
        user: '张雨晨',
        status: 0,
        visible: 0,
        createTime: null,
        updateTime: null,
        members: [],
        notes: [],
        isPublic: true,
        lastEdit: '',
        totalWords: '',
      },
      notes: [],
      createNoteDialogVisible: false,
      isEditMode: false, // 标记当前是编辑模式还是新增模式
      newNoteForm: {
        id: null, // 用于编辑时存储笔记ID
        notebookId: this.$route.params.notebookId,
        title: '',
        description: '',
      },
      newNoteRules: {
        title: [{ required: true, message: '请输入笔记标题', trigger: 'blur' }],
        description: [{ required: true, message: '请输入笔记描述', trigger: 'blur' }],
      },
      activeNoteMenu: null,
      addCollaboratorDialogVisible: false,
      collaboratorForm: {
        id: null,
        type: 1,
        enablePassword: false,
        password: '',
      },
      collaboratorRules: {
        type: [{ required: true, message: '请选择分享类型', trigger: 'change' }],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur', validator: this.validatePassword },
        ],
      },
    };
  },
  methods: {
    // 切换协作者管理菜单
    toggleCollaboratorMenu(memberId) {
      this.activeCollaboratorMenu = this.activeCollaboratorMenu === memberId ? null : memberId;
    },

    async setCollaboratorRole(memberId, role) {
      try {
        const permissionDto = {
          id: this.notebook.id,
          userId: memberId,
          permission: role,
        };

        const res = await changeUserPermission(permissionDto);

        if (res.data.code === 200) {
          this.$message.success('协作者身份设置成功');
          this.getNoteBookData();
        } else {
          this.$message.error('协作者身份设置失败');
        }
      } catch (error) {
        console.error('设置协作者身份失败:', error);
        this.$message.error('设置协作者身份失败，请稍后重试');
      }
    },

    async removeCollaborator(memberId) {
      try {
        await this.$confirm('确定删除该协作者吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        });

        const res = await deleteCoopUser(memberId, this.notebook.id);
        if (res.data.code === 200) {
          this.$message.success('协作者删除成功');
          this.getNoteBookData();
        } else {
          this.$message.error('协作者删除失败');
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除协作者失败:', error);
          this.$message.error('删除协作者失败，请稍后重试');
        }
      }
    },

    getCoopTypeText(type) {
      if (type == 1) {
        return '仅阅读';
      } else if (type == 2) {
        return '可编辑';
      } else if (type == 3) {
        return '可管理';
      }
    },

    openAddCollaboratorDialog() {
      if (!this.notebook.permission == 0) {
        this.$message.error('您没有权限添加协作者');
        return;
      }
      this.collaboratorForm.id = this.$route.params.notebookId;
      this.addCollaboratorDialogVisible = true;
    },

    submitCollaboratorForm() {
      this.$refs.collaboratorForm.validate(async (valid) => {
        if (valid) {
          const shareData = {
            id: this.collaboratorForm.id,
            type: this.collaboratorForm.type,
            password: this.collaboratorForm.enablePassword ? this.collaboratorForm.password : null,
          };
          try {
            const res = await getShareCode(shareData);
            if (res.data.code === 200) {
              this.$message.success('分享链接生成成功');
              this.$alert(`生成的分享链接为：${res.data.data}`, '分享链接', {
                confirmButtonText: '确定',
              });
              this.addCollaboratorDialogVisible = false;
            } else {
              this.$message.error('分享链接生成失败');
            }
          } catch (error) {
            console.error('生成分享链接失败:', error);
            this.$message.error('生成分享链接失败，请稍后重试');
          }
        }
      });
    },

    resetCollaboratorForm() {
      this.$refs.collaboratorForm.resetFields();
      this.collaboratorForm.enablePassword = false;
    },

    validatePassword(rule, value, callback) {
      if (this.collaboratorForm.enablePassword && !value) {
        callback(new Error('请输入密码'));
      } else {
        callback();
      }
    },

    viewNote(note) {
      window.open(`/home/note${note.id}`, '_blank');
    },

    showCreateNoteDialog() {
      this.isEditMode = false;
      this.createNoteDialogVisible = true;
    },

    async submitNoteForm() {
      this.$refs.newNoteForm.validate(async (valid) => {
        if (valid) {
          try {
            let res;
            if (this.isEditMode) {
              // 编辑笔记
              res = await updateNote(this.newNoteForm);
            } else {
              // 新增笔记
              res = await addNote(this.newNoteForm);
            }

            if (res.data.code == 200) {
              this.$message.success(this.isEditMode ? '笔记更新成功' : '笔记创建成功');
              this.createNoteDialogVisible = false;
              this.getNotesData();
              if (!this.isEditMode) {
                window.open(`/home/note${res.data.data}`, '_blank');
              }
            } else {
              this.$message.error(this.isEditMode ? '笔记更新失败' : '笔记创建失败');
            }
          } catch (error) {
            console.error(this.isEditMode ? '更新笔记失败:' : '创建笔记失败:', error);
            this.$message.error(this.isEditMode ? '更新笔记失败，请稍后重试' : '创建笔记失败，请稍后重试');
          }
        }
      });
    },

    resetForm() {
      this.$refs.newNoteForm.resetFields();
      this.newNoteForm.id = null; // 重置笔记ID
    },

    editNote(note) {
      this.isEditMode = true;
      this.newNoteForm = {
        id: note.id,
        notebookId: this.$route.params.notebookId,
        title: note.title,
        description: note.description,
      };
      this.createNoteDialogVisible = true;
    },

    async deleteNote(noteId) {
      try {
        await this.$confirm('确定删除该笔记吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        });

        const res = await deleteNote(noteId);
        if (res.data.code === 200) {
          this.$message.success('笔记删除成功');
          this.getNotesData();
        } else {
          this.$message.error('笔记删除失败');
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除笔记失败:', error);
          this.$message.error('删除笔记失败，请稍后重试');
        }
      }
    },

    toggleNoteMenu(noteId) {
      this.activeNoteMenu = this.activeNoteMenu === noteId ? null : noteId;
    },

    formatDate(date) {
      if (!date) return '未知时间';
      return new Date(date).toLocaleString();
    },

    async getNotesData() {
      const notebookId = this.$route.params.notebookId;
      try {
        const res = await getNotes(notebookId, 2);
        this.notes = res.data.data;
      } catch (error) {
        console.error('获取笔记本数据失败:', error);
        alert('获取笔记本数据失败，请稍后重试');
      }
    },

    async getNoteBookData() {
      const notebookId = this.$route.params.notebookId;
      try {
        const res = await getNoteBook(notebookId, 2);
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
/* 全局样式 */
body {
  font-family: 'Roboto', sans-serif;
  margin: 0;
  padding: 0;
  /* background-color: #f8f9fa; */
}

.notebook-detail {
  height: 100vh;
  background: linear-gradient(to bottom right, #f8f9ff, #ffffff); /* 浅色渐变背景 */
}

/* 笔记本封面 */
.notebook-cover {
  width: 100%;
}

.cover-image {
  position: absolute; /* 设为绝对定位 */
  opacity: 0.7; /* 设置透明度 */
  width: 100%;
  height: 50px; /* 固定高度 */
  /* object-fit: cover; */
}

.notebook-overlay {
  position: absolute;
  top: 15px;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6));
  height: 50px;
}

.notebook-meta {
  position: absolute;
  /* bottom: 20px; */
  color: white;
  margin: 50px 90px;
}

.notebook-meta h1 {
  font-size: 30px;
  font-weight: 500;
  line-height: 36px;
  letter-spacing: 0px;
  font-size: 30px;
  font-weight: bold;
  line-height: 36px;
  letter-spacing: 0px;
  font-feature-settings: "kern" on;
  color: #FFFFFF;
  margin-right: 20px;
}

.meta-info {
  display: flex;
  gap: 16px;
  align-items: center;
  font-size: 14px;
  font-weight: normal;
  line-height: 20px;
  letter-spacing: 0px;
  font-feature-settings: "kern" on;
  color: #E5E7EB;
}

.author {
  display: flex;
  align-items: center;
  gap: 8px;
}

.author-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid white;
}

.author-name {
  font-size: 14px;
}

.visibility {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 笔记本内容区域 */
.notebook-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  gap: 20px;
}

.notes-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 800px;
  
}

.notes-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.notes-header h2 {
  font-size: 20px;
  color: #333;
}

.notes-actions {
  display: flex;
  gap: 8px;
}

.btn-new-note {
  padding: 8px 16px;
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-new-note:hover {
  background-color: #0077cc;
}

.btn-sort {
  width: 36px;
  height: 36px;
  border: 1px solid #e0e0e0;
  border-radius: 50%;
  background-color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-sort:hover {
  background-color: #f0f0f0;
}

.notes-list {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  height: calc(100vh - 300px);
    width: 100%;
  scroll-behavior: smooth; /* 添加平滑滚动效果 */
}

.notes-list::-webkit-scrollbar {
  display: none; /* 隐藏滚动条 */
}

.note-item {
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: box-shadow 0.3s;
  
  width: 896px;
  height: 130px;
  margin-bottom: 15px;
}

.note-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translate(15px, 0px) scale(1.01); /* 放大 5% */
  transition: transform 0.3s, box-shadow 0.3s;
}

.note-content h3 {
  font-size: 18px;
  font-weight: 500;
  line-height: 28px;
  letter-spacing: 0px;
  font-feature-settings: "kern" on;
  color: #1F2937;
}

.note-description {
  opacity: 1;
  font-family: Roboto;
  font-size: 16px;
  font-weight: normal;
  line-height: 24px;
  letter-spacing: 0px;
  color: #4B5563;
  font-feature-settings: "kern" on;
}




.note-meta {
  display: flex;
  gap: 8px;
}

.note-actions {
  position: absolute;
  top: 16px;
  right: 16px;
}

.btn-more {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
}

.btn-more:hover {
  color: #333;
}

.note-menu {
  display: flex;
  align-items: center;
  position: absolute;
  top: 24px;
  right: 0;
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.note-menu button {
  display: block;
  width: 100%;
  padding: 8px 16px;
  text-align: left;
  background: none;
  border: none;
  color: #333;
  cursor: pointer;
}

.note-menu button:hover {
  background-color: #f0f0f0;
}

/* 右侧信息栏 */
.sidebar {
  width: 300px;
}

.collaborators {
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.collaborators h3 {
  font-size: 16px;
  color: #333;
  margin-bottom: 16px;
}

.collaborator-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.collaborator {
  display: flex;
  align-items: center;
  gap: 8px;
}

.collaborator img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.collaborator-info {
  flex: 1;
}

.collaborator-info p {
  font-size: 14px;
  color: #333;
}

.collaborator-info span {
  font-size: 12px;
  color: #666;
}

.last-active {
  font-size: 12px;
  color: #666;
}

.btn-add-collaborator {
  width: 100%;
  padding: 8px;
  border: 1px dashed #e0e0e0;
  border-radius: 8px;
  background-color: white;
  color: #666;
  cursor: pointer;
  margin-top: 16px;
}

.btn-add-collaborator:hover {
  border-color: #1e90ff;
  color: #1e90ff;
}

.statistics {
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
}

.statistics h3 {
  font-size: 16px;
  color: #333;
  margin-bottom: 16px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

/* 弹窗样式 */
.el-dialog {
  border-radius: 8px;
}

.el-dialog__header {
  border-bottom: 1px solid #e0e0e0;
}

.el-dialog__body {
  padding: 16px;
}

.el-dialog__footer {
  border-top: 1px solid #e0e0e0;
  padding: 16px;
  text-align: right;
}

.el-button {
  border-radius: 4px;
}

/* 笔记本封面 */
.notebook-cover1 {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.cover-image {
  width: 100%;
  height: auto;
  max-height: 256px; /* 限制最大高度 */
  object-fit: cover; /* 保持图片比例，覆盖区域 */
}

.notebook-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6));
  height: 100%;
}

/* 笔记操作按钮样式 */
.note-actions {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  gap: 8px; /* 按钮之间的间距 */
}

.btn-more {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  transition: background-color 0.3s ease;
}

.btn-more:hover {
  background-color: #f0f0f0; /* 鼠标悬停时背景颜色 */
}

.note-menu {
  position: absolute;
  top: 40px; /* 下拉菜单距离按钮的距离 */
  right: 0;
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
  display: flex;
  flex-direction: column;
  min-width: 120px; /* 下拉菜单的最小宽度 */
}

.note-menu button {
  padding: 8px 16px;
  background: none;
  border: none;
  color: #333;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.3s ease;
}

.note-menu button:hover {
  background-color: #f0f0f0; /* 鼠标悬停时背景颜色 */
}

/* 编辑和删除按钮的图标样式 */
.note-menu button i {
  margin-right: 8px; /* 图标与文字之间的间距 */
}

/* 笔记本卡片样式 */
.note-item {
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: box-shadow 0.3s ease;
  position: relative;
  width: 896px;
  height: 110px;
}

.note-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.note-content h3 {
  font-size: 18px;
  font-weight: 500;
  line-height: 10px;
  letter-spacing: 0px;
  color: #1f2937;
  margin-bottom: 2px;
}

.note-description {
  height: 20px;
  opacity: 1;
  font-family: Roboto;
  font-size: 16px;
  font-weight: normal;
  line-height: 24px;
  letter-spacing: 0px;
  color: #4b5563;
  margin-top: 10px;
}

.note-details {
 
  gap: 16px;
  font-size: 12px;
  color: #666;
  margin-top: 20px;
}

.note-meta {
  display: flex;
  margin-top: 30px;
  gap: 8px;
}

/* 协作者管理按钮 */
.collaborator-actions {
  position: relative;
}

.btn-manage {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  transition: background-color 0.3s ease;
}

.btn-manage:hover {
  background-color: #f0f0f0;
}

/* 协作者列表 */
.collaborator-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.collaborator {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-bottom: 1px solid #e0e0e0;
}

.collaborator-info {
  flex: 1;
}

.collaborator-info p {
  font-size: 14px;
  color: #333;
  margin: 0;
}

.collaborator-info span {
  font-size: 12px;
  color: #666;
}

.last-active {
  font-size: 12px;
  color: #666;
}

/* 身份下拉框 */
.role-select {
  width: 100px;
}

/* 删除按钮 */
.el-button--danger {
  background-color: #ff4d4f;
  border-color: #ff4d4f;
}

.el-button--danger:hover {
  background-color: #ff7875;
  border-color: #ff7875;
}

/* 协作者部分样式 */
.collaborators {
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.collaborators h3 {
  font-size: 16px;
  color: #333;
  margin-bottom: 16px;
}

.collaborator-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.collaborator-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.collaborator-item:hover {
  background-color: #f9f9f9;
}

.collaborator-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.collaborator-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.collaborator-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin: 0;
}

.collaborator-role {
  font-size: 12px;
  color: #666;
}

.collaborator-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.role-select {
  width: 90px;
}

.role-select .el-input__inner {
  border: none;
  background-color: transparent;
  font-size: 12px;
  padding: 0;
}

.role-select .el-input__suffix {
  display: none;
}

.el-button--text {
  color: #666;
  padding: 0;
}

.el-button--text:hover {
  color: #ff4d4f;
}

.btn-add-collaborator {
  width: 100%;
  padding: 8px;
  border: 1px dashed #e0e0e0;
  border-radius: 8px;
  background-color: white;
  color: #666;
  cursor: pointer;
  margin-top: 16px;
  transition: border-color 0.3s ease, color 0.3s ease;
}

.btn-add-collaborator:hover {
  border-color: #1e90ff;
  color: #1e90ff;
}
</style>