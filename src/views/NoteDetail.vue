<template>
  <div :class="['note-detail', theme]">
    <!-- 头部 -->
    <header class="header">
      <div class="header-content">
        <div class="left-actions">
          <span class="notebook-name">所在笔记本：{{note.title}}</span>
        </div>
        <div class="right-actions">
          <!-- 主题切换按钮 -->
          <button class="btn-theme" @click="toggleTheme">
            <i :class="themeIcon"></i> {{ themeText }}
          </button>
          <!-- 分享按钮 -->
          <button class="btn-share" @click="openShareDialog">
            <i class="fas fa-share-alt"></i> 分享
          </button>
          <button class="btn-save" @click="saveNote">
            <i class="fas fa-save"></i> 保存
          </button>
        </div>
      </div>
    </header>


    <!-- 主体内容 -->
    <main class="main-content">
       

 <!-- 左侧目录 -->
  <!-- 左侧目录 -->
  <aside class="toc-sidebar">
    <div class="toc-card">
      <h3 class="toc-title">
        <i class="fas fa-list-ul"></i> 目录
      </h3>
      <div class="toc-container">
        <ul class="toc-list">
          <li v-for="(item, index) in tocItems" :key="index" :class="['toc-item', `toc-level-${item.level}`]">
            <a :href="`#${item.id}`" @click.prevent="scrollTo(item.id)">
              <i class="fas fa-chevron-right"></i> {{ item.text }}
            </a>
          </li>
        </ul>
      </div>
    </div>
  </aside>
      <!-- 左侧编辑器 -->
      <div class="editor-container">
        <input
          v-model="note.title"
          type="text"
          placeholder="请输入笔记标题"
          class="note-title"
        />
        <!-- 添加 description 区域 -->
        <div class="description-container">
          <textarea
            v-model="note.description"
            placeholder="请输入笔记描述"
            class="note-description"
          ></textarea>
        </div>
        <div id="editorjs"></div>
      </div>

      <!-- 右侧侧边栏 -->
      <aside class="sidebar">
        <!-- AI 助手 -->
        <div class="info-card">
          <div class="card-header">
            <h3 class="card-title">AI 助手</h3>
          </div>
          <button class="ai-action" @click="warnn()">
            <i class="fas fa-magic"></i>
            <span>优化文章结构</span>
            <i class="fas fa-chevron-right"></i>
          </button>
          <button class="ai-action" @click="warnn()">
            <i class="fas fa-check-circle"></i>
            <span>检查语法错误</span>
            <i class="fas fa-chevron-right"></i>
          </button>
          <button class="ai-action" @click="generateSummary()">
            <i class="fas fa-file-alt"></i>
            <span>生成摘要</span>
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>

        <!-- 文档信息 -->
        <div class="info-card">
          <h3 class="card-title">文档信息</h3>
          <div class="info-item">
            <span>创建时间</span>
            <span>{{ formatDate(note.createTime) }}</span>
          </div>
          <div class="info-item">
            <span>最后编辑</span>
            <span>{{ formatDate(note.updateTime) }}</span>
          </div>
          <div class="info-item">
            <span>当前字数</span>
            <span>{{wordCount}}字</span>
          </div>
        </div>

        <!-- 协作者部分 -->
        <div class="info-card">
          <h3 class="card-title">协作人</h3>
          <div class="version-item" v-for="user in coopUsers" :key="user.userId">
            <div class="user-info">
              <!-- 用户头像 -->
              <el-avatar :src="user.avatar" :size="30" />

              <!-- 用户信息 -->
              <div class="user-details">
                <span class="user-name">{{ user.userName }}</span>
                <span class="user-permission">
                  {{ formatPermission(user.permission) }}
                  <span v-if="user.resource === 1">（来自笔记本）</span>
                  <span v-else>（来自笔记）</span>
                </span>
              </div>

              <!-- 操作按钮（仅限笔记协作） -->
              <div class="user-actions" v-if="user.resource === 2">
                <el-dropdown trigger="click" @command="handleCommand(user, $event)">
                  <el-button type="text" class="btn-more">
                    <i class="fas fa-ellipsis-v"></i>
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item command="changePermission">修改权限</el-dropdown-item>
                      <el-dropdown-item command="delete" divided>删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </div>
          </div>
        </div>

        <!-- 修改权限弹窗 -->
        <el-dialog :visible.sync="dialogVisible" title="修改权限" width="30%">
          <el-select v-model="selectedPermission" placeholder="请选择权限">
            <el-option
              v-for="permission in permissionOptions"
              :key="permission.value"
              :label="permission.label"
              :value="permission.value"
            />
          </el-select>
          <template #footer>
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="confirmChangePermission">确认</el-button>
          </template>
        </el-dialog>
      </aside>

      <!-- 摘要弹窗 -->
      <transition name="fade">
        <div v-if="showSummaryModal" class="summary-modal">
          <div class="modal-overlay" @click="closeSummaryModal"></div>
          <div class="modal-content">
            <!-- 加载动画 -->
            <div v-if="isLoading" class="loading-animation">
              <div class="particle-loader"></div>
              <p class="loading-text">AI 正在分析中...</p>
            </div>

            <!-- 摘要内容 -->
            <div v-else class="summary-result">
              <h3>摘要</h3>
              <p>{{ summaryText }}</p>
              <button class="btn-copy" @click="copySummary">
                <i class="fas fa-copy"></i> 复制摘要
              </button>
            </div>
          </div>
        </div>
      </transition>
    </main>

    <!-- 分享弹窗 -->
    <el-dialog
      title="分享笔记"
      :visible.sync="shareDialogVisible"
      width="30%"
      @close="resetShareForm"
    >
      <el-form :model="shareForm" :rules="shareRules" ref="shareForm">
        <el-form-item label="分享类型" prop="type">
          <el-select v-model="shareForm.type" placeholder="请选择分享类型">
            <el-option label="仅阅读" :value="1"></el-option>
            <el-option label="可编辑" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设置密码" prop="enablePassword">
          <el-switch v-model="shareForm.enablePassword"></el-switch>
        </el-form-item>
        <el-form-item v-if="shareForm.enablePassword" label="密码" prop="password">
          <el-input v-model="shareForm.password" type="password"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="shareDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitShareForm">生成链接</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import '@/assets/styles/editor.css'
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import ImageTool from "@editorjs/image";
import Quote from "@editorjs/quote";
import Embed from "@editorjs/embed";
import Table from "@editorjs/table";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";
import editorjsCodecup from '@calumk/editorjs-codecup';
import { addNoteContent, getNote ,getNoteCoopUsers,changeNotePermission,deleteNotePermission,getNoteShareCode,updateNote,getEssaySummary} from "@/utils/api";
import { Message } from "element-ui";
import 'prismjs/components/prism-python'; 
import BreakLine from 'editorjs-break-line';
import Delimiter from '@editorjs/delimiter';
// 引入常见语言的支持
import 'prismjs/components/prism-java';    // Java 语言支持
import 'prismjs/components/prism-python';  // Python 语言支持

