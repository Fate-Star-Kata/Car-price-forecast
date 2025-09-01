<template>
  <div class="min-h-screen bg-base-100 p-6">
    <!-- 页面标题 -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-base-content mb-2">社区交流</h1>
      <p class="text-base-content/70">与其他用户分享经验，讨论二手车相关话题</p>
    </div>

    <!-- 社区统计 -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div class="stat bg-base-200 rounded-lg shadow">
        <div class="stat-figure text-primary">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z">
            </path>
          </svg>
        </div>
        <div class="stat-title">总帖子数</div>
        <div class="stat-value text-primary">{{ communityStats.total_posts.toLocaleString() }}</div>
        <div class="stat-desc">今日新增 {{ communityStats.today_posts }} 个</div>
      </div>

      <div class="stat bg-base-200 rounded-lg shadow">
        <div class="stat-figure text-success">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z">
            </path>
          </svg>
        </div>
        <div class="stat-title">活跃用户</div>
        <div class="stat-value text-success">{{ communityStats.active_users.toLocaleString() }}</div>
        <div class="stat-desc">本周活跃用户数</div>
      </div>

      <div class="stat bg-base-200 rounded-lg shadow">
        <div class="stat-figure text-warning">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z">
            </path>
          </svg>
        </div>
        <div class="stat-title">总回复数</div>
        <div class="stat-value text-warning">{{ communityStats.total_replies.toLocaleString() }}</div>
        <div class="stat-desc">平均每帖 {{ (communityStats.total_replies / communityStats.total_posts).toFixed(1) }} 个回复
        </div>
      </div>

      <div class="stat bg-base-200 rounded-lg shadow">
        <div class="stat-figure text-info">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z">
            </path>
          </svg>
        </div>
        <div class="stat-title">总点赞数</div>
        <div class="stat-value text-info">{{ communityStats.total_likes.toLocaleString() }}</div>
        <div class="stat-desc">用户互动热度</div>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-4 gap-6">
      <!-- 左侧：分类和筛选 -->
      <div class="xl:col-span-1">
        <div class="card bg-base-200 shadow-lg mb-6">
          <div class="card-body">
            <h3 class="card-title text-lg mb-4">讨论分类</h3>

            <div class="space-y-2">
              <button v-for="category in categories" :key="category.value" @click="selectCategory(category.value)"
                class="btn btn-ghost justify-start w-full"
                :class="{ 'btn-primary': selectedCategory === category.value }">
                <span class="text-lg mr-2">{{ category.icon }}</span>
                <span class="flex-1 text-left">{{ category.label }}</span>
                <span class="badge badge-sm">{{ category.count }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 热门标签 -->
        <div class="card bg-base-200 shadow-lg">
          <div class="card-body">
            <h3 class="card-title text-lg mb-4">热门标签</h3>

            <div class="flex flex-wrap gap-2">
              <button v-for="tag in popularTags" :key="tag.name" @click="searchByTag(tag.name)"
                class="badge badge-outline hover:badge-primary cursor-pointer">
                {{ tag.name }} ({{ tag.count }})
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：帖子列表和内容 -->
      <div class="xl:col-span-3 space-y-6">
        <!-- 操作栏 -->
        <div class="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div class="flex flex-wrap gap-2">
            <button @click="showCreatePost = true" class="btn btn-primary">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              发布帖子
            </button>

            <div class="dropdown">
              <label tabindex="0" class="btn btn-outline">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"></path>
                </svg>
                {{ getSortText(sortType) }}
              </label>
              <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40">
                <li><a @click="setSortType('latest')">最新发布</a></li>
                <li><a @click="setSortType('hot')">热门讨论</a></li>
                <li><a @click="setSortType('most_replies')">回复最多</a></li>
                <li><a @click="setSortType('most_likes')">点赞最多</a></li>
              </ul>
            </div>
          </div>

          <div class="flex gap-2">
            <div class="form-control">
              <div class="input-group">
                <input v-model="searchQuery" type="text" placeholder="搜索帖子..." class="input input-bordered input-sm">
                <button @click="searchPosts" class="btn btn-square btn-sm">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 帖子列表 -->
        <div class="space-y-4">
          <div v-for="post in filteredPosts" :key="post.id"
            class="card bg-base-200 shadow hover:shadow-lg transition-shadow cursor-pointer" @click="viewPost(post)">
            <div class="card-body">
              <div class="flex items-start gap-4">
                <!-- 用户头像 -->
                <div class="avatar">
                  <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span class="text-primary font-semibold">{{ post.author.username.charAt(0).toUpperCase() }}</span>
                  </div>
                </div>

                <!-- 帖子内容 -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-2">
                    <h3 class="font-semibold text-lg truncate">{{ post.title }}</h3>
                    <div class="badge badge-sm" :class="getCategoryBadgeClass(post.category)">{{
                      getCategoryText(post.category) }}</div>
                    <div v-if="post.is_pinned" class="badge badge-warning badge-sm">置顶</div>
                  </div>

                  <p class="text-base-content/70 text-sm mb-3 line-clamp-2">{{ post.content }}</p>

                  <div class="flex items-center gap-4 text-sm text-base-content/60">
                    <div class="flex items-center gap-1">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                      <span>{{ post.author.username }}</span>
                    </div>

                    <div class="flex items-center gap-1">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span>{{ formatDate(post.created_at) }}</span>
                    </div>

                    <div class="flex items-center gap-1">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z">
                        </path>
                      </svg>
                      <span>{{ post.reply_count }} 回复</span>
                    </div>

                    <div class="flex items-center gap-1">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z">
                        </path>
                      </svg>
                      <span>{{ post.like_count }} 点赞</span>
                    </div>

                    <div class="flex items-center gap-1">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z">
                        </path>
                      </svg>
                      <span>{{ post.view_count }} 浏览</span>
                    </div>
                  </div>

                  <!-- 标签 -->
                  <div v-if="post.tags && post.tags.length > 0" class="flex flex-wrap gap-1 mt-2">
                    <span v-for="tag in post.tags" :key="tag" class="badge badge-ghost badge-xs">{{ tag }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 空状态 -->
          <div v-if="filteredPosts.length === 0" class="text-center py-12">
            <svg class="w-16 h-16 mx-auto mb-4 text-base-content/30" fill="none" stroke="currentColor"
              viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z">
              </path>
            </svg>
            <p class="text-base-content/50 mb-4">暂无相关帖子</p>
            <button @click="showCreatePost = true" class="btn btn-primary btn-sm">发布第一个帖子</button>
          </div>
        </div>

        <!-- 分页 -->
        <div v-if="totalPages > 1" class="flex justify-center">
          <div class="btn-group">
            <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1" class="btn btn-sm">«</button>
            <button v-for="page in visiblePages" :key="page" @click="goToPage(page)" class="btn btn-sm"
              :class="{ 'btn-active': page === currentPage }">
              {{ page }}
            </button>
            <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages"
              class="btn btn-sm">»</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 发帖模态框 -->
    <div v-if="showCreatePost" class="modal modal-open">
      <div class="modal-box max-w-4xl">
        <h3 class="font-bold text-lg mb-4">发布新帖子</h3>

        <form @submit.prevent="createPost" class="space-y-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">标题 *</span>
            </label>
            <input v-model="newPost.title" type="text" class="input input-bordered" placeholder="输入帖子标题" required
              maxlength="100">
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="form-control">
              <label class="label">
                <span class="label-text">分类 *</span>
              </label>
              <select v-model="newPost.category" class="select select-bordered" required>
                <option value="">选择分类</option>
                <option v-for="category in categories.slice(1)" :key="category.value" :value="category.value">
                  {{ category.label }}
                </option>
              </select>
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text">标签</span>
              </label>
              <input v-model="tagInput" @keydown.enter.prevent="addTag" type="text" class="input input-bordered"
                placeholder="输入标签后按回车添加">
            </div>
          </div>

          <div v-if="newPost.tags.length > 0" class="flex flex-wrap gap-2">
            <span v-for="(tag, index) in newPost.tags" :key="index" class="badge badge-primary gap-2">
              {{ tag }}
              <button @click="removeTag(index)" type="button" class="btn btn-ghost btn-xs">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </span>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">内容 *</span>
            </label>
            <textarea v-model="newPost.content" class="textarea textarea-bordered h-40" placeholder="分享您的想法和经验..."
              required></textarea>
          </div>

          <div class="modal-action">
            <button @click="showCreatePost = false" type="button" class="btn btn-ghost">取消</button>
            <button type="submit" class="btn btn-primary" :disabled="isCreatingPost">
              <span v-if="isCreatingPost" class="loading loading-spinner loading-sm"></span>
              {{ isCreatingPost ? '发布中...' : '发布帖子' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  type CommunityStats,
  type PostContent,
  type CreatePostRequest,
  type DiscussionCategory,
  SortType
} from '@/types/factory'

// 响应式数据
const selectedCategory = ref<DiscussionCategory | 'all'>('all')
const sortType = ref<SortType>(SortType.LATEST)
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = 10
const showCreatePost = ref(false)
const isCreatingPost = ref(false)
const tagInput = ref('')

// 新帖子数据
const newPost = ref<CreatePostRequest>({
  title: '',
  content: '',
  category: '' as DiscussionCategory,
  tags: []
})

// 社区统计数据
const communityStats = ref<CommunityStats>({
  total_posts: 15420,
  total_replies: 48650,
  total_likes: 92340,
  active_users: 3280,
  today_posts: 45
})

// 分类数据
const categories = ref([
  { value: 'all', label: '全部', icon: '📋', count: 15420 },
  { value: 'buying_guide', label: '购车指南', icon: '🚗', count: 3240 },
  { value: 'selling_tips', label: '卖车技巧', icon: '💰', count: 2180 },
  { value: 'maintenance', label: '保养维修', icon: '🔧', count: 4560 },
  { value: 'price_discussion', label: '价格讨论', icon: '💵', count: 2890 },
  { value: 'experience_sharing', label: '经验分享', icon: '💡', count: 1820 },
  { value: 'q_and_a', label: '问答求助', icon: '❓', count: 730 }
])

// 热门标签
const popularTags = ref([
  { name: '新手必看', count: 1240 },
  { name: '价格评估', count: 980 },
  { name: '保养心得', count: 760 },
  { name: '购车陷阱', count: 650 },
  { name: '二手车检测', count: 580 },
  { name: '过户流程', count: 420 },
  { name: '保险理赔', count: 380 },
  { name: '改装升级', count: 320 }
])

// 帖子数据
const posts = ref<PostContent[]>([
  {
    id: '1',
    title: '新手买二手车需要注意哪些问题？',
    content: '最近想买一辆二手车，但是完全没有经验，想请教一下各位老司机，在选购二手车的时候需要注意哪些问题？比如如何检查车况、如何砍价等等...',
    category: 'buying_guide' as DiscussionCategory,
    author: {
      id: '1',
      username: '新手小白',
      avatar: '',
      reputation: 120
    },
    created_at: '2024-01-16T10:30:00Z',
    updated_at: '2024-01-16T10:30:00Z',
    like_count: 45,
    reply_count: 23,
    view_count: 1280,
    is_pinned: true,
    status: 'published',
    tags: ['新手必看', '购车指南', '经验分享']
  },
  {
    id: '2',
    title: '分享一下我的卖车经历，希望对大家有帮助',
    content: '刚刚成功卖掉了我的爱车，整个过程还算顺利。想分享一下经验，包括如何定价、如何拍照、如何与买家沟通等等，希望能帮到准备卖车的朋友们...',
    category: 'selling_tips' as DiscussionCategory,
    author: {
      id: '2',
      username: '老司机张三',
      avatar: '',
      reputation: 850
    },
    created_at: '2024-01-16T09:15:00Z',
    updated_at: '2024-01-16T09:15:00Z',
    like_count: 78,
    reply_count: 34,
    view_count: 2150,
    is_pinned: false,
    status: 'published',
    tags: ['卖车技巧', '经验分享', '定价策略']
  },
  {
    id: '3',
    title: '2024年二手车市场价格趋势分析',
    content: '根据最近几个月的市场观察，我发现二手车价格出现了一些有趣的变化。特别是新能源车和传统燃油车的价格走势完全不同...',
    category: 'price_discussion' as DiscussionCategory,
    author: {
      id: '3',
      username: '市场分析师',
      avatar: '',
      reputation: 1200
    },
    created_at: '2024-01-16T08:45:00Z',
    updated_at: '2024-01-16T08:45:00Z',
    like_count: 156,
    reply_count: 67,
    view_count: 3420,
    is_pinned: false,
    status: 'published',
    tags: ['价格讨论', '市场分析', '趋势预测']
  },
  {
    id: '4',
    title: '汽车保养的几个误区，你中招了吗？',
    content: '很多车主在保养爱车时存在一些误区，不仅浪费钱还可能对车辆造成损害。今天就来聊聊那些常见的保养误区...',
    category: 'maintenance' as DiscussionCategory,
    author: {
      id: '4',
      username: '修车师傅',
      avatar: '',
      reputation: 680
    },
    created_at: '2024-01-16T07:20:00Z',
    updated_at: '2024-01-16T07:20:00Z',
    like_count: 92,
    reply_count: 41,
    view_count: 1890,
    is_pinned: false,
    status: 'published',
    tags: ['保养心得', '误区避免', '省钱技巧']
  },
  {
    id: '5',
    title: '求助：这个价格的车值得买吗？',
    content: '看中了一辆2019年的本田雅阁，里程5万公里，卖家要价15万。车况看起来还不错，但是不太确定这个价格是否合理，求各位大神指点...',
    category: 'q_and_a' as DiscussionCategory,
    author: {
      id: '5',
      username: '纠结的买家',
      avatar: '',
      reputation: 45
    },
    created_at: '2024-01-16T06:50:00Z',
    updated_at: '2024-01-16T06:50:00Z',
    like_count: 12,
    reply_count: 18,
    view_count: 560,
    is_pinned: false,
    status: 'published',
    tags: ['价格评估', '购车咨询', '本田雅阁']
  }
])

// 计算属性
const filteredPosts = computed(() => {
  let filtered = posts.value

  // 按分类筛选
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(post => post.category === selectedCategory.value)
  }

  // 按搜索关键词筛选
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(post =>
      post.title.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query) ||
      post.tags?.some(tag => tag.toLowerCase().includes(query))
    )
  }

  // 排序
  filtered.sort((a, b) => {
    if (a.is_pinned && !b.is_pinned) return -1
    if (!a.is_pinned && b.is_pinned) return 1

    switch (sortType.value) {
      case 'latest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      case 'hot':
        return (b.like_count + b.reply_count * 2) - (a.like_count + a.reply_count * 2)
      case 'most_replies':
        return b.reply_count - a.reply_count
      case 'most_likes':
        return b.like_count - a.like_count
      default:
        return 0
    }
  })

  // 分页
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filtered.slice(start, end)
})

