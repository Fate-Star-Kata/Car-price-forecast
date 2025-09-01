<template>
  <div class="min-h-screen bg-base-100 p-6">
    <!-- 页面标题 -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-base-content mb-2">价格趋势分析</h1>
      <p class="text-base-content/70">
        实时掌握二手车市场价格动态，洞察投资机会
      </p>
    </div>

    <!-- 筛选条件 -->
    <div class="card bg-base-200 shadow-lg mb-6">
      <div class="card-body">
        <h2 class="card-title text-lg mb-4">筛选条件</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-9 gap-15">
          <div class="form-control">
            <label class="label">
              <span class="label-text">品牌</span>
            </label>
            <div class="h-8 flex items-center">
              <select
                v-model="filters.brand"
                class="select select-bordered w-full"
              >
                <option value="">全部品牌</option>
                <option
                  v-for="brand in filterOptionsData?.brands || []"
                  :key="brand.value"
                  :value="brand.value"
                >
                  {{ brand.label }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">车型分类</span>
            </label>
            <div class="h-8 flex items-center">
              <select
                v-model="filters.category"
                class="select select-bordered w-full"
              >
                <option value="">全部分类</option>
                <option
                  v-for="model in filterOptionsData?.models || []"
                  :key="model.value"
                  :value="model.value"
                >
                  {{ model.label }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">年份范围</span>
            </label>
            <div class="h-8 flex items-center">
              <select
                v-model="filters.year_range_selected"
                class="select select-bordered select-sm w-full"
              >
                <option value="">全部年份</option>
                <option
                  v-for="yearRange in filterOptionsData?.year_ranges ||
                  []"
                  :key="yearRange.value"
                  :value="yearRange.value"
                >
                  {{ yearRange.label }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">月份选择</span>
            </label>
            <select
              v-model="filters.month"
              class="select select-bordered select-sm w-full"
            >
              <option value="">全部月份</option>
              <option v-for="i in 12" :value="i">{{ i }}月</option>
            </select>
          </div>
          <div class="flex justify-between items-center mt-4">
            <button
              @click="applyFilters"
              class="btn btn-primary btn-sm"
              :disabled="isLoading"
            >
              <span
                v-if="isLoading"
                class="loading loading-spinner loading-sm"
              ></span>
              {{ isLoading ? "加载中..." : "应用筛选" }}
            </button>
          </div>
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
                <button
                  v-for="chartType in chartTypes"
                  :key="chartType.value"
                  @click="selectedChartType = chartType.value"
                  class="btn btn-xs join-item"
                  :class="{
                    'btn-primary': selectedChartType === chartType.value,
                    'btn-outline': selectedChartType !== chartType.value,
                  }"
                >
                  {{ chartType.label }}
                </button>
              </div>
            </div>

            <!-- 图表容器 -->
            <div
              class="h-80 bg-base-100 rounded-lg p-4 flex items-center justify-center"
            >
              <div v-if="isLoading" class="text-center">
                <span class="loading loading-spinner loading-lg"></span>
                <p class="mt-2 text-base-content/70">正在加载图表数据...</p>
              </div>
              <div
                v-else-if="
                  !trendData ||
                  !trendData.datasets ||
                  trendData.datasets.length === 0
                "
                class="text-center text-base-content/50"
              >
                <svg
                  class="w-16 h-16 mx-auto mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  ></path>
                </svg>
                <p>暂无数据</p>
              </div>
              <div v-else class="w-full h-full">
                <!-- ECharts图表组件 -->
                <VChart
                  v-if="chartOption"
                  :option="chartOption"
                  class="w-full h-full"
                  autoresize
                />
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center text-base-content/50"
                >
                  <p>图表数据加载中...</p>
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
                  <tr
                    v-if="
                      !brandComparison ||
                      !brandComparison.labels ||
                      brandComparison.labels.length === 0
                    "
                  >
                    <td
                      colspan="5"
                      class="text-center text-base-content/50 py-8"
                    >
                      暂无品牌对比数据
                    </td>
                  </tr>
                  <tr
                    v-else
                    v-for="(brand, index) in brandComparison.labels"
                    :key="brand"
                  >
                    <td class="font-medium">{{ brand }}</td>
                    <td class="font-semibold text-primary">
                      {{ brandComparison.datasets[0]?.data[index] || 0 }}万
                    </td>
                    <td>
                      <div class="text-sm text-base-content/60">
                        暂无变化数据
                      </div>
                    </td>
                    <td>
                      <div class="text-sm text-base-content/60">
                        暂无份额数据
                      </div>
                    </td>
                    <td class="text-sm">暂无交易量数据</td>
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
              <div
                v-if="!marketStatsData"
                class="col-span-2 text-center text-base-content/50 py-8"
              >
                暂无市场概况数据
              </div>
              <template v-else>
                <div class="stat bg-base-100 rounded-lg p-3">
                  <div class="stat-title text-xs">平均价格</div>
                  <div class="stat-value text-lg text-primary">
                    {{ marketStatsData.average_price || 0 }}
                  </div>
                  <div
                    class="stat-desc"
                    :class="{
                      'text-success': (marketStatsData.monthly_growth || 0) > 0,
                      'text-error': (marketStatsData.monthly_growth || 0) < 0,
                    }"
                  >
                    {{
                      (marketStatsData.monthly_growth || 0) > 0 ? "↗︎" : "↘︎"
                    }}
                    {{
                      ((marketStatsData.monthly_growth || 0) * 100).toFixed(1)
                    }}%
                  </div>
                </div>

                <div class="stat bg-base-100 rounded-lg p-3">
                  <div class="stat-title text-xs">总交易量</div>
                  <div class="stat-value text-lg">
                    {{ formatNumber(marketStatsData.transaction_volume || 0) }}
                  </div>
                  <div class="stat-desc text-base-content/60">本月</div>
                </div>

                <div class="stat bg-base-100 rounded-lg p-3">
                  <div class="stat-title text-xs">活跃挂牌</div>
                  <div class="stat-value text-lg">
                    {{ marketStatsData.monthly_change || 0 }}
                  </div>
                  <div class="stat-desc text-base-content/60">当前</div>
                </div>

                <div class="stat bg-base-100 rounded-lg p-3">
                  <div class="stat-title text-xs">市场热度</div>
                  <div class="stat-value text-lg text-warning">
                    {{ marketStatsData ? calculateMarketHeat() : "暂无" }}
                  </div>
                  <div class="stat-desc text-base-content/60">综合指数</div>
                </div>
              </template>
            </div>
          </div>
        </div>

        <!-- 热门车型排行 -->
        <div class="card bg-base-200 shadow-lg">
          <div class="card-body">
            <h3 class="card-title text-lg mb-4">热门车型排行</h3>

            <div class="space-y-3">
              <div
                v-if="!hotModelsData || hotModelsData.length === 0"
                class="text-center text-base-content/50 py-8"
              >
                暂无热门车型数据
              </div>
              <div
                v-else
                v-for="(vehicle, index) in hotModelsData"
                :key="vehicle.brand_model"
                class="flex items-center gap-3 p-3 bg-base-100 rounded-lg hover:bg-base-300 transition-colors"
              >
                <div class="flex-shrink-0">
                  <div
                    class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                    :class="{
                      'bg-yellow-500 text-white': index === 0,
                      'bg-gray-400 text-white': index === 1,
                      'bg-orange-600 text-white': index === 2,
                      'bg-base-300 text-base-content': index > 2,
                    }"
                  >
                    {{ index + 1 }}
                  </div>
                </div>

                <div class="flex-1 min-w-0">
                  <div class="font-medium text-sm truncate">
                    {{ vehicle.brand_model }}
                  </div>
                  <div class="text-xs text-base-content/60">
                    {{ vehicle.average_price }}
                  </div>
                </div>

                <div class="flex-shrink-0 text-right">
                  <div
                    class="text-xs"
                    :class="{
                      'text-success': vehicle.change_type === 'positive',
                      'text-error': vehicle.change_type === 'negative',
                      'text-base-content': !vehicle.change_type,
                    }"
                  >
                    {{ vehicle.price_change }}
                  </div>
                  <div class="text-xs text-base-content/60">
                    保值率 {{ vehicle.retention_rate }}
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-4">
              <button class="btn btn-outline btn-sm w-full">
                查看完整排行榜
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import VChart from "vue-echarts";
import { use } from "echarts/core";
import {
  CanvasRenderer
} from "echarts/renderers";
import {
  LineChart,
  BarChart
} from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from "echarts/components";
import type {
  TrendsFilter,
  PriceTrendPoint,
  BrandPriceComparison,
  PopularVehicle,
  MarketStats,
} from "@/types/apis/trends_T";
import type { FilterOptionsResponse } from "@/types/apis/trends_T";
import {
  getTrendChart,
  getBrandComparison,
  getMarketStats,
  getHotModels,
  getFilterOptions,
} from "@/api/user/trends";

