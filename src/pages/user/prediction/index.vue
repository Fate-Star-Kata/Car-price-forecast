<template>
  <div class="min-h-screen bg-base-100 p-6">
    <!-- 页面标题 -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-base-content mb-2">二手车价格预测</h1>
      <p class="text-base-content/70">基于AI算法，为您提供精准的二手车价格评估</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 左侧：车辆信息输入表单 -->
      <div class="lg:col-span-2">
        <div class="card bg-base-200 shadow-lg">
          <div class="card-body">
            <h2 class="card-title text-xl mb-4">车辆信息</h2>

            <form @submit.prevent="handlePredict" class="space-y-4">
              <!-- 基本信息 -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="form-control">
                  <label class="label">
                    <span class="label-text">品牌 *</span>
                  </label>
                  <select v-model="vehicleInfo.brand" class="select select-bordered" required>
                    <option value="">请选择品牌</option>
                    <option v-for="brand in brands" :key="brand" :value="brand">{{ brand }}</option>
                  </select>
                </div>

                <div class="form-control">
                  <label class="label">
                    <span class="label-text">车型 *</span>
                  </label>
                  <select v-model="vehicleInfo.model" class="select select-bordered" required :disabled="!vehicleInfo.brand">
                    <option value="">请选择车型</option>
                    <option v-for="model in availableModels" :key="model" :value="model">{{ model }}</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="form-control">
                  <label class="label">
                    <span class="label-text">年份 *</span>
                  </label>
                  <input v-model.number="vehicleInfo.year" type="number" class="input input-bordered"
                         :min="1990" :max="new Date().getFullYear()" required>
                </div>

                <div class="form-control">
                  <label class="label">
                    <span class="label-text">里程数 (万公里) *</span>
                  </label>
                  <input v-model.number="vehicleInfo.mileage" type="number" class="input input-bordered"
                         min="0" step="0.1" required>
                </div>

                <div class="form-control">
                  <label class="label">
                    <span class="label-text">排量 (L)</span>
                  </label>
                  <input v-model.number="vehicleInfo.engine_size" type="number" class="input input-bordered"
                         min="0" step="0.1">
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="form-control">
                  <label class="label">
                    <span class="label-text">燃料类型</span>
                  </label>
                  <select v-model="vehicleInfo.fuel_type" class="select select-bordered">
                    <option value="">请选择燃料类型</option>
                    <option value="汽油">汽油</option>
                    <option value="柴油">柴油</option>
                    <option value="混合动力">混合动力</option>
                    <option value="纯电动">纯电动</option>
                  </select>
                </div>

                <div class="form-control">
                  <label class="label">
                    <span class="label-text">变速箱类型</span>
                  </label>
                  <select v-model="vehicleInfo.transmission" class="select select-bordered">
                    <option value="">请选择变速箱类型</option>
                    <option value="手动">手动</option>
                    <option value="自动">自动</option>
                    <option value="CVT">CVT</option>
                  </select>
                </div>
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text">车辆状况</span>
                </label>
                <textarea v-model="vehicleInfo.condition" class="textarea textarea-bordered"
                          placeholder="请描述车辆的整体状况、维修记录、事故情况等"></textarea>
              </div>

              <!-- 预测按钮 -->
              <div class="card-actions justify-end mt-6">
                <button type="submit" class="btn btn-primary" :disabled="isLoading">
                  <span v-if="isLoading" class="loading loading-spinner loading-sm"></span>
                  {{ isLoading ? '预测中...' : '开始预测' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- 右侧：预测结果展示 -->
      <div class="lg:col-span-1">
        <!-- 预测结果卡片 -->
        <div v-if="predictionResult" class="card bg-base-200 shadow-lg mb-6">
          <div class="card-body">
            <h3 class="card-title text-lg mb-4">预测结果</h3>

            <div class="text-center mb-4">
              <div class="text-3xl font-bold text-primary mb-2">
                ¥{{ formatPrice(predictionResult.predicted_price) }}
              </div>
              <div class="text-sm text-base-content/70">
                预测价格范围：¥{{ formatPrice(predictionResult.price_range.min) }} - ¥{{ formatPrice(predictionResult.price_range.max) }}
              </div>
            </div>

            <div class="divider"></div>

            <!-- 置信度 -->
            <div class="mb-4">
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm">预测置信度</span>
                <span class="text-sm font-semibold">{{ (predictionResult.confidence * 100).toFixed(1) }}%</span>
              </div>
              <progress class="progress progress-primary" :value="predictionResult.confidence * 100" max="100"></progress>
            </div>

            <!-- 影响因素 -->
            <div>
              <h4 class="font-semibold mb-2">主要影响因素</h4>
              <div class="space-y-2">
                <div v-for="factor in predictionResult.influence_factors" :key="factor.factor"
                     class="flex justify-between items-center">
                  <span class="text-sm">{{ factor.factor }}</span>
                  <div class="flex items-center">
                    <span class="text-sm font-medium" :class="{
                      'text-success': factor.impact > 0,
                      'text-error': factor.impact < 0,
                      'text-base-content': factor.impact === 0
                    }">
                      {{ factor.impact > 0 ? '+' : '' }}{{ (factor.impact * 100).toFixed(1) }}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 模型选择卡片 -->
        <div class="card bg-base-200 shadow-lg">
          <div class="card-body">
            <h3 class="card-title text-lg mb-4">预测模型</h3>

            <div class="form-control">
              <label class="label">
                <span class="label-text">选择预测模型</span>
              </label>
              <select v-model="selectedModel" class="select select-bordered select-sm">
                <option value="default">默认模型 (推荐)</option>
                <option value="advanced">高级模型</option>
                <option value="fast">快速模型</option>
              </select>
            </div>

            <div class="mt-4 text-xs text-base-content/60">
              <p>• 默认模型：平衡准确性和速度</p>
              <p>• 高级模型：更高准确性，耗时较长</p>
              <p>• 快速模型：快速预测，准确性略低</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 历史预测记录 -->
    <div v-if="predictionHistory.length > 0" class="mt-8">
      <div class="card bg-base-200 shadow-lg">
        <div class="card-body">
          <h3 class="card-title text-xl mb-4">历史预测记录</h3>

          <div class="overflow-x-auto">
            <table class="table table-zebra">
              <thead>
                <tr>
                  <th>预测时间</th>
                  <th>车辆信息</th>
                  <th>预测价格</th>
                  <th>置信度</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="record in predictionHistory" :key="record.id">
                  <td>{{ formatDate(record.created_at) }}</td>
                  <td>{{ record.vehicle_info.brand }} {{ record.vehicle_info.model }} ({{ record.vehicle_info.year }}年)</td>
                  <td class="font-semibold text-primary">¥{{ formatPrice(record.predicted_price) }}</td>
                  <td>
                    <div class="badge badge-outline">{{ (record.confidence * 100).toFixed(1) }}%</div>
                  </td>
                  <td>
                    <button @click="loadHistoryRecord(record)" class="btn btn-ghost btn-xs">查看详情</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { VehicleInfo, PredictionResult, PredictionHistory } from '@/types/factory'

// 响应式数据
const isLoading = ref(false)
const selectedModel = ref('default')
const predictionResult = ref<PredictionResult | null>(null)
const predictionHistory = ref<PredictionHistory[]>([])

// 车辆信息表单
const vehicleInfo = ref<VehicleInfo>({
  brand: '',
  model: '',
  year: new Date().getFullYear(),
  mileage: 0,
  engine_size: 0,
  fuel_type: '',
  transmission: '',
  condition: ''
})

// 品牌和车型数据
const brands = ref(['奥迪', '宝马', '奔驰', '大众', '丰田', '本田', '日产', '现代', '起亚', '福特'])
const brandModels = ref<Record<string, string[]>>({
  '奥迪': ['A3', 'A4', 'A6', 'Q3', 'Q5', 'Q7'],
  '宝马': ['1系', '3系', '5系', 'X1', 'X3', 'X5'],
  '奔驰': ['A级', 'C级', 'E级', 'GLA', 'GLC', 'GLE'],
  '大众': ['朗逸', '帕萨特', '迈腾', '途观', '途岳', '途昂'],
  '丰田': ['卡罗拉', '凯美瑞', '汉兰达', 'RAV4', '普拉多', '陆地巡洋舰'],
  '本田': ['思域', '雅阁', 'CR-V', '缤智', '冠道', '艾力绅'],
  '日产': ['轩逸', '天籁', '奇骏', '逍客', '楼兰', '途达'],
  '现代': ['朗动', '索纳塔', '途胜', 'ix35', '胜达', '库斯途'],
  '起亚': ['K3', 'K5', '智跑', '狮跑', '索兰托', '嘉华'],
  '福特': ['福克斯', '蒙迪欧', '翼虎', '锐界', '探险者', '撼路者']
})

// 计算属性
const availableModels = computed(() => {
  return vehicleInfo.value.brand ? brandModels.value[vehicleInfo.value.brand] || [] : []
})

// 方法
const handlePredict = async () => {
  isLoading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 2000))

    // 模拟预测结果
    predictionResult.value = {
      predicted_price: Math.floor(Math.random() * 200000) + 50000,
      price_range: {
        min: Math.floor(Math.random() * 150000) + 40000,
        max: Math.floor(Math.random() * 250000) + 60000
      },
      confidence: Math.random() * 0.3 + 0.7,
      influence_factors: [
        { factor: '车龄', impact: -0.15 },
        { factor: '里程数', impact: -0.12 },
        { factor: '品牌价值', impact: 0.08 },
        { factor: '车型热度', impact: 0.05 },
        { factor: '市场供需', impact: 0.03 }
      ]
    }

    // 添加到历史记录
    const historyRecord: PredictionHistory = {
      id: Date.now().toString(),
      vehicle_info: { ...vehicleInfo.value },
      predicted_price: predictionResult.value.predicted_price,
      confidence: predictionResult.value.confidence,
      created_at: new Date().toISOString()
    }
    predictionHistory.value.unshift(historyRecord)

  } catch (error) {
    console.error('预测失败:', error)
  } finally {
    isLoading.value = false
  }
}

const loadHistoryRecord = (record: PredictionHistory) => {
  vehicleInfo.value = { ...record.vehicle_info }
  predictionResult.value = {
    predicted_price: record.predicted_price,
    price_range: {
      min: record.predicted_price * 0.9,
      max: record.predicted_price * 1.1
    },
    confidence: record.confidence,
    influence_factors: [
      { factor: '车龄', impact: -0.15 },
      { factor: '里程数', impact: -0.12 },
      { factor: '品牌价值', impact: 0.08 }
    ]
  }
}

const formatPrice = (price: number) => {
  return price.toLocaleString('zh-CN')
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('zh-CN')
}

// 生命周期
onMounted(() => {
  // 可以在这里加载历史记录
})
</script>