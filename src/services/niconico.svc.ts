import { axiosInstace } from './base.svc';

import { ResultListGenericVM } from '@/view-models/result.vm';


const baseURL = '/niconico';


/**
 * [GET] 取得
 */
export async function getRankingList(type = 'all') {
  return axiosInstace.get<ResultListGenericVM<{ id: string, title: string }>>(`${baseURL}/ranking`, {
    params: {
      type,
    }
  })
}
