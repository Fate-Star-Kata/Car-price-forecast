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

              <form @submit.prevent="handlePredict" class="space-y-3">
                <!-- 基本信息区块 -->
                <div class="bg-base-50 rounded-xl p-6 border border-base-200">
                  <h3 class="text-lg font-semibold text-base-content mb-4 flex items-center gap-2">
                    <span class="w-2 h-2 bg-primary rounded-full"></span>
                    基本信息
                  </h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="form-control">
                      <label class="text-lg font-bold text-base-content mb-3 block">
                        品牌 <span class="text-red-500">*</span>
                      </label>
                      <input v-model="vehicleInfo.brand" type="text" class="input input-bordered input-lg bg-base-100 border-2 focus:border-primary" 
                             placeholder="请输入品牌，如：奥迪、宝马、奔驰、大众、丰田等" required>
                    </div>

                    <div class="form-control">
                      <label class="text-lg font-bold text-base-content mb-3 block">
                        车型 <span class="text-red-500">*</span>
                      </label>
                      <input v-model="vehicleInfo.model" type="text" class="input input-bordered input-lg bg-base-100 border-2 focus:border-primary" 
                             placeholder="请输入车型，如：A4、3系、C级、朗逸、卡罗拉等" required>
                    </div>
                  </div>
                </div>

                <!-- 技术参数区块 -->
                <div class="bg-base-50 rounded-xl p-6 border border-base-200">
                  <h3 class="text-lg font-semibold text-base-content mb-4 flex items-center gap-2">
                    <span class="w-2 h-2 bg-secondary rounded-full"></span>
                    技术参数
                  </h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="form-control">
                      <label class="text-lg font-bold text-base-content mb-3 block">
                        年份 <span class="text-red-500">*</span>
                      </label>
                      <input v-model.number="vehicleInfo.year" type="number" class="input input-bordered input-lg bg-base-100 border-2 focus:border-primary"
                             :min="1990" :max="new Date().getFullYear()" required>
                    </div>

                    <div class="form-control">
                      <label class="text-lg font-bold text-base-content mb-3 block">
                        里程数 (万公里) <span class="text-red-500">*</span>
                      </label>
                      <input v-model.number="vehicleInfo.mileage" type="number" class="input input-bordered input-lg bg-base-100 border-2 focus:border-primary"
                             min="0" step="0.1" required>
                    </div>

                    <div class="form-control">
                      <label class="text-lg font-bold text-base-content mb-3 block">
                        排量 (L) <span class="text-red-500">*</span>
                      </label>
                      <input v-model.number="vehicleInfo.displacement" type="number" class="input input-bordered input-lg bg-base-100 border-2 focus:border-primary"
                             min="0" step="0.1" required>
                    </div>
                  </div>
                </div>

                <!-- 配置信息区块 -->
                <div class="bg-base-50 rounded-xl p-6 border border-base-200">
                  <h3 class="text-lg font-semibold text-base-content mb-4 flex items-center gap-2">
                    <span class="w-2 h-2 bg-accent rounded-full"></span>
                    配置信息
                  </h3>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">


                    <div class="form-control">
                      <label class="text-lg font-bold text-base-content mb-3 block">
                        变速箱类型 <span class="text-red-500">*</span>
                      </label>
                      <select v-model="vehicleInfo.transmission" class="select select-bordered select-lg bg-base-100 border-2 focus:border-primary" required>
                        <option value="">请选择变速箱类型</option>
                        <option value="manual">手动</option>
                        <option value="automatic">自动</option>
                        <option value="cvt">CVT</option>
                      </select>
                    </div>

                    <div class="form-control">
                      <label class="text-lg font-bold text-base-content mb-3 block">
                        所在城市 <span class="text-red-500">*</span>
                      </label>
                      <input v-model="vehicleInfo.city" type="text" class="input input-bordered input-lg bg-base-100 border-2 focus:border-primary" 
                             placeholder="请输入城市，如：北京、上海、广州、深圳等" required>
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
                    <label class="text-lg font-bold text-base-content mb-3 block">
                      车况等级 <span class="text-red-500">*</span>
                    </label>
                    <select v-model="vehicleInfo.condition" class="select select-bordered select-lg bg-base-100 border-2 focus:border-primary" required>
                      <option value="excellent">优秀 - 车况极佳，无明显磨损</option>
                      <option value="good">良好 - 车况良好，正常使用痕迹</option>
                      <option value="fair">一般 - 有一定磨损，但不影响使用</option>
                      <option value="poor">较差 - 磨损较重，需要维修</option>
                    </select>
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
          <div class="bg-base-100 rounded-2xl shadow-xl border border-base-300/50">
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
                  <option value="random_forest">🎯 随机森林模型 (推荐)</option>
                  <option value="gradient_boosting">🚀 梯度提升模型</option>
                  <option value="linear_regression">⚡ 线性回归模型</option>
                </select>
              </div>

              <div class="bg-base-50 rounded-lg p-4 space-y-2">
                <div v-if="selectedModel === 'random_forest'" class="flex items-center gap-2 mt-2">
                  <span class="text-base-content/80">随机森林：平衡准确性和稳定性</span>
                </div>
                <div v-else-if="selectedModel === 'gradient_boosting'" class="flex items-center gap-2 mt-2">
                  <span class="text-base-content/80">梯度提升：高精度预测，计算时间较长</span>
                </div>
                <div v-else-if="selectedModel === 'linear_regression'" class="flex items-center gap-2 mt-2">
                  <span class="text-base-content/80">线性回归：快速预测，准确性略低</span>
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
                  <div class="flex justify-between items-center p-3 bg-base-100 rounded-lg border border-base-200">
                    <span class="font-medium text-base-content">车龄影响</span>
                    <div class="flex items-center gap-2">
                      <span class="text-sm font-bold px-2 py-1 rounded-full text-base-content bg-base-200">
                        {{ predictionResult.factor_analysis.age_impact }}%
                      </span>
                    </div>
                  </div>
                  <div class="flex justify-between items-center p-3 bg-base-100 rounded-lg border border-base-200">
                    <span class="font-medium text-base-content">里程影响</span>
                    <div class="flex items-center gap-2">
                      <span class="text-sm font-bold px-2 py-1 rounded-full text-base-content bg-base-200">
                        {{ predictionResult.factor_analysis.mileage_impact }}%
                      </span>
                    </div>
                  </div>
                  <div class="flex justify-between items-center p-3 bg-base-100 rounded-lg border border-base-200">
                    <span class="font-medium text-base-content">品牌影响</span>
                    <div class="flex items-center gap-2">
                      <span class="text-sm font-bold px-2 py-1 rounded-full text-base-content bg-base-200">
                        {{ predictionResult.factor_analysis.brand_impact }}%
                      </span>
                    </div>
                  </div>
                  <div class="flex justify-between items-center p-3 bg-base-100 rounded-lg border border-base-200">
                    <span class="font-medium text-base-content">其他影响</span>
                    <div class="flex items-center gap-2">
                      <span class="text-sm font-bold px-2 py-1 rounded-full text-base-content bg-base-200">
                        {{ predictionResult.factor_analysis.other_impact }}%
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
import { ref, onMounted } from 'vue'
import type { VehicleInfo, PredictionResult, PredictionHistory } from '@/types/factory'
import type { PredictionRequest, ModelSelectOption } from '@/types/apis/prediction_T'
import { predictPrice } from '@/api/user/prediction'

