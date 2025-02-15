<template>
    <div class="page-container">
      <div class="content">
        <div class="image-container">
          <img
            src="https://ai-public.mastergo.com/ai/img_res/fc02f145a5a7e214cc596eaf538b2f81.jpg"
            alt="404 插画"
            class="image"
          />
        </div>
  
        <h1 class="title">哎呀，页面找不到了~</h1>
        <h2 class="subtitle">404 - Page Not Found</h2>
        <p class="description">您访问的页面可能已被移除、删除或暂时无法访问</p>
  
        <div class="button-container">
          <button class="btn-primary" @click="goHome">返回首页</button>
          <button class="btn-secondary" @click="goBack">返回上一页</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    methods: {
      goHome() {
        window.location.href = '/';
      },
      goBack() {
        window.history.back();
      },
    },
  };
  </script>
  
  <style scoped>
  /* 引入Google Fonts */
  @import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');
  /* 引入Font Awesome */
  @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
  
  /* 全局样式 */
  body {
    height: 100vh;
    background-color: #f9fafb;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    font-family: Arial, sans-serif;
  }
  
  .page-container {
    width: 95%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0 32px;
  }
  
  .content {
    width: 100%;
    
    text-align: center;
  }
  
  .image-container {
    margin-bottom: 48px;
  }
  
  .image {
    width: 400px;
    height: 400px;
    margin: 0 auto;
    object-fit: cover;
  }
  
  .title {
    font-size: 36px;
    font-weight: bold;
    color: #1a1a1a;
    margin-bottom: 16px;
  }
  
  .subtitle {
    font-size: 24px;
    color: #6366f1;
    margin-bottom: 24px;
  }
  
  .description {
    font-size: 18px;
    color: #666;
    margin-bottom: 48px;
  }
  
  .button-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
  }
  
  .btn-primary,
  .btn-secondary {
    padding: 12px 32px;
    font-size: 16px;
    font-weight: 500;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;
  }
  
  .btn-primary {
    background-color: #6366f1;
    color: #fff;
    border: none;
  }
  
  .btn-primary:hover {
    background-color: #818cf8;
    transform: scale(1.05);
  }
  
  .btn-secondary {
    background-color: transparent;
    color: #6366f1;
    border: 2px solid #6366f1;
  }
  
  .btn-secondary:hover {
    background-color: #6366f1;
    color: #fff;
    transform: scale(1.05);
  }
  </style>