// 价格趋势图表数据相关类型定义

// 趋势筛选条件
export interface TrendsFilter {
  brand: string // 品牌
  category: string // 车型分类
  year_range_selected: string // 选中的年份范围
  year_range?: { start: number; end: number } // 年份范围对象（可选，用于兼容）
  month: string // 月份
}

// 价格趋势图表数据请求参数
export interface TrendChartRequest {
  brand?: string // 品牌名称
  model?: string // 车型名称
  start_year?: number // 开始年份
  end_year?: number // 结束年份
  months?: number // 月份数量，默认12
}

// 价格趋势图表数据响应
export interface TrendChartResponse {
  code: number
  msg: string | null
  data: {
    labels: string[] // 月份标签
    datasets: {
      label: string // 数据集标签
      data: number[] // 价格数据
      borderColor: string // 边框颜色
      backgroundColor: string // 背景颜色
      tension: number // 曲线张力
    }[]
  }
}

// 价格趋势点数据
export interface PriceTrendPoint {
  date: string // 日期
  price: number // 价格
  volume: number // 交易量
}

// 品牌价格对比数据
export interface BrandPriceComparison {
  brand: string // 品牌名称
  average_price: number // 平均价格
  price_change: number // 价格变化
  market_share: number // 市场份额
}

// 热门车型数据
export interface PopularVehicle {
  rank: number // 排名
  brand: string // 品牌
  model: string // 车型
  brand_model: string // 品牌车型
  average_price: number // 平均价格
  price_change: string // 价格变化
  change_type: 'positive' | 'negative' // 变化类型
  transaction_volume: number // 交易量
  transaction_count: number // 交易次数
  retention_rate: string // 保值率
}

// 市场统计数据
export interface MarketStats {
  average_price: number // 平均价格
  monthly_change: string // 月度变化
  monthly_growth: number // 月度增长率
  transaction_volume: number // 交易量
  total_transactions: number // 总交易量
  total_listings: number // 总挂牌量
  active_listings: number // 活跃挂牌量
  market_activity: number // 市场活跃度
}

// 品牌价格对比请求参数
export interface BrandComparisonRequest {
  year?: number // 年份
  months?: number // 月份数量
  brands?: string[] // 品牌列表数组
}

// 品牌价格对比响应
export interface BrandComparisonResponse {
  code: number
  msg: string | null
  data: {
    labels: string[] // 品牌标签
    datasets: {
      label: string // 数据集标签
      data: number[] // 价格数据
      backgroundColor: string[] // 背景颜色数组
    }[]
  }
}

// 市场统计信息请求参数
export interface MarketStatsRequest {
  period?: string // 统计周期 (month/quarter/year)
}

// 市场统计信息响应
export interface MarketStatsResponse {
  code: number
  msg: string | null
  data: {
    average_price: number // 平均价格
    monthly_change: string // 月度变化
    monthly_growth: number // 月度增长率
    transaction_volume: number // 交易量
    total_transactions: number // 总交易量
    total_listings: number // 总挂牌量
    active_listings: number // 活跃挂牌量
    market_activity: number // 市场活跃度
  }
}

// 热门车型排行请求参数
export interface HotModelsRequest {
  limit?: number // 返回数量，默认10
  period?: string // 统计周期
}

// 热门车型排行响应
export interface HotModelsResponse {
  code: number
  msg: string | null
  data: {
    rank: number // 排名
    brand: string // 品牌
    model: string // 车型
    brand_model: string // 品牌车型
    average_price: number // 平均价格
    price_change: string // 价格变化
    change_type: 'positive' | 'negative' // 变化类型
    transaction_volume: number // 交易量
    sales_count: number // 销量
    retention_rate: string // 保值率
  }[]
}

// 筛选选项响应
export interface FilterOptionsResponse {
  code: number
  msg: string | null
  data: {
    brands: {
      value: string // 品牌值
      label: string // 品牌标签
    }[] // 品牌列表
    models: {
      value: string // 车型值
      label: string // 车型标签
    }[] // 车型分类列表
    year_ranges: {
      value: string // 年份范围值
      label: string // 年份范围标签
    }[] // 年份范围列表
  }
}