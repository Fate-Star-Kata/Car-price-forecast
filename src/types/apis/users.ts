// 通用响应类型
export interface ApiResponse<T = any> {
  code: number
  msg: string | null
  data: T
}

// 帖子相关类型
export interface Post {
  id: number
  title: string
  category_name: string
  category_code: string
  author_name: string
  status: string
  status_display: string
  is_pinned: boolean
  is_hot: boolean
  view_count: number
  like_count: number
  reply_count: number
  last_reply_time: string | null
  created_at: string
  updated_at: string
  content?: string
  is_liked?: boolean
  category?: number
  author?: number
  last_reply_user?: number | null
}

// 获取帖子列表请求参数
export interface GetCommunityPostsParams {
  category?: number
  page?: number
  page_size?: number
}

// 获取帖子列表响应
export interface GetCommunityPostsResponse {
  total: number
  page: number
  page_size: number
  posts: Post[]
}

// 创建帖子请求体
export interface CreateCommunityPostBody {
  title: string
  content: string
  category_id: number
}

// 修改帖子请求体
export interface UpdateCommunityPostBody {
  title: string
  content: string
  category: number
}

// 点赞响应
export interface LikeResponse {
  liked: boolean
  like_count: number
}

// 回复类型
export interface Reply {
  id: number
  author_name: string
  status_display: string
  is_liked: boolean
  child_replies: Reply[]
  content: string
  status: string
  like_count: number
  created_at: string
  updated_at: string
  post: number
  author: number
  parent_reply: number | null
}

// 获取回复列表请求参数
export interface GetCommunityRepliesParams {
  id: number
  page?: number
  page_size?: number
}

// 创建回复请求体
export interface CreateCommunityReplyBody {
  content: string
  parent_reply?: number
}

// 分类类型
export interface Category {
  id: number
  post_count: number
  name: string
  code: string
  description: string
  icon: string | null
  sort_order: number
  is_active: boolean
  created_at: string
}

// 获取回复列表响应
export interface GetCommunityRepliesResponse {
  total: number
  page: number
  page_size: number
  replies: Reply[]
}

// 社区统计数据类型
export interface CommunityStats {
  total_posts: number
  total_replies: number
  total_categories: number
  user_posts: number
  user_replies: number
}