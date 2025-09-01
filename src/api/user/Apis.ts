import serviceAxios from '@/http'
import type {
  ApiResponse,
  GetCommunityPostsParams,
  GetCommunityPostsResponse,
  Post,
  CreateCommunityPostBody,
  LikeResponse,
  GetCommunityRepliesParams,
  GetCommunityRepliesResponse,
  CreateCommunityReplyBody,
  Reply,
  Category
} from '@/types/apis/users'

// 获取帖子列表
export function getPosts(params?: GetCommunityPostsParams): Promise<ApiResponse<GetCommunityPostsResponse>> {
  return serviceAxios({
    url: '/car/community/posts',
    method: 'get',
    params
  })
}

// 创建帖子
export function createPost(data: CreateCommunityPostBody): Promise<ApiResponse<Post>> {
  return serviceAxios({
    url: '/car/community/posts',
    method: 'post',
    data
  })
}

// 查看帖子详情
export function getPostDetail(id: number): Promise<ApiResponse<Post>> {
  return serviceAxios({
    url: `/car/community/posts/${id}`,
    method: 'get'
  })
}

// 删除帖子
export function deletePost(id: number): Promise<ApiResponse<null>> {
  return serviceAxios({
    url: `/car/community/posts/${id}`,
    method: 'delete'
  })
}

// 点赞与取消点赞
export function togglePostLike(id: number): Promise<ApiResponse<LikeResponse>> {
  return serviceAxios({
    url: `/car/community/posts/${id}/like`,
    method: 'post'
  })
}

// 获取回复列表
export function getReplies(id: number, params?: Omit<GetCommunityRepliesParams, 'id'>): Promise<ApiResponse<GetCommunityRepliesResponse>> {
  return serviceAxios({
    url: `/car/community/posts/${id}/replies`,
    method: 'get',
    params
  })
}

// 创建回复
export function createReply(id: number, data: CreateCommunityReplyBody): Promise<ApiResponse<Reply>> {
  return serviceAxios({
    url: `/car/community/posts/${id}/replies`,
    method: 'post',
    data
  })
}

// 获取帖子分类
export function getCategories(): Promise<ApiResponse<Category[]>> {
  return serviceAxios({
    url: '/car/community/categories',
    method: 'get'
  })
}

// 保留原有的getUserInfo函数以保持兼容性
export function getUserInfo(query: GetCommunityPostsParams): Promise<ApiResponse<GetCommunityPostsResponse>> {
  return getPosts(query)
}
