//
import { axiosInstace } from './base.svc';

import { ResultVM, ResultListGenericVM } from '@/view-models/result.vm';

interface BangumiResultVM extends ResultVM {
  item: {
    id: string;
    title: string;
  }
  items: { id: string, name: string }[];
}

const baseURL = '/anime1';


/**
 * [GET] 取得動畫列表
 */
export async function getList() {
  return axiosInstace.get<ResultListGenericVM<{ id: string, name: string }>>(baseURL)
}

/**
 * [GET] 取得動畫
 */
export async function getBangumi(id: string) {
  return axiosInstace.get<BangumiResultVM>(`${baseURL}/${id}`)
}
