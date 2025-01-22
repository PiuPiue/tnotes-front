<template>
  <div class="note-detail">
    <!-- 笔记标题 -->
    <div class="note-header">
      <input
        v-model="note.title"
        type="text"
        placeholder="请输入笔记标题"
        class="note-title"
      />
      <div class="note-actions">
        <button @click="saveNote" class="btn-save">
          <i class="fas fa-save"></i> 保存
        </button>
      </div>
    </div>

    <!-- Editor.js 编辑器容器 -->
    <div id="editorjs" class="note-editor"></div>

    <!-- 笔记元信息 -->
    <div class="note-meta">
      <span>创建时间：{{ formatDate(note.createTime) }}</span>
      <span>更新时间：{{ formatDate(note.updateTime) }}</span>
    </div>
  </div>
</template>

<script>
import "@/assets/styles/editor.css";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import ImageTool from "@editorjs/image";
import Quote from "@editorjs/quote";
import CodeTool from "@editorjs/code";
import Embed from "@editorjs/embed";
import Table from "@editorjs/table";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";
import { addNoteContent, getNote } from "@/utils/api";
import { Message } from "element-ui"; // 引入 Element UI 的提示组件

export default {
  name: "NoteDetail",
  data() {
    return {
      note: {
        id: null,
        title: "",
        content: { blocks: [] }, // 确保 content 是一个包含 blocks 的对象
        createTime: null,
        updateTime: null,
      },
      editor: null,
    };
  },
  methods: {
    // 初始化 Editor.js
    initEditor() {
      return new Promise((resolve) => {
        this.editor = new EditorJS({
          holder: "editorjs",
          tools: {
            header: Header,
            list: List,
            image: ImageTool,
            quote: Quote,
            code: CodeTool,
            embed: Embed,
            table: Table,
            marker: Marker,
            inlineCode: InlineCode,
          },
          placeholder: "开始写作吧...",
          data: this.note.content,
          minHeight: 300,
          onReady: () => {
            console.log("编辑器已准备好！");
            resolve(); // 初始化完成后 resolve
          },
        });
      });
    },

    // 保存笔记
    async saveNote() {
      try {
        const editorData = await this.editor.save();
        this.note.content = editorData;
        // 调用 API 保存笔记
        const res = await addNoteContent(this.note);
        if (res.data.code === 200) {
          Message.success("笔记保存成功"); // 使用 Element UI 的 Message 提示
          this.note.updateTime = new Date();
        } else {
          Message.error("保存失败：" + res.data.message); // 使用 Element UI 的 Message 提示
        }
      } catch (error) {
        console.error("保存失败：", error);
        Message.error("保存失败，请稍后重试"); // 使用 Element UI 的 Message 提示
      }
    },

    // 格式化日期
    formatDate(date) {
      if (!date) return "未知时间";
      return new Date(date).toLocaleString();
    },

    // 获取笔记数据
    async getData() {
      const noteId = this.$route.params.noteId;
      try {
        const res = await getNote(noteId,2);
        console.log("API 返回的数据：", res.data.data); // 打印调试信息
        if (res.data.code === 200) {
          this.note = res.data.data;

          // 将 content 数组转换为 Editor.js 所需的格式
          if (Array.isArray(this.note.content)) {
            this.note.content = { blocks: this.note.content };
          } else if (!this.note.content || !Array.isArray(this.note.content.blocks)) {
            this.note.content = { blocks: [] }; // 如果数据格式不正确，重置为默认值
          }

          // 初始化 Editor.js
          await this.initEditor();
          if (this.editor) {
            this.editor.render(this.note.content); // 渲染内容
          }
        } else {
          Message.error("获取笔记失败：" + res.data.message); // 使用 Element UI 的 Message 提示
        }
      } catch (error) {
        console.error("获取笔记失败：", error);
        Message.error("获取笔记失败，请稍后重试"); // 使用 Element UI 的 Message 提示
      }
    },

    // 监听键盘事件
    handleKeyDown(event) {
      // 检查是否按下了 Ctrl + S
      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault(); // 阻止默认保存行为
        this.saveNote(); // 调用保存方法
      }
    },
  },
  mounted() {
    if (this.$route.params.noteId) {
      this.getData(); // 加载数据并初始化编辑器
    } else {
      this.initEditor(); // 新建笔记时直接初始化编辑器
    }

    // 添加键盘事件监听器
    window.addEventListener("keydown", this.handleKeyDown);
  },
  beforeDestroy() {
    // 移除键盘事件监听器
    window.removeEventListener("keydown", this.handleKeyDown);
    //离开之前先自动保存
    this.saveNote();
  },
};
</script>

<style scoped>
.note-detail {
  padding: 20px;
  width: 100%;
  max-width: 1200px; /* 最大宽度设置为1200px */
  margin: 0 auto;
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 笔记标题 */
.note-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  width: 100%; /* 改为 100% 宽度 */
}

.note-title {
  flex: 1;
  font-size: 24px;
  font-weight: bold;
  border: none;
  outline: none;
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 8px;
}

/* 操作按钮 */
.note-actions {
  display: flex;
  gap: 10px;
}

.btn-save,
.btn-delete {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease, transform 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-save {
  background-color: #1e90ff;
  color: white;
}

.btn-save:hover {
  background-color: #0077cc;
  transform: translateY(-2px);
}

.btn-delete {
  background-color: #ff4d4d;
  color: white;
}

.btn-delete:hover {
  background-color: #cc0000;
  transform: translateY(-2px);
}

/* 编辑器区域 */
.note-editor {
  margin-bottom: 20px;
  background-color: #ffffff;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  overflow: hidden;
  min-height: 300px;
}

#editorjs {
  min-height: 200px;
}

/* 笔记元信息 */
.note-meta {
  font-size: 14px;
  color: #666;
  text-align: right;
  padding-top: 10px;
  border-top: 1px solid #e0e0e0;
}

.note-meta span {
  margin-left: 10px;
}
</style>