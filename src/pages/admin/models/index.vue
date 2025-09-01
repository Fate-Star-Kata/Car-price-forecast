<template>
  <div class="models-management">
    <!-- 模型统计卡片 -->
    <div class="stats-cards">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon total">
                <el-icon>
                  <SetUp />
                </el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ stats.totalModels }}</div>
                <div class="stat-label">总模型数</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon production">
                <el-icon>
                  <CircleCheck />
                </el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ stats.productionModels }}</div>
                <div class="stat-label">生产模型</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon accuracy">
                <el-icon>
                  <TrendCharts />
                </el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ stats.bestAccuracy }}%</div>
                <div class="stat-label">最佳准确率</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon response">
                <el-icon>
                  <Timer />
                </el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ stats.avgResponseTime }}ms</div>
                <div class="stat-label">平均响应时间</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 训练新模型区域 -->
    <el-card class="training-section" style="margin-top: 20px;">
      <template #header>
        <div class="card-header">
          <span>训练新模型</span>
        </div>
      </template>
      <el-form :model="trainingForm" :rules="trainingRules" ref="trainingFormRef" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="模型名称" prop="modelName">
              <el-input v-model="trainingForm.modelName" placeholder="请输入模型名称" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="算法类型" prop="algorithmType">
              <el-select v-model="trainingForm.algorithmType" placeholder="请选择算法类型" style="width: 100%">
                <el-option label="线性回归" value="linear_regression" />
                <el-option label="随机森林" value="random_forest" />
                <el-option label="梯度提升" value="gradient_boosting" />
                <el-option label="支持向量机" value="svm" />
                <el-option label="神经网络" value="neural_network" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="训练数据集" prop="datasetId">
              <el-select v-model="trainingForm.datasetId" placeholder="请选择训练数据集" style="width: 100%">
                <el-option v-for="dataset in availableDatasets" :key="dataset.id" :label="dataset.name"
                  :value="dataset.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="超参数配置">
              <el-input v-model="trainingForm.hyperparameters" type="textarea" :rows="3"
                placeholder="请输入JSON格式的超参数配置" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="描述">
              <el-input v-model="trainingForm.description" type="textarea" :rows="3" placeholder="请输入模型描述" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" @click="handleTraining" :loading="training">
            <el-icon>
              <VideoPlay />
            </el-icon>
            开始训练
          </el-button>
          <el-button @click="resetTrainingForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 模型列表 -->
    <el-card class="models-list" style="margin-top: 20px;">
      <template #header>
        <div class="card-header">
          <span>模型列表</span>
          <div class="header-actions">
            <el-input v-model="searchForm.query" placeholder="搜索模型名称" style="width: 200px; margin-right: 10px;"
              clearable @input="handleSearch">
              <template #prefix>
                <el-icon>
                  <Search />
                </el-icon>
              </template>
            </el-input>
            <el-select v-model="searchForm.algorithmType" placeholder="算法类型" style="width: 140px; margin-right: 10px;"
              clearable @change="handleSearch">
              <el-option label="全部" value="" />
              <el-option label="线性回归" value="linear_regression" />
              <el-option label="随机森林" value="random_forest" />
              <el-option label="梯度提升" value="gradient_boosting" />
              <el-option label="支持向量机" value="svm" />
              <el-option label="神经网络" value="neural_network" />
            </el-select>
            <el-select v-model="searchForm.status" placeholder="状态" style="width: 120px;" clearable
              @change="handleSearch">
              <el-option label="全部" value="" />
              <el-option label="训练中" value="training" />
              <el-option label="已完成" value="completed" />
              <el-option label="生产中" value="production" />
              <el-option label="已部署" value="deployed" />
              <el-option label="已停用" value="inactive" />
              <el-option label="失败" value="failed" />
            </el-select>
          </div>
        </div>
      </template>

      <el-table :data="modelsList" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="模型名称" min-width="150" />
        <el-table-column prop="algorithmType" label="算法类型" width="120">
          <template #default="{ row }">
            <el-tag>{{ getAlgorithmLabel(row.algorithmType) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="accuracy" label="准确率" width="100">
          <template #default="{ row }">
            <span :class="getAccuracyClass(row.accuracy)">{{ row.accuracy }}%</span>
          </template>
        </el-table-column>
        <el-table-column prop="trainingTime" label="训练时间" width="180" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusTagType(row.status)">{{ getStatusLabel(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="responseTime" label="响应时间" width="100">
          <template #default="{ row }">
            <span>{{ row.responseTime }}ms</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleView(row)">
              <el-icon>
                <View />
              </el-icon>
              查看
            </el-button>
            <el-button size="small" type="success" @click="handleDeploy(row)" :disabled="row.status === 'deployed'">
              <el-icon>
                <Upload />
              </el-icon>
              {{ row.status === 'deployed' ? '已部署' : '部署' }}
            </el-button>
            <el-button size="small" type="warning" @click="handleDeactivate(row)" :disabled="row.status === 'inactive'">
              <el-icon>
                <VideoPause />
              </el-icon>
              停用
            </el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">
              <el-icon>
                <Delete />
              </el-icon>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrapper">
        <el-pagination v-model:current-page="pagination.page" v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]" :total="pagination.total" layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </el-card>

    <!-- 查看详情对话框 -->
    <el-dialog v-model="detailDialogVisible" title="模型详情" width="70%">
      <div v-if="currentModel">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="模型名称">{{ currentModel.name }}</el-descriptions-item>
          <el-descriptions-item label="算法类型">{{ getAlgorithmLabel(currentModel.algorithmType) }}</el-descriptions-item>
          <el-descriptions-item label="准确率">{{ currentModel.accuracy }}%</el-descriptions-item>
          <el-descriptions-item label="响应时间">{{ currentModel.responseTime }}ms</el-descriptions-item>
          <el-descriptions-item label="训练时间">{{ currentModel.trainingTime }}</el-descriptions-item>
          <el-descriptions-item label="状态">{{ getStatusLabel(currentModel.status) }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ currentModel.createdAt }}</el-descriptions-item>
          <el-descriptions-item label="最后更新">{{ currentModel.updatedAt }}</el-descriptions-item>
          <el-descriptions-item label="描述" :span="2">{{ currentModel.description || '无' }}</el-descriptions-item>
        </el-descriptions>

        <div style="margin-top: 20px;" v-if="currentModel.metrics">
          <h4>性能指标</h4>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-statistic title="均方误差 (MSE)" :value="currentModel.metrics.mse" :precision="4" />
            </el-col>
            <el-col :span="8">
              <el-statistic title="平均绝对误差 (MAE)" :value="currentModel.metrics.mae" :precision="4" />
            </el-col>
            <el-col :span="8">
              <el-statistic title="R² 分数" :value="currentModel.metrics.r2Score" :precision="4" />
            </el-col>
          </el-row>
        </div>

        <div style="margin-top: 20px;" v-if="currentModel.hyperparameters">
          <h4>超参数配置</h4>
          <el-input :model-value="JSON.stringify(currentModel.hyperparameters, null, 2)" type="textarea" :rows="6"
            readonly />
        </div>
      </div>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  SetUp,
  CircleCheck,
  TrendCharts,
  Timer,
  VideoPlay,
  VideoPause,
  Search,
  View,
  Upload,
  Delete
} from '@element-plus/icons-vue'
import { modelApi, datasetApi } from '@/api/admin'

