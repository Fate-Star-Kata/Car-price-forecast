// 价格预测相关类型定义

// 预测请求参数
export interface PredictionRequest {
  brand: string // 品牌
  model: string // 型号
  year: number // 年份
  mileage: number // 公里数
  displacement: number // 排量
  transmission: string // 变速箱
  condition: string // 车况
  city: string // 城市
  model_select: string // 模型选择(random_forest, gradient_boosting, linear_regression)
}

// 价格范围
export interface PriceRange {
  min: number
  max: number
  formatted: string
}

// 因素分析
export interface FactorAnalysis {
  age_impact: number // 车龄影响
  mileage_impact: number // 里程影响
  brand_impact: number // 品牌影响
  other_impact: number // 其他影响
}

// 市场洞察
export interface MarketInsights {
  vehicle_age: number // 车龄
  mileage_per_year: number // 年均里程
  depreciation_analysis: Record<string, any> // 折旧分析
  market_position: string // 市场定位
  recommendations: string[] // 建议
  mileage_category: string // 里程分类
  age_category: string // 车龄分类
}

// 预测响应数据
export interface PredictionData {
  record_id: number // 记录ID
  predicted_price: number // 预测价格
  predicted_price_formatted: string // 格式化预测价格
  confidence_score: number // 置信度分数
  price_range: PriceRange // 价格范围
  factor_analysis: FactorAnalysis // 因素分析
  model_used: string // 使用的模型
  market_insights: MarketInsights // 市场洞察
}

// 预测响应
export interface PredictionResponse {
  code: number
  msg: string | null
  data: PredictionData
}

// 模型选择选项
export type ModelSelectOption = 'random_forest' | 'gradient_boosting' | 'linear_regression'

// 变速箱类型
export type TransmissionType = 'automatic' | 'manual' | 'cvt'

// 车况类型
export type ConditionType = 'excellent' | 'good' | 'fair' | 'poor'