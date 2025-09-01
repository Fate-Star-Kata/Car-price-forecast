<template>
  <div class="min-h-screen bg-gradient-to-br from-base-100 to-base-200">
    <!-- 顶部横幅区域 -->
    <div class="bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-base-300">
      <div class="container mx-auto px-6 py-12">
        <div class="text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-4">
            <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
          <h1 class="text-4xl font-bold text-base-content mb-3">智能价格预测</h1>
          <p class="text-lg text-base-content/70 max-w-2xl mx-auto">运用先进的机器学习算法，结合市场数据和车辆特征，为您提供精准可靠的二手车价格评估</p>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="container mx-auto px-6 py-8">
      <div class="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <!-- 左侧：车辆信息输入表单 -->
        <div class="xl:col-span-3">
          <div class="bg-base-100 rounded-2xl shadow-xl border border-base-300/50">
            <div class="p-8">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                </div>
                <h2 class="text-2xl font-bold text-base-content">车辆信息录入</h2>
              </div>

              <form @submit.prevent="handlePredict" class="space-y-8">
                <!-- 基本信息区块 -->
                <div class="bg-base-50 rounded-xl p-6 border border-base-200">
                  <h3 class="text-lg font-semibold text-base-content mb-4 flex items-center gap-2">
                    <span class="w-2 h-2 bg-primary rounded-full"></span>
                    基本信息
                  </h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="form-control">
                      <label class="label">
                        <span class="label-text font-medium text-base-content">品牌 *</span>
                      </label>
                      <select v-model="vehicleInfo.brand" class="select select-bordered select-lg bg-base-100 border-2 focus:border-primary" required>
                        <option value="">请选择品牌</option>
                        <option v-for="brand in brands" :key="brand" :value="brand">{{ brand }}</option>
                      </select>
                    </div>

                    <div class="form-control">
                      <label class="label">
                        <span class="label-text font-medium text-base-content">车型 *</span>
                      </label>
                      <select v-model="vehicleInfo.model" class="select select-bordered select-lg bg-base-100 border-2 focus:border-primary" required :disabled="!vehicleInfo.brand">
                        <option value="">请选择车型</option>
                        <option v-for="model in availableModels" :key="model" :value="model">{{ model }}</option>
                      </select>
                    </div>
                  </div>
                </div>

                <!-- 技术参数区块 -->
                <div class="bg-base-50 rounded-xl p-6 border border-base-200">
                  <h3 class="text-lg font-semibold text-base-content mb-4 flex items-center gap-2">
                    <span class="w-2 h-2 bg-secondary rounded-full"></span>
                    技术参数
                  </h3>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="form-control">
                      <label class="label">
                        <span class="label-text font-medium text-base-content">年份 *</span>
                      </label>
                      <input v-model.number="vehicleInfo.year" type="number" class="input input-bordered input-lg bg-base-100 border-2 focus:border-primary"
                             :min="1990" :max="new Date().getFullYear()" required>
                    </div>

                    <div class="form-control">
                      <label class="label">
                        <span class="label-text font-medium text-base-content">里程数 (万公里) *</span>
                      </label>
                      <input v-model.number="vehicleInfo.mileage" type="number" class="input input-bordered input-lg bg-base-100 border-2 focus:border-primary"
                             min="0" step="0.1" required>
                    </div>

                    <div class="form-control">
                      <label class="label">
                        <span class="label-text font-medium text-base-content">排量 (L)</span>
                      </label>
                      <input v-model.number="vehicleInfo.engine_size" type="number" class="input input-bordered input-lg bg-base-100 border-2 focus:border-primary"
                             min="0" step="0.1">
                    </div>
                  </div>
                </div>

                <!-- 配置信息区块 -->
                <div class="bg-base-50 rounded-xl p-6 border border-base-200">
                  <h3 class="text-lg font-semibold text-base-content mb-4 flex items-center gap-2">
                    <span class="w-2 h-2 bg-accent rounded-full"></span>
                    配置信息
                  </h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="form-control">
                      <label class="label">
                        <span class="label-text font-medium text-base-content">燃料类型</span>
                      </label>
                      <select v-model="vehicleInfo.fuel_type" class="select select-bordered select-lg bg-base-100 border-2 focus:border-primary">
                        <option value="">请选择燃料类型</option>
                        <option value="汽油">汽油</option>
                        <option value="柴油">柴油</option>
                        <option value="混合动力">混合动力</option>
                        <option value="纯电动">纯电动</option>
                      </select>
                    </div>

                    <div class="form-control">
                      <label class="label">
                        <span class="label-text font-medium text-base-content">变速箱类型</span>
                      </label>
                      <select v-model="vehicleInfo.transmission" class="select select-bordered select-lg bg-base-100 border-2 focus:border-primary">
                        <option value="">请选择变速箱类型</option>
                        <option value="手动">手动</option>
                        <option value="自动">自动</option>
                        <option value="CVT">CVT</option>
                      </select>
                    </div>
                  </div>
                </div>

                <!-- 车辆状况区块 -->
                <div class="bg-base-50 rounded-xl p-6 border border-base-200">
                  <h3 class="text-lg font-semibold text-base-content mb-4 flex items-center gap-2">
                    <span class="w-2 h-2 bg-warning rounded-full"></span>
                    车辆状况
                  </h3>
                  <div class="form-control">
                    <label class="label">
                      <span class="label-text font-medium text-base-content">详细描述</span>
                    </label>
                    <textarea v-model="vehicleInfo.condition" class="textarea textarea-bordered textarea-lg bg-base-100 border-2 focus:border-primary h-32"
                              placeholder="请详细描述车辆的整体状况、维修记录、事故情况、外观内饰状态等信息，这将有助于提高预测准确性..."></textarea>
                  </div>
                </div>

                <!-- 预测按钮 -->
                <div class="flex justify-center pt-4">
                  <button type="submit" class="btn btn-primary btn-lg px-12 shadow-lg hover:shadow-xl transition-all duration-300" :disabled="isLoading">
                    <span v-if="isLoading" class="loading loading-spinner loading-md mr-2"></span>
                    <svg v-else class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                    {{ isLoading ? '智能分析中...' : '开始智能预测' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- 右侧：预测结果和模型选择 -->
        <div class="xl:col-span-1 space-y-6">
          <!-- 模型选择卡片 -->
          <div class="bg-base-100 rounded-2xl shadow-xl border border-base-300/50 sticky top-6">
            <div class="p-6">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                  </svg>
                </div>
                <h3 class="text-xl font-bold text-base-content">AI预测模型</h3>
              </div>

              <div class="form-control mb-6">
                <label class="label">
                  <span class="label-text font-medium text-base-content">选择预测模型</span>
                </label>
                <select v-model="selectedModel" class="select select-bordered select-lg bg-base-100 border-2 focus:border-secondary">
                  <option value="default">🎯 默认模型 (推荐)</option>
                  <option value="advanced">🚀 高级模型</option>
                  <option value="fast">⚡ 快速模型</option>
                </select>
              </div>

              <div class="bg-base-50 rounded-lg p-4 space-y-2">
                <div class="flex items-center gap-2 text-sm">
                  <span class="w-2 h-2 bg-success rounded-full"></span>
                  <span class="text-base-content/80">默认模型：平衡准确性和速度</span>
                </div>
                <div class="flex items-center gap-2 text-sm">
                  <span class="w-2 h-2 bg-info rounded-full"></span>
                  <span class="text-base-content/80">高级模型：更高准确性，耗时较长</span>
                </div>
                <div class="flex items-center gap-2 text-sm">
                  <span class="w-2 h-2 bg-warning rounded-full"></span>
                  <span class="text-base-content/80">快速模型：快速预测，准确性略低</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 预测结果卡片 -->
          <div v-if="predictionResult" class="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl shadow-xl border border-primary/20">
            <div class="p-6">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 class="text-xl font-bold text-base-content">预测结果</h3>
              </div>

              <!-- 主要价格显示 -->
              <div class="text-center mb-6 p-6 bg-base-100 rounded-xl border border-primary/10">
                <div class="text-4xl font-bold text-primary mb-2">
                  ¥{{ formatPrice(predictionResult.predicted_price) }}
                </div>
                <div class="text-sm text-base-content/70 mb-3">
                  预测价格范围
                </div>
                <div class="text-lg font-semibold text-base-content">
                  ¥{{ formatPrice(predictionResult.price_range.min) }} - ¥{{ formatPrice(predictionResult.price_range.max) }}
                </div>
              </div>

              <!-- 置信度 -->
              <div class="mb-6">
                <div class="flex justify-between items-center mb-3">
                  <span class="font-medium text-base-content">预测置信度</span>
                  <span class="text-lg font-bold text-primary">{{ (predictionResult.confidence * 100).toFixed(1) }}%</span>
                </div>
                <div class="relative">
                  <progress class="progress progress-primary w-full h-3" :value="predictionResult.confidence * 100" max="100"></progress>
                  <div class="absolute inset-0 flex items-center justify-center text-xs font-medium text-base-100">
                    {{ predictionResult.confidence >= 0.8 ? '高置信度' : predictionResult.confidence >= 0.6 ? '中等置信度' : '低置信度' }}
                  </div>
                </div>
              </div>

              <!-- 影响因素 -->
              <div>
                <h4 class="font-semibold mb-4 text-base-content">主要影响因素</h4>
                <div class="space-y-3">
                  <div v-for="factor in predictionResult.influence_factors" :key="factor.factor"
                       class="flex justify-between items-center p-3 bg-base-100 rounded-lg border border-base-200">
                    <span class="font-medium text-base-content">{{ factor.factor }}</span>
                    <div class="flex items-center gap-2">
                      <span class="text-sm font-bold px-2 py-1 rounded-full" :class="{
                        'text-success bg-success/10': factor.impact > 0,
                        'text-error bg-error/10': factor.impact < 0,
                        'text-base-content bg-base-200': factor.impact === 0
                      }">
                        {{ factor.impact > 0 ? '+' : '' }}{{ (factor.impact * 100).toFixed(1) }}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
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