// 统计数据
const stats = ref({
  totalModels: 0,
  productionModels: 0,
  bestAccuracy: 0,
  avgResponseTime: 0
})

// 训练表单
const trainingForm = reactive({
  modelName: '',
  algorithmType: '',
  datasetId: '',
  hyperparameters: '',
  description: ''
})

const trainingRules = {
  modelName: [{ required: true, message: '请输入模型名称', trigger: 'blur' }],
  algorithmType: [{ required: true, message: '请选择算法类型', trigger: 'change' }],
  datasetId: [{ required: true, message: '请选择训练数据集', trigger: 'change' }]
}

const trainingFormRef = ref()
const training = ref(false)
const availableDatasets = ref([])

// 搜索表单
const searchForm = reactive({
  query: '',
  algorithmType: '',
  status: ''
})

// 模型列表
const modelsList = ref([])
const loading = ref(false)

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 详情对话框
const detailDialogVisible = ref(false)
const currentModel = ref(null)

// 获取统计数据
const fetchStats = async () => {
  try {
    // 临时使用数据集API生成模型统计信息
    const response = await datasetApi.getDatasets({ dataset_type: 'train', page_size: 1000 })
    if (response.code === 200 && response.data) {
      const datasets = response.data.datasets || []
      const processedDatasets = datasets.filter(d => d.status === 'processed')

      stats.value = {
        totalModels: datasets.length,
        productionModels: processedDatasets.length,
        bestAccuracy: (Math.random() * 10 + 90).toFixed(1), // 临时模拟最佳准确率
        avgResponseTime: Math.round(Math.random() * 50 + 30) // 临时模拟平均响应时间
      }
    } else {
      // 默认统计数据
      stats.value = {
        totalModels: 0,
        productionModels: 0,
        bestAccuracy: '0.0',
        avgResponseTime: 0
      }
    }
  } catch (error) {
    console.error('获取统计数据失败:', error)
    // 设置默认值
    stats.value = {
      totalModels: 0,
      productionModels: 0,
      bestAccuracy: '0.0',
      avgResponseTime: 0
    }
  }
}

