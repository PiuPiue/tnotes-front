<template>
  <div class="newworld">
    <h1>探索新世界</h1>
    <p>发现灵感，记录思考，开启你的创作之旅。</p>

    <!-- 推荐文章 -->
    <div class="section">
      <h2>推荐文章</h2>
      <div class="article-list">
        <div
          v-for="article in articles"
          :key="article.id"
          class="article-card"
          @click="viewArticle(article)"
        >
          <div class="article-image">
            <img :src="article.image" :alt="article.title" />
          </div>
          <div class="article-content">
            <h3>{{ article.title }}</h3>
            <p>{{ article.summary }}</p>
            <div class="article-meta">
              <span>{{ article.author }}</span>
              <span>{{ article.date }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 灵感卡片 -->
    <div class="section">
      <h2>灵感卡片</h2>
      <div class="inspiration-grid">
        <div
          v-for="card in inspirationCards"
          :key="card.id"
          class="inspiration-card"
          @click="saveInspiration(card)"
        >
          <div class="card-content">
            <i :class="card.icon"></i>
            <h3>{{ card.title }}</h3>
            <p>{{ card.description }}</p>
          </div>
          <button class="btn-save">
            <i class="fas fa-bookmark"></i> 保存
          </button>
        </div>
      </div>
    </div>

    <!-- 热门话题 -->
    <div class="section">
      <h2>热门话题</h2>
      <div class="topics-list">
        <div
          v-for="topic in topics"
          :key="topic.id"
          class="topic-item"
          @click="viewTopic(topic)"
        >
          <span class="topic-tag">#{{ topic.tag }}</span>
          <span class="topic-count">{{ topic.count }} 条讨论</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NewWorld',
  data() {
    return {
      articles: [
        {
          id: 1,
          title: '如何提升写作效率？',
          summary: '分享一些提升写作效率的技巧和工具。',
          author: '作者A',
          date: '2023-10-01',
          image: 'https://cdn.pixabay.com/photo/2018/09/03/11/51/pictures-3651039_1280.png',
        },
        {
          id: 2,
          title: '旅行中的灵感记录',
          summary: '如何在旅行中捕捉灵感并记录下来。',
          author: '作者B',
          date: '2023-09-25',
          image: 'https://cdn.pixabay.com/photo/2014/02/02/17/41/photos-256889_1280.jpg',
        },
        {
          id: 3,
          title: 'Vue3 实战技巧',
          summary: 'Vue3 开发中的一些实用技巧和最佳实践。',
          author: '作者C',
          date: '2023-09-20',
          image: 'https://via.placeholder.com/150',
        },
      ],
      inspirationCards: [
        {
          id: 1,
          icon: 'fas fa-lightbulb',
          title: '创意写作',
          description: '激发你的创意，写出独特的故事。',
        },
        {
          id: 2,
          icon: 'fas fa-paint-brush',
          title: '艺术灵感',
          description: '从艺术中汲取灵感，创作出美丽的作品。',
        },
        {
          id: 3,
          icon: 'fas fa-music',
          title: '音乐灵感',
          description: '用音乐激发你的创作灵感。',
        },
      ],
      topics: [
        { id: 1, tag: '写作技巧', count: 123 },
        { id: 2, tag: '旅行灵感', count: 98 },
        { id: 3, tag: '科技趋势', count: 156 },
        { id: 4, tag: '生活哲学', count: 87 },
      ],
    };
  },
  methods: {
    viewArticle(article) {
      alert(`查看文章: ${article.title}`);
    },
    saveInspiration(card) {
      alert(`保存灵感: ${card.title}`);
    },
    viewTopic(topic) {
      alert(`查看话题: #${topic.tag}`);
    },
  },
};
</script>

<style scoped>
.newworld {
  padding: 20px;
  max-width: 800px; /* 与 Notes 模块保持一致 */
  margin: 0 auto;
}

h1 {
  font-size: 24px;
  color: #333;
  text-align: center;
  margin-bottom: 10px;
}

p {
  font-size: 16px;
  color: #666;
  text-align: center;
  margin-bottom: 30px;
}

.section {
  margin-bottom: 30px;
}

h2 {
  font-size: 20px;
  color: #333;
  margin-bottom: 15px;
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.article-card {
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.article-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.article-image img {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.article-content {
  padding: 15px;
}

.article-content h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 10px;
}

.article-content p {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #999;
}

.inspiration-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.inspiration-card {
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.inspiration-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.inspiration-card i {
  font-size: 24px;
  color: #1e90ff;
  margin-bottom: 10px;
}

.inspiration-card h3 {
  font-size: 16px;
  color: #333;
  margin-bottom: 10px;
}

.inspiration-card p {
  font-size: 14px;
  color: #666;
  margin-bottom: 15px;
}

.btn-save {
  padding: 8px 16px;
  background-color: #1e90ff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.btn-save:hover {
  background-color: #0077cc;
}

.topics-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.topic-item {
  background-color: #f5f7fa;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.topic-item:hover {
  background-color: #e0e0e0;
}

.topic-tag {
  font-size: 14px;
  color: #333;
}

.topic-count {
  font-size: 12px;
  color: #666;
  margin-left: 8px;
}
</style>