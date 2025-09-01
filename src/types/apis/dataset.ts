// 数据集管理相关类型定义

// 数据集项类型
export interface DatasetItem {
  id: number
  name: string
  description?: string
  dataset_type: 'train' | 'test' | 'validation' | 'all'
  record_count: number
  status: 'uploading' | 'processing' | 'processed' | 'failed'
  file_path?: string
  upload_time: string
  created_by_name: string
}

// 数据集列表请求参数
export interface DatasetListRequest {
  query?: string
  page?: number
  page_size?: number
  dataset_type?: string
  status?: string
}

// 数据集列表响应
export interface DatasetListResponse {
  code: number
  msg: string
  data: {
    total: number
    page: number
    page_size: number
    datasets: DatasetItem[]
  }
}

// 数据集详情响应
export interface DatasetDetailResponse {
  code: number
  msg: string
  data: DatasetItem
}

// 数据集统计信息
export interface DatasetStats {
  total_datasets: number
  total_records: number
  processed_datasets: number
  failed_datasets: number
  dataset_types: {
    train: number
    test: number
    validation: number
  }
}

// 数据集统计响应
export interface DatasetStatsResponse {
  code: number
  msg: string
  data: DatasetStats
}

// 数据集上传请求
export interface DatasetUploadRequest {
  file: File
  name?: string
  description?: string
  dataset_type?: string
}

// 数据集上传响应
export interface DatasetUploadResponse {
  code: number
  msg: string
  data: {
    dataset_id: number
    name: string
    status: string
  }
}

// 删除数据集请求
export interface DeleteDatasetRequest {
  dataset_id: number
}

// 删除数据集响应
export interface DeleteDatasetResponse {
  code: number
  msg: string
  data: null
}

// 数据集类型枚举
export enum DatasetType {
  TRAIN = 'train',
  TEST = 'test',
  VALIDATION = 'validation',
  ALL = 'all'
}

// 数据集状态枚举
export enum DatasetStatus {
  UPLOADING = 'uploading',
  PROCESSING = 'processing',
  PROCESSED = 'processed',
  FAILED = 'failed'
}

// 数据集查询表单
export interface DatasetQueryForm {
  query: string
  dataset_type: string
  status: string
}

// 数据集上传表单
export interface DatasetUploadForm {
  name: string
  description: string
  dataset_type: string
  file: File | null
}