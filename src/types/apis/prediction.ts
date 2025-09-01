// 价格预测相关类型定义

// 车辆基本信息
export interface VehicleInfo {
  brand: string // 品牌
  model: string // 车型
  year: number // 年份
  mileage: number // 里程数（万公里）
  displacement: number // 排量（L）
  transmission: string // 变速箱类型
  condition: string // 车辆状况
  city: string // 所在城市
}

// 预测请求参数
export interface PredictionRequest {
  vehicle_info: VehicleInfo
  model_type: string // 预测模型类型
}

// 影响因素分析
export interface InfluenceFactor {
  factor_name: string // 因素名称
  weight: number // 权重百分比
  impact: string // 影响描述
}

// 预测结果
export interface PredictionResult {
  predicted_price: number // 预测价格
  confidence: number // 置信度
  price_range: {
    min: number // 最低价格
    max: number // 最高价格
  }
  influence_factors: InfluenceFactor[] // 影响因素分析
  model_accuracy: number // 模型准确率
}

// 预测响应
export interface PredictionResponse {
  code: number
  message: string
  data: PredictionResult
}

// 品牌车型选项
export interface BrandModel {
  brand: string
  models: string[]
}

// 预测历史记录
export interface PredictionHistory {
  id: number
  vehicle_info: VehicleInfo
  predicted_price: number
  model_type: string
  created_at: string
}

// 预测历史列表响应
export interface PredictionHistoryResponse {
  code: number
  message: string
  data: {
    history: PredictionHistory[]
    total: number
  }
}