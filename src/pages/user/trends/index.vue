<template>
  <div class="min-h-screen bg-base-100 p-6">
    <!-- 页面标题 -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-base-content mb-2">价格趋势分析</h1>
      <p class="text-base-content/70">实时掌握二手车市场价格动态，洞察投资机会</p>
    </div>

    <!-- 筛选条件 -->
    <div class="card bg-base-200 shadow-lg mb-6">
      <div class="card-body">
        <h2 class="card-title text-lg mb-4">筛选条件</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">品牌</span>
            </label>
            <select v-model="filters.brand" class="select select-bordered select-sm">
              <option value="">全部品牌</option>
              <option v-for="brand in brands" :key="brand" :value="brand">{{ brand }}</option>
            </select>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">车型分类</span>
            </label>
            <select v-model="filters.category" class="select select-bordered select-sm">
              <option value="">全部分类</option>
              <option value="轿车">轿车</option>
              <option value="SUV">SUV</option>
              <option value="两厢车">两厢车</option>
              <option value="MPV">MPV</option>
            </select>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">年份范围</span>
            </label>
            <div class="flex gap-2">
              <input v-model.number="filters.year_range.start" type="number"
                     class="input input-bordered input-sm w-20" :min="2000" :max="2024" placeholder="起">
              <span class="self-center">-</span>
              <input v-model.number="filters.year_range.end" type="number"
                     class="input input-bordered input-sm w-20" :min="2000" :max="2024" placeholder="止">
            </div>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">价格范围 (万元)</span>
            </label>
            <div class="flex gap-2">
              <input v-model.number="filters.price_range.min" type="number"
                     class="input input-bordered input-sm w-20" min="0" placeholder="最低">
              <span class="self-center">-</span>
              <input v-model.number="filters.price_range.max" type="number"
                     class="input input-bordered input-sm w-20" min="0" placeholder="最高">
            </div>
          </div>
        </div>

        <div class="flex justify-between items-center mt-4">
          <div class="flex gap-2">
            <div class="form-control">
              <label class="label">
                <span class="label-text">时间周期</span>
              </label>
              <div class="join">
                <button v-for="period in timePeriods" :key="period.value"
                        @click="selectedPeriod = period.value"
                        class="btn btn-sm join-item"
                        :class="{ 'btn-primary': selectedPeriod === period.value, 'btn-outline': selectedPeriod !== period.value }">
                  {{ period.label }}
                </button>
              </div>
            </div>
          </div>

          <button @click="applyFilters" class="btn btn-primary btn-sm" :disabled="isLoading">
            <span v-if="isLoading" class="loading loading-spinner loading-sm"></span>
            {{ isLoading ? '加载中...' : '应用筛选' }}
          </button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <!-- 左侧：价格趋势图表 -->
      <div class="xl:col-span-2 space-y-6">
        <!-- 价格趋势图 -->
        <div class="card bg-base-200 shadow-lg">
          <div class="card-body">
            <div class="flex justify-between items-center mb-4">
              <h3 class="card-title text-lg">价格趋势</h3>
              <div class="join">
                <button v-for="chartType in chartTypes" :key="chartType.value"
                        @click="selectedChartType = chartType.value"
                        class="btn btn-xs join-item"
                        :class="{ 'btn-primary': selectedChartType === chartType.value, 'btn-outline': selectedChartType !== chartType.value }">
                  {{ chartType.label }}
                </button>
              </div>
            </div>

            <!-- 图表容器 -->
            <div class="h-80 bg-base-100 rounded-lg p-4 flex items-center justify-center">
              <div v-if="isLoading" class="text-center">
                <span class="loading loading-spinner loading-lg"></span>
                <p class="mt-2 text-base-content/70">正在加载图表数据...</p>
              </div>
              <div v-else-if="trendData.length === 0" class="text-center text-base-content/50">
                <svg class="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                <p>暂无数据</p>
              </div>
              <div v-else class="w-full h-full">
                <!-- 这里应该集成真实的图表库，如 Chart.js 或 ECharts -->
                <div class="relative w-full h-full">
                  <!-- 模拟折线图 -->
                  <svg class="w-full h-full" viewBox="0 0 400 200">
                    <defs>
                      <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:0.3" />
                        <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:0" />
                      </linearGradient>
                    </defs>

                    <!-- 网格线 -->
                    <g stroke="#e5e7eb" stroke-width="1" opacity="0.3">
                      <line v-for="i in 5" :key="`h-${i}`" :x1="0" :y1="i * 40" :x2="400" :y2="i * 40" />
                      <line v-for="i in 6" :key="`v-${i}`" :x1="i * 80" :y1="0" :x2="i * 80" :y2="200" />
                    </g>

                    <!-- 价格趋势线 -->
                    <polyline :points="trendLinePoints" fill="url(#priceGradient)" stroke="#3b82f6" stroke-width="2" />

                    <!-- 数据点 -->
                    <circle v-for="(point, index) in mockTrendPoints" :key="index"
                            :cx="point.x" :cy="point.y" r="4" fill="#3b82f6" />
                  </svg>

                  <!-- 图表说明 -->
                  <div class="absolute bottom-2 left-2 text-xs text-base-content/60">
                    平均价格变化趋势 ({{ selectedPeriod }})
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 品牌价格对比 -->
        <div class="card bg-base-200 shadow-lg">
          <div class="card-body">
            <h3 class="card-title text-lg mb-4">品牌价格对比</h3>

            <div class="overflow-x-auto">
              <table class="table table-zebra table-sm">
                <thead>
                  <tr>
                    <th>品牌</th>
                    <th>平均价格</th>
                    <th>价格变化</th>
                    <th>市场份额</th>
                    <th>交易量</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="brand in brandComparison" :key="brand.brand">
                    <td class="font-medium">{{ brand.brand }}</td>
                    <td class="font-semibold text-primary">¥{{ formatPrice(brand.average_price) }}</td>
                    <td>
                      <div class="flex items-center gap-1" :class="{
                        'text-success': brand.price_change > 0,
                        'text-error': brand.price_change < 0,
                        'text-base-content': brand.price_change === 0
                      }">
                        <svg v-if="brand.price_change > 0" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                        </svg>
                        <svg v-else-if="brand.price_change < 0" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                        <span class="text-sm font-medium">{{ brand.price_change > 0 ? '+' : '' }}{{ (brand.price_change * 100).toFixed(1) }}%</span>
                      </div>
                    </td>
                    <td>
                      <div class="flex items-center gap-2">
                        <progress class="progress progress-primary w-16" :value="brand.market_share * 100" max="100"></progress>
                        <span class="text-xs">{{ (brand.market_share * 100).toFixed(1) }}%</span>
                      </div>
                    </td>
                    <td class="text-sm">{{ brand.transaction_count.toLocaleString() }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：热门车型排行和市场统计 -->
      <div class="space-y-6">
        <!-- 市场统计 -->
        <div class="card bg-base-200 shadow-lg">
          <div class="card-body">
            <h3 class="card-title text-lg mb-4">市场概况</h3>

            <div class="grid grid-cols-2 gap-4">
              <div class="stat bg-base-100 rounded-lg p-3">
                <div class="stat-title text-xs">平均价格</div>
                <div class="stat-value text-lg text-primary">¥{{ formatPrice(marketStats.average_price) }}</div>
                <div class="stat-desc" :class="{
                  'text-success': marketStats.monthly_growth > 0,
                  'text-error': marketStats.monthly_growth < 0
                }">
                  {{ marketStats.monthly_growth > 0 ? '↗︎' : '↘︎' }} {{ (marketStats.monthly_growth * 100).toFixed(1) }}%
                </div>
              </div>

              <div class="stat bg-base-100 rounded-lg p-3">
                <div class="stat-title text-xs">总交易量</div>
                <div class="stat-value text-lg">{{ formatNumber(marketStats.total_transactions) }}</div>
                <div class="stat-desc text-base-content/60">本月</div>
              </div>

              <div class="stat bg-base-100 rounded-lg p-3">
                <div class="stat-title text-xs">活跃挂牌</div>
                <div class="stat-value text-lg">{{ formatNumber(marketStats.active_listings) }}</div>
                <div class="stat-desc text-base-content/60">当前</div>
              </div>

              <div class="stat bg-base-100 rounded-lg p-3">
                <div class="stat-title text-xs">市场热度</div>
                <div class="stat-value text-lg text-warning">{{ calculateMarketHeat() }}</div>
                <div class="stat-desc text-base-content/60">综合指数</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 热门车型排行 -->
        <div class="card bg-base-200 shadow-lg">
          <div class="card-body">
            <h3 class="card-title text-lg mb-4">热门车型排行</h3>

            <div class="space-y-3">
              <div v-for="vehicle in popularVehicles" :key="vehicle.rank"
                   class="flex items-center gap-3 p-3 bg-base-100 rounded-lg hover:bg-base-300 transition-colors">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" :class="{
                    'bg-yellow-500 text-white': vehicle.rank === 1,
                    'bg-gray-400 text-white': vehicle.rank === 2,
                    'bg-orange-600 text-white': vehicle.rank === 3,
                    'bg-base-300 text-base-content': vehicle.rank > 3
                  }">
                    {{ vehicle.rank }}
                  </div>
                </div>

                <div class="flex-1 min-w-0">
                  <div class="font-medium text-sm truncate">{{ vehicle.brand }} {{ vehicle.model }}</div>
                  <div class="text-xs text-base-content/60">¥{{ formatPrice(vehicle.average_price) }}</div>
                </div>

                <div class="flex-shrink-0 text-right">
                  <div class="text-xs" :class="{
                    'text-success': vehicle.price_change > 0,
                    'text-error': vehicle.price_change < 0,
                    'text-base-content': vehicle.price_change === 0
                  }">
                    {{ vehicle.price_change > 0 ? '+' : '' }}{{ (vehicle.price_change * 100).toFixed(1) }}%
                  </div>
                  <div class="text-xs text-base-content/60">保值率 {{ (vehicle.retention_rate * 100).toFixed(0) }}%</div>
                </div>
              </div>
            </div>

            <div class="mt-4">
              <button class="btn btn-outline btn-sm w-full">查看完整排行榜</button>
            </div>
          </div>
        </div>

        <!-- 价格预警 -->
        <div class="card bg-base-200 shadow-lg">
          <div class="card-body">
            <h3 class="card-title text-lg mb-4">价格预警</h3>

            <div class="space-y-2">
              <div class="alert alert-warning py-2">
                <svg class="stroke-current shrink-0 w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div class="text-xs">
                  <div class="font-medium">奥迪A4价格上涨</div>
                  <div class="text-warning/70">近7天涨幅达8.5%</div>
                </div>
              </div>

              <div class="alert alert-info py-2">
                <svg class="stroke-current shrink-0 w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div class="text-xs">
                  <div class="font-medium">SUV市场活跃</div>
                  <div class="text-info/70">交易量环比增长15%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { TrendsFilter, PriceTrendPoint, BrandPriceComparison, PopularVehicle, MarketStats } from '@/types/factory'

