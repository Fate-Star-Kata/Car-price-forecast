import http from '@/http'

// 数据集管理相关接口
export const datasetApi = {
  // 获取数据集列表
  getDatasets: (params?: {
    query?: string
    page?: number
    page_size?: number
    dataset_type?: string
    status?: string
  }) => {
    return http.get('/car/admin/datasets', { params })
  },

  // 获取数据集详情
  getDatasetDetail: (datasetId: string | number) => {
    return http.get(`/car/admin/datasets/${datasetId}`)
  },

  // 删除数据集
  deleteDataset: (datasetId: string | number) => {
    return http.post('/car/admin/datasets/delete', { dataset_id: datasetId })
  },

  // 获取数据集统计信息
  getDatasetStats: () => {
    return http.get('/car/admin/datasets/stats')
  },

  // 上传数据集
  uploadDataset: (formData: FormData) => {
    return http.post('/car/admin/datasets/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

// 模型管理相关接口
export const modelApi = {
  // 获取模型列表
  getModels: (params?: {
    query?: string
    page?: number
    page_size?: number
    algorithm?: string
    status?: string
  }) => {
    return http.get('/car/admin/models', { params })
  },

  // 获取模型详情
  getModelDetail: (modelId: string | number) => {
    return http.get(`/car/admin/models/${modelId}`)
  },

  // 修改模型状态
  updateModelStatus: (modelId: string | number, status: string) => {
    return http.post('/car/admin/models/status', {
      model_id: modelId,
      status
    })
  },

  // 删除模型
  deleteModel: (modelId: string | number) => {
    return http.post('/car/admin/models/delete', { model_id: modelId })
  },

  // 获取模型统计信息
  getModelStats: () => {
    return http.get('/car/admin/models/stats')
  },

  // 训练新模型
  trainModel: (params: {
    model_name: string
    algorithm: string
    dataset_id: string | number
    hyperparameters?: Record<string, any>
  }) => {
    return http.post('/car/admin/models/train', params)
  }
}

// 预测记录管理相关接口
export const predictionApi = {
  // 获取预测记录列表
  getPredictions: (params?: {
    query?: string
    page?: number
    page_size?: number
    user_id?: string | number
    model_id?: string | number
    start_date?: string
    end_date?: string
  }) => {
    return http.get('/car/admin/predictions', { params })
  },

  // 获取预测记录详情
  getPredictionDetail: (predictionId: string | number) => {
    return http.get(`/car/admin/predictions/${predictionId}`)
  },

  // 删除预测记录
  deletePrediction: (predictionId: string | number) => {
    return http.post('/car/admin/predictions/delete', { prediction_id: predictionId })
  },

  // 导出预测记录
  exportPredictions: (params?: {
    query?: string
    user_id?: string | number
    model_id?: string | number
    start_date?: string
    end_date?: string
    format?: 'csv' | 'excel'
  }) => {
    return http.get('/car/admin/predictions/export', {
      params,
      responseType: 'blob'
    })
  }
}

// 通用管理接口
export const adminApi = {
  // 获取系统统计信息
  getSystemStats: () => {
    return http.get('/car/admin/stats')
  },

  // 获取用户列表（用于筛选）
  getUsers: (params?: {
    query?: string
    page?: number
    page_size?: number
  }) => {
    return http.get('/car/admin/users', { params })
  }
}

// 导出所有API
// 社区管理相关接口
export const communityApi = {
  // 获取帖子列表
  getPosts: (params?: {
    query?: string
    page?: number
    page_size?: number
    category?: number
    status?: string
  }) => {
    return http.get('/car/community/admin/posts', { params })
  },

  // 获取帖子详情
  getPostDetail: (postId: string | number) => {
    return http.get(`/car/community/admin/posts/${postId}`)
  },

  // 更新帖子状态
  updatePostStatus: (postId: string | number, status: string) => {
    return http.put(`/car/community/admin/posts/${postId}`, { status })
  },

  // 删除帖子
  deletePost: (postId: string | number) => {
    return http.delete(`/car/community/admin/posts/${postId}`)
  },

  // 获取回复列表
  getReplies: (params?: {
    query?: string
    page?: number
    page_size?: number
    post_id?: number
  }) => {
    return http.get('/car/community/admin/replies', { params })
  },

  // 删除回复
  deleteReply: (replyId: string | number) => {
    return http.delete(`/car/community/admin/replies/${replyId}`)
  },

  // 获取统计信息
  getCommunityStats: () => {
    return http.get('/car/community/admin/stats')
  },

  // 获取分类列表
  getCategories: (params?: {
    query?: string
    page?: number
    page_size?: number
  }) => {
    return http.get('/car/community/admin/categories', { params })
  },

  // 创建分类
  createCategory: (data: {
    name: string
    description?: string
    code?: string
  }) => {
    return http.post('/car/community/admin/categories', data)
  },

  // 更新分类
  updateCategory: (categoryId: string | number, data: {
    name?: string
    description?: string
    code?: string
  }) => {
    return http.put(`/car/community/admin/categories/${categoryId}`, data)
  },

  // 删除分类
  deleteCategory: (categoryId: string | number) => {
    return http.delete(`/car/community/admin/categories/${categoryId}`)
  }
}

export default {
  dataset: datasetApi,
  model: modelApi,
  prediction: predictionApi,
  admin: adminApi,
  community: communityApi
}