import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import config from "../config";

const { api } = config;

// Set default base URL
axios.defaults.baseURL = api.API_URL;
axios.defaults.headers.post["Content-Type"] = "application/json";

// Token management
const getAuthToken = () => {
  const authUser = sessionStorage.getItem("authUser");
  if (authUser) {
    try {
      const user = JSON.parse(authUser);
      return user.token || user.accessToken;
    } catch (error) {
      console.error('Error parsing auth user:', error);
      return null;
    }
  }
  return null;
};

// Set initial auth header if token exists
const token = getAuthToken();
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// Request interceptor to add token to every request
axios.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // ENHANCED LOGGING FOR DEBUGGING
    console.log('=== API REQUEST DEBUG ===');
    console.log('URL:', `${axios.defaults.baseURL}${config.url}`);
    console.log('Method:', config.method?.toUpperCase());
    console.log('Headers:', config.headers);
    console.log('Request Data:', config.data);
    console.log('========================');
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with enhanced error handling
axios.interceptors.response.use(
  (response) => {
    // ENHANCED LOGGING FOR SUCCESSFUL RESPONSES
    console.log('=== API RESPONSE DEBUG ===');
    console.log('Status:', response.status);
    console.log('Data:', response.data);
    console.log('Headers:', response.headers);
    console.log('==========================');
    return response;
  },
  (error) => {
    // ENHANCED ERROR LOGGING
    console.error('=== API ERROR DEBUG ===');
    console.error('Error:', error);
    
    if (error.response) {
      console.error('Response Status:', error.response.status);
      console.error('Response Data:', error.response.data);
      console.error('Response Headers:', error.response.headers);
    } else if (error.request) {
      console.error('Request made but no response:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    console.error('Config:', error.config);
    console.error('========================');

    let message;
    let errorData = null;

    if (error.response) {
      errorData = error.response.data;
      
      switch (error.response.status) {
        case 400:
          message = error.response.data?.message || "Bad Request - Please check your input";
          break;
        case 401:
          message = "Unauthorized - Invalid credentials";
          // Optional: Clear session and redirect to login
          sessionStorage.removeItem("authUser");
          // Only redirect if we're not already on the login page
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
          break;
        case 403:
          message = "Forbidden - Access denied";
          break;
        case 404:
          message = "Resource not found";
          break;
        case 500:
          message = "Internal server error";
          break;
        default:
          message = error.response.data?.message || error.message || "An error occurred";
      }
    } else if (error.request) {
      message = "Network error - Unable to connect to server";
    } else {
      message = error.message || "An error occurred";
    }

    // Create a more detailed error object
    const enhancedError = {
      message,
      status: error.response?.status,
      data: errorData,
      originalError: error
    };

    return Promise.reject(enhancedError);
  }
);

// Set authorization header
const setAuthorization = (token: string) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

// Remove authorization header
const removeAuthorization = () => {
  delete axios.defaults.headers.common["Authorization"];
};

class APIClient {
  get = (url: string, params?: any) => {
    let response;

    if (params) {
      const paramKeys: string[] = [];
      Object.keys(params).forEach(key => {
        paramKeys.push(`${key}=${params[key]}`);
      });
      
      const queryString = paramKeys.length ? paramKeys.join('&') : "";
      response = axios.get(`${url}?${queryString}`);
    } else {
      response = axios.get(url);
    }

    return response;
  };

  create = (url: string, data: any) => {
    // ENHANCED LOGGING FOR CREATE METHOD
    console.log('=== APIClient.create DEBUG ===');
    console.log('URL:', url);
    console.log('Data being sent:', data);
    console.log('Full URL:', `${axios.defaults.baseURL}${url}`);
    console.log('==============================');
    
    return axios.post(url, data);
  };

  update = (url: string, data: any) => {
    return axios.patch(url, data);
  };

  put = (url: string, data: any) => {
    return axios.put(url, data);
  };

  delete = (url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> => {
    return axios.delete(url, { ...config });
  };
}

const getLoggedinUser = () => {
  const user = sessionStorage.getItem("authUser");
  if (!user) {
    return null;
  }
  try {
    return JSON.parse(user);
  } catch (error) {
    console.error('Error parsing logged in user:', error);
    return null;
  }
};

export {
  APIClient,
  setAuthorization,
  removeAuthorization,
  getLoggedinUser
};