// 响应式数据
const isLoading = ref(false)
const selectedPeriod = ref('3M')
const selectedChartType = ref('line')

// 筛选条件
const filters = ref<TrendsFilter>({
  brand: '',
  category: '',
  year_range: { start: 2020, end: 2024 },
  price_range: { min: 0, max: 0 }
})

// 基础数据
const brands = ref(['奥迪', '宝马', '奔驰', '大众', '丰田', '本田', '日产', '现代', '起亚', '福特'])
const timePeriods = ref([
  { label: '1个月', value: '1M' },
  { label: '3个月', value: '3M' },
  { label: '6个月', value: '6M' },
  { label: '1年', value: '1Y' }
])
const chartTypes = ref([
  { label: '折线图', value: 'line' },
  { label: '柱状图', value: 'bar' },
  { label: '面积图', value: 'area' }
])

// 图表数据
const trendData = ref<PriceTrendPoint[]>([])
const brandComparison = ref<BrandPriceComparison[]>([
  { brand: '奥迪', average_price: 185000, price_change: 0.085, market_share: 0.15, transaction_count: 1250 },
  { brand: '宝马', average_price: 195000, price_change: 0.062, market_share: 0.18, transaction_count: 1480 },
  { brand: '奔驰', average_price: 210000, price_change: 0.045, market_share: 0.16, transaction_count: 1320 },
  { brand: '大众', average_price: 125000, price_change: -0.025, market_share: 0.22, transaction_count: 1850 },
  { brand: '丰田', average_price: 135000, price_change: 0.015, market_share: 0.20, transaction_count: 1650 }
])

