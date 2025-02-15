<template>
  <div class="essays-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h5>随笔</h5>
      <button class="create-essay-btn" @click="createEssay()">
        <i class="fas fa-plus"></i> 新建随笔
      </button>
    </div>

    <!-- 随笔展示 -->
    <div class="timeline">
      <div class="timeline-content">
        <div
          class="essay"
          v-for="(essay, index) in essays"
          :key="index"
          @click="viewEssay(essay)"
          @mouseenter="hoverEssay = index"
          @mouseleave="hoverEssay = null"
        >
          <div class="timeline-dot-wrapper">
            <div class="timeline-dot"></div>
            <p class="essay-create-time">创建于：{{ essay.createTime }}</p>
          </div>
          <div class="essay-content">
            <p class="essay-title">{{ essay.title }}</p>
            <p class="essay-description">
              {{ essay.content.length > 200 ? essay.content.slice(0, 200) + '...' : essay.content }}
            </p>
            <p class="essay-update-time">更新于：{{ formatDate(essay.updateTime) }}</p>
          </div>
          <button
            v-if="hoverEssay === index"
            class="delete-btn"
            @click="deleteEssay(index)"
          >
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getEssays, deleteEssay } from '../../utils/api.js'; // 添加 deleteEssay 函数
export default {
  name: 'EssaysPage',
  data() {
    return {
      essays: [],
      hoverEssay: null, // 记录当前悬停的随笔索引
    };
  },
  methods: {
    createEssay() {
      this.$router.push({ name: 'EssayEditor' });
    },
    async deleteEssay(index) {
      const essayId = this.essays[index].id; // 获取随笔ID
      const res = await deleteEssay(essayId); // 调用删除接口
      if (res.data.code === 200) {
        
        this.essays.splice(index, 1); // 删除本地数组中的随笔
      } else {
        this.$message.error('删除失败');
      }
    },
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

  viewEssay(essay){
    this.$router.push({ name: 'EssayEditor', params: { essayId: essay.id } });
  }
    
  },
  async mounted() {
    const res2 = await getEssays();
    this.essays = res2.data.data;
  },
};
</script>

<style scoped>
.essays-page {
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  padding: 20px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 10px;
}

.timeline {
  position: relative;
  width: 100%;
  max-width: 80%;
  border-left: 2px solid #6366f1; /* 时间线的线条 */
  padding-left: 30px;
}

.timeline-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.essay {
  display: flex;
  align-items: center;
  gap: 20px;
  position: relative;
  width: 100%;
  transition: transform 0.3s ease;
}

.essay:hover {
  transform: scale(1.05); /* 鼠标悬停时添加动画效果 */
}

.timeline-dot-wrapper {
  display: flex;
  align-items: center;
  position: absolute;
  left: -20px; /* 点离开卡片一定的间距 */
}

.timeline-dot {
  width: 12px;
  height: 12px;
  background-color: #6366f1;
  border-radius: 50%;
}

.essay-create-time {
  font-size: 12px;
  color: #a1a1a1;
  margin-left: 10px; /* 点与时间之间的间距 */
}

.essay-content {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f8f9ff;
  width: 100%;
  position: relative;
}

.essay-title {
  font-family: Roboto;
  font-size: 18px;
  font-weight: 500;
  line-height: 28px;
  color: #111827;
}

.essay-description {
  font-family: Roboto;
  font-size: 16px;
  font-weight: normal;
  line-height: 26px;
  color: #4b5563;
}

.essay-update-time {
  font-size: 12px;
  color: #a1a1a1;
  margin-top: 10px;
}

.create-essay-btn {
  display: flex;
  align-items: center;
  margin-top: 20px;
  margin-right: 180px;
  background-color: #4f46e5;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
  height: 40px;
  font-size: 0.875rem;
}

.delete-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: #f44336;
  cursor: pointer;
  font-size: 18px;
  transition: transform 0.2s ease;
}

.delete-btn:hover {
  transform: scale(1.1); /* 删除按钮悬停时的放大效果 */
}
</style>
