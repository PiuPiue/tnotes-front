<template>
   <div class="container">
    <div class="quick-start-page">
      <!-- 欢迎卡片 -->
      <div class="welcome-card">
        <div class="welcome-content">
          <h2>欢迎回来，{{ userInfo.name }}！</h2>
          <p>开始记录你的灵感，或与团队协作完成更多任务。</p>
        </div>
        <img
          src="https://ai-public.mastergo.com/ai/img_res/f8701189dbc317491d835f05a7315386.jpg"
          alt="Welcome"
          class="welcome-image"
        />
      </div>
  
      <!-- 快速操作卡片 -->
      <div class="quick-actions">
        <div
          class="action-card"
          v-for="action in quickActions"
          :key="action.id"
          @click="handleAction(action)"
        >
          <div class="action-icon">
            <i :class="action.icon"></i>
          </div>
          <div class="action-details">
            <h3>{{ action.title }}</h3>
            <p>{{ action.description }}</p>
          </div>
        </div>
      </div>
  
      <!-- 最近活动 -->
      <div class="recent-activity">
        <h3>最近活动</h3>
        <div class="activity-list">
          <div
            class="activity-item"
            v-for="activity in recentActivities"
            :key="activity.id"
          >
            <div class="activity-icon">
              <i :class="activity.icon"></i>
            </div>
            <div class="activity-content">
              <p>{{ activity.description }}</p>
              <span class="activity-time">{{ activity.time }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

     <!-- 快速笔记弹窗 -->
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
        <el-form-item label="选择笔记本" prop="notebookId">
          <el-select
            v-model="newNoteForm.notebookId"
            placeholder="请选择笔记本"
            style="width: 100%"
          >
            <el-option
              v-for="notebook in notebooks"
              :key="notebook.id"
              :label="notebook.title"
              :value="notebook.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input type="textarea" v-model="newNoteForm.description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createNoteDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitNoteForm">确定</el-button>
      </span>
    </el-dialog>

    <!-- 协作弹窗 -->
    <el-dialog
      title="协作"
      :visible.sync="collaborationDialogVisible"
      width="30%"
      @close="resetCollaborationForm"
    >
      <el-tabs v-model="activeTab">
        <el-tab-pane label="加入协作" name="join">
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
        </el-tab-pane>

        <el-tab-pane label="邀请协作" name="invite">
          <el-form :model="collaboratorForm1" :rules="collaboratorRules1" ref="collaboratorForm1">

              <!-- 笔记本选择 -->
          <el-form-item label="选择笔记本" prop="id">
          <el-select
            v-model="collaboratorForm1.id"
            placeholder="请选择笔记本"
            style="width: 100%"
          >
            <el-option
              v-for="notebook in notebooks"
              :key="notebook.id"
              :label="notebook.title"
              :value="notebook.id"
            ></el-option>
          </el-select>
          </el-form-item>

            <el-form-item label="分享类型" prop="type">
              <el-select v-model="collaboratorForm1.type" placeholder="请选择分享类型">
                <el-option label="仅阅读" :value="1"></el-option>
                <el-option label="可编辑" :value="2"></el-option>
                <el-option label="可管理" :value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="设置密码" prop="enablePassword">
              <el-switch v-model="collaboratorForm1.enablePassword"></el-switch>
            </el-form-item>
            <el-form-item v-if="collaboratorForm1.enablePassword" label="密码" prop="password">
              <el-input v-model="collaboratorForm1.password" type="password"></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>

      <span slot="footer" class="dialog-footer">
        <el-button @click="collaborationDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </span>
    </el-dialog>

    

   </div>
  </template>
  
  <script>
  import { getNotebooks ,addNote ,getShareCode ,joinNoteBook ,joinNote} from '@/utils/api';
  export default {
    name: "QuickStartPage",
    data() {
      return {
        activeTab: 'join',
        collaborationDialogVisible: false,
      createNoteDialogVisible: false, // 控制弹窗显示

      collaborationForm: {
        type: 'note', // 默认选择加入笔记
        code: '',
        password: '',
      },

      collaboratorRules: {
        type: [{ required: true, message: '请选择分享类型', trigger: 'change' }],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur', validator: this.validatePassword },
        ],
      },

      collaboratorForm1: {
        id: null,
        type: 1,
        enablePassword: false,
        password: '',
      },

      collaborationRules1: {
        type: [{ required: true, message: '请选择加入类型', trigger: 'change' }],
        code: [{ required: true, message: '请输入邀请码', trigger: 'blur' }],
      },
      
      notebooks: [], // 笔记本列表
      newNoteForm: {
        notebookId: "", // 笔记本 ID
        title: "", // 笔记标题
        description: "", // 笔记描述
      },
      newNoteRules: {
        notebookId: [
          { required: true, message: "请选择笔记本", trigger: "change" },
        ],
        title: [
          { required: true, message: "请输入标题", trigger: "blur" },
          { max: 50, message: "标题长度不能超过 50 个字符", trigger: "blur" },
        ],
        description: [
          { max: 200, message: "描述长度不能超过 200 个字符", trigger: "blur" },
        ],
      },

        userInfo: JSON.parse(localStorage.getItem("userInfo")),
        quickActions: [
          {
            id: 1,
            icon: "fas fa-plus",
            title: "快速笔记",
            description: "创建一个全新的笔记，记录你的灵感。",
          },
          {
            id: 2,
            icon: "fas fa-pen",
            title: "新建随笔",
            description: "记住你的想法，分享你的创意。",
          },
          {
            id: 3,
            icon: "fas fa-users",
            title: "邀请协作",
            description: "邀请团队成员一起编辑和讨论。",
          },
          {
            id: 4,
            icon: "fas fa-file-import",
            title: "导入文件",
            description: "从本地导入文件，快速开始编辑。",
          },
          
        ],
        recentActivities: [
          {
            id: 1,
            icon: "fas fa-edit",
            description: "你编辑了《项目计划》",
            time: "2小时前",
          },
          {
            id: 2,
            icon: "fas fa-share-alt",
            description: "你分享了《会议记录》",
            time: "5小时前",
          },
         
        ],
      };
    },
    methods: {

      submitForm() {
      if (this.activeTab === 'join') {
        this.submitCollaborationForm();
      } else if (this.activeTab === 'invite') {
        this.submitCollaboratorForm1();
      }
    },
    submitCollaboratorForm1() {
      this.$refs.collaboratorForm1.validate(async (valid) => {
        if (valid) {
          const shareData = {
            id: this.collaboratorForm1.id,
            type: this.collaboratorForm1.type,
            password: this.collaboratorForm1.enablePassword ? this.collaboratorForm1.password : null,
          };
          try {
            const res = await getShareCode(shareData);
            if (res.data.code === 200) {
              this.$message.success('分享链接生成成功');
              this.$alert(`生成的分享链接为：${res.data.data}`, '分享链接', {
                confirmButtonText: '确定',
              });
              this.collaborationDialogVisible = false;
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
        type: 'note',
        code: '',
        password: '',
      };
      this.$refs.collaborationForm.resetFields();
    },
    resetCollaboratorForm1() {
      this.$refs.collaboratorForm1.resetFields();
      this.collaboratorForm1.enablePassword = false;
    },
    validatePassword(rule, value, callback) {
      if (this.collaboratorForm1.enablePassword && !value) {
        callback(new Error('请输入密码'));
      } else {
        callback();
      }
    },
      handleAction(action) {
        alert
        if(action.id === 1){
          this.openCreateNoteDialog();
        }else if(action.id === 2){
          this.$router.push({ name: 'EssayEditor' });
        }else if(action.id === 3){
          this.collaborationDialogVisible = true;
          this.loadNotebooks();
        }else{
          // 提示还在开发中
          this.$message.warning('功能正在开发中，敬请期待');
        }
      },

      // 打开弹窗
    openCreateNoteDialog() {
      this.createNoteDialogVisible = true;
      this.loadNotebooks(); // 加载笔记本列表
      
    },

    // 加载笔记本列表
    async loadNotebooks() {
      try {
        const response = await getNotebooks();
        this.notebooks = response.data.data.filter(
          (notebook) => notebook.resType === 1
        );
        console.log(this.notebooks);
      } catch (error) {
        console.error("Error fetching notebooks:", error);
        this.$message.error("加载笔记本列表失败，请稍后重试");
      }
    },

    // 提交表单
    submitNoteForm() {
      this.$refs.newNoteForm.validate((valid) => {
        if (valid) {
          // 表单验证通过，提交数据
          this.handleCreateNote();
        } else {
          console.log("表单验证失败");
          return false;
        }
      });
    },

    // 处理创建笔记逻辑
    async handleCreateNote() {
      
      const res = await addNote(this.newNoteForm);
      if (res.data.code == 200) {
        this.createNoteDialogVisible = false;
        this.$message.success("笔记创建成功");     
        window.open(`/home/note${res.data.data}`, '_blank');
        // this.$router.push({ name: 'NoteDetail', params: { noteId: res.data.data } });        
      } else {
        this.$message.error('笔记创建失败');
      }
    },

    // 重置表单
    resetForm() {
      this.$refs.newNoteForm.resetFields();
      this.newNoteForm = {
        notebookId: "",
        title: "",
        description: "",
      };
    },

  },
  mounted() {
    
  },
    
   

  };
  </script>
  
  <style scoped>
  .container{
    width: 100%;
    height: 100vh;
    background: linear-gradient(to bottom right, #f0f4ff, #ffffff);
    overflow-x: hidden;
  }
  .quick-start-page {
    /* 滑动 */
   
    padding: 24px;
    width: 80%;
    margin: 0 auto;
  }
  .container::-webkit-scrollbar{
    display: none;
  }
  
  .welcome-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    border-radius: 16px;
    padding: 32px;
    color: white;
    margin-bottom: 24px;
    height: 100px;
    margin-top: 30px;
  }
  
  .welcome-content h2 {
    font-size: 28px;
    font-weight: 600;
    margin-bottom: 8px;
  }
  
  .welcome-content p {
    font-size: 16px;
    opacity: 0.9;
  }
  
  .welcome-image {
    width: 120px;
    height: 120px;
    border-radius: 16px;
  }
  
  .quick-actions {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    margin-bottom: 24px;
  }
  
  .action-card {
    display: flex;
    align-items: center;
    background-color: white;
    border-radius: 12px;
    padding: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .action-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }
  
  .action-icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f3f4f6;
    border-radius: 12px;
    margin-right: 16px;
  }
  
  .action-icon i {
    font-size: 24px;
    color: #6366f1;
  }
  
  .action-details h3 {
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 4px;
  }
  
  .action-details p {
    font-size: 14px;
    color: #666;
  }
  
  .recent-activity h3 {
    font-size: 20px;
    font-weight: 500;
    margin-bottom: 16px;
  }
  
  .activity-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .activity-item {
    display: flex;
    align-items: center;
    background-color: white;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .activity-icon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f3f4f6;
    border-radius: 8px;
    margin-right: 16px;
  }
  
  .activity-icon i {
    font-size: 18px;
    color: #6366f1;
  }
  
  .activity-content p {
    font-size: 14px;
    margin-bottom: 4px;
  }
  
  .activity-time {
    font-size: 12px;
    color: #999;
  }

  .welcome-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 16px;
  padding: 32px;
  color: white;
  margin-bottom: 24px;
  height: 100px;
  margin-top: 30px;
  transition: all 0.3s ease; /* 让动画更平滑 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 鼠标悬浮时 */
.welcome-card:hover {
  transform: scale(1.05); /* 放大 5% */
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2); /* 增加阴影 */
}

/* 欢迎卡片中的图片 */
.welcome-image {
  width: 120px;
  height: 120px;
  border-radius: 16px;
  transition: transform 0.3s ease; /* 让图片的动画也平滑 */
}

/* 鼠标悬浮时，图片也做一个微小的旋转，增加动感 */
.welcome-card:hover .welcome-image {
  transform: rotate(5deg); /* 旋转 5 度 */
}

/* 欢迎卡片内容 */
.welcome-content h2 {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 8px;
  transition: color 0.3s ease;
}

/* 鼠标悬浮时，标题颜色变化 */
.welcome-card:hover .welcome-content h2 {
  color: #fff; /* 高亮颜色 */
}

/* 欢迎卡片的描述文本 */
.welcome-content p {
  font-size: 16px;
  opacity: 0.9;
  transition: opacity 0.3s ease;
}

/* 鼠标悬浮时，描述文本更显眼 */
.welcome-card:hover .welcome-content p {
  opacity: 1;
}

  </style>