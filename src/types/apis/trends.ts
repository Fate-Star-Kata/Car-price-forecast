// 价格趋势相关类型定义

// 趋势筛选条件
export interface TrendsFilter {
  brand?: string // 品牌筛选
  category?: string // 车型分类：轿车、SUV、两厢车、MPV
  year_range?: {
    start: number
    end: number
  } // 年份范围
  price_range?: {
    min: number
    max: number
  } // 价格范围
}

// 价格趋势数据点
export interface PriceTrendPoint {
  date: string // 日期
  average_price: number // 平均价格
  transaction_count: number // 交易量
  price_change: number // 价格变化百分比
}

// 品牌价格对比数据
export interface BrandPriceComparison {
  brand: string // 品牌名称
  average_price: number // 平均价格
  price_change: number // 价格变化百分比
  market_share: number // 市场份额
  transaction_count: number // 交易量
}

// 热门车型数据
export interface PopularVehicle {
  rank: number // 排名
  brand: string // 品牌
  model: string // 车型
  average_price: number // 平均价格
  price_change: number // 价格变化百分比
  transaction_count: number // 交易量
  retention_rate: number // 保值率
}

// 市场统计数据
export interface MarketStats {
  average_price: number // 平均价格
  monthly_growth: number // 月度涨幅
  total_transactions: number // 总交易量
  active_listings: number // 活跃挂牌数
}

// 趋势分析响应
export interface TrendsAnalysisResponse {
  code: number
  message: string
  data: {
    price_trends: PriceTrendPoint[] // 价格趋势数据
    brand_comparison: BrandPriceComparison[] // 品牌对比数据
    popular_vehicles: PopularVehicle[] // 热门车型
    market_stats: MarketStats // 市场统计
    last_updated: string // 最后更新时间
  }
}

// 趋势查询请求
export interface TrendsRequest {
  filters: TrendsFilter
  time_period: string // 时间周期：1M, 3M, 6M, 1Y
  chart_type: string // 图表类型：line, bar, area
}