// 注册ECharts组件
use([
  CanvasRenderer,
  LineChart,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
]);

// 注册Vue组件
const components = {
  VChart
};

// 响应式数据
const isLoading = ref(false);
const selectedPeriod = ref("3M");
const selectedChartType = ref("line");

// 筛选条件
const filters = ref<TrendsFilter>({
  brand: "",
  category: "",
  year_range_selected: "",
  year_range: { start: 2020, end: 2024 },
  month: "",
});

// 基础数据
const brands = ref<{ value: string; label: string }[]>([
  {
    value: "0",
    label: "暂无数据",
  },

]);
const timePeriods = ref([
  { label: "1个月", value: "1M" },
  { label: "3个月", value: "3M" },
  { label: "6个月", value: "6M" },
  { label: "1年", value: "1Y" },
]);
const chartTypes = ref([
  { label: "折线图", value: "line" },
  { label: "柱状图", value: "bar" },
  { label: "面积图", value: "area" },
]);

// 图表数据
const trendData = ref<any>(null);
const brandComparison = ref<any>(null);
const hotModelsData = ref<any[]>([]);
const marketStatsData = ref<any>(null);
const filterOptionsData = ref<any>(null);

// 计算属性
const chartOption = computed(() => {
  if (!trendData.value || !trendData.value.datasets || trendData.value.datasets.length === 0) {
    return null;
  }

  const dataset = trendData.value.datasets[0];
  const labels = trendData.value.labels || [];
  const data = dataset.data || [];

  const baseOption = {
    title: {
      text: '价格趋势分析',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'normal'
      }
    },
    tooltip: {
      trigger: 'axis',
      formatter: '{b}: {c}万元'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: labels,
      axisLine: {
        lineStyle: {
          color: '#e5e7eb'
        }
      },
      axisLabel: {
        color: '#6b7280'
      }
    },
    yAxis: {
      type: 'value',
      name: '价格(万元)',
      axisLine: {
        lineStyle: {
          color: '#e5e7eb'
        }
      },
      axisLabel: {
        color: '#6b7280'
      },
      splitLine: {
        lineStyle: {
          color: '#f3f4f6'
        }
      }
    }
  };

  // 根据图表类型设置不同的series配置
  if (selectedChartType.value === 'line') {
    return {
      ...baseOption,
      series: [{
        name: dataset.label || '平均价格',
        type: 'line',
        data: data,
        smooth: true,
        lineStyle: {
          color: '#3b82f6',
          width: 2
        },
        itemStyle: {
          color: '#3b82f6'
        },
        symbol: 'circle',
        symbolSize: 6
      }]
    };
  } else if (selectedChartType.value === 'bar') {
    return {
      ...baseOption,
      series: [{
        name: dataset.label || '平均价格',
        type: 'bar',
        data: data,
        itemStyle: {
          color: '#3b82f6'
        },
        barWidth: '60%'
      }]
    };
  } else if (selectedChartType.value === 'area') {
    return {
      ...baseOption,
      series: [{
        name: dataset.label || '平均价格',
        type: 'line',
        data: data,
        smooth: true,
        lineStyle: {
          color: '#3b82f6',
          width: 2
        },
        itemStyle: {
          color: '#3b82f6'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: 'rgba(59, 130, 246, 0.3)'
            }, {
              offset: 1, color: 'rgba(59, 130, 246, 0)'
            }]
          }
        },
        symbol: 'circle',
        symbolSize: 6
      }]
    };
  }

  return baseOption;
});

