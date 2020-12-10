import { axiosInstace } from './base.svc';

import { ResultListGenericVM, ResultGenericVM } from '@/view-models/result.vm';

const baseURL = '/agefans';


/**
 * [GET] 取得動畫列表
 */
export async function getList(keyword = '') {
  return axiosInstace.get<ResultListGenericVM<{ id: string, name: string }>>(baseURL, {
    params: {
      keyword
    }
  })
}

/**
 * [GET] 取得動畫明細
 */
export async function getDetails(id: string) {
  return axiosInstace.get<ResultGenericVM<{ id: string, title: string }>>(`${baseURL}/${id}`)
}
