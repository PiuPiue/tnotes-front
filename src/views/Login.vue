<template>
    <div class="auth-container">
      <div class="auth-box">
        <!-- 顶部图片和网站名称 -->
        <div class="auth-header">
          <img src="../assets/images/生成网站图标.png" alt="Logo" class="logo" />
          <span class="site-name">T-Notes</span>
        </div>
  
        <!-- 切换按钮 -->
        <div class="auth-switch">
          <button
            :class="['switch-button', { active: isLogin }]"
            @click="switchToLogin"
          >
            登录
          </button>
          <button
            :class="['switch-button', { active: !isLogin }]"
            @click="switchToRegister"
          >
            注册
          </button>
        </div>
  
        <!-- 登录表单 -->
        <transition name="fade" mode="out-in">
          <form v-if="isLogin" @submit.prevent="handleLogin" class="auth-form" key="login">
            <div class="form-group">
              <input
                type="text"
                v-model="loginForm.name"
                placeholder="用户名或邮箱"
                required
              />
            </div>
            <div class="form-group">
              <input
                type="password"
                v-model="loginForm.password"
                placeholder="密码"
                required
              />
            </div>
            <button type="submit" class="auth-button">登录</button>
          </form>
  
          <!-- 注册表单 -->
          <form v-else @submit.prevent="handleRegister" class="auth-form" key="register">
            <div class="form-group">
              <input
                type="text"
                v-model="registerForm.username"
                placeholder="用户名"
                required
              />
            </div>
            <div class="form-group">
              <input
                type="email"
                v-model="registerForm.email"
                placeholder="邮箱"
                required
              />
            </div>
            <div class="form-group">
              <input
                type="password"
                v-model="registerForm.password"
                placeholder="密码"
                required
              />
            </div>
            <div class="form-group code-group">
              <input
                type="text"
                v-model="registerForm.code"
                placeholder="验证码"
                required
              />
              <button
                type="button"
                class="code-button"
                @click="sendCode"
                :disabled="isCodeSent"
              >
                {{ isCodeSent ? `${countdown}秒后重试` : '获取验证码' }}
              </button>
            </div>
            <button type="submit" class="auth-button">注册</button>
          </form>
        </transition>
      </div>
    </div>
  </template>
  
  <script>
  import { login } from '@/utils/api';
  export default {
    name: 'AuthIndex',
    data() {
      return {
        isLogin: false, // 当前是登录还是注册
        loginForm: {
          name: '',
          password: ''
        },
        registerForm: {
          username: '',
          email: '',
          password: '',
          code: ''
        },
        isCodeSent: false, // 是否已发送验证码
        countdown: 60 // 验证码倒计时
      };
    },
    methods: {
      // 切换到登录
      switchToLogin() {
        this.isLogin = true;
      },
      // 切换到注册
      switchToRegister() {
        this.isLogin = false;
      },
      // 处理登录
      async handleLogin() {
        if (!this.validateLoginForm()) return;
  
        try {
          const response = await login(this.loginForm)
          if (response.data.code == 200) {
            this.$message.success('登录成功');
            localStorage.setItem('Authorization', response.data.data.token);
            localStorage.setItem('userInfo', JSON.stringify(response.data.data));
            this.$router.push('/home/newworld'); // 跳转到首页
          } else {
            this.$message.error('登录失败：' + response.data.message);
          }
        } catch (error) {
            console.log(error);
        }
      },
      // 处理注册
      async handleRegister() {
        if (!this.validateRegisterForm()) return;
  
        try {
          const response = await this.$http.post('/api/register', this.registerForm);
          if (response.data.success) {
            this.$message('注册成功');
            this.switchToLogin(); // 注册成功后切换到登录
          } else {
            alert('注册失败：' + response.data.message);
          }
        } catch (error) {
          alert('注册失败：' + error.message);
        }
      },
      // 发送验证码
      async sendCode() {
        if (!this.validateEmail()) {
          alert('请输入有效的邮箱地址');
          return;
        }
  
        try {
          const response = await this.$http.post('/api/send-code', {
            email: this.registerForm.email
          });
          if (response.data.success) {
            this.isCodeSent = true;
            this.startCountdown();
            alert('验证码已发送');
          } else {
            alert('发送验证码失败：' + response.data.message);
          }
        } catch (error) {
          alert('发送验证码失败：' + error.message);
        }
      },
      // 开始倒计时
      startCountdown() {
        const timer = setInterval(() => {
          this.countdown--;
          if (this.countdown === 0) {
            clearInterval(timer);
            this.isCodeSent = false;
            this.countdown = 60;
          }
        }, 1000);
      },
      // 验证登录表单
      validateLoginForm() {
        if (!this.loginForm.name || !this.loginForm.password) {
          alert('请输入用户名和密码');
          return false;
        }
        return true;
      },
      // 验证注册表单
      validateRegisterForm() {
        if (!this.registerForm.username || !this.registerForm.email || !this.registerForm.password || !this.registerForm.code) {
          alert('请填写所有字段');
          return false;
        }
        if (!this.validateEmail()) {
          alert('请输入有效的邮箱地址');
          return false;
        }
        return true;
      },
      // 验证邮箱格式
      validateEmail() {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(this.registerForm.email);
      }
    }
  };
  </script>
  
  <style scoped>
  .auth-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f5f7fa;
  }
  
  .auth-box {
    background-color: #fff;
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    width: 400px;
    text-align: center;
    transition: all 0.3s ease;
  }
  
  /* 顶部图片和网站名称 */
  .auth-header {
   
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction:row;
    margin-bottom: 20px;
  }
  
  .logo {
    width: 100px;
    height: 100px;
    margin-right: 10px;
  }
  
  .site-name {
    /* 字体斜体 */
    font-style: italic;
    font-size: 30px;
    font-weight: bold;
    color: #1E90FF;
  }
  
  .auth-switch {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }
  
  .switch-button {
    padding: 10px 20px;
    border: none;
    background-color: transparent;
    font-size: 16px;
    cursor: pointer;
    color: #666;
    transition: all 0.3s ease;
  }
  
  .switch-button.active {
    color: #1E90FF;
    border-bottom: 2px solid #1E90FF;
  }
  
  .auth-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  input {
    width: 100%;
    padding: 12px;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    font-size: 14px;
    outline: none;
    transition: border-color 0.3s ease;
  }
  
  input:focus {
    border-color: #1E90FF;
  }
  
  .code-group {
    display: flex;
    gap: 10px;
  }
  
  .code-button {
    padding: 10px 15px;
    background-color: #1E90FF;
    color: #fff;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    flex-shrink: 0;
    transition: background-color 0.3s ease;
  }
  
  .code-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  
  .auth-button {
    width: 100%;
    padding: 12px;
    background-color: #1E90FF;
    color: #fff;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .auth-button:hover {
    background-color: #0077cc;
  }
  
  /* 动画效果 */
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
  }
  
  .fade-enter, .fade-leave-to {
    opacity: 0;
    transform: translateY(-10px);
  }
  </style>