// 社区交流相关类型定义

// 讨论分类枚举
export enum DiscussionCategory {
  ALL = 'all',
  BUYING_ADVICE = 'buying_advice', // 购车咨询
  SELLING_EXPERIENCE = 'selling_experience', // 卖车经验
  MAINTENANCE = 'maintenance', // 保养维修
  MARKET_ANALYSIS = 'market_analysis', // 市场分析
  QA = 'qa' // 问答求助
}

// 帖子状态枚举
export enum PostStatus {
  ACTIVE = 'active',
  LOCKED = 'locked',
  DELETED = 'deleted',
  PINNED = 'pinned'
}

// 排序方式枚举
export enum SortType {
  LATEST = 'latest', // 最新发布
  HOTTEST = 'hottest', // 最热讨论
  MOST_REPLIES = 'most_replies' // 回复最多
}

// 用户信息
export interface CommunityUser {
  id: number
  username: string
  avatar?: string
  level: number // 用户等级
  reputation: number // 声誉值
  post_count: number // 发帖数
  join_date: string // 加入时间
}

// 帖子内容
export interface PostContent {
  id: number
  title: string // 标题
  content: string // 内容
  category: DiscussionCategory // 分类
  author: CommunityUser // 作者
  status: PostStatus // 状态
  reply_count: number // 回复数
  view_count: number // 浏览数
  like_count: number // 点赞数
  is_liked: boolean // 当前用户是否已点赞
  is_pinned: boolean // 是否置顶
  created_at: string // 创建时间
  updated_at: string // 更新时间
  tags?: string[] // 标签
}

// 回复内容
export interface ReplyContent {
  id: number
  post_id: number // 帖子ID
  content: string // 回复内容
  author: CommunityUser // 回复者
  parent_id?: number // 父回复ID（用于嵌套回复）
  like_count: number // 点赞数
  is_liked: boolean // 当前用户是否已点赞
  created_at: string // 创建时间
  children?: ReplyContent[] // 子回复
}

// 社区统计信息
export interface CommunityStats {
  total_posts: number // 总帖子数
  total_replies: number // 总回复数
  active_users: number // 活跃用户数
  daily_posts: number // 今日发帖数
  category_stats: {
    category: DiscussionCategory
    count: number
  }[] // 分类统计
}

// 发帖请求
export interface CreatePostRequest {
  title: string
  content: string
  category: DiscussionCategory
  tags?: string[]
}

// 回复请求
export interface CreateReplyRequest {
  post_id: number
  content: string
  parent_id?: number // 回复特定评论时使用
}

// 帖子列表查询参数
export interface PostsListRequest {
  category?: DiscussionCategory
  sort?: SortType
  search?: string // 搜索关键词
  page?: number
  page_size?: number
  author_id?: number // 按作者筛选
  tag?: string // 按标签筛选
}

// 帖子列表响应
export interface PostsListResponse {
  code: number
  message: string
  data: {
    posts: PostContent[]
    total: number
    page: number
    page_size: number
    has_next: boolean
    has_previous: boolean
  }
}

// 帖子详情响应
export interface PostDetailResponse {
  code: number
  message: string
  data: {
    post: PostContent
    replies: ReplyContent[]
    reply_total: number
  }
}

// 社区统计响应
export interface CommunityStatsResponse {
  code: number
  message: string
  data: CommunityStats
}

// 创建帖子响应
export interface CreatePostResponse {
  code: number
  message: string
  data: {
    post_id: number
    created_at: string
  }
}

// 点赞操作请求
export interface LikeRequest {
  target_type: 'post' | 'reply' // 目标类型
  target_id: number // 目标ID
  action: 'like' | 'unlike' // 操作类型
}