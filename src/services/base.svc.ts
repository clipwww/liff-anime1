import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ResultVM, ResultCode } from '@/view-models/result.vm'

import store from '@/store';

export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  ignoreErrorMessage?: boolean;
  ignoreLoader?: boolean;
}

export interface CustomAxiosResponse extends AxiosResponse {
  config: CustomAxiosRequestConfig
}


export const createAxiosInstance = () => {
  console.log('createAxiosInstance')
  const axiosInstace = axios.create({
    baseURL: 'https://mechakucha-api.herokuapp.com',
    timeout: 60000,
    headers: {
      'Content-Type': 'application/json',

    },
  })


  axiosInstace.interceptors.request.use((config: CustomAxiosRequestConfig) => {
    const { ignoreErrorMessage = false, ignoreLoader = false } = config;

    if (!ignoreLoader) {
      store.dispatch('updateLoading', true);
    }

    return config;
  }, (err) => {
    console.error(err);
    store.dispatch('updateLoading', false);
  })

  axiosInstace.interceptors.response.use((response: CustomAxiosResponse) => {
    const { ignoreErrorMessage = false, ignoreLoader = false } = response.config;
    const { success, resultCode, resultMessage } = response.data as ResultVM;

    if (!ignoreLoader) {
      store.dispatch('updateLoading', false);
    }

    if (!success && !ignoreErrorMessage) {
      alert(resultMessage)
    }

    return response;
  }, (err) => {
    console.error(err);
    store.dispatch('updateLoading', false);
    alert(err.message)
  })

  async function request<T>(config: AxiosRequestConfig): Promise<T> {
    return axiosInstace.request(config).then(res => res.data).catch(err => {
      console.error(err);
      return {
        code: ResultCode.clientError,
        message: err.message
      }
    })
  }

  async function get<T = ResultVM>(url: string, config?: CustomAxiosRequestConfig): Promise<T> {
    return request<T>({
      method: 'GET',
      url,
      ...config
    })
  }

  async function post<T = ResultVM>(url: string, data?: any, config?: CustomAxiosRequestConfig): Promise<T> {
    return request<T>({
      method: 'POST',
      url,
      data,
      ...config
    })
  }

  async function put<T = ResultVM>(url: string, data?: any, config?: CustomAxiosRequestConfig): Promise<T> {
    return request<T>({
      method: 'PUT',
      url,
      data,
      ...config
    })
  }

  async function del<T = ResultVM>(url: string, config?: CustomAxiosRequestConfig): Promise<T> {
    return request<T>({
      method: 'DELETE',
      url,
      ...config
    })
  }

  return {
    request,
    get,
    post,
    put,
    delete: del,
    interceptors: axiosInstace.interceptors
  }
}

export const axiosInstace = createAxiosInstance();
