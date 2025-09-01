<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800">
    <!-- 主要内容区域 -->
    <div class="container mx-auto px-4 py-16">
      <!-- 标题区域 -->
      <div class="text-center space-y-8 mb-16">
        <RevealMotion :delay="0">
          <h1
            class="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            智能二手车价格预测系统
          </h1>
        </RevealMotion>

        <RevealMotion :delay="0.1">
          <p class="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            基于AI机器学习技术，为您提供精准的二手车价格评估与市场趋势分析
          </p>
        </RevealMotion>

        <RevealMotion :delay="0.2">
          <div class="flex items-center justify-center gap-4 pt-4">
            <router-link to="/user/prediction"
              class="btn btn-primary btn-lg rounded-full px-8 shadow-lg hover:shadow-xl transition-all">
              开始预测
            </router-link>
            <router-link to="/user/trends"
              class="btn btn-outline btn-lg rounded-full px-8 hover:bg-blue-50 transition-all">
              查看趋势
            </router-link>
          </div>
        </RevealMotion>
      </div>

      <!-- 核心功能展示 -->
      <div class="max-w-6xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <RevealMotion v-for="(feature, i) in features" :key="i" :delay="i * 0.1">
            <div class="card bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0">
              <div class="card-body p-6 text-center">
                <div class="text-4xl mb-4">{{ feature.icon }}</div>
                <h3 class="card-title text-lg font-semibold text-gray-800 justify-center">{{ feature.title }}</h3>
                <p class="text-gray-600 text-sm mt-2">{{ feature.desc }}</p>
              </div>
            </div>
          </RevealMotion>
        </div>
      </div>

      <!-- 数据统计 -->
      <div class="mt-20">
        <RevealMotion :delay="0.4">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-gray-800 mb-4">平台数据概览</h2>
            <p class="text-gray-600">实时更新的市场数据，助您做出明智决策</p>
          </div>
        </RevealMotion>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <RevealMotion v-for="(stat, i) in stats" :key="i" :delay="0.5 + i * 0.1">
            <div class="text-center p-6 bg-white rounded-xl shadow-md">
              <div class="text-3xl font-bold text-blue-600 mb-2">{{ stat.value }}</div>
              <div class="text-gray-600 text-sm">{{ stat.label }}</div>
            </div>
          </RevealMotion>
        </div>
      </div>
    </div>

    <!-- 页脚 -->
    <footer class="bg-gray-800 text-white py-8 mt-20">
      <div class="container mx-auto px-4 text-center">
        <p class="text-gray-300">{{ footerText }}</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
/**
 * 动画说明：
 * - 使用你指定的 motion-v：import { Motion } from 'motion-v'
 * - RevealMotion 组件内部用 IntersectionObserver 监听进入视口
 * - 初始：opacity 0 + y 16；进入：opacity 1 + y 0
 */
import { h, defineComponent, onMounted, onBeforeUnmount, ref, computed } from "vue";
import { Motion } from "motion-v";

const footerText = import.meta.env.VITE_APP_FOOTER || "版权所有 © 2025 HZSYSTEM";

type RevealProps = { delay?: number };
const RevealMotion = defineComponent<RevealProps>({
  name: "RevealMotion",
  props: { delay: { type: Number, default: 0 } },
  setup(props, { slots }) {
    const el = ref<HTMLElement | null>(null);
    const inView = ref(false);
    let io: IntersectionObserver | null = null;

    // 使用 computed 来确保响应式更新
    const animateProps = computed(() => {
      return inView.value
        ? { opacity: 1, y: 0, transition: { duration: 0.6, delay: props.delay } }
        : { opacity: 0, y: 16 };
    });

    onMounted(() => {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              inView.value = true;
              // 只动画一次，注释掉下一行可反复触发
              io?.unobserve(e.target);
            }
          });
        },
        { threshold: 0.15 }
      );
      if (el.value) io.observe(el.value);
    });

    onBeforeUnmount(() => io?.disconnect());

    return () =>
      h(
        "div",
        {
          ref: el,
        },
        [
          h(
            // Motion 组件：用 initial + animate
            Motion as any,
            {
              initial: { opacity: 0, y: 16 },
              animate: animateProps.value,
            },
            slots
          )
        ]
      );
  },
});

// 二手车价格预测系统核心功能
const features = [
  { title: "智能预测", desc: "AI算法精准评估车辆价值", icon: "🤖" },
  { title: "趋势分析", desc: "实时掌握市场价格动态", icon: "📈" },
  { title: "模型训练", desc: "自定义训练预测模型", icon: "🧠" },
  { title: "社区交流", desc: "与专家用户互动分享", icon: "💬" },
];

// 平台数据统计
const stats = [
  { value: "50万+", label: "车辆数据" },
  { value: "95%", label: "预测准确率" },
  { value: "10万+", label: "用户信赖" },
  { value: "24/7", label: "实时服务" },
];
</script>

<style scoped>
/* 禁用滚动 */
html,
body {
  overflow: hidden;
}
</style>
