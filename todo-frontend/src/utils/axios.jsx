import axios from 'axios';
import { LocalStorageTokenKey } from '../const/const.js' 

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: 'https://todo-api.ericnkp.com',
  timeout: 10000, // Optional: specify a timeout
  headers: { 'Content-Type': 'application/json' },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Modify the request config before sending the request
    // For example, add an authorization token
    const token = localStorage.getItem(LocalStorageTokenKey);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle the error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Process the response data
    return response;
  },
  (error) => {
    // Handle the response error
    if (error.response && error.response.status === 401) {
      // For example, redirect to login page

    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