const popularVehicles = ref<PopularVehicle[]>([
  { rank: 1, brand: '大众', model: '朗逸', average_price: 85000, price_change: 0.025, transaction_count: 450, retention_rate: 0.72 },
  { rank: 2, brand: '丰田', model: '卡罗拉', average_price: 92000, price_change: 0.018, transaction_count: 380, retention_rate: 0.75 },
  { rank: 3, brand: '本田', model: '思域', average_price: 98000, price_change: 0.032, transaction_count: 320, retention_rate: 0.73 },
  { rank: 4, brand: '大众', model: '帕萨特', average_price: 145000, price_change: -0.015, transaction_count: 280, retention_rate: 0.68 },
  { rank: 5, brand: '奥迪', model: 'A4', average_price: 185000, price_change: 0.085, transaction_count: 250, retention_rate: 0.70 }
])

const marketStats = ref<MarketStats>({
  average_price: 142000,
  monthly_growth: 0.035,
  total_transactions: 8650,
  active_listings: 25400
})

// 计算属性
const mockTrendPoints = computed(() => {
  // 模拟趋势点数据
  return [
    { x: 50, y: 150 },
    { x: 100, y: 120 },
    { x: 150, y: 140 },
    { x: 200, y: 110 },
    { x: 250, y: 130 },
    { x: 300, y: 100 },
    { x: 350, y: 90 }
  ]
})

const trendLinePoints = computed(() => {
  return mockTrendPoints.value.map(point => `${point.x},${point.y}`).join(' ')
})

// 方法
const applyFilters = async () => {
  isLoading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1500))

    // 模拟更新数据
    console.log('应用筛选条件:', filters.value)

  } catch (error) {
    console.error('加载数据失败:', error)
  } finally {
    isLoading.value = false
  }
}

const formatPrice = (price: number) => {
  return (price / 10000).toFixed(1) + '万'
}

const formatNumber = (num: number) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toLocaleString()
}

const calculateMarketHeat = () => {
  // 简单的市场热度计算
  const heat = (marketStats.value.monthly_growth + 0.1) * 50
  if (heat > 80) return '火热'
  if (heat > 60) return '活跃'
  if (heat > 40) return '平稳'
  return '冷淡'
}

// 生命周期
onMounted(() => {
  applyFilters()
})
</script>