const totalPages = computed(() => {
  let filtered = posts.value

  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(post => post.category === selectedCategory.value)
  }

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(post =>
      post.title.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query) ||
      post.tags?.some(tag => tag.toLowerCase().includes(query))
    )
  }

  return Math.ceil(filtered.length / pageSize)
})

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

// 方法
const selectCategory = (category: DiscussionCategory | 'all') => {
  selectedCategory.value = category
  currentPage.value = 1
}

const setSortType = (sort: SortType) => {
  sortType.value = sort
  currentPage.value = 1
}

const searchPosts = () => {
  currentPage.value = 1
}

const searchByTag = (tag: string) => {
  searchQuery.value = tag
  searchPosts()
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const viewPost = (post: PostContent) => {
  console.log('查看帖子:', post.title)
  // 这里应该跳转到帖子详情页
}

const addTag = () => {
  const tag = tagInput.value.trim()
  if (tag && !newPost.value.tags.includes(tag) && newPost.value.tags.length < 5) {
    newPost.value.tags.push(tag)
    tagInput.value = ''
  }
}

const removeTag = (index: number) => {
  newPost.value.tags.splice(index, 1)
}

const createPost = async () => {
  if (!newPost.value.title.trim() || !newPost.value.content.trim() || !newPost.value.category) {
    return
  }

  isCreatingPost.value = true

  try {
    // 模拟创建帖子
    const post: PostContent = {
      id: Date.now().toString(),
      title: newPost.value.title,
      content: newPost.value.content,
      category: newPost.value.category,
      author: {
        id: 'current_user',
        username: '当前用户',
        avatar: '',
        reputation: 100
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      like_count: 0,
      reply_count: 0,
      view_count: 0,
      is_pinned: false,
      status: 'published',
      tags: [...newPost.value.tags]
    }

    posts.value.unshift(post)
    communityStats.value.total_posts += 1
    communityStats.value.today_posts += 1

    // 重置表单
    newPost.value = {
      title: '',
      content: '',
      category: '' as DiscussionCategory,
      tags: []
    }

    showCreatePost.value = false
  } catch (error) {
    console.error('创建帖子失败:', error)
  } finally {
    isCreatingPost.value = false
  }
}

// 工具函数
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 60) {
    return `${minutes}分钟前`
  } else if (hours < 24) {
    return `${hours}小时前`
  } else if (days < 7) {
    return `${days}天前`
  } else {
    return date.toLocaleDateString('zh-CN')
  }
}

const getSortText = (sort: SortType) => {
  const texts = {
    'latest': '最新发布',
    'hot': '热门讨论',
    'most_replies': '回复最多',
    'most_likes': '点赞最多'
  }
  return texts[sort] || '最新发布'
}

const getCategoryText = (category: DiscussionCategory) => {
  const categoryMap = categories.value.find(c => c.value === category)
  return categoryMap?.label || category
}

const getCategoryBadgeClass = (category: DiscussionCategory) => {
  const classes = {
    'buying_guide': 'badge-primary',
    'selling_tips': 'badge-success',
    'maintenance': 'badge-warning',
    'price_discussion': 'badge-info',
    'experience_sharing': 'badge-accent',
    'q_and_a': 'badge-secondary'
  }
  return classes[category] || 'badge-neutral'
}

// 生命周期
onMounted(() => {
  // 初始化数据
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>