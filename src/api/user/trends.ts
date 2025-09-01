import type {
  TrendChartRequest,
  TrendChartResponse,
  BrandComparisonRequest,
  BrandComparisonResponse,
  MarketStatsRequest,
  MarketStatsResponse,
  HotModelsRequest,
  HotModelsResponse,
  FilterOptionsResponse
} from '@/types/apis/trends_T'
import serviceAxios from '@/http'

// 获取价格趋势图表数据
export function getTrendChart(params: TrendChartRequest): Promise<TrendChartResponse> {
  return serviceAxios({
    url: '/car/trends/chart',
    method: 'get',
    params,
  })
}

// 获取品牌价格对比数据
export function getBrandComparison(params?: BrandComparisonRequest): Promise<BrandComparisonResponse> {
  return serviceAxios({
    url: '/car/trends/brands',
    method: 'get',
    params,
  })
}

// 获取市场统计信息
export function getMarketStats(params?: MarketStatsRequest): Promise<MarketStatsResponse> {
  return serviceAxios({
    url: '/car/trends/marketStats',
    method: 'get',
    params,
  })
}

// 获取热门车型排行
export function getHotModels(params?: HotModelsRequest): Promise<HotModelsResponse> {
  return serviceAxios({
    url: '/car/trends/hotModels',
    method: 'get',
    params,
  })
}

// 获取筛选选项
export function getFilterOptions(): Promise<FilterOptionsResponse> {
  return serviceAxios({
    url: '/car/trends/filterOptions',
    method: 'get',
  })
}