<template>
    <div class="app">
      <!-- 顶部导航 -->
  
      <!-- 主体内容 -->
      <main class="main">
        <!-- 分类导航 -->
        <div class="category-nav">
          <a href="#" class="category-link active">文章</a>
          <a href="#" class="category-link">专栏</a>
          <a href="#" class="category-link">云资源</a>
        </div>
  
        <!-- 文章列表 -->
        <div class="article-grid">
          <div v-for="article in articles" :key="article.id" class="article-card">
            <div class="article-cover">
              <img :src="article.cover" :alt="article.title" />
              <div class="cover-overlay">
                <span>阅读全文</span>
              </div>
            </div>
            <div class="article-content">
              <div class="article-tags">
                <span class="tag">{{ article.category }}</span>
                <span class="tag">{{ article.readTime }}</span>
              </div>
              <h3 class="article-title">{{ article.title }}</h3>
              <p class="article-description">{{ article.description }}</p>
              <div class="article-footer">
                <div class="author-info">
                  <img :src="article.authorAvatar" :alt="article.author" />
                  <span>{{ article.author }}</span>
                </div>
                <div class="article-stats">
                  <span><i class="fas fa-eye"></i>{{ article.views }}</span>
                  <span><i class="fas fa-comment"></i>{{ article.comments }}</span>
                  <span><i class="fas fa-heart"></i>{{ article.likes }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- 推荐专栏 -->
        <div class="section">
          <h2>推荐专栏</h2>
          <div class="column-grid">
            <div v-for="column in columns" :key="column.id" class="column-card">
              <img :src="column.cover" :alt="column.title" />
              <div class="column-content">
                <h3>{{ column.title }}</h3>
                <p>{{ column.description }}</p>
                <div class="column-footer">
                  <div class="author-info">
                    <img :src="column.authorAvatar" :alt="column.author" />
                    <span>{{ column.author }}</span>
                  </div>
                  <button class="subscribe-button">订阅专栏</button>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- 精选主题 -->
        <div class="section">
          <div class="section-header">
            <h2>精选主题</h2>
            <button class="view-all-button">
              <i class="fas fa-th-large"></i>
              查看全部
            </button>
          </div>
          <div class="topic-grid">
            <div v-for="topic in topics" :key="topic.id" class="topic-card">
              <div class="topic-cover">
                <img :src="topic.cover" :alt="topic.title" />
              </div>
              <h3>{{ topic.title }}</h3>
              <p>{{ topic.description }}</p>
              <div class="topic-stats">
                <span>{{ topic.articleCount }}篇文章</span>
                <span>{{ topic.followers }}关注</span>
              </div>
            </div>
          </div>
        </div>
  
        <!-- AI 助手 -->
        <div class="section">
          <h2>AI 助手</h2>
          <div class="ai-assistant">
            <div class="ai-content">
              <h3>AI 设计助手</h3>
              <p>让 AI 为你的设计工作提供智能支持，从创意发想到设计优化，提升设计效率。</p>
              <div class="ai-actions">
                <button class="ai-button primary">开始对话</button>
                <button class="ai-button secondary">查看示例</button>
              </div>
            </div>
            <div class="ai-image">
              <img src="https://ai-public.mastergo.com/ai/img_res/c7cd3fa7b7dfaaa8aeeff8a228dd9345.jpg" alt="AI 助手" />
            </div>
          </div>
          <div class="ai-features">
            <div class="ai-feature">
              <div class="icon">
                <i class="fas fa-magic"></i>
              </div>
              <h4>智能排版</h4>
              <p>自动优化文档布局，生成专业排版效果</p>
              <div class="ai-link">
                <span>立即使用</span>
                <i class="fas fa-arrow-right"></i>
              </div>
            </div>
            <div class="ai-feature">
              <div class="icon">
                <i class="fas fa-paint-brush"></i>
              </div>
              <h4>智能配色</h4>
              <p>一键生成专业配色方案，提供设计灵感</p>
              <div class="ai-link">
                <span>立即使用</span>
                <i class="fas fa-arrow-right"></i>
              </div>
            </div>
            <div class="ai-feature">
              <div class="icon">
                <i class="fas fa-robot"></i>
              </div>
              <h4>代码生成</h4>
              <p>自动将设计转换为代码，提升开发效率</p>
              <div class="ai-link">
                <span>立即使用</span>
                <i class="fas fa-arrow-right"></i>
              </div>
            </div>
          </div>
        </div>
  
        <!-- 快速访问 -->
        <div class="section">
          <h2>快速访问</h2>
          <div class="shortcut-grid">
            <div v-for="shortcut in shortcuts" :key="shortcut.id" class="shortcut-card">
              <div class="shortcut-cover">
                <img :src="shortcut.cover" :alt="shortcut.name" />
              </div>
              <h3>{{ shortcut.name }}</h3>
              <p>{{ shortcut.count }}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  </template>

<script>
export default {
  name: 'App',
  data() {
    return {
      articles: [
        {
          id: 1,
          title: '设计系统的构建：从理论到实践 - 打造一致性的用户体验',
          description: '本文详细介绍了如何构建一个完整的设计系统，包括组件库的规划、设计token的制定、团队协作流程的建立等关键环节。',
          cover: 'https://ai-public.mastergo.com/ai/img_res/414213f5764e0cf73b2bbc194ca2c977.jpg',
          author: 'Sarah Anderson',
          authorAvatar: 'https://ai-public.mastergo.com/ai/img_res/6d496df4037302d5704649979600355a.jpg',
          views: '2,456',
          likes: '386',
          comments: '128',
          category: '设计系统',
          readTime: '15 分钟'
        },{
id: 2,
title: '数据可视化的艺术：如何让数据讲故事',
description: '探索数据可视化的最佳实践，从数据分析到视觉呈现，帮助你创造既美观又有洞察力的数据故事。',
cover: 'https://ai-public.mastergo.com/ai/img_res/2c531103a1e54a745eaedd608cf598be.jpg',
author: 'Michael Chen',
authorAvatar: 'https://ai-public.mastergo.com/ai/img_res/3b30273c3450b099d15cc703e746a2c5.jpg',
views: '1,829',
likes: '275',
comments: '95',
category: '数据分析',
readTime: '12 分钟'
},
{
id: 3,
title: '用户研究方法论：从访谈到洞察',
description: '深入探讨用户研究的方法论，包括如何设计访谈问题、进行用户观察、分析数据并转化为可行的产品策略。',
cover: 'https://ai-public.mastergo.com/ai/img_res/97569b711503b702704eead9116ee1af.jpg',
author: 'Emily Watson',
authorAvatar: 'https://ai-public.mastergo.com/ai/img_res/da0a94583ef1dbaa755622232ca5f919.jpg',
views: '3,142',
likes: '492',
comments: '156',
category: '用户研究',
readTime: '18 分钟'
},
{
id: 4,
title: 'AI 驱动的产品设计：未来设计师的必备技能',
description: '探讨人工智能如何改变产品设计流程，以及设计师如何利用AI工具提升工作效率和创新能力。',
cover: 'https://ai-public.mastergo.com/ai/img_res/5fd57237629a7a014815e4fe96848e23.jpg',
author: 'Alex Turner',
authorAvatar: 'https://ai-public.mastergo.com/ai/img_res/c3b01fb8416d94f9780d76d03f9260c0.jpg',
views: '4,567',
likes: '689',
comments: '234',
category: 'AI 设计',
readTime: '20 分钟'
},
{
id: 5,
title: '设计心理学：情感化设计的艺术',
description: '深入探讨如何运用心理学原理在产品设计中创造情感共鸣，提升用户体验和产品粘性。',
cover: 'https://ai-public.mastergo.com/ai/img_res/bc3226f01817d3c7d78426362ca0a393.jpg',
author: 'Rachel Martinez',
authorAvatar: 'https://ai-public.mastergo.com/ai/img_res/2e962199dc0d1d930b3dfd2867298c5e.jpg',
views: '2,890',
likes: '437',
comments: '167',
category: '设计心理学',
readTime: '16 分钟'
},
{
id: 6,
title: '移动端微交互设计：提升用户体验的细节',
description: '探索移动应用中微交互设计的最佳实践，如何通过细节设计提升用户体验和产品质感。',
cover: 'https://ai-public.mastergo.com/ai/img_res/faf8120bad2a41976d1834b9ebf62c8d.jpg',
author: 'Daniel Kim',
authorAvatar: 'https://ai-public.mastergo.com/ai/img_res/923a5ae8aa8652d5e04d8861e3a15575.jpg',
views: '3,245',
likes: '521',
comments: '183',
category: '交互设计',
readTime: '14 分钟'
}
        // 其他文章数据...
      ],
      topics: [
        {
          id: 1,
          title: '交互设计前沿',
          description: '探索最新的交互设计趋势和创新实践',
          cover: 'https://ai-public.mastergo.com/ai/img_res/a7dc341fd384a05de1681d53af050651.jpg',
          articleCount: '56',
          followers: '2.3k'
        },
        // 其他主题数据...
      ],
      columns: [
        {
          id: 1,
          title: '产品设计进阶指南',
          description: '从入门到精通，全方位提升产品设计能力。涵盖用户研究、交互设计、视觉设计、设计系统构建等核心主题，帮助你成为一名优秀的产品设计师。',
          cover: 'https://ai-public.mastergo.com/ai/img_res/031abf163a940af65041e0636f0c8205.jpg',
          author: 'David Zhang',
          authorAvatar: 'https://ai-public.mastergo.com/ai/img_res/ca46435a9cfa524a1177752cda4b3f15.jpg'
        },
        // 其他专栏数据...
      ],
      shortcuts: [
        {
          id: 1,
          name: '设计资源',
          count: '125 个文件',
          cover: 'https://ai-public.mastergo.com/ai/img_res/092cd0bf35a197e96cb1ff093ad805f3.jpg'
        },
        // 其他快速访问数据...
      ]
    };
  }
};
</script>

<style scoped>
/* 全局样式 */
.app {
  min-height: 100vh;
  background: linear-gradient(to bottom right, #f0f4ff, #ffffff);
  font-family: Arial, sans-serif;
}

/* 顶部导航 */
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid #e5e7eb;
  z-index: 50;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo img {
  height: 24px;
  width: 24px;
}

.logo span {
  font-size: 18px;
  font-weight: 500;
  color: #1e293b;
}

.nav-links {
  display: flex;
  gap: 48px;
}

.nav-link {
  color: #4b5563;
  text-decoration: none;
  transition: color 0.3s;
}

.nav-link:hover {
  color: #2563eb;
}

.nav-link.active {
  color: #2563eb;
  font-weight: 500;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-box {
  position: relative;
}

.search-box i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
}

.search-box input {
  width: 192px;
  padding: 8px 8px 8px 32px;
  border-radius: 9999px;
  border: none;
  background: #f3f4f6;
  font-size: 14px;
}

.user-button {
  width: 32px;
  height: 32px;
  border-radius: 9999px;
  background: #2563eb;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

/* 主体内容 */
.main {
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 80px;
  padding-bottom: 48px;
  padding-left: 16px;
  padding-right: 16px;
}

/* 分类导航 */
.category-nav {
  display: flex;
  gap: 32px;
  margin-bottom: 32px;
  border-bottom: 1px solid #e5e7eb;
}

.category-link {
  padding-bottom: 16px;
  color: #4b5563;
  text-decoration: none;
  transition: color 0.3s;
}

.category-link:hover {
  color: #2563eb;
}

.category-link.active {
  color: #2563eb;
  border-bottom: 2px solid #2563eb;
}

/* 文章列表 */
.article-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  margin-bottom: 48px;
}

.article-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s;
  cursor: pointer;
}

.article-card:hover {
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
}

.article-cover {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.article-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.article-card:hover .article-cover img {
  transform: scale(1.05);
}

.cover-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
  padding: 16px;
  color: white;
  opacity: 0;
  transition: opacity 0.3s;
}

.article-card:hover .cover-overlay {
  opacity: 1;
}

.article-content {
  padding: 16px;
}

.article-tags {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.tag {
  padding: 4px 8px;
  background: #f3f4f6;
  border-radius: 9999px;
  font-size: 12px;
  color: #4b5563;
}

.article-title {
  font-size: 18px;
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 8px;
}

.article-description {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 16px;
  line-height: 1.5;
}

.article-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.author-info img {
  width: 24px;
  height: 24px;
  border-radius: 9999px;
}

.author-info span {
  font-size: 14px;
  color: #4b5563;
}

.article-stats {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #6b7280;
}

.article-stats i {
  margin-right: 4px;
}

/* 推荐专栏 */
.section {
  margin-bottom: 48px;
}

.section h2 {
  font-size: 24px;
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 24px;
}

.column-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
}

.column-card {
  display: flex;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s;
  cursor: pointer;
}

.column-card:hover {
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
}

.column-card img {
  width: 200px;
  height: 200px;
  object-fit: cover;
}

.column-content {
  flex: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.column-content h3 {
  font-size: 20px;
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 16px;
}

.column-content p {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 16px;
  line-height: 1.5;
}

.column-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.author-info img {
  width: 24px;
  height: 24px;
  border-radius: 9999px;
}

.author-info span {
  font-size: 14px;
  color: #4b5563;
}

.subscribe-button {
  padding: 8px 16px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.subscribe-button:hover {
  background: #1e4bb5;
}

/* 精选主题 */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.view-all-button {
  padding: 8px 16px;
  background: #f3f4f6;
  color: #4b5563;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.view-all-button:hover {
  background: #e5e7eb;
}

.topic-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.topic-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s;
  cursor: pointer;
}

.topic-card:hover {
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
}

.topic-cover {
  position: relative;
  height: 150px;
  overflow: hidden;
}

.topic-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.topic-card:hover .topic-cover img {
  transform: scale(1.05);
}

.topic-card h3 {
  font-size: 16px;
  font-weight: 500;
  color: #1e293b;
  margin: 16px;
}

.topic-card p {
  font-size: 14px;
  color: #6b7280;
  margin: 0 16px 16px;
  line-height: 1.5;
}

.topic-stats {
  display: flex;
  justify-content: space-between;
  padding: 16px;
  border-top: 1px solid #e5e7eb;
  font-size: 14px;
  color: #6b7280;
}

/* AI 助手 */
.ai-assistant {
  display: flex;
  background: linear-gradient(to right, #2563eb, #4f46e5);
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 32px;
}

.ai-content {
  flex: 1;
  padding: 32px;
  color: white;
}

.ai-content h3 {
  font-size: 28px;
  font-weight: 500;
  margin-bottom: 16px;
}

.ai-content p {
  font-size: 16px;
  margin-bottom: 24px;
  line-height: 1.5;
}

.ai-actions {
  display: flex;
  gap: 16px;
}

.ai-button {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.ai-button.primary {
  background: white;
  color: #2563eb;
}

.ai-button.primary:hover {
  background: #f3f4f6;
}

.ai-button.secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.ai-button.secondary:hover {
  background: rgba(255, 255, 255, 0.2);
}

.ai-image {
  width: 320px;
  height: 320px;
  position: relative;
}

.ai-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ai-image::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to top, rgba(37, 99, 235, 0.2), transparent);
}

.ai-features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.ai-feature {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s;
  cursor: pointer;
}

.ai-feature:hover {
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
}

.ai-feature .icon {
  width: 48px;
  height: 48px;
  border-radius: 9999px;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.ai-feature .icon i {
  font-size: 20px;
  color: #2563eb;
}

.ai-feature h4 {
  font-size: 18px;
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 8px;
}

.ai-feature p {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 16px;
  line-height: 1.5;
}

.ai-link {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #2563eb;
  cursor: pointer;
}

.ai-link i {
  font-size: 12px;
}

/* 快速访问 */
.shortcut-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
}

.shortcut-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s;
  cursor: pointer;
}

.shortcut-card:hover {
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
}

.shortcut-cover {
  position: relative;
  padding-bottom: 66.666667%;
  margin-bottom: 12px;
}

.shortcut-cover img {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.shortcut-card h3 {
  font-size: 16px;
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 4px;
}

.shortcut-card p {
  font-size: 14px;
  color: #6b7280;
}
</style>