// 方法
const loadTrendChart = async () => {
  try {
    const params: any = {};
    if (filters.value.brand) params.brand = filters.value.brand;

    // 处理年份范围
    if (filters.value.year_range_selected) {
      const [startYear, endYear] = filters.value.year_range_selected
        .split("-")
        .map(Number);
      if (startYear) params.start_year = startYear;
      if (endYear) params.end_year = endYear;
    }

    if (filters.value.month) params.months = parseInt(filters.value.month);

    const response = await getTrendChart(params);
    trendData.value = response.data;
  } catch (error) {
    console.error("加载趋势图表数据失败:", error);
  }
};

const loadBrandComparison = async () => {
  try {
    const params: any = {};

    // 处理年份范围，取开始年份作为对比年份
    if (filters.value.year_range_selected) {
      const [startYear] = filters.value.year_range_selected
        .split("-")
        .map(Number);
      if (startYear) params.year = startYear;
    }

    if (filters.value.month) params.months = parseInt(filters.value.month);
    if (filters.value.brand) params.brands = [filters.value.brand];

    const response = await getBrandComparison(params);
    brandComparison.value = response.data;
  } catch (error) {
    console.error("加载品牌对比数据失败:", error);
  }
};

const loadMarketStats = async () => {
  try {
    const response = await getMarketStats({ period: "month" });
    console.log("时长统计", response.data);
    marketStatsData.value = response.data;
  } catch (error) {
    console.error("加载市场统计数据失败:", error);
  }
};

