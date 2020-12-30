import { axiosInstace } from './base.svc';

import { ResultListGenericVM, ResultGenericVM } from '@/view-models/result.vm';

const baseURL = '/himawari';


/**
 * [GET] 取得動畫列表
 */
export async function getList(keyword = '', page = 1) {
  return axiosInstace.get<ResultListGenericVM<{ group_id: string, title: string, count: number, source: string }>>(baseURL, {
    params: {
      mode: 'commentgroup',
      keyword,
      page
    }
  })
}
