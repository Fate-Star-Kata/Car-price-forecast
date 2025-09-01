<script setup lang="ts">
import { Motion } from 'motion-v'
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Refresh,
  Upload,
  Download,
  Delete,
  View,
  Search,
  Plus,
  Document,
  DataAnalysis,
  Files
} from '@element-plus/icons-vue'
import { datasetApi } from '@/api/admin'
import type {
  DatasetItem,
  DatasetStats,
  DatasetQueryForm,
  DatasetUploadForm,
  DatasetListResponse,
  DatasetStatsResponse
} from '@/types/apis/dataset'

// 响应式数据
const loading = ref(false)
const uploadLoading = ref(false)
const tableLoading = ref(false)
const datasets = ref<DatasetItem[]>([])
const stats = ref<DatasetStats>({
  total_datasets: 0,
  total_records: 0,
  processed_datasets: 0,
  failed_datasets: 0,
  dataset_types: {
    train: 0,
    test: 0,
    validation: 0
  }
})

// 分页信息
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
})

// 查询表单
const queryForm = reactive<DatasetQueryForm>({
  query: '',
  dataset_type: '',
  status: ''
})

// 上传表单
const uploadForm = reactive<DatasetUploadForm>({
  name: '',
  description: '',
  dataset_type: 'train',
  file: null
})

// 上传对话框显示状态
const uploadDialogVisible = ref(false)

// 数据集类型选项
const datasetTypeOptions = [
  { label: '全部', value: '' },
  { label: '训练集', value: 'train' },
  { label: '测试集', value: 'test' },
  { label: '验证集', value: 'validation' }
]

// 状态选项
const statusOptions = [
  { label: '全部', value: '' },
  { label: '上传中', value: 'uploading' },
  { label: '处理中', value: 'processing' },
  { label: '已处理', value: 'processed' },
  { label: '失败', value: 'failed' }
]

// 状态标签类型映射
const statusTagType = {
  uploading: 'info',
  processing: 'warning',
  processed: 'success',
  failed: 'danger'
}

// 数据集类型标签类型映射
const datasetTypeTagType = {
  train: 'primary',
  test: 'success',
  validation: 'warning'
}