const loadHotModels = async () => {
  try {
    const response = await getHotModels({ limit: 5 });
    hotModelsData.value = Array.isArray(response.data)
      ? response.data : [];
  } catch (error) {
    console.error("加载热门车型数据失败:", error);
  }
};

const loadFilterOptions = async () => {
  try {
    const response = await getFilterOptions();
    filterOptionsData.value = response.data;
    if (response.data.brands) {
      brands.value = response.data.brands;
    }
  } catch (error) {
    console.error("加载筛选选项失败:", error);
  }
};

const applyFilters = async () => {
  isLoading.value = true;
  try {
    await Promise.all([
      loadTrendChart(),
      loadBrandComparison(),
      loadMarketStats(),
      loadHotModels(),
    ]);
  } catch (error) {
    console.error("加载数据失败:", error);
  } finally {
    isLoading.value = false;
  }
};

const initData = async () => {
  isLoading.value = true;
  try {
    await loadFilterOptions();
    await applyFilters();
  } catch (error) {
    console.error("初始化数据失败:", error);
  } finally {
    isLoading.value = false;
  }
};

const formatNumber = (num: number) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + "万";
  }
  return num.toLocaleString();
};

const calculateMarketHeat = () => {
  if (!marketStatsData.value) return "暂无";
  const activity = marketStatsData.value.monthly_change || 0;
  if (activity > 0.8) return "火热";
  if (activity > 0.6) return "活跃";
  if (activity > 0.4) return "平稳";
  return "冷淡";
};

// 生命周期
onMounted(() => {
  initData();
});
</script>
