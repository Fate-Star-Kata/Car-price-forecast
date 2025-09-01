import type { PredictionRequest, PredictionResponse } from '@/types/apis/prediction_T'
import serviceAxios from '@/http'

/**
 * 价格预测API
 * @param data 预测请求参数
 * @returns 预测结果
 */
export function predictPrice(data: PredictionRequest): Promise<PredictionResponse> {
  return serviceAxios({
    url: '/car/prediction',
    method: 'post',
    data,
  })
}