// 动画配置
const cardVariants = {
  initial: { opacity: 0, y: 30, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  whileHover: {
    scale: 1.02,
    y: -5,
    transition: { duration: 0.2, ease: ['easeOut'] }
  },
  transition: { duration: 0.4, ease: ['easeOut'] }
}

const statsCardVariants = {
  initial: { opacity: 0, y: 40, scale: 0.9 },
  animate: { opacity: 1, y: 0, scale: 1 },
  whileHover: {
    scale: 1.05,
    y: -8,
    transition: { duration: 0.3, ease: ['easeOut'] }
  },
  transition: { duration: 0.5, ease: ['easeOut'] }
}

const iconVariants = {
  initial: { scale: 0, rotate: -180 },
  animate: { scale: 1, rotate: 0 },
  whileHover: {
    scale: 1.2,
    rotate: 10,
    transition: { duration: 0.2, ease: ['easeOut'] }
  },
  transition: { duration: 0.6, delay: 0.3, ease: ['easeOut'] }
}

// 计算属性
const filteredDatasets = computed(() => {
  return datasets.value.filter(dataset => {
    const matchQuery = !queryForm.query ||
      dataset.name.toLowerCase().includes(queryForm.query.toLowerCase()) ||
      dataset.created_by_name.toLowerCase().includes(queryForm.query.toLowerCase())
    const matchType = !queryForm.dataset_type || dataset.dataset_type === queryForm.dataset_type
    const matchStatus = !queryForm.status || dataset.status === queryForm.status
    return matchQuery && matchType && matchStatus
  })
})

// 获取数据集统计信息
const fetchStats = async () => {
  try {
    const response = await datasetApi.getDatasetStats() as DatasetStatsResponse
    if (response.code === 200) {
      stats.value = response.data
    }
  } catch (error) {
    console.error('获取统计信息失败:', error)
  }
}

// 获取数据集列表
const fetchDatasets = async () => {
  tableLoading.value = true
  try {
    const params = {
      query: queryForm.query || undefined,
      page: pagination.current,
      page_size: pagination.pageSize,
      dataset_type: queryForm.dataset_type || undefined,
      status: queryForm.status || undefined
    }
    const response = await datasetApi.getDatasets(params) as DatasetListResponse
    if (response.code === 200) {
      datasets.value = response.data.datasets
      pagination.total = response.data.total
    }
  } catch (error) {
    console.error('获取数据集列表失败:', error)
    ElMessage.error('获取数据集列表失败')
  } finally {
    tableLoading.value = false
  }
}

// 刷新数据
const refreshData = async () => {
  loading.value = true
  try {
    await Promise.all([fetchStats(), fetchDatasets()])
    ElMessage.success('数据刷新成功')
  } catch (error) {
    ElMessage.error('数据刷新失败')
  } finally {
    loading.value = false
  }
}

// 搜索数据集
const handleSearch = () => {
  pagination.current = 1
  fetchDatasets()
}

// 重置搜索
const handleReset = () => {
  queryForm.query = ''
  queryForm.dataset_type = ''
  queryForm.status = ''
  pagination.current = 1
  fetchDatasets()
}

// 分页变化
const handlePageChange = (page: number) => {
  pagination.current = page
  fetchDatasets()
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  pagination.current = 1
  fetchDatasets()
}

// 打开上传对话框
const openUploadDialog = () => {
  uploadForm.name = ''
  uploadForm.description = ''
  uploadForm.dataset_type = 'train'
  uploadForm.file = null
  uploadDialogVisible.value = true
}

// 文件选择处理
const handleFileChange = (file: File) => {
  uploadForm.file = file
  if (!uploadForm.name) {
    uploadForm.name = file.name.replace(/\.[^/.]+$/, '')
  }
}

// 上传数据集
const handleUpload = async () => {
  if (!uploadForm.file) {
    ElMessage.warning('请选择要上传的文件')
    return
  }
  if (!uploadForm.name.trim()) {
    ElMessage.warning('请输入数据集名称')
    return
  }

  uploadLoading.value = true
  try {
    const formData = new FormData()
    formData.append('file', uploadForm.file)
    formData.append('name', uploadForm.name)
    formData.append('description', uploadForm.description)
    formData.append('dataset_type', uploadForm.dataset_type)

    const response = await datasetApi.uploadDataset(formData)
    if (response.data.code === 200) {
      ElMessage.success('数据集上传成功')
      uploadDialogVisible.value = false
      await refreshData()
    } else {
      ElMessage.error(response.data.msg || '上传失败')
    }
  } catch (error) {
    console.error('上传失败:', error)
    ElMessage.error('上传失败，请重试')
  } finally {
    uploadLoading.value = false
  }
}

// 查看数据集详情
const viewDataset = async (dataset: DatasetItem) => {
  try {
    const response = await datasetApi.getDatasetDetail(dataset.id)
    if (response.data.code === 200) {
      const detail = response.data.data
      ElMessageBox.alert(
        `<div style="text-align: left;">
          <p><strong>名称：</strong>${detail.name}</p>
          <p><strong>描述：</strong>${detail.description || '无'}</p>
          <p><strong>类型：</strong>${detail.dataset_type}</p>
          <p><strong>记录数：</strong>${detail.record_count.toLocaleString()}</p>
          <p><strong>状态：</strong>${detail.status}</p>
          <p><strong>文件路径：</strong>${detail.file_path || '无'}</p>
          <p><strong>上传时间：</strong>${new Date(detail.upload_time).toLocaleString()}</p>
          <p><strong>创建者：</strong>${detail.created_by_name}</p>
        </div>`,
        '数据集详情',
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定'
        }
      )
    }
  } catch (error) {
    ElMessage.error('获取数据集详情失败')
  }
}

