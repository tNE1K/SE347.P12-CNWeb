import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

const baseURL = `http://127.0.0.1:5000`;

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (res) => {
    //auto map data
    return res.data;
  },
  (error) => {
    const _err = error.response;

    return Promise.reject({
      statusCode: _err.status,
      message: _err.data.message,
      data: _err.data.data,
    });
  },
);

class HTTPRequest {
  api: AxiosInstance;

  constructor() {
    this.api = axiosInstance;
  }

  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.api.get(url, config);
  }

  async post<T = any>(
    url: string,
    data: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.api.post(url, data, config);
  }

  async put<T = any>(
    url: string,
    data: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.api.put(url, data, config);
  }

  async patch<T = any>(
    url: string,
    data: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.api.patch(url, data, config);
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.api.delete(url, config);
  }
}

const request = new HTTPRequest();

export default request;
