<template>
    <div class="profile-container">
      <!-- 个人信息部分 -->
      <div class="profile-card">
        <div class="profile-header">
          <div class="avatar-container">
            <el-avatar :size="96" :src="profile.avatar" class="avatar"></el-avatar>
            <el-upload
              class="avatar-upload"
              action="https://notes.t-music.cn/api/minio/upload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <el-button class="avatar-edit-button" icon="el-icon-camera" circle></el-button>
            </el-upload>
          </div>
          <div class="profile-info">
            <div class="profile-name">
              <h2>{{ profile.name }}</h2>
              <el-tag type="warning" class="badge">
                <i class="el-icon-star-on"></i>
                专业版用户
              </el-tag>
            </div>
            <p class="profile-email">邮箱：{{ profile.email }}</p>
            <p class="profile-bio">个人简介：{{ profile.description }}</p>
            <el-button type="primary" @click="openEditProfileDialog">修改资料</el-button>
          </div>
        </div>
      </div>
  
      <!-- 账号安全部分 -->
      <div class="security-card">
        <h3>账号安全</h3>
        <div class="security-item" @click="openChangeEmailDialog">
          <div class="security-content">
            <i class="el-icon-message"></i>
            <div>
              <span>邮箱绑定</span>
              <p>当前绑定邮箱：{{ profile.email }}</p>
            </div>
          </div>
          <i class="el-icon-arrow-right"></i>
        </div>
        <div class="security-item" @click="openChangePasswordDialog">
          <div class="security-content">
            <i class="el-icon-lock"></i>
            <div>
              <span>修改密码</span>
              <p>定期修改密码可以保护账号安全</p>
            </div>
          </div>
          <i class="el-icon-arrow-right"></i>
        </div>
        <div class="security-item" @click="openSecurityDialog">
          <div class="security-content">
            <i class="el-icon-shield"></i>
            <div>
              <span>账号安全</span>
              <p>开启两步验证，提升账号安全性</p>
            </div>
          </div>
          <i class="el-icon-arrow-right"></i>
        </div>
      </div>
  
      <!-- 修改资料弹窗 -->
      <el-dialog title="修改个人资料" :visible.sync="editProfileDialogVisible" width="480px">
        <el-form :model="profile" label-width="80px">
          <el-form-item label="用户名">
            <el-input v-model="profile.name"></el-input>
          </el-form-item>
          <el-form-item label="个人简介">
            <el-input type="textarea" v-model="profile.description" rows="4"></el-input>
          </el-form-item>
          <el-form-item label="头像">
            <el-upload
              action="https://notes.t-music.cn/api/minio/upload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <el-button type="primary" icon="el-icon-upload">上传头像</el-button>
            </el-upload>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editProfileDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveProfile">确认修改</el-button>
        </span>
      </el-dialog>
  
      <!-- 换绑邮箱弹窗 -->
      <el-dialog title="换绑邮箱" :visible.sync="changeEmailDialogVisible" width="480px">
        <el-steps :active="emailStep" finish-status="success" simple>
          <el-step title="验证原邮箱"></el-step>
          <el-step title="绑定新邮箱"></el-step>
        </el-steps>
        <el-form v-if="emailStep === 0" label-width="100px">
          <el-form-item label="原邮箱">
            <el-input v-model="profile.email" disabled></el-input>
          </el-form-item>
          <el-form-item label="验证码">
            <el-input v-model="email.oldCode" placeholder="请输入验证码">
              <el-button slot="append" @click="sendOldEmailCode">发送验证码</el-button>
            </el-input>
          </el-form-item>
        </el-form>
        <el-form v-if="emailStep === 1" label-width="100px">
          <el-form-item label="新邮箱">
            <el-input v-model="email.email" placeholder="请输入新邮箱"></el-input>
          </el-form-item>
          <el-form-item label="验证码">
            <el-input v-model="email.authCode" placeholder="请输入验证码">
              <el-button slot="append" @click="sendNewEmailCode">发送验证码</el-button>
            </el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="changeEmailDialogVisible = false">取消</el-button>
          <el-button v-if="emailStep === 0" type="primary" @click="nextStep()">下一步</el-button>
          <el-button v-if="emailStep === 1" type="primary" @click="saveEmail">确认修改</el-button>
        </span>
      </el-dialog>
  
      <!-- 修改密码弹窗 -->
      <el-dialog title="修改密码" :visible.sync="changePasswordDialogVisible" width="480px">
        <el-form label-width="100px">
         
          <el-form-item label="新密码">
            <el-input type="password" v-model="password.new"></el-input>
          </el-form-item>
          <el-form-item label="确认密码">
            <el-input type="password" v-model="password.password"></el-input>
          </el-form-item>
          <el-form-item label="验证码">
            <el-input v-model="password.authCode
            " placeholder="请输入验证码">
              <el-button slot="append" @click="sendPasswordCode">发送验证码</el-button>
            </el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="changePasswordDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="savePassword">确认修改</el-button>
        </span>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import {updateUserInfo,sendPasswordVerificationCode,updatePassword,unbindEmail,sendUnbindVerificationCode,updateEmail,sendNewEmailVerificationCode} from '@/utils/api'
  export default {
    data() {
      return {
        profile : JSON.parse(localStorage.getItem("userInfo")),
        email: {
          oldCode: "",
          email: "",
          authCode: "",
        },
        password: {
          new: "",
          password: "",
          authCode: "",
        },
        editProfileDialogVisible: false,
        changeEmailDialogVisible: false,
        changePasswordDialogVisible: false,
        emailStep: 0,
      };
    },
    methods: {
        async nextStep(){
            const res = await unbindEmail(this.email.oldCode)
            if (res.data.code === 200) {
                this.emailStep = 1
                this.$message.success("解绑成功成功，解绑效果5分钟内有效")
            }else{
                this.$message.error("验证码错误")
            }

        },
        openSecurityDialog() {
    // 这里可以添加打开安全设置弹窗的逻辑
    console.log('打开安全设置弹窗');
  },
      openEditProfileDialog() {
        this.editProfileDialogVisible = true;
      },
      openChangeEmailDialog() {
        this.changeEmailDialogVisible = true;
        console.log(this.changeEmailDialogVisible);
        this.emailStep = 0;
      },
      openChangePasswordDialog() {
        this.changePasswordDialogVisible = true;
      },
      
        handleAvatarSuccess(response) {
            if (response.path) {
            this.profile.avatar = response.path;
            localStorage.setItem("userInfo", JSON.stringify(this.profile));
            this.$message.success('封面图片上传成功');
            } else {
            this.$message.error('上传失败：服务器返回的 URL 无效');
            }
      },
      beforeAvatarUpload(file) {
        const isImage = file.type.startsWith("image/");
        if (!isImage) {
          this.$message.error("只能上传图片文件！");
        }
        return isImage;
      },
      async sendOldEmailCode() {
        const res = await sendUnbindVerificationCode()
        if (res.data.code === 200) {
          this.$message.success("验证码已发送至原邮箱");
        } else {
          this.$message.error("发送失败：" + res.data.message);
        }
       
      },
      async sendNewEmailCode() {
        const res = await sendNewEmailVerificationCode(this.email.email)
        if (res.data.code === 200) {
            this.$message.success("验证码已发送至新邮箱！");
        }else{
            this.$message.error("发送失败：" + res.data.message);
        }
        
      },
      async sendPasswordCode() {
        const res = await sendPasswordVerificationCode()
        if (res.data.code === 200) {
          this.$message.success("验证码已发送！");
        } else {
          this.$message.error("发送失败：" + res.data.message);
        }
      },
      async saveProfile() {
        const res = await updateUserInfo(this.profile)
        if (res.data.code === 200) {
          this.$message.success("个人资料已保存！");
          localStorage.setItem("userInfo", JSON.stringify(res.data.data));
        } else {
          this.$message.error("保存失败：" + res.data.message);
        }
        this.editProfileDialogVisible = false;
      },
      async saveEmail() {
        const res = await updateEmail(this.email)
        if (res.data.code === 200) {
          this.$message.success("邮箱已修改！");
          this.profile.email = this.email.email;
          localStorage.setItem("userInfo", JSON.stringify(res.data.data));
        } else {
          this.$message.error("修改失败：" + res.data.message);
        }
        this.changeEmailDialogVisible = false;
      },
      async savePassword() {
        
        const res = await updatePassword(this.password)
        if (res.data.code === 200) {
          this.$message.success("密码已修改！");
        } else {
          this.$message.error("修改失败：" + res.data.message);
        }
       
        this.changePasswordDialogVisible = false;
      },
    },
  };
  </script>
  
  <style scoped>
  .profile-container {
    max-width: 1440px;
    margin: 0 auto;
    padding: 32px 24px;
  }
  
  .profile-card,
  .security-card {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 32px;
    margin-bottom: 24px;
  }
  
  .profile-header {
    display: flex;
    align-items: flex-start;
  }
  
  .avatar-container {
    position: relative;
  }
  
  .avatar-upload {
    position: absolute;
    bottom: 0;
    right: 0;
  }
  
  .avatar-edit-button {
    background-color: #6366f1;
    color: white;
    border: none;
  }
  
  .profile-info {
    margin-left: 32px;
    flex: 1;
  }
  
  .profile-name {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
  }
  
  .profile-name h2 {
    font-size: 20px;
    font-weight: 500;
    margin-right: 12px;
  }
  
  .badge {
    display: flex;
    align-items: center;
  }
  
  .profile-email,
  .profile-bio {
    color: #6b7280;
    margin-bottom: 16px;
  }
  
  .security-card h3 {
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 24px;
  }
  
  .security-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    margin-bottom: 16px;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .security-item:hover {
    border-color: rgba(99, 102, 241, 0.2);
    background-color: rgba(99, 102, 241, 0.05);
  }
  
  .security-content {
    display: flex;
    align-items: center;
  }
  
  .security-content i {
    color: #6366f1;
    margin-right: 12px;
  }
  
  .security-content span {
    font-weight: 500;
  }
  
  .security-content p {
    color: #6b7280;
    font-size: 14px;
    margin-top: 4px;
  }
  </style>