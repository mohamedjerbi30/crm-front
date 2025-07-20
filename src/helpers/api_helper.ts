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
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axios.interceptors.response.use(
  (response) => {
    return response.data ? response.data : response;
  },
  (error) => {
    let message;
    
    if (error.response) {
      switch (error.response.status) {
        case 401:
          message = "Unauthorized - Invalid credentials";
          // Optional: Clear session and redirect to login
          sessionStorage.removeItem("authUser");
          window.location.href = "/login";
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
    
    return Promise.reject(message);
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