// 模型训练相关类型定义

// 训练状态枚举
export enum TrainingStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  STOPPED = 'stopped'
}

// 算法类型枚举
export enum AlgorithmType {
  RANDOM_FOREST = 'random_forest',
  GRADIENT_BOOSTING = 'gradient_boosting',
  NEURAL_NETWORK = 'neural_network',
  LINEAR_REGRESSION = 'linear_regression',
  SVM = 'svm'
}

// 训练配置参数
export interface TrainingConfig {
  algorithm: AlgorithmType // 算法类型
  epochs: number // 训练轮数
  learning_rate: number // 学习率
  validation_split: number // 验证集比例
  model_name: string // 模型名称
  description?: string // 模型描述
}

// 数据集信息
export interface DatasetInfo {
  id: string
  name: string // 数据集名称
  description?: string // 数据集描述
  file_size: number // 文件大小（字节）
  record_count: number // 记录数量
  feature_count: number // 特征数量
  upload_time: string // 上传时间
  file_format: string // 文件格式
}

// 训练进度信息
export interface TrainingProgress {
  current_epoch: number // 当前轮数
  total_epochs: number // 总轮数
  progress_percentage: number // 进度百分比
  current_loss: number // 当前损失值
  validation_accuracy: number // 验证准确率
  estimated_time_remaining: number // 预计剩余时间（秒）
  training_metrics: {
    loss_history: number[] // 损失历史
    accuracy_history: number[] // 准确率历史
  }
}

// 模型信息
export interface ModelInfo {
  id: string
  name: string // 模型名称
  algorithm: AlgorithmType // 算法类型
  accuracy: number // 准确率
  training_time: number // 训练时间（秒）
  status: TrainingStatus // 状态
  created_at: string // 创建时间
  dataset_id: string // 数据集ID
  config: TrainingConfig // 训练配置
  file_size: number // 模型文件大小
  version: string // 模型版本
}

// 训练状态概览
export interface TrainingOverview {
  training_models: number // 训练中模型数量
  completed_models: number // 已完成模型数量
  best_accuracy: number // 最佳准确率
  average_training_time: number // 平均训练时间
}

// 开始训练请求
export interface StartTrainingRequest {
  dataset_id: string // 数据集ID
  config: TrainingConfig // 训练配置
}

// 开始训练响应
export interface StartTrainingResponse {
  code: number
  message: string
  data: {
    training_id: string // 训练任务ID
    estimated_time: number // 预计训练时间
  }
}

// 训练进度响应
export interface TrainingProgressResponse {
  code: number
  message: string
  data: TrainingProgress
}

// 模型列表响应
export interface ModelsListResponse {
  code: number
  message: string
  data: {
    models: ModelInfo[]
    total: number
    overview: TrainingOverview
  }
}

// 数据集上传响应
export interface DatasetUploadResponse {
  code: number
  message: string
  data: DatasetInfo
}

// 模型操作请求
export interface ModelOperationRequest {
  model_id: string
  operation: 'use' | 'download' | 'delete' // 操作类型
}