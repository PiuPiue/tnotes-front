<template>
    <div class="welcome-container">
      <!-- 动态背景 -->
      <div class="background-animation"></div>
      <div class="particles-background"></div>
  
      <!-- 欢迎标题和介绍 -->
      <div class="welcome-header">
        <h1>欢迎来到 t-notes</h1>
        <p>一个集笔记与云存储于一体的高效工具，帮助你随时随地记录灵感、管理文件。</p>
      </div>
  
      <!-- 功能卡片 -->
      <div class="feature-cards">
        <div class="feature-card" @click="navigateToNotes">
          <div class="feature-icon">
            <i class="fas fa-book"></i>
          </div>
          <h2>笔记管理</h2>
          <p>创建、编辑和管理你的笔记，随时随地记录灵感。</p>
          <div class="feature-badge">协作支持</div>
        </div>
        <div class="feature-card" @click="navigateToCloud">
          <div class="feature-icon">
            <i class="fas fa-cloud"></i>
          </div>
          <h2>云存储</h2>
          <p>安全存储和共享你的文件，随时随地访问。</p>
        </div>
        <div class="feature-card" @click="navigateToAI">
          <div class="feature-icon">
            <i class="fas fa-robot"></i>
          </div>
          <h2>AI 助手</h2>
          <p>使用 AI 助手提升你的工作效率，智能生成内容。</p>
        </div>
      </div>
  
  
  
      <!-- 快速开始按钮 -->
      <div class="quick-start">
        <button class="start-button" @click="navigateToQuickStart">
          <i class="fas fa-rocket"></i>
          <span>快速开始</span>
        </button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'WelcomePage',
    methods: {
      navigateToNotes() {
        this.$router.push('/home/mine');
      },
      navigateToCloud() {
        this.$router.push('/home/cloud/index');
      },
      navigateToAI() {
        this.$router.push('/home/mine');
      },
      navigateToQuickStart() {
        this.$router.push('/home/quickstart');
      },
    },
  };
  </script>
  
  <style scoped>
  .welcome-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background: linear-gradient(to bottom right, #f0f4ff, #ffffff);
    padding: 20px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  
  .background-animation {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, #6366f1, #4f46e5, #8b5cf6);
    z-index: 0;
    opacity: 0.1;
    animation: gradientAnimation 10s ease infinite;
  }
  
  @keyframes gradientAnimation {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }
  
  .particles-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url('https://www.example.com/particles-background.png') no-repeat center center;
    background-size: cover;
    z-index: 0;
    opacity: 0.2;
  }
  
  .welcome-header {
    margin-bottom: 40px;
    position: relative;
    z-index: 1;
  }
  
  .welcome-header h1 {
    font-size: 3rem;
    font-weight: 700;
    color: #6366f1;
    margin-bottom: 16px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .welcome-header p {
    font-size: 1.2rem;
    color: #4b5563;
    max-width: 600px;
    margin: 0 auto;
  }
  
  .feature-cards {
    display: flex;
    justify-content: center;
    gap: 30px;
    margin-bottom: 40px;
    position: relative;
    z-index: 1;
  }
  
  .feature-card {
    background: white;
    border-radius: 12px;
    padding: 24px;
    width: 300px;
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    position: relative;
    overflow: hidden;
  }
  
  .feature-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, #6366f1, #4f46e5);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
  }
  
  .feature-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
  
  .feature-card:hover::before {
    opacity: 0.1;
  }
  
  .feature-icon {
    font-size: 2.5rem;
    color: #6366f1;
    margin-bottom: 16px;
  }
  
  .feature-card h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 8px;
  }
  
  .feature-card p {
    font-size: 1rem;
    color: #6b7280;
  }
  
  .feature-badge {
    position: absolute;
    top: 10px;
    right: 10px;
    background: #6366f1;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.8rem;
  }
  
  .user-testimonials {
    margin-top: 60px;
    position: relative;
    z-index: 1;
  }
  
  .user-testimonials h2 {
    font-size: 2rem;
    color: #6366f1;
    margin-bottom: 20px;
  }
  
  .testimonial-cards {
    display: flex;
    justify-content: center;
    gap: 30px;
  }
  
  .testimonial-card {
    background: white;
    border-radius: 12px;
    padding: 24px;
    width: 300px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .testimonial-card p {
    font-size: 1rem;
    color: #6b7280;
    margin-bottom: 8px;
  }
  
  .testimonial-card span {
    font-size: 0.9rem;
    color: #6366f1;
  }
  
  .quick-start {
    margin-top: 40px;
    position: relative;
    z-index: 1;
  }
  
  .start-button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    background: #6366f1;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1.1rem;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.3s ease;
  }
  
  .start-button:hover {
    background: #4f46e5;
    transform: scale(1.05);
  }
  
  .start-button i {
    font-size: 1.2rem;
  }
  </style>