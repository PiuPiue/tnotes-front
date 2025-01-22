<template>
  <div class="notes-index">
    <!-- 首页 -->
    <div class="welcome-section">
      <h1>欢迎使用 T-Notes</h1>
      <p>记录你的灵感与思考</p>
    </div>

    <!-- 笔记本列表 -->
    <div class="section">
      <div class="section-header" @click="toggleSection('notebooks')">
        <i class="fas fa-book"></i>
        <span>笔记本</span>
        <i class="fas fa-chevron-down" v-if="!sections.notebooks"></i>
        <i class="fas fa-chevron-up" v-else></i>
      </div>
      <transition name="slide">
        <div v-if="sections.notebooks" class="section-content">
          <div
            v-for="notebook in notebooks"
            :key="notebook.id"
            class="item"
            @click="selectNotebook(notebook)"
          >
            <i class="fas fa-book-open"></i>
            <span>{{ notebook.name }}</span>
            <div class="item-actions">
              <button @click.stop="addNote(notebook)" class="btn-icon">
                <i class="fas fa-plus"></i>
              </button>
              <button @click.stop="deleteNotebook(notebook.id)" class="btn-icon">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
          <button @click="createNotebook" class="btn-add">
            <i class="fas fa-plus"></i> 新建笔记本
          </button>
        </div>
      </transition>
    </div>

    <!-- 随笔列表 -->
    <div class="section">
      <div class="section-header" @click="toggleSection('essays')">
        <i class="fas fa-pen"></i>
        <span>随笔</span>
        <i class="fas fa-chevron-down" v-if="!sections.essays"></i>
        <i class="fas fa-chevron-up" v-else></i>
      </div>
      <transition name="slide">
        <div v-if="sections.essays" class="section-content">
          <div
            v-for="essay in essays"
            :key="essay.id"
            class="item"
            @click="selectEssay(essay)"
          >
            <i class="fas fa-file-alt"></i>
            <span>{{ essay.title }}</span>
            <button @click.stop="deleteEssay(essay.id)" class="btn-icon">
              <i class="fas fa-trash"></i>
            </button>
          </div>
          <button @click="createEssay" class="btn-add">
            <i class="fas fa-plus"></i> 新建随笔
          </button>
        </div>
      </transition>
    </div>

    <!-- 我的收藏 -->
    <div class="section">
      <div class="section-header" @click="toggleSection('favorites')">
        <i class="fas fa-star"></i>
        <span>我的收藏</span>
        <i class="fas fa-chevron-down" v-if="!sections.favorites"></i>
        <i class="fas fa-chevron-up" v-else></i>
      </div>
      <transition name="slide">
        <div v-if="sections.favorites" class="section-content">
          <div
            v-for="favorite in favorites"
            :key="favorite.id"
            class="item"
            @click="selectFavorite(favorite)"
          >
            <i class="fas fa-bookmark"></i>
            <span>{{ favorite.title }}</span>
            <button @click.stop="deleteFavorite(favorite.id)" class="btn-icon">
              <i class="fas fa-trash"></i>
            </button>
          </div>
          <button @click="addFavorite" class="btn-add">
            <i class="fas fa-plus"></i> 添加收藏
          </button>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotesIndex',
  data() {
    return {
      sections: {
        notebooks: false, // 笔记本是否展开
        essays: false, // 随笔是否展开
        favorites: false, // 收藏是否展开
      },
      notebooks: [
        {
          id: 1,
          name: '工作笔记',
          notes: [
            { id: 1, title: '项目计划' },
            { id: 2, title: '会议记录' },
          ],
        },
        {
          id: 2,
          name: '学习笔记',
          notes: [
            { id: 3, title: 'Vue3 学习笔记' },
            { id: 4, title: 'Python 进阶' },
          ],
        },
      ],
      essays: [
        {
          id: 1,
          title: '秋天的怀念',
          content: '一篇关于秋天的随笔，记录了对季节变化的感悟。',
        },
        {
          id: 2,
          title: '旅行的意义',
          content: '探讨旅行对人生的意义和影响。',
        },
      ],
      favorites: [
        {
          id: 1,
          title: '重要笔记',
          type: 'notebook',
          targetId: 1,
        },
        {
          id: 2,
          title: '灵感随笔',
          type: 'essay',
          targetId: 2,
        },
      ],
    };
  },
  methods: {
    // 切换部分展开状态
    toggleSection(section) {
      this.sections[section] = !this.sections[section];
    },

    // 笔记本操作
    selectNotebook(notebook) {
      alert(`选中笔记本: ${notebook.name}`);
    },
    createNotebook() {
      const name = prompt('请输入笔记本名称');
      if (name) {
        this.notebooks.push({
          id: this.notebooks.length + 1,
          name,
          notes: [],
        });
      }
    },
    addNote(notebook) {
      const title = prompt('请输入笔记标题');
      if (title) {
        notebook.notes.push({
          id: notebook.notes.length + 1,
          title,
        });
      }
    },
    deleteNotebook(notebookId) {
      this.notebooks = this.notebooks.filter((nb) => nb.id !== notebookId);
    },

    // 随笔操作
    selectEssay(essay) {
      alert(`选中随笔: ${essay.title}`);
    },
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
    deleteEssay(essayId) {
      this.essays = this.essays.filter((essay) => essay.id !== essayId);
    },

    // 收藏操作
    selectFavorite(favorite) {
      alert(`选中收藏: ${favorite.title}`);
    },
    addFavorite() {
      const title = prompt('请输入收藏标题');
      if (title) {
        this.favorites.push({
          id: this.favorites.length + 1,
          title,
          type: 'custom',
          targetId: null,
        });
      }
    },
    deleteFavorite(favoriteId) {
      this.favorites = this.favorites.filter((fav) => fav.id !== favoriteId);
    },
  },
};
</script>

<style scoped>
.notes-index {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.welcome-section {
  text-align: center;
  margin-bottom: 30px;
}

.welcome-section h1 {
  font-size: 24px;
  color: #333;
}

.welcome-section p {
  font-size: 16px;
  color: #666;
}

.section {
  margin-bottom: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
  background-color: #f8f9fa;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.section-header:hover {
  background-color: #e0e0e0;
}

.section-header i {
  font-size: 18px;
  color: #1e90ff;
}

.section-header span {
  flex: 1;
  font-size: 16px;
  font-weight: 500;
}

.section-content {
  padding: 10px;
  background-color: #ffffff;
}

.item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  border-radius: 5px;
}

.item:hover {
  background-color: #f5f7fa;
}

.item i {
  font-size: 16px;
  color: #1e90ff;
}

.item span {
  flex: 1;
  font-size: 14px;
}

.item-actions {
  display: flex;
  gap: 8px;
}

.btn-icon {
  background: none;
  border: none;
  color: #1e90ff;
  cursor: pointer;
}

.btn-add {
  width: 100%;
  padding: 10px;
  background-color: #1e90ff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  font-size: 14px;
}

.btn-add:hover {
  background-color: #0077cc;
}

/* 展开收起动画 */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s ease;
  max-height: 500px; /* 根据内容调整 */
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>