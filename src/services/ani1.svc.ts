// 
import { axiosInstace } from './base.svc';

import { ResultListGenericVM } from '@/view-models/result.vm';

const baseURL = 'https://clipwww-nuxt-express-project.herokuapp.com/api/anime1';


/**
 * [GET] 取得動畫列表
 */
export async function getList() {
  return axiosInstace.request<ResultListGenericVM<{ id: string, name: string }>>({
    method: 'GET',
    url: `${baseURL}/list`,
  })
}

/**
 * [GET] 取得動畫
 */
export async function getBangumi(id: string) {
  return axiosInstace.request<ResultListGenericVM<{ id: string, name: string }>>({
    method: 'GET',
    url: `${baseURL}/bangumi/${id}`,
  })
}