// 删除数据集
const deleteDataset = async (dataset: DatasetItem) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除数据集 "${dataset.name}" 吗？此操作不可恢复。`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const response = await datasetApi.deleteDataset(dataset.id)
    if (response.data.code === 200) {
      ElMessage.success('数据集删除成功')
      await refreshData()
    } else {
      ElMessage.error(response.data.msg || '删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败，请重试')
    }
  }
}

// 格式化文件大小
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 格式化时间
const formatTime = (timeStr: string) => {
  return new Date(timeStr).toLocaleString()
}

// 组件挂载时获取数据
onMounted(() => {
  refreshData()
})
</script>

<template>
  <div class="data-management">
    <!-- 页面标题和操作 -->
    <Motion :initial="cardVariants.initial" :animate="cardVariants.animate" :whileHover="cardVariants.whileHover as any"
      :transition="{ ...cardVariants.transition, delay: 0.1 } as any">
      <el-card class="mb-6">
        <template #header>
          <div class="flex items-center justify-between">
            <span class="text-lg font-medium">数据管理</span>
            <div class="flex gap-2">
              <Motion :initial="{ scale: 0.8, opacity: 0 }" :animate="{ scale: 1, opacity: 1 }"
                :whileHover="{ scale: 1.05 }" :transition="{ duration: 0.3, delay: 0.3 }">
                <el-button type="primary" :icon="Plus" @click="openUploadDialog">
                  上传数据集
                </el-button>
              </Motion>
              <Motion :initial="{ scale: 0.8, opacity: 0 }" :animate="{ scale: 1, opacity: 1 }"
                :whileHover="{ scale: 1.05 }" :transition="{ duration: 0.3, delay: 0.4 }">
                <el-button :icon="Refresh" :loading="loading" @click="refreshData">
                  刷新
                </el-button>
              </Motion>
            </div>
          </div>
        </template>

        <!-- 统计卡片 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Motion :initial="statsCardVariants.initial" :animate="statsCardVariants.animate"
            :whileHover="statsCardVariants.whileHover as any"
            :transition="{ ...statsCardVariants.transition, delay: 0.2 } as any"
            class="bg-blue-50 p-6 rounded-lg cursor-pointer">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-blue-600 text-sm font-medium">总数据集</p>
                <Motion :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }"
                  :transition="{ duration: 0.4, delay: 0.4 }">
                  <p class="text-2xl font-bold text-blue-900">{{ stats.total_datasets }}</p>
                </Motion>
              </div>
              <Motion :initial="iconVariants.initial" :animate="iconVariants.animate"
                :whileHover="iconVariants.whileHover as any"
                :transition="{ ...iconVariants.transition, delay: 0.3 } as any" class="text-blue-500">
                <el-icon size="32">
                  <Files />
                </el-icon>
              </Motion>
            </div>
          </Motion>

          <Motion :initial="statsCardVariants.initial" :animate="statsCardVariants.animate"
            :whileHover="statsCardVariants.whileHover as any"
            :transition="{ ...statsCardVariants.transition, delay: 0.3 } as any"
            class="bg-green-50 p-6 rounded-lg cursor-pointer">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-green-600 text-sm font-medium">总记录数</p>
                <Motion :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }"
                  :transition="{ duration: 0.4, delay: 0.5 }">
                  <p class="text-2xl font-bold text-green-900">{{ stats.total_records.toLocaleString() }}</p>
                </Motion>
              </div>
              <Motion :initial="iconVariants.initial" :animate="iconVariants.animate"
                :whileHover="iconVariants.whileHover as any"
                :transition="{ ...iconVariants.transition, delay: 0.4 } as any" class="text-green-500">
                <el-icon size="32">
                  <DataAnalysis />
                </el-icon>
              </Motion>
            </div>
          </Motion>

          <Motion :initial="statsCardVariants.initial" :animate="statsCardVariants.animate"
            :whileHover="statsCardVariants.whileHover as any"
            :transition="{ ...statsCardVariants.transition, delay: 0.4 } as any"
            class="bg-yellow-50 p-6 rounded-lg cursor-pointer">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-yellow-600 text-sm font-medium">已处理</p>
                <Motion :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }"
                  :transition="{ duration: 0.4, delay: 0.6 }">
                  <p class="text-2xl font-bold text-yellow-900">{{ stats.processed_datasets }}</p>
                </Motion>
              </div>
              <Motion :initial="iconVariants.initial" :animate="iconVariants.animate"
                :whileHover="iconVariants.whileHover as any"
                :transition="{ ...iconVariants.transition, delay: 0.5 } as any" class="text-yellow-500">
                <el-icon size="32">
                  <Document />
                </el-icon>
              </Motion>
            </div>
          </Motion>

          <Motion :initial="statsCardVariants.initial" :animate="statsCardVariants.animate"
            :whileHover="statsCardVariants.whileHover as any"
            :transition="{ ...statsCardVariants.transition, delay: 0.5 } as any"
            class="bg-red-50 p-6 rounded-lg cursor-pointer">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-red-600 text-sm font-medium">处理失败</p>
                <Motion :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }"
                  :transition="{ duration: 0.4, delay: 0.7 }">
                  <p class="text-2xl font-bold text-red-900">{{ stats.failed_datasets }}</p>
                </Motion>
              </div>
              <Motion :initial="iconVariants.initial" :animate="iconVariants.animate"
                :whileHover="iconVariants.whileHover as any"
                :transition="{ ...iconVariants.transition, delay: 0.6 } as any" class="text-red-500">
                <el-icon size="32">
                  <Delete />
                </el-icon>
              </Motion>
            </div>
          </Motion>
        </div>
      </el-card>
    </Motion>

    <!-- 搜索和筛选 -->
    <Motion :initial="cardVariants.initial" :animate="cardVariants.animate" :whileHover="cardVariants.whileHover as any"
      :transition="{ ...cardVariants.transition, delay: 0.6 } as any">
      <el-card class="mb-6">
        <el-form :model="queryForm" inline>
          <el-form-item label="搜索">
            <el-input v-model="queryForm.query" placeholder="搜索数据集名称或创建者" :prefix-icon="Search" clearable
              style="width: 250px" @keyup.enter="handleSearch" />
          </el-form-item>
          <el-form-item label="数据集类型">
            <el-select v-model="queryForm.dataset_type" placeholder="选择类型" clearable style="width: 150px">
              <el-option v-for="option in datasetTypeOptions" :key="option.value" :label="option.label"
                :value="option.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="queryForm.status" placeholder="选择状态" clearable style="width: 150px">
              <el-option v-for="option in statusOptions" :key="option.value" :label="option.label"
                :value="option.value" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" @click="handleSearch">
              搜索
            </el-button>
            <el-button @click="handleReset">
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </Motion>

    <!-- 数据集列表 -->
    <Motion :initial="cardVariants.initial" :animate="cardVariants.animate" :whileHover="cardVariants.whileHover as any"
      :transition="{ ...cardVariants.transition, delay: 0.7 } as any">
      <el-card>
        <template #header>
          <span class="font-medium">数据集列表</span>
        </template>

        <el-table :data="filteredDatasets" :loading="tableLoading" stripe style="width: 100%">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="name" label="数据集名称" min-width="200" show-overflow-tooltip />
          <el-table-column prop="dataset_type" label="类型" width="100">
            <template #default="{ row }">
              <el-tag :type="datasetTypeTagType[row.dataset_type as keyof typeof datasetTypeTagType]" size="small">
                {{ row.dataset_type === 'train' ? '训练集' :
                  row.dataset_type === 'test' ? '测试集' :
                    row.dataset_type === 'validation' ? '验证集' : row.dataset_type }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="record_count" label="记录数" width="120">
            <template #default="{ row }">
              {{ row.record_count.toLocaleString() }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="statusTagType[row.status as keyof typeof statusTagType]" size="small">
                {{ row.status === 'uploading' ? '上传中' :
                  row.status === 'processing' ? '处理中' :
                    row.status === 'processed' ? '已处理' :
                      row.status === 'failed' ? '失败' : row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="created_by_name" label="创建者" width="120" />
          <el-table-column prop="upload_time" label="上传时间" width="180">
            <template #default="{ row }">
              {{ formatTime(row.upload_time) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" :icon="View" size="small" @click="viewDataset(row)">
                查看
              </el-button>
              <el-button type="danger" :icon="Delete" size="small" @click="deleteDataset(row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="flex justify-center mt-6">
          <el-pagination v-model:current-page="pagination.current" v-model:page-size="pagination.pageSize"
            :page-sizes="[10, 20, 50, 100]" :total="pagination.total" layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange" @current-change="handlePageChange" />
        </div>
      </el-card>
    </Motion>

    <!-- 上传数据集对话框 -->
    <el-dialog v-model="uploadDialogVisible" title="上传数据集" width="500px" :close-on-click-modal="false">
      <el-form :model="uploadForm" label-width="100px">
        <el-form-item label="数据集名称" required>
          <el-input v-model="uploadForm.name" placeholder="请输入数据集名称" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="uploadForm.description" type="textarea" :rows="3" placeholder="请输入数据集描述（可选）" />
        </el-form-item>
        <el-form-item label="数据集类型" required>
          <el-select v-model="uploadForm.dataset_type" style="width: 100%">
            <el-option label="训练集" value="train" />
            <el-option label="测试集" value="test" />
            <el-option label="验证集" value="validation" />
          </el-select>
        </el-form-item>
        <el-form-item label="选择文件" required>
          <el-upload :auto-upload="false" :show-file-list="true" :limit="1" accept=".csv,.xlsx,.xls"
            :on-change="(file: any) => handleFileChange(file.raw)">
            <el-button :icon="Upload">选择文件</el-button>
            <template #tip>
              <div class="el-upload__tip">
                支持 CSV、Excel 格式文件，文件大小不超过 100MB
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="uploadDialogVisible = false">取消</el-button>
          <el-button type="primary" :loading="uploadLoading" @click="handleUpload">
            上传
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.data-management {
  width: 100%;
}

/* 统计卡片增强样式 */
.cursor-pointer {
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.cursor-pointer:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* 响应式动画优化 */
@media (prefers-reduced-motion: reduce) {
  .cursor-pointer {
    transition: none;
  }
}

/* 增强卡片视觉效果 */
.el-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.el-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
}

/* 表格样式优化 */
.el-table {
  border-radius: 8px;
  overflow: hidden;
}

/* 对话框样式 */
.dialog-footer {
  text-align: right;
}

.el-upload__tip {
  color: #909399;
  font-size: 12px;
  margin-top: 8px;
}
</style>