import 'prismjs/components/prism-javascript';  // JavaScript 语言支持
import 'prismjs/components/prism-c';       // C 语言支持
 // HTML 支持

export default {
  name: "NoteDetail",
  
  data() {
    return { 
      
      tocItems:[],
      theme: 'light', // 默认主题为浅色
      themeIcon: 'fas fa-moon', // 主题图标
      themeText: '深色模式', // 主题切换按钮文本
      wordCount: 0, // 新增字段，用于存储当前字数
      showSummaryModal: false, // 控制弹窗显示
      isLoading: false, // 控制加载状态
      summaryText: "", // 生成的摘要内容
      toc: [], // 目录数据
      // 分享弹窗相关数据
      shareDialogVisible: false, // 控制分享弹窗的显示
      shareForm: {
        type: 1, // 分享类型，默认仅阅读
        enablePassword: false, // 是否启用密码
        password: "", // 密码
      },
      shareRules: {
        type: [{ required: true, message: "请选择分享类型", trigger: "change" }],
        password: [
          { required: true, message: "请输入密码", trigger: "blur", validator: this.validatePassword },
        ],
      },
      // 其他数据
      dialogVisible: false,
      selectedPermission: null,
      selectedUser: null,
      permissionOptions: [
        { value: 1, label: "只读" },
        { value: 2, label: "可编辑" },
      ],
      note: {
        id: null,
        title: "",
        content: { blocks: [] },
        createTime: null,
        updateTime: null,
      },
      coopUsers: [],
      editor: null,
      socket: null,
      clientId: null,
      cursors: new Map(),
      clientColor: this.getRandomColor(),
    };
  },
  methods: {
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light';
      this.themeIcon = this.theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
      this.themeText = this.theme === 'light' ? '深色模式' : '浅色模式';
    },
    async updateWordCount() {
      try {
        const outputData = await this.editor.save();
        let textContent = 0;
        outputData.blocks.forEach(block => {
          if (block.type === 'paragraph') {
            textContent += block.data.text.length;
          }
        });
        this.wordCount = textContent; // 更新字数
      } catch (error) {
        console.error('Error updating word count:', error);
      }
    },
    warnn(){
      this.$message.warning('还在开发中，敬请期待~~~')
    },
    // 打开分享弹窗
    openShareDialog() {
      this.shareDialogVisible = true;
    },

    // 提交分享表单
    submitShareForm() {
      this.$refs.shareForm.validate(async (valid) => {
        if (valid) {
          const shareData = {
            id: this.note.id, // 笔记 ID
            type: this.shareForm.type, // 分享类型
            password: this.shareForm.enablePassword ? this.shareForm.password : null, // 密码
          };
          try {
            // 调用后端 API 生成分享链接
            const res = await getNoteShareCode(shareData); // 替换为实际的 API 方法
            if (res.data.code === 200) {
              this.$message.success("分享链接生成成功");
              this.$alert(`生成的分享链接为：${res.data.data}`, '分享链接', {
                confirmButtonText: '确定',
              });
              this.shareDialogVisible = false;
            } else {
              this.$message.error("分享链接生成失败");
            }
          } catch (error) {
            console.error("生成分享链接失败:", error);
            this.$message.error("生成分享链接失败，请稍后重试");
          }
        }
      });
    },

    // 重置分享表单
    resetShareForm() {
      this.$refs.shareForm.resetFields();
      this.shareForm.enablePassword = false;
    },

    // 密码验证规则
    validatePassword(rule, value, callback) {
      if (this.shareForm.enablePassword && !value) {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    },

    // 格式化权限显示
    formatPermission(permission) {
      switch (permission) {
        case 1:
          return "只读";
        case 2:
          return "可编辑";
        default:
          return "未知权限";
      }
    },

    // 处理操作按钮点击
    handleCommand(user, command) {
      if (command === "delete") {
        this.deleteCollaborator(user);
      } else if (command === "changePermission") {
        this.openPermissionDialog(user);
      }
    },

    // 打开修改权限弹窗
    openPermissionDialog(user) {
      this.selectedUser = user;
      this.selectedPermission = user.permission;
      this.dialogVisible = true;
    },

    // 确认修改权限
    async confirmChangePermission() {
      if (!this.selectedUser || !this.selectedPermission) return;

      try {
        const newPermission = this.selectedPermission;
        const permission = {
          id: this.note.id,
          userId: this.selectedUser.userId,
          permission: newPermission,
        }
        // 调用 API 修改权限
        const res = await changeNotePermission(
            permission
        );
        if (res.data.code === 200) {
          this.$message.success("权限修改成功");
          // 更新本地数据
          this.selectedUser.permission = this.selectedPermission;
        } else {
          this.$message.error("权限修改失败：" + res.data.message);
        }
      } catch (error) {
        this.$message.error("权限修改失败，请稍后重试");
      } finally {
        this.dialogVisible = false;
      }
    },

    // 删除协作者
    async deleteCollaborator(user) {
      try {
        // 调用 API 删除协作者
        const res = await deleteNotePermission(user.userId,this.note.id);
        if (res.data.code === 200) {
          this.$message.success("删除成功");
          // 更新本地数据
          this.coopUsers = this.coopUsers.filter((u) => u.id !== user.id);
        } else {
          this.$message.error("删除失败：" + res.data.message);
        }
      } catch (error) {
        this.$message.error("删除失败，请稍后重试");
      }
    },
    
    async initEditor() {
      return new Promise((resolve) => {
        this.editor = new EditorJS({
          readOnly: this.note.permission == 1,
          holder: "editorjs",
          autofocuse: true,
          tools: {
            header: {
              class: Header,
              config: {
                placeholder: "请输入标题",
                levels: [1, 2, 3, 4], // 支持的标题级别
                defaultLevel: 2, // 默认标题级别
              },
              inlineToolbar: true,
              shortcut: "CMD+H",
            },
            list:{
              class: List,
              inlineToolbar:true,
              shortcut:'CMD+L'
            },
            image: {
                class: ImageTool,
              config: {
                uploader:{
              
              uploadByFile(file) {
                const formData = new FormData();
                formData.append('file', file);
    
                return fetch('https://notes.t-music.cn/api/minio/upload', {
                  method: 'POST',
                  headers: {
                    'Authorization': localStorage.getItem('Authorization'),
                  },
                  body: formData,
                })
                .then(response => response.json())
                .then(data => {
                  if (data.success) {
                    return {
                      success: 1,
                      file: {
                        url: data.path, // 假设返回的数据中包含图片的URL
                      },
                    };
                  } else {
                    return {
                      success: 0,
                      message: '上传失败',
                    };
                  }
                })
                .catch(error => {
                  console.error('上传失败:', error);
                  return {
                    success: 0,
                    message: '上传失败',
                  };
                });
              },
                  },
                  
                // endpoints: {
                //   byFile: 'http://localhost:8081/minio/upload', // 上传图片接口
                  
                // },
                // headers: {
                //     'Authorization': localStorage.getItem('Authorization'), // 替换为你的 token
                // },
                // field: 'file',
              },
         
            },
            quote: Quote,
            code: editorjsCodecup,
            embed: Embed,
            table: Table,
            marker: Marker,
            inlineCode: InlineCode, 
            breakLine: {
              class: BreakLine,
              inlineToolbar: true,
              shortcut: 'CMD+SHIFT+ENTER',
            },
            delimiter: {
              class: Delimiter,
              inlineToolbar: true,  // 如果希望在工具栏显示按钮
              shortcut: 'CMD+P',
            },
          },
          placeholder: "开始写作吧...",
          data: this.note.content,
          minHeight: 300,
          onReady: () => {
            resolve();
            this.updateWordCount()
            this.generateTOC(); // 生成目录
          },
          onChange: async () => {
            this.updateWordCount()
            this.generateTOC(); // 生成目录
            const data = await this.editor.save();
            // 确保空段落也被包含
            if (data.blocks.length >= 0) {
              this.note.content = data;
              this.broadcastDocumentUpdate(data);
              }
            },
          });

        // 监听光标位置变化
        const editorElement = document.getElementById("editorjs");
        editorElement.addEventListener("click", this.updateLocalCursor);
        editorElement.addEventListener("keyup", this.updateLocalCursor);
        editorElement.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            setTimeout(this.updateLocalCursor, 10); // 缩短延迟时间
          }
        });
        document.addEventListener("selectionchange", this.updateLocalCursor);
      });
    },


    // 生成目录
    generateTOC() {
    const editorElement = document.getElementById("editorjs");
    const headers = editorElement.querySelectorAll("h1, h2, h3, h4");
    this.tocItems = Array.from(headers).map((header, index) => {
      // 如果标题没有 id，动态生成一个唯一的 id
      if (!header.id) {
        header.id = `header-${index}-${Math.random().toString(36).substr(2, 6)}`;
      }
      return {
        id: header.id,
        text: header.innerText,
        level: parseInt(header.tagName.replace('H', ''), 10)
      };
    });
  },  // 跳转到指定标题
  scrollTo(id) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  },

    async saveNote() {
      try {
        const notedto = {
          id: this.note.id,
          title: this.note.title,
          description: this.note.description,
        }
        const editorData = await this.editor.save();
        const res1 = await updateNote(notedto);
        this.note.content = editorData;
        const res = await addNoteContent(this.note);
        if (res.data.code === 200&&res1.data.code===200) {
          Message.success("笔记保存成功", 0.5);
          this.note.updateTime = new Date();
        } else {
          Message.error("保存失败：" + res.data.message);
        }
      } catch (error) {
        
        Message.error("保存失败，请稍后重试");
      }
    },

    formatDate(date) {
      if (!date) return "未知时间";
      return new Date(date).toLocaleString();
    },

    async getData() {
      const noteId = this.$route.params.noteId;
      try {
        const res = await getNote(noteId, 2);
        if (res.data.code === 200) {
          this.note = res.data.data;
          if (Array.isArray(this.note.content)) {
            this.note.content = { blocks: this.note.content };
          } else if (!this.note.content || !Array.isArray(this.note.content.blocks)) {
            this.note.content = { blocks: [] };
          }
          await this.initEditor();
          if (this.editor) {
            this.editor.render(this.note.content);
          }
        } else {
          Message.error("获取笔记失败：" + res.data.message);
        }
      } catch (error) {
        Message.error("获取笔记失败，请稍后重试");
      }
    },

    handleKeyDown(event) {
      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault();
        this.saveNote();
      }
    },

    initWebSocket() {
      // 创建 WebSocket 连接
      this.socket = new WebSocket(`wss://websocket.t-music.cn/coop?noteId=${this.$route.params.noteId}`);

      // WebSocket 连接成功
      this.socket.onopen = () => {
        // 生成一个唯一的 clientId
        // this.clientId = Math.random().toString(36).substr(2, 9);
        this.clientId = JSON.parse(localStorage.getItem('userInfo')).name
      };

      // 接收 WebSocket 消息
      this.socket.onmessage = async (event) => {
        try {
          let message;
          // 如果消息是 Blob 对象（二进制数据），转换为字符串
          if (event.data instanceof Blob) {
            message = await event.data.text();
          } else {
            // 如果消息是字符串，直接使用
            message = event.data;
          }

          // 解析 JSON 消息
          const parsedMessage = JSON.parse(message);

          // 处理文档更新消息
          if (parsedMessage.type === "documentUpdate") {
            // 渲染远程用户的文档更新
            this.editor.render(parsedMessage.data);
          }
          // 处理光标更新消息
          else if (parsedMessage.type === "cursorUpdate") {
            // 获取或创建远程用户的光标
            let cursor = this.cursors.get(parsedMessage.clientId);
            if (!cursor) {
              // 如果光标不存在，创建一个新的光标
              cursor = this.createCursor(parsedMessage.clientInfo);
              this.cursors.set(parsedMessage.clientId, cursor);
            }
            // 更新远程用户的光标位置
            this.updateCursorPosition(parsedMessage.clientId, parsedMessage.position);
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      // WebSocket 连接关闭
      this.socket.onclose = () => {
        console.log("WebSocket disconnected");
      };
    },

    broadcastDocumentUpdate(data) {
      if (this.socket.readyState === WebSocket.OPEN) {
        const message = {
          type: "documentUpdate",
          data: data,
        };
        try {
          this.socket.send(JSON.stringify(message));
        } catch (error) {
          console.error("Error sending WebSocket message:", error);
        }
      }
    },

    createCursor(clientInfo) {
      const cursor = document.createElement("div");
      cursor.className = "remote-cursor";
      cursor.style.position = "absolute";
      cursor.style.pointerEvents = "none";
      cursor.style.transition = "all 0.1s ease";
      cursor.style.zIndex = 1000;

      const flag = document.createElement("div");
      flag.className = "cursor-flag";
      flag.style.backgroundColor = clientInfo.color;
      flag.style.padding = "2px 6px";
      flag.style.borderRadius = "3px";
      flag.style.color = "white";
      flag.style.fontSize = "12px";
      flag.textContent = clientInfo.name || "Anonymous";

      const line = document.createElement("div");
      line.className = "cursor-line";
      line.style.width = "2px";
      line.style.height = "24px"; // 光标线的高度
      line.style.backgroundColor = clientInfo.color;

      cursor.appendChild(flag);
      cursor.appendChild(line);

      document.getElementById("editorjs").appendChild(cursor);
      return cursor;
    },
    updateCursorPosition(clientId, position) {
  const cursor = this.cursors.get(clientId);
  if (!cursor || !position) return;

  try {
    const editorElement = document.getElementById("editorjs");
    const blocks = editorElement.querySelectorAll(".ce-block");
    const block = blocks[position.blockIndex];
    if (!block) return;

    // 获取块内部的编辑区域
    const contentElement = block.querySelector('.ce-block__content [contenteditable="true"]') 
      || block.querySelector('[contenteditable="true"]')
      || block.querySelector(".cdx-list__item");
    if (!contentElement) return;

    const editorRect = editorElement.getBoundingClientRect();
    let cursorLeft = 0;
    let cursorTop = 0;
    let lineHeight = 0;

    // 处理多行块内部的光标位置
    if (position.offset > 0 && contentElement.textContent.length > 0) {
      const range = document.createRange();
      let textNode = contentElement.firstChild;

      // 处理列表项
      if (contentElement.classList.contains("cdx-list__item")) {
        const walker = document.createTreeWalker(contentElement, NodeFilter.SHOW_TEXT, null, false);
        textNode = walker.firstChild();
      } else if (!textNode && contentElement.textContent) {
        textNode = document.createTextNode(contentElement.textContent);
        contentElement.appendChild(textNode);
      }

      if (textNode) {
        const offset = Math.min(position.offset, textNode.textContent.length);
        range.setStart(textNode, offset);
        range.setEnd(textNode, offset);
        const rects = range.getClientRects();

        if (rects.length > 0) {
          const rect = rects[0];
          cursorLeft = rect.left - editorRect.left;
          cursorTop = rect.top - editorRect.top;
          lineHeight = rect.height;

          // 基线偏移补偿
          const fontSize = parseInt(window.getComputedStyle(contentElement).fontSize, 10);
          cursorTop += fontSize * 0.2;
        }
      }
    } else {
      // 处理行首位置
      const contentRect = contentElement.getBoundingClientRect();
      cursorLeft = contentRect.left - editorRect.left;
      cursorTop = contentRect.top - editorRect.top;
      lineHeight = parseInt(window.getComputedStyle(contentElement).lineHeight, 10);
    }

    // 应用滚动偏移
    const scrollTop = editorElement.scrollTop;
    const scrollLeft = editorElement.scrollLeft;
    cursor.style.left = `${cursorLeft + scrollLeft}px`;
    cursor.style.top = `${cursorTop + scrollTop - 20}px`;

    // 设置光标高度
    const line = cursor.querySelector(".cursor-line");
    cursor.style.height = `${lineHeight}px`;
    line.style.height = `${lineHeight}px`;

    // 调整光标标志位置
    const flag = cursor.querySelector(".cursor-flag");
    if (flag) flag.style.top = `-${flag.offsetHeight}px`;

  } catch (err) {
    console.error("Error updating cursor position:", err);
  }
    },
    broadcastCursorPosition(blockIndex, offset) {
  if (this.socket.readyState === WebSocket.OPEN) {
    const message = {
      type: "cursorUpdate",
      clientId: this.clientId,
      position: {
        blockIndex,
        offset,
      },
      clientInfo: {
        name: "User " + this.clientId,
        color: this.clientColor,
      },
    };
    this.socket.send(JSON.stringify(message));
  }
},

    updateLocalCursor() {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  const range = selection.getRangeAt(0);
  const node = range.startContainer;

  const blockElement = this.findBlockElement(node.nodeType === Node.TEXT_NODE ? node.parentElement : node);
  if (!blockElement) return;

  const editorElement = document.getElementById("editorjs");
  const blocks = Array.from(editorElement.querySelectorAll(".ce-block"));
  const blockIndex = blocks.indexOf(blockElement);

  if (blockIndex === -1) return;

  let offset = range.startOffset;
  if (blockElement.querySelector(".cdx-list__item")) {
    const listItem = blockElement.querySelector(".cdx-list__item");
    const walker = document.createTreeWalker(listItem, NodeFilter.SHOW_TEXT, null, false);
    const textNode = walker.firstChild();
    if (textNode) {
      
      offset = range.startContainer === textNode ? range.startOffset : 0;
    }
  }

  this.broadcastCursorPosition(blockIndex, offset+50000);
},
findBlockElement(node) {
  while (node && !node.classList?.contains("ce-block")) {
    node = node.parentElement;
  }
  return node;
},

    getRandomColor() {
      const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEEAD", "#D4A5A5"];
      return colors[Math.floor(Math.random() * colors.length)];
    },

    async getCoopUser(){
      const res = await getNoteCoopUsers(this.$route.params.noteId)
      this.coopUsers = res.data.data;
      console.log(this.coopUsers)
    },

    async generateSummary() {
      this.showSummaryModal = true;
      this.isLoading = true;

      // 模拟 AI 分析过程
      try {
        const data = await this.extractText();
        const dto = { message: data };
        const res = await getEssaySummary(dto);
        this.summaryText = res.data.data;
      } catch (error) {
        console.error("生成摘要失败:", error);
        this.summaryText = "生成摘要失败，请稍后重试。";
      } finally {
        this.isLoading = false;
      }
    },

    // 复制摘要
    copySummary() {
      navigator.clipboard.writeText(this.summaryText)
        .then(() => {
          this.$message.success("摘要已复制到剪贴板");
        })
        .catch(() => {
          this.$message.error("复制失败，请手动复制");
        });
    },

    // 关闭弹窗
    closeSummaryModal() {
      this.showSummaryModal = false;
      this.isLoading = false;
      this.summaryText = "";
    },

    extractText() {
      return this.editor.save().then((outputData) => {
        // 遍历 editorjs 的输出，提取纯文本
        let textContent = '';
        outputData.blocks.forEach(block => {
         
          if (block.type === 'paragraph') {
            textContent += block.data.text + '\n';
          }
          
        });
        return textContent;
      }).catch((error) => {
        console.log('Error saving data: ', error);
      });
    }
    
  },
  mounted() {
    if (this.$route.params.noteId) {
      this.getData();
    } else {
      this.initEditor();
    }
    this.initWebSocket();
    this.getCoopUser();
    if(this.note.permission != 1){
      addEventListener("keydown", this.handleKeyDown);
    }
    this.updateWordCount()
 
  },
  beforeDestroy() {
    if(this.note.permission != 1){
      window.removeEventListener("keydown", this.handleKeyDown);
    this.saveNote();
    if (this.socket) {
      this.socket.close();
    }
    }
    
  },
 
};
</script>
<style scoped>
/* 全局样式 */
body {
  font-family: 'Roboto', sans-serif;
  margin: 0;
  padding: 0;
}

.note-detail {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 浅色主题 */
.note-detail.light {
  background-color: #f5f5f5;
  color: #333;
}

/* 深色主题 */
.note-detail.dark {
  background-color: #1A202C;
  color: #ffffff;
}

/* 头部 */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.light .header {
  background: linear-gradient(135deg, #ffffff, #f0f0f0);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.dark .header {
  background: linear-gradient(135deg, #2a2a40, #1e1e2f);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.header-content {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 24px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.left-actions,
.right-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.notebook-name {
  font-size: 16px;
}

.light .notebook-name {
  color: #666;
}

.dark .notebook-name {
  color: #a0a0c0;
}

.btn-theme,
.btn-share,
.btn-save {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-theme {
  background: linear-gradient(135deg, #00aaff, #0077cc);
  color: #ffffff;
}

.btn-share {
  background: linear-gradient(135deg, #00aaff, #0077cc);
  color: #ffffff;
}

.btn-save {
  background: linear-gradient(135deg, #00ff88, #00cc66);
  color: #ffffff;
}

.btn-theme:hover,
.btn-share:hover,
.btn-save:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 170, 255, 0.3);
}

/* 主体内容 */
.main-content {
  max-width: 1840px;
  margin: 80px auto 0;
  padding: 24px;
  display: flex;
  gap: 24px;
}


/* 中间编辑器 */
.editor-container {
  flex: 1;
  width: 800px; /* 限制编辑器宽度，避免页面过宽 */
  border-radius: 15px;
  padding: 24px;
}

.light .editor-container {
  background: #ffffff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.dark .editor-container {
  background: linear-gradient(135deg, #2a2a40, #1e1e2f);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.note-title {
  text-align: center;
  width: 95%;
  
  font-size: 24px;
  font-weight: bold;
  border: none;
  outline: none;
  margin-bottom: 24px;
  padding: 12px;
  border-radius: 8px;
}

.light .note-title {
  color: #333;
}

.dark .note-title {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.description-container {
  width: 700px;
  border-radius: 10px;
  padding: 15px 20px;
  margin-left: 50px;
  margin-bottom: 20px;
  border-left: 4px solid #4CAF50;
  background: rgba(0, 0, 0, 0.05);
  font-size: 1rem;
  line-height: 1.6;
}

.description-container::-webkit-scrollbar {
  display: none;
}

.light .description-container {
  background: rgba(0, 0, 0, 0.05);
  color: #333;
}

.dark .description-container {
  background: rgba(255, 255, 255, 0.1);
  color: #ddd;
}

.note-description {
  width: 100%;
  font-size: 14px;
  border: none;
  outline: none;
  background: transparent;
  resize: none;
  min-height: 80px;
}

.note-description::-webkit-scrollbar {
  display: none;
}

.light .note-description {
  color: #333;
}

.dark .note-description {
  color: #ffffff;
}

/* 右侧侧边栏 */
.sidebar {
  
  width: 320px;
  flex-shrink: 0;
  position: sticky;
  top: 100px; /* 与头部高度一致 */
  height: calc(100vh - 100px); /* 减去头部高度 */
  overflow-y: auto; /* 允许滚动 */
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.sidebar::-webkit-scrollbar {
  display: none; /* 隐藏滚动条 */
}

.light .sidebar {
  background: #ffffff;
}

.dark .sidebar {
  background: linear-gradient(135deg, #2a2a40, #1e1e2f);
}

.info-card {
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 16px;
}

.light .info-card {
  background: #ffffff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.dark .info-card {
  background: linear-gradient(135deg, #2a2a40, #1e1e2f);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
}

.light .card-title {
  color: #0077cc;
}

.dark .card-title {
  color: #00ff88;
}

.info-item {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  margin-bottom: 12px;
}

.light .info-item {
  color: #666;
}

.dark .info-item {
  color: #a0a0c0;
}

.ai-action {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  border-radius: 8px;
  transition: background 0.2s, transform 0.2s;
}

.light .ai-action {
  background: rgba(0, 0, 0, 0.05);
  color: #333;
}

.dark .ai-action {
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
}

.ai-action:hover {
  background: rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.version-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-details {
  flex-grow: 1;
}

.user-name {
  font-size: 14px;
}

.light .user-name {
  color: #333;
}

.dark .user-name {
  color: #ffffff;
}

.user-permission {
  font-size: 12px;
}

.light .user-permission {
  color: #666;
}

.dark .user-permission {
  color: #a0a0c0;
}

.user-actions {
  margin-left: auto;
}

.btn-more {
  padding: 0;
}

.light .btn-more {
  color: #666;
}

.dark .btn-more {
  color: #a0a0c0;
}

.btn-more:hover {
  color: #00ff88;
}

/* 弹窗样式 */
.summary-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
}

.modal-content {
  position: relative;
  border-radius: 15px;
  padding: 30px;
  max-width: 600px;
  width: 90%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  text-align: center;
}

.light .modal-content {
  background: #ffffff;
  color: #333;
}

.dark .modal-content {
  background: linear-gradient(135deg, #2a2a40, #1e1e2f);
  color: #fff;
}

/* 加载动画 */
.loading-animation {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.particle-loader {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: conic-gradient(#00ff88, #00aaff, #ff00ff, #00ff88);
  animation: spin 1.5s linear infinite;
  position: relative;
}

.particle-loader::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  background: radial-gradient(circle, transparent 50%, #1e1e2f 70%);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  margin-top: 20px;
  font-size: 16px;
  animation: pulse 1.5s infinite;
}

.light .loading-text {
  color: #0077cc;
}

.dark .loading-text {
  color: #00ff88;
}

@keyframes pulse {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 0.4; }
}

/* 摘要内容 */
.summary-result {
  text-align: left;
}

.summary-result h3 {
  font-size: 24px;
  margin-bottom: 20px;
}

.light .summary-result h3 {
  color: #0077cc;
}

.dark .summary-result h3 {
  color: #00ff88;
}

.summary-result p {
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 20px;
}

.btn-copy {
  background: linear-gradient(135deg, #00ff88, #00aaff);
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-copy:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 255, 136, 0.3);
}

/* 弹窗过渡动画 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .toc-sidebar {
    display: none; /* 在小屏幕上隐藏目录 */
  }

  .editor-container {
    max-width: 100%;
  }
}

/* 左侧目录 */
.toc-sidebar {
  width: 240px;
  flex-shrink: 0;
  position: sticky;
  top: 100px; /* 与头部高度一致 */
  height: 680px;
  overflow-y: auto;
  padding: 16px;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  background: var(--toc-bg-color);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.toc-sidebar::-webkit-scrollbar{
  display: none;
}


.light .toc-sidebar {
  --toc-bg-color: #ffffff;
}

.dark .toc-sidebar {
  --toc-bg-color: #1e1e2f;
}

.toc-card {
  background: transparent;
}

.toc-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--toc-title-color);
}

.light .toc-title {
  --toc-title-color: #0077cc;
}

.dark .toc-title {
  --toc-title-color: #00ff88;
}

.toc-container {
  height: auto; /* 高度自适应 */
  
  overflow-y: auto;
  padding: 8px;
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-item {
  margin: 8px 0;
  padding: 8px 12px;
  border-radius: 8px;
  transition: background 0.2s, transform 0.2s;
  background: var(--toc-item-bg);
}

.toc-item a {
  text-decoration: none;
  color: var(--toc-item-color);
  display: block;
  transition: color 0.2s;
}

.toc-item:hover {
  background: var(--toc-item-hover-bg);
  transform: translateX(4px);
}

.light .toc-item {
 
  --toc-item-color: #333;
  --toc-item-hover-bg: rgba(0, 0, 0, 0.1);
}

.dark .toc-item {

  --toc-item-color: #ddd;
  --toc-item-hover-bg: rgba(255, 255, 255, 0.1);
}

.toc-level-1 {
  font-size: 16px;
  font-weight: bold;
}

.toc-level-2 {
  font-size: 14px;
  padding-left: 12px;
}

.toc-level-3 {
  font-size: 12px;
  padding-left: 24px;
}

.toc-level-4 {
  font-size: 12px;
  padding-left: 36px;
}

/* 左侧目录 */
.toc-sidebar {
  width: 240px;
  flex-shrink: 0;
  position: sticky;
  top: 100px; /* 与头部高度一致 */
  height: 680px;
  overflow-y: auto;
  padding: 16px;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  background: var(--toc-bg-color);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.toc-sidebar::-webkit-scrollbar {
  display: none; /* 隐藏滚动条 */
}

.light .toc-sidebar {
  --toc-bg-color: #ffffff;
}

.dark .toc-sidebar {
  --toc-bg-color: #1e1e2f;
}

.toc-card {
  background: transparent;
}

.toc-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--toc-title-color);
  display: flex;
  align-items: center;
  gap: 8px;
}

.light .toc-title {
  --toc-title-color: #0077cc;
}

.dark .toc-title {
  --toc-title-color: #00ff88;
}

.toc-container {
  height: auto; /* 高度自适应 */
  overflow-y: auto;
  padding: 8px;
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-item {
  margin: 8px 0;
  padding: 8px 12px;
  border-radius: 8px;
  transition: background 0.2s, transform 0.2s;
  background: var(--toc-item-bg);
}

.toc-item a {
  text-decoration: none;
  color: var(--toc-item-color);
  display: flex;
  align-items: center;
  gap: 8px;
  transition: color 0.2s;
}

.toc-item:hover {
  background: var(--toc-item-hover-bg);
  transform: translateX(4px);
}

.light .toc-item {
  --toc-item-color: #333;
  --toc-item-hover-bg: rgba(0, 0, 0, 0.1);
}

.dark .toc-item {
  --toc-item-color: #ddd;
  --toc-item-hover-bg: rgba(255, 255, 255, 0.1);
}

.toc-level-1 {
  font-size: 16px;
  font-weight: bold;
}

.toc-level-2 {
  font-size: 14px;
  padding-left: 12px;
}

.toc-level-3 {
  font-size: 12px;
  padding-left: 24px;
}

.toc-level-4 {
  font-size: 12px;
  padding-left: 36px;
}

/* 图标样式 */
.fas {
  font-size: 14px;
  color: var(--toc-icon-color);
}



.dark .fas {
  --toc-icon-color: #00ff88;
}
</style>