import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3001/api",
  timeout: 10000, // adjust the timeout as needed
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // You can modify request config here, such as adding headers or authentication tokens
    // For example:
    // config.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`;
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // You can modify response data here before returning it to the calling function
    return response;
  },
  (error) => {
    // Handle response errors
    return Promise.reject(error);
  }
);

export default axiosInstance;