// 获取可用数据集
const fetchAvailableDatasets = async () => {
  try {
    const response = await datasetApi.getDatasets({ dataset_type: 'train' })
    if (response.code === 200) {
      availableDatasets.value = response.data.datasets || []
    }
  } catch (error) {
    console.error('获取数据集列表失败:', error)
    ElMessage.error('获取数据集列表失败')
  }
}

// 获取模型列表
const fetchModels = async () => {
  loading.value = true
  try {
    const params = {
      query: searchForm.query || undefined,
      algorithm: searchForm.algorithmType || undefined,
      status: searchForm.status || undefined,
      page: pagination.page,
      page_size: pagination.pageSize
    }
    // 临时使用数据集接口，直到模型接口实现
    // const response = await modelApi.getModels(params)
    const response = await datasetApi.getDatasets({
      dataset_type: 'train',
      page: params.page,
      page_size: params.page_size,
      query: params.query
    })
    if (response.code === 200 && response.data) {
      // 处理API响应数据，支持多种可能的数据结构
      const modelsData = response.data.models || response.data.datasets || response.data || []

      // 临时将数据集数据映射为模型列表格式
      modelsList.value = modelsData.map((dataset, index) => ({
        id: dataset.id,
        name: `基于${dataset.name}的模型`,
        algorithmType: 'random_forest', // 临时默认算法
        accuracy: (Math.random() * 20 + 80).toFixed(1), // 临时模拟准确率
        trainingTime: dataset.upload_time ? new Date(dataset.upload_time).toLocaleString() : '-',
        status: dataset.status === 'processed' ? 'trained' : 'training',
        responseTime: Math.round(Math.random() * 100 + 50),
        createdAt: dataset.upload_time ? new Date(dataset.upload_time).toLocaleString() : '-',
        updatedAt: dataset.processed_time ? new Date(dataset.processed_time).toLocaleString() : '-',
        description: dataset.description || `使用${dataset.name}训练的模型`,
        metrics: {
          mse: (Math.random() * 1000 + 500).toFixed(2),
          rmse: (Math.random() * 50 + 20).toFixed(2),
          mae: (Math.random() * 30 + 10).toFixed(2)
        },
        hyperparameters: {
          n_estimators: 100,
          max_depth: 10,
          min_samples_split: 2
        },
        createdByName: dataset.created_by_name || 'unknown',
        trainingDatasetName: dataset.name
      }))
      pagination.total = response.data.total || modelsData.length
    } else {
      modelsList.value = []
      pagination.total = 0
      console.warn('模型API返回数据格式异常:', response)
    }
  } catch (error) {
    console.error('获取模型列表失败:', error)
    ElMessage.error('获取模型列表失败')
    modelsList.value = []
    pagination.total = 0
  } finally {
    loading.value = false
  }
}

// 训练模型
const handleTraining = async () => {
  if (!trainingFormRef.value) return

  await trainingFormRef.value.validate(async (valid) => {
    if (valid) {
      training.value = true
      try {
        const params = {
          ...trainingForm,
          hyperparameters: trainingForm.hyperparameters ? JSON.parse(trainingForm.hyperparameters) : {}
        }

        const response = await modelApi.trainModel(params)
        if (response.data.code === 200) {
          ElMessage.success('模型训练已开始，请稍后查看训练结果')
          resetTrainingForm()
          fetchModels()
          fetchStats()
        } else {
          ElMessage.error(response.data.msg || '训练失败')
        }
      } catch (error) {
        console.error('训练失败:', error)
        ElMessage.error('训练失败')
      } finally {
        training.value = false
      }
    }
  })
}

