import axios from "axios";
import JSONbig from 'json-bigint'; // 引入 json-bigint 库
import Vue from "vue";
import { alertError } from "./alert";

// 创建 Axios 实例
const req = axios.create({
  baseURL: 'http://localhost:8081',
  timeout: 100000,
 
  transformResponse: [function (data) {
    try {
      // 使用 json-bigint 来解析响应中的 long 类型
      return JSONbig.parse(data);
    } catch (error) {
      // 如果解析失败，则返回原始数据
      return data;
    }
  }]
});

req.defaults.message = Vue.prototype.$message; // 传递 Vue 实例的 $message
// 请求拦截器 - 添加 Token
req.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem('Authorization'); // 从localStorage中获取Token
    if (token) {
      config.headers['Authorization'] = `${token}`; // 在请求头中添加Token
    }
    return config;
  },
  function (error) {
    console.log(error)
  }
);


// 响应拦截器 - 错误处理
req.interceptors.response.use(
  response => {
    if (response.data.code) {
      if (response.data.code == 200) {
        return response;  // 正常返回数据
      } else {
        const errorMessage = response.data.message || '请求失败，请稍后再试';
        alertError(errorMessage)
      }
    } else {
      return response;  // 如果没有 code 字段，返回正常响应
    }
  },
  error => {
    console.error('请求错误:', error);
    alertError(error.message);
    
  }
);



export default req;