// 响应式数据
const isLoading = ref(false)
const selectedModel = ref<ModelSelectOption>('random_forest')
const predictionResult = ref<PredictionResult | null>(null)
const predictionHistory = ref<PredictionHistory[]>([])

// 车辆信息表单
const vehicleInfo = ref<VehicleInfo>({
  brand: '',
  model: '',
  year: new Date().getFullYear(),
  mileage: 0,
  displacement: 0, // 排量
  transmission: '',
  condition: 'good', // 默认车况为good
  city: '' // 用户输入城市
})

// 方法
const handlePredict = async () => {
  isLoading.value = true
  try {
    // 构建API请求参数
    const requestData: PredictionRequest = {
      brand: vehicleInfo.value.brand,
      model: vehicleInfo.value.model,
      year: vehicleInfo.value.year,
      mileage: vehicleInfo.value.mileage,
      displacement: vehicleInfo.value.displacement,
      transmission: vehicleInfo.value.transmission,
      condition: vehicleInfo.value.condition,
      city: vehicleInfo.value.city,
      model_select: selectedModel.value
    }

    // 调用API
    const response = await predictPrice(requestData)
    
    if (response.code === 200) {
      // 转换API响应为页面所需格式
      predictionResult.value = {
        predicted_price: response.data.predicted_price,
        price_range: {
          min: response.data.price_range.min,
          max: response.data.price_range.max
        },
        confidence: response.data.confidence_score / 100, // 转换为0-1范围
        factor_analysis: {
          age_impact: response.data.factor_analysis.age_impact,
          mileage_impact: response.data.factor_analysis.mileage_impact,
          brand_impact: response.data.factor_analysis.brand_impact,
          other_impact: response.data.factor_analysis.other_impact
        },
        model_used: response.data.model_used,
        market_insights: response.data.market_insights
      }

      // 添加到历史记录
      const historyRecord: PredictionHistory = {
        id: response.data.record_id,
        vehicle_info: { ...vehicleInfo.value },
        predicted_price: response.data.predicted_price,
        confidence: response.data.confidence_score / 100,
        model_type: selectedModel.value,
        created_at: new Date().toISOString()
      }
      predictionHistory.value.unshift(historyRecord)
    } else {
      throw new Error(response.msg || '预测失败')
    }

  } catch (error) {
    console.error('预测失败:', error)
    // 可以添加错误提示
    alert('预测失败，请检查输入信息或稍后重试')
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
    factor_analysis: {
      age_impact: 15,
      mileage_impact: 12,
      brand_impact: 8,
      other_impact: 10
    },
    model_used: record.model_type,
    market_insights: {}
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