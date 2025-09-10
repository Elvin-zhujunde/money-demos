import axios from 'axios';
import { ElMessage } from 'element-plus';
import { useUserStore } from '../stores/user';

const request = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 5000
});

request.interceptors.request.use(
  config => {
    const userStore = useUserStore();
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`;
      config.headers['X-User-Role'] = userStore.userInfo?.role;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    ElMessage.error(error.response?.data?.message || '请求失败');
    return Promise.reject(error);
  }
);

export default request; 