import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Notification, Loading } from 'element-ui';
import { ElLoadingComponent } from 'element-ui/types/loading';
import { ResultVM, ResultCode } from '@/view-models/result.vm'

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
    timeout: 20000,
    headers: {
      'Content-Type': 'application/json',

    },
  })

  let loadingInstance: ElLoadingComponent;

  axiosInstace.interceptors.request.use((config: CustomAxiosRequestConfig) => {
    const { ignoreErrorMessage = false, ignoreLoader = false } = config;

    if (!ignoreLoader) {
      loadingInstance = Loading.service({ fullscreen: true, text: '努力加載中', background: `rgba(0,0,0,0.7)` });
    }

    return config;
  })

  axiosInstace.interceptors.response.use((response: CustomAxiosResponse) => {
    const { ignoreErrorMessage = false, ignoreLoader = false } = response.config;
    const { success, resultCode, resultMessage } = response.data as ResultVM;

    if (!ignoreLoader) {
      loadingInstance.close();
    }

    if (!success && !ignoreErrorMessage) {
      Notification.error({
        title: 'Oops',
        message: resultMessage,
        dangerouslyUseHTMLString: true,
        duration: 5000,
      });
    }

    return response;
  }, (err) => {
    loadingInstance.close();
    Notification.error({
      title: 'Oops',
      message: err.message,
      dangerouslyUseHTMLString: true,
      duration: 5000,
    });
  })

  async function request<T>(config: AxiosRequestConfig): Promise<T> {
    return axiosInstace.request(config).then(res => res.data).catch(err => ({
      code: ResultCode.clientError,
      message: err.message
    }))
  }

  return {
    request
  }
}

export const axiosInstace = createAxiosInstance();
