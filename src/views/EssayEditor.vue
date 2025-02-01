<template>
    <div class="note-editor-page">
     
  
      <!-- 编辑区域 -->
      <div class="editor-container">
        <!-- 标题输入框 -->
        <input
          v-model="newNote.title"
          type="text"
          placeholder="输入标题..."
          class="editor-title"
        />
  
        <!-- 内容输入框 -->
        <textarea
          v-model="newNote.content"
          placeholder="写下你的想法..."
          rows="12"
          class="editor-content"
        ></textarea>
  
        <!-- 操作按钮 -->
        <div class="editor-actions">
          <button class="action-button">
            <i class="fas fa-image"></i>
            <span>插入图片</span>
          </button>
          <button class="action-button">
            <i class="fas fa-tags"></i>
            <span>添加标签</span>
          </button>
        </div>
  
        <!-- 保存和取消按钮 -->
        <div class="editor-footer">
          <button class="footer-button cancel-button" @click="cancel">
            取消
          </button>
          <button class="footer-button save-button" @click="save">保存</button>
        </div>
      </div>
    </div>
  </template>
  
  
  <script>
  import { addEssay,getEssay } from "../utils/api";
  export default {
    name: "NoteEditorPage",
    data() {
      return {
        newNote: {
          id: null,
          title: "",
          content: "",
        },
      };
    },
    methods: {
      // 返回上一页
      goBack() {
        this.$router.go(-1);
      },
  
      // 保存随笔
      async save() {
        if (!this.newNote.title || !this.newNote.content) {
          this.$message.error("请输入标题和内容！");
          return;
        }
        // 这里可以添加保存逻辑，比如调用 API 或保存到本地
        const res =await addEssay(this.newNote);
        if (res.data.code === 200) {
          this.$message.success("随笔保存成功");
        } else {
          this.$message.error("随笔保存失败");
        }
        // 清空输入框
        this.newNote.title = "";
        this.newNote.content = "";
        // 返回上一页
        this.goBack();
      },
  
      // 取消编辑
      cancel() {
        if (this.newNote.title || this.newNote.content) {
          const confirmCancel = confirm("确定要取消编辑吗？未保存的内容将丢失。");
          if (!confirmCancel) return;
        }
  
        // 清空输入框
        this.newNote.title = "";
        this.newNote.content = "";
  
        // 返回上一页
        this.goBack();
      },
      async getData() {
        if (this.$route.params.essayId) {
            const res = await getEssay(this.$route.params.essayId);
            this.newNote = res.data.data;
        }
      },
    },
    mounted() {
        this.getData();    
    },
  };
  </script>
  
  <style scoped>
  /* 页面样式 */
  .note-editor-page {
    min-height: 100vh;
    background: linear-gradient(to bottom right, #f0f4ff, #ffffff);
    padding: 20px;
  }
  
  /* 导航栏样式 */
  
  
  /* 编辑区域样式 */
  .editor-container {

    max-width: 800px;
    margin: 80px auto;
    background-color: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  /* 标题输入框 */
  .editor-title {
    width: 100%;
    font-size: 1.5rem;
    font-weight: 500;
    color: #1a1a1a;
    padding: 8px 0;
    margin-bottom: 16px;
    border: none;
    outline: none;
    background: transparent;
  }
  
  .editor-title::placeholder {
    color: #a0a0a0;
  }
  
  /* 内容输入框 */
  .editor-content {
    width: 100%;
    font-size: 1rem;
    color: #4a4a4a;
    padding: 8px 0;
    border: none;
    outline: none;
    background: transparent;
    resize: none;
    line-height: 1.6;
  }
  
  .editor-content::placeholder {
    color: #a0a0a0;
  }
  
  /* 操作按钮区域 */
  .editor-actions {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid #f0f0f0;
  }
  
  /* 操作按钮 */
  .action-button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background-color: #f8f8f8;
    color: #4a4a4a;
    border: none;
    border-radius: 8px;
    font-size: 0.875rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }
  
  .action-button:hover {
    background-color: #e0e0e0;
  }
  
  .action-button i {
    font-size: 0.875rem;
  }
  
  /* 保存和取消按钮区域 */
  .editor-footer {
    display: flex;
    justify-content: flex-end;
    gap: 16px;
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid #f0f0f0;
  }
  
  .footer-button {
    padding: 8px 16px;
    border: none;
    border-radius: 8px;
    font-size: 0.875rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }
  
  .cancel-button {
    background-color: #f8f8f8;
    color: #4a4a4a;
  }
  
  .cancel-button:hover {
    background-color: #e0e0e0;
  }
  
  .save-button {
    background-color: #007bff;
    color: white;
  }
  
  .save-button:hover {
    background-color: #0056b3;
  }
  </style>