// 重置训练表单
const resetTrainingForm = () => {
  trainingFormRef.value?.resetFields()
}

// 搜索处理
const handleSearch = () => {
  pagination.page = 1
  fetchModels()
}

// 分页处理
const handleSizeChange = (size) => {
  pagination.pageSize = size
  pagination.page = 1
  fetchModels()
}

const handleCurrentChange = (page) => {
  pagination.page = page
  fetchModels()
}

// 查看详情
const handleView = async (row) => {
  try {
    const response = await modelApi.getModelDetail(row.id)
    if (response.data.code === 200) {
      currentModel.value = response.data.data
      detailDialogVisible.value = true
    }
  } catch (error) {
    console.error('获取详情失败:', error)
    ElMessage.error('获取详情失败')
  }
}

// 部署模型
const handleDeploy = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要部署模型 "${row.name}" 吗？`,
      '确认部署',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }
    )

    const response = await modelApi.updateModelStatus(row.id, 'deployed')
    if (response.data.code === 200) {
      ElMessage.success('部署成功')
      fetchModels()
      fetchStats()
    } else {
      ElMessage.error(response.data.msg || '部署失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('部署失败:', error)
      ElMessage.error('部署失败')
    }
  }
}

// 停用模型
const handleDeactivate = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要停用模型 "${row.name}" 吗？`,
      '确认停用',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const response = await modelApi.updateModelStatus(row.id, 'inactive')
    if (response.data.code === 200) {
      ElMessage.success('停用成功')
      fetchModels()
      fetchStats()
    } else {
      ElMessage.error(response.data.msg || '停用失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('停用失败:', error)
      ElMessage.error('停用失败')
    }
  }
}

// 删除模型
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除模型 "${row.name}" 吗？此操作不可恢复。`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const response = await modelApi.deleteModel(row.id)
    if (response.data.code === 200) {
      ElMessage.success('删除成功')
      fetchModels()
      fetchStats()
    } else {
      ElMessage.error(response.data.msg || '删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 工具函数
const getAlgorithmLabel = (type) => {
  const labels = {
    linear_regression: '线性回归',
    random_forest: '随机森林',
    gradient_boosting: '梯度提升',
    svm: '支持向量机',
    neural_network: '神经网络'
  }
  return labels[type] || type
}

const getStatusLabel = (status) => {
  const labels = {
    training: '训练中',
    completed: '已完成',
    production: '生产中',
    deployed: '已部署',
    inactive: '已停用',
    failed: '失败'
  }
  return labels[status] || status
}

const getStatusTagType = (status) => {
  const types = {
    training: 'warning',
    completed: 'success',
    production: 'primary',
    deployed: 'primary',
    inactive: 'info',
    failed: 'danger'
  }
  return types[status] || ''
}

const getAccuracyClass = (accuracy) => {
  if (accuracy >= 90) return 'accuracy-excellent'
  if (accuracy >= 80) return 'accuracy-good'
  if (accuracy >= 70) return 'accuracy-fair'
  return 'accuracy-poor'
}

// 初始化
onMounted(() => {
  fetchStats()
  fetchAvailableDatasets()
  fetchModels()
})
</script>

<style scoped>
.models-management {
  padding: 20px;
}

.stats-cards {
  margin-bottom: 20px;
}

.stat-card {
  border-radius: 8px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-content {
  display: flex;
  align-items: center;
  padding: 10px 0;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  font-size: 24px;
  color: white;
}

.stat-icon.total {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-icon.production {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stat-icon.accuracy {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.stat-icon.response {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-top: 5px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  align-items: center;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.accuracy-excellent {
  color: #67c23a;
  font-weight: bold;
}

.accuracy-good {
  color: #409eff;
  font-weight: bold;
}

.accuracy-fair {
  color: #e6a23c;
  font-weight: bold;
}

.accuracy-poor {
  color: #f56c6c;
  font-weight: bold;
}

.el-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.el-table {
  border-radius: 8px;
  overflow: hidden;
}

.el-button {
  border-radius: 6px;
}

.el-input,
.el-select {
  border-radius: 6px;
}
</style>