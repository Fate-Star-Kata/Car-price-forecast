<template>
  <div class="min-h-screen bg-base-100 p-6">
    <!-- 页面标题 -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-base-content mb-2">模型训练中心</h1>
      <p class="text-base-content/70">训练和管理您的AI预测模型，提升价格预测准确性</p>
    </div>

    <!-- 训练状态概览 -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div class="stat bg-base-200 rounded-lg shadow">
        <div class="stat-figure text-primary">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
          </svg>
        </div>
        <div class="stat-title">训练中模型</div>
        <div class="stat-value text-primary">{{ trainingOverview.training_models }}</div>
        <div class="stat-desc">个模型正在训练</div>
      </div>

      <div class="stat bg-base-200 rounded-lg shadow">
        <div class="stat-figure text-success">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div class="stat-title">已完成模型</div>
        <div class="stat-value text-success">{{ trainingOverview.completed_models }}</div>
        <div class="stat-desc">个模型训练完成</div>
      </div>

      <div class="stat bg-base-200 rounded-lg shadow">
        <div class="stat-figure text-warning">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
        </div>
        <div class="stat-title">最佳准确率</div>
        <div class="stat-value text-warning">{{ (trainingOverview.best_accuracy * 100).toFixed(1) }}%</div>
        <div class="stat-desc">当前最高准确率</div>
      </div>

      <div class="stat bg-base-200 rounded-lg shadow">
        <div class="stat-figure text-info">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div class="stat-title">平均训练时间</div>
        <div class="stat-value text-info">{{ formatTrainingTime(trainingOverview.average_training_time) }}</div>
        <div class="stat-desc">每个模型平均</div>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <!-- 左侧：数据上传和模型配置 -->
      <div class="xl:col-span-2 space-y-6">
        <!-- 数据上传 -->
        <div class="card bg-base-200 shadow-lg">
          <div class="card-body">
            <h2 class="card-title text-xl mb-4">数据集管理</h2>

            <!-- 上传区域 -->
            <div class="border-2 border-dashed border-base-300 rounded-lg p-8 text-center hover:border-primary transition-colors"
                 @dragover.prevent @drop.prevent="handleFileDrop">
              <input ref="fileInput" type="file" class="hidden" accept=".csv,.xlsx,.json" @change="handleFileSelect">

              <svg class="w-12 h-12 mx-auto mb-4 text-base-content/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>

              <p class="text-lg font-medium mb-2">拖拽文件到此处或点击上传</p>
              <p class="text-sm text-base-content/60 mb-4">支持 CSV、Excel、JSON 格式，最大 100MB</p>

              <button @click="$refs.fileInput.click()" class="btn btn-primary btn-sm">
                选择文件
              </button>
            </div>

            <!-- 数据集列表 -->
            <div v-if="datasets.length > 0" class="mt-6">
              <h3 class="font-semibold mb-3">已上传数据集</h3>
              <div class="space-y-2">
                <div v-for="dataset in datasets" :key="dataset.id"
                     class="flex items-center justify-between p-3 bg-base-100 rounded-lg">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                    </div>
                    <div>
                      <div class="font-medium">{{ dataset.name }}</div>
                      <div class="text-sm text-base-content/60">
                        {{ formatFileSize(dataset.file_size) }} • {{ dataset.record_count.toLocaleString() }} 条记录 • {{ dataset.feature_count }} 个特征
                      </div>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <button @click="selectDataset(dataset)" class="btn btn-ghost btn-xs"
                            :class="{ 'btn-primary': selectedDataset?.id === dataset.id }">
                      {{ selectedDataset?.id === dataset.id ? '已选择' : '选择' }}
                    </button>
                    <div class="dropdown dropdown-end">
                      <label tabindex="0" class="btn btn-ghost btn-xs">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                        </svg>
                      </label>
                      <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-32">
                        <li><a @click="previewDataset(dataset)">预览</a></li>
                        <li><a @click="downloadDataset(dataset)">下载</a></li>
                        <li><a @click="deleteDataset(dataset)" class="text-error">删除</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 模型配置 -->
        <div class="card bg-base-200 shadow-lg">
          <div class="card-body">
            <h2 class="card-title text-xl mb-4">训练配置</h2>

            <form @submit.prevent="startTraining" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="form-control">
                  <label class="label">
                    <span class="label-text">模型名称 *</span>
                  </label>
                  <input v-model="trainingConfig.model_name" type="text" class="input input-bordered"
                         placeholder="输入模型名称" required>
                </div>

                <div class="form-control">
                  <label class="label">
                    <span class="label-text">算法类型 *</span>
                  </label>
                  <select v-model="trainingConfig.algorithm" class="select select-bordered" required>
                    <option value="">选择算法</option>
                    <option value="random_forest">随机森林</option>
                    <option value="gradient_boosting">梯度提升</option>
                    <option value="neural_network">神经网络</option>
                    <option value="linear_regression">线性回归</option>
                    <option value="svm">支持向量机</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="form-control">
                  <label class="label">
                    <span class="label-text">训练轮数</span>
                  </label>
                  <input v-model.number="trainingConfig.epochs" type="number" class="input input-bordered"
                         min="1" max="1000" value="100">
                </div>

                <div class="form-control">
                  <label class="label">
                    <span class="label-text">学习率</span>
                  </label>
                  <input v-model.number="trainingConfig.learning_rate" type="number" class="input input-bordered"
                         min="0.001" max="1" step="0.001" value="0.01">
                </div>

                <div class="form-control">
                  <label class="label">
                    <span class="label-text">验证集比例</span>
                  </label>
                  <input v-model.number="trainingConfig.validation_split" type="number" class="input input-bordered"
                         min="0.1" max="0.5" step="0.05" value="0.2">
                </div>
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text">模型描述</span>
                </label>
                <textarea v-model="trainingConfig.description" class="textarea textarea-bordered"
                          placeholder="描述模型的用途和特点"></textarea>
              </div>

              <div class="card-actions justify-end">
                <button type="submit" class="btn btn-primary" :disabled="!selectedDataset || isTraining">
                  <span v-if="isTraining" class="loading loading-spinner loading-sm"></span>
                  {{ isTraining ? '启动中...' : '开始训练' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- 右侧：训练进度和模型列表 -->
      <div class="space-y-6">
        <!-- 当前训练进度 -->
        <div v-if="currentTraining" class="card bg-base-200 shadow-lg">
          <div class="card-body">
            <h3 class="card-title text-lg mb-4">训练进度</h3>

            <div class="space-y-4">
              <div>
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm font-medium">{{ currentTraining.model_name }}</span>
                  <span class="text-sm">{{ currentTraining.progress_percentage.toFixed(1) }}%</span>
                </div>
                <progress class="progress progress-primary" :value="currentTraining.progress_percentage" max="100"></progress>
              </div>

              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div class="text-base-content/60">当前轮数</div>
                  <div class="font-semibold">{{ currentTraining.current_epoch }}/{{ currentTraining.total_epochs }}</div>
                </div>
                <div>
                  <div class="text-base-content/60">当前损失</div>
                  <div class="font-semibold">{{ currentTraining.current_loss.toFixed(4) }}</div>
                </div>
                <div>
                  <div class="text-base-content/60">验证准确率</div>
                  <div class="font-semibold">{{ (currentTraining.validation_accuracy * 100).toFixed(2) }}%</div>
                </div>
                <div>
                  <div class="text-base-content/60">预计剩余</div>
                  <div class="font-semibold">{{ formatTime(currentTraining.estimated_time_remaining) }}</div>
                </div>
              </div>

              <!-- 训练曲线 -->
              <div class="mt-4">
                <div class="text-sm font-medium mb-2">训练曲线</div>
                <div class="h-32 bg-base-100 rounded-lg p-2">
                  <!-- 这里应该集成图表库显示训练曲线 -->
                  <div class="w-full h-full flex items-center justify-center text-base-content/50 text-xs">
                    训练曲线图表
                  </div>
                </div>
              </div>

              <div class="flex gap-2">
                <button @click="pauseTraining" class="btn btn-warning btn-sm flex-1">暂停</button>
                <button @click="stopTraining" class="btn btn-error btn-sm flex-1">停止</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 模型列表 -->
        <div class="card bg-base-200 shadow-lg">
          <div class="card-body">
            <div class="flex justify-between items-center mb-4">
              <h3 class="card-title text-lg">我的模型</h3>
              <div class="dropdown dropdown-end">
                <label tabindex="0" class="btn btn-ghost btn-sm">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                  </svg>
                  筛选
                </label>
                <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40">
                  <li><a @click="filterModels('all')">全部模型</a></li>
                  <li><a @click="filterModels('completed')">已完成</a></li>
                  <li><a @click="filterModels('training')">训练中</a></li>
                  <li><a @click="filterModels('failed')">失败</a></li>
                </ul>
              </div>
            </div>

            <div class="space-y-3 max-h-96 overflow-y-auto">
              <div v-for="model in filteredModels" :key="model.id"
                   class="p-3 bg-base-100 rounded-lg hover:bg-base-300 transition-colors">
                <div class="flex items-start justify-between">
                  <div class="flex-1 min-w-0">
                    <div class="font-medium text-sm truncate">{{ model.name }}</div>
                    <div class="text-xs text-base-content/60 mt-1">
                      {{ getAlgorithmName(model.algorithm) }} • {{ formatDate(model.created_at) }}
                    </div>
                    <div class="flex items-center gap-2 mt-2">
                      <div class="badge badge-sm" :class="getStatusBadgeClass(model.status)">{{ getStatusText(model.status) }}</div>
                      <div v-if="model.status === 'completed'" class="text-xs text-success">
                        准确率: {{ (model.accuracy * 100).toFixed(1) }}%
                      </div>
                    </div>
                  </div>

                  <div class="dropdown dropdown-end">
                    <label tabindex="0" class="btn btn-ghost btn-xs">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                      </svg>
                    </label>
                    <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-32">
                      <li v-if="model.status === 'completed'"><a @click="useModel(model)">使用模型</a></li>
                      <li><a @click="viewModelDetails(model)">查看详情</a></li>
                      <li v-if="model.status === 'completed'"><a @click="downloadModel(model)">下载</a></li>
                      <li><a @click="deleteModel(model)" class="text-error">删除</a></li>
                    </ul>
                  </div>
                </div>
              </div>

              <div v-if="filteredModels.length === 0" class="text-center py-8 text-base-content/50">
                <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
                <p>暂无模型</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type {
  TrainingConfig,
  DatasetInfo,
  TrainingProgress,
  ModelInfo,
  TrainingOverview,
  TrainingStatus,
  AlgorithmType
} from '@/types/factory'

// 响应式数据
const isTraining = ref(false)
const selectedDataset = ref<DatasetInfo | null>(null)
const currentTraining = ref<TrainingProgress | null>(null)
const modelFilter = ref('all')

// 训练配置
const trainingConfig = ref<TrainingConfig>({
  algorithm: '' as AlgorithmType,
  epochs: 100,
  learning_rate: 0.01,
  validation_split: 0.2,
  model_name: '',
  description: ''
})

// 数据
const trainingOverview = ref<TrainingOverview>({
  training_models: 2,
  completed_models: 8,
  best_accuracy: 0.892,
  average_training_time: 1800
})

const datasets = ref<DatasetInfo[]>([
  {
    id: '1',
    name: '二手车数据集_2024.csv',
    description: '包含2024年二手车交易数据',
    file_size: 15728640,
    record_count: 50000,
    feature_count: 25,
    upload_time: '2024-01-15T10:30:00Z',
    file_format: 'CSV'
  },
  {
    id: '2',
    name: '历史价格数据.xlsx',
    description: '历史价格变化数据',
    file_size: 8388608,
    record_count: 30000,
    feature_count: 18,
    upload_time: '2024-01-10T14:20:00Z',
    file_format: 'Excel'
  }
])

const models = ref<ModelInfo[]>([
  {
    id: '1',
    name: '价格预测模型_v1.0',
    algorithm: 'random_forest' as AlgorithmType,
    accuracy: 0.892,
    training_time: 1650,
    status: 'completed' as TrainingStatus,
    created_at: '2024-01-15T16:45:00Z',
    dataset_id: '1',
    config: {
      algorithm: 'random_forest' as AlgorithmType,
      epochs: 100,
      learning_rate: 0.01,
      validation_split: 0.2,
      model_name: '价格预测模型_v1.0'
    },
    file_size: 52428800,
    version: '1.0'
  },
  {
    id: '2',
    name: '深度学习模型_v2.1',
    algorithm: 'neural_network' as AlgorithmType,
    accuracy: 0.856,
    training_time: 3200,
    status: 'training' as TrainingStatus,
    created_at: '2024-01-16T09:20:00Z',
    dataset_id: '1',
    config: {
      algorithm: 'neural_network' as AlgorithmType,
      epochs: 200,
      learning_rate: 0.001,
      validation_split: 0.25,
      model_name: '深度学习模型_v2.1'
    },
    file_size: 104857600,
    version: '2.1'
  }
])

// 计算属性
const filteredModels = computed(() => {
  if (modelFilter.value === 'all') return models.value
  return models.value.filter(model => model.status === modelFilter.value)
})

// 方法
const handleFileDrop = (event: DragEvent) => {
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    handleFileUpload(files[0])
  }
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (files && files.length > 0) {
    handleFileUpload(files[0])
  }
}

const handleFileUpload = async (file: File) => {
  // 模拟文件上传
  console.log('上传文件:', file.name)

  // 创建新的数据集记录
  const newDataset: DatasetInfo = {
    id: Date.now().toString(),
    name: file.name,
    description: '用户上传的数据集',
    file_size: file.size,
    record_count: Math.floor(Math.random() * 100000) + 10000,
    feature_count: Math.floor(Math.random() * 30) + 10,
    upload_time: new Date().toISOString(),
    file_format: file.name.split('.').pop()?.toUpperCase() || 'Unknown'
  }

  datasets.value.unshift(newDataset)
}

const selectDataset = (dataset: DatasetInfo) => {
  selectedDataset.value = dataset
}

const startTraining = async () => {
  if (!selectedDataset.value) return

  isTraining.value = true

  // 模拟训练开始
  currentTraining.value = {
    current_epoch: 0,
    total_epochs: trainingConfig.value.epochs,
    progress_percentage: 0,
    current_loss: 1.0,
    validation_accuracy: 0.5,
    estimated_time_remaining: trainingConfig.value.epochs * 30,
    training_metrics: {
      loss_history: [],
      accuracy_history: []
    }
  }

  // 模拟训练进度更新
  const progressInterval = setInterval(() => {
    if (currentTraining.value) {
      currentTraining.value.current_epoch += 1
      currentTraining.value.progress_percentage = (currentTraining.value.current_epoch / currentTraining.value.total_epochs) * 100
      currentTraining.value.current_loss = Math.max(0.1, currentTraining.value.current_loss - 0.01)
      currentTraining.value.validation_accuracy = Math.min(0.95, currentTraining.value.validation_accuracy + 0.005)
      currentTraining.value.estimated_time_remaining = (currentTraining.value.total_epochs - currentTraining.value.current_epoch) * 30

      if (currentTraining.value.current_epoch >= currentTraining.value.total_epochs) {
        clearInterval(progressInterval)
        completeTraining()
      }
    }
  }, 1000)
}

const completeTraining = () => {
  // 创建新的完成模型
  const newModel: ModelInfo = {
    id: Date.now().toString(),
    name: trainingConfig.value.model_name,
    algorithm: trainingConfig.value.algorithm,
    accuracy: currentTraining.value?.validation_accuracy || 0.8,
    training_time: trainingConfig.value.epochs * 30,
    status: 'completed' as TrainingStatus,
    created_at: new Date().toISOString(),
    dataset_id: selectedDataset.value?.id || '',
    config: { ...trainingConfig.value },
    file_size: Math.floor(Math.random() * 100000000) + 10000000,
    version: '1.0'
  }

  models.value.unshift(newModel)
  trainingOverview.value.completed_models += 1
  trainingOverview.value.training_models -= 1

  currentTraining.value = null
  isTraining.value = false

  // 重置表单
  trainingConfig.value = {
    algorithm: '' as AlgorithmType,
    epochs: 100,
    learning_rate: 0.01,
    validation_split: 0.2,
    model_name: '',
    description: ''
  }
}

const pauseTraining = () => {
  console.log('暂停训练')
}

const stopTraining = () => {
  currentTraining.value = null
  isTraining.value = false
  console.log('停止训练')
}

const filterModels = (filter: string) => {
  modelFilter.value = filter
}

const useModel = (model: ModelInfo) => {
  console.log('使用模型:', model.name)
}

const viewModelDetails = (model: ModelInfo) => {
  console.log('查看模型详情:', model.name)
}

const downloadModel = (model: ModelInfo) => {
  console.log('下载模型:', model.name)
}

const deleteModel = (model: ModelInfo) => {
  const index = models.value.findIndex(m => m.id === model.id)
  if (index > -1) {
    models.value.splice(index, 1)
  }
}

const previewDataset = (dataset: DatasetInfo) => {
  console.log('预览数据集:', dataset.name)
}

const downloadDataset = (dataset: DatasetInfo) => {
  console.log('下载数据集:', dataset.name)
}

const deleteDataset = (dataset: DatasetInfo) => {
  const index = datasets.value.findIndex(d => d.id === dataset.id)
  if (index > -1) {
    datasets.value.splice(index, 1)
    if (selectedDataset.value?.id === dataset.id) {
      selectedDataset.value = null
    }
  }
}

// 工具函数
const formatFileSize = (bytes: number) => {
  const sizes = ['B', 'KB', 'MB', 'GB']
  if (bytes === 0) return '0 B'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
}

const formatTrainingTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (hours > 0) {
    return `${hours}小时${minutes}分钟`
  }
  return `${minutes}分钟`
}

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

const getAlgorithmName = (algorithm: AlgorithmType) => {
  const names = {
    'random_forest': '随机森林',
    'gradient_boosting': '梯度提升',
    'neural_network': '神经网络',
    'linear_regression': '线性回归',
    'svm': '支持向量机'
  }
  return names[algorithm] || algorithm
}

const getStatusText = (status: TrainingStatus) => {
  const texts = {
    'pending': '等待中',
    'running': '训练中',
    'completed': '已完成',
    'failed': '失败',
    'stopped': '已停止'
  }
  return texts[status] || status
}

const getStatusBadgeClass = (status: TrainingStatus) => {
  const classes = {
    'pending': 'badge-warning',
    'running': 'badge-info',
    'completed': 'badge-success',
    'failed': 'badge-error',
    'stopped': 'badge-neutral'
  }
  return classes[status] || 'badge-neutral'
}

// 生命周期
onMounted(() => {
  // 初始化数据
})

onUnmounted(() => {
  // 清理定时器
})
</script>