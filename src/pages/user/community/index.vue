<template>
  <div class="min-h-screen bg-base-100 p-6">
    <!-- 页面标题 -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-base-content mb-2">社区交流</h1>
      <p class="text-base-content/70">与其他用户分享经验，讨论二手车相关话题</p>
    </div>

    <!-- 社区统计 -->
    <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
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
        <div class="stat-desc">社区帖子总数</div>
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
        <div class="stat-desc">社区回复总数</div>
      </div>

      <div class="stat bg-base-200 rounded-lg shadow">
        <div class="stat-figure text-info">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10">
            </path>
          </svg>
        </div>
        <div class="stat-title">分类总数</div>
        <div class="stat-value text-info">{{ communityStats.total_categories.toLocaleString() }}</div>
        <div class="stat-desc">讨论分类数量</div>
      </div>

      <div class="stat bg-base-200 rounded-lg shadow">
        <div class="stat-figure text-success">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z">
            </path>
          </svg>
        </div>
        <div class="stat-title">我的帖子</div>
        <div class="stat-value text-success">{{ communityStats.user_posts.toLocaleString() }}</div>
        <div class="stat-desc">我发布的帖子</div>
      </div>

      <div class="stat bg-base-200 rounded-lg shadow">
        <div class="stat-figure text-accent">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z">
            </path>
          </svg>
        </div>
        <div class="stat-title">我的回复</div>
        <div class="stat-value text-accent">{{ communityStats.user_replies.toLocaleString() }}</div>
        <div class="stat-desc">我发布的回复</div>
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
              <div class="input-group flex">
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
            class="card bg-base-200 shadow hover:shadow-lg transition-shadow cursor-pointer"
            @click="openPostDetail(post)">
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

        <div class="space-y-4">
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
            <button @click="submitCreatePost" type="button" class="btn btn-primary" :disabled="isCreatingPost">
              <span v-if="isCreatingPost" class="loading loading-spinner loading-sm"></span>
              {{ isCreatingPost ? '发布中...' : '发布帖子' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 修改帖子弹窗 -->
    <div v-if="showEditPost" class="modal modal-open z-9999">
      <div class="modal-box max-w-4xl">
        <h3 class="font-bold text-lg mb-4">修改帖子</h3>

        <form @submit.prevent="submitEditPost" class="space-y-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">标题 *</span>
            </label>
            <input v-model="editPost.title" type="text" class="input input-bordered" placeholder="输入帖子标题" required
              maxlength="100">
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">分类 *</span>
            </label>
            <select v-model="editPost.category" class="select select-bordered" required>
              <option value="">选择分类</option>
              <option v-for="category in categories.slice(1)" :key="category.value" :value="category.value">
                {{ category.label }}
              </option>
            </select>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">内容 *</span>
            </label>
            <textarea v-model="editPost.content" class="textarea textarea-bordered h-40" placeholder="分享您的想法和经验..."
              required></textarea>
          </div>

          <div class="modal-action">
            <button @click="cancelEditPost" type="button" class="btn btn-ghost">取消</button>
            <button @click="submitEditPost" type="submit" class="btn btn-primary" :disabled="isEditingPost">
              <span v-if="isEditingPost" class="loading loading-spinner loading-sm"></span>
              {{ isEditingPost ? '保存中...' : '保存修改' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 帖子详情模态框 -->
    <div v-if="showPostDetail && selectedPost" class="modal modal-open">
      <div class="modal-box max-w-6xl max-h-[90vh] overflow-y-auto">
        <!-- 帖子详情头部 -->
        <div class="flex justify-between items-start mb-6">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
              <h3 class="font-bold text-xl">{{ selectedPost.title }}</h3>
              <div class="badge badge-sm badge-primary">
                {{ selectedPost.category_name }}
              </div>
              <div v-if="selectedPost.is_pinned" class="badge badge-warning badge-sm">置顶</div>
              <div v-if="selectedPost.is_hot" class="badge badge-error badge-sm">热门</div>
            </div>

            <div class="flex items-center gap-4 text-sm text-base-content/60 mb-4">
              <div class="flex items-center gap-2">
                <div class="avatar">
                  <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span class="text-primary font-semibold text-xs">
                      {{ selectedPost.author_name?.charAt(0).toUpperCase() || 'U' }}
                    </span>
                  </div>
                </div>
                <span class="font-medium">{{ selectedPost.author_name }}</span>
                <span class="badge badge-ghost badge-xs">{{ selectedPost.status_display }}</span>
              </div>

              <div class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>{{ formatDate(selectedPost.created_at) }}</span>
              </div>

              <div class="flex items-center gap-4">
                <span>{{ selectedPost.view_count }} 浏览</span>
                <span>{{ selectedPost.reply_count }} 回复</span>
                <span>{{ selectedPost.like_count }} 点赞</span>
              </div>
            </div>
          </div>

          <button @click="closePostDetail" class="btn btn-ghost btn-sm">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- 帖子内容 -->
        <div class="bg-base-200 rounded-lg p-6 mb-6">
          <div class="prose max-w-none">
            <p class="whitespace-pre-wrap">{{ selectedPost.content }}</p>
          </div>


        </div>

        <!-- 操作按钮 -->
        <div class="flex items-center gap-4 mb-6">
          <button @click="toggleLike(selectedPost)" class="btn btn-sm"
            :class="selectedPost.is_liked ? 'btn-primary' : 'btn-outline'">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z">
              </path>
            </svg>
            {{ selectedPost.is_liked ? '已点赞' : '点赞' }} ({{ selectedPost.like_count }})
          </button>

          <button @click="showReplyForm = !showReplyForm" class="btn btn-outline btn-sm">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z">
              </path>
            </svg>
            回复
          </button>

          <!-- 修改按钮 - 仅当前用户可见 -->
          <button v-if="userStore.userInfo?.user_id === selectedPost.author" @click="startEditPost"
            class="btn btn-outline btn-sm">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
              </path>
            </svg>
            修改
          </button>

          <div class="dropdown">
            <label tabindex="0" class="btn btn-ghost btn-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z">
                </path>
              </svg>
            </label>
            <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40">
              <li><a @click="reportPost(selectedPost.id)">举报</a></li>
              <li><a @click="sharePost(selectedPost)">分享</a></li>
            </ul>
          </div>
        </div>

        <!-- 回复表单 -->
        <div v-if="showReplyForm" class="bg-base-200 rounded-lg p-4 mb-6">
          <form @submit.prevent="submitReply" class="space-y-4">
            <div class="form-control">
              <textarea ref="replyTextarea" v-model="replyContent" class="textarea textarea-bordered"
                placeholder="写下您的回复..." rows="4" required></textarea>
            </div>

            <!-- Emoji选择器 -->
            <div class="flex items-center gap-2">
              <button type="button" @click="showEmojiPicker = !showEmojiPicker" class="btn btn-ghost btn-sm">
                😀 表情
              </button>
              <span class="text-sm text-base-content/60">{{ replyContent.length }}/1000</span>
            </div>

            <!-- Emoji面板 -->
            <div v-if="showEmojiPicker" class="bg-base-100 rounded-lg p-3 border">
              <div class="grid grid-cols-8 gap-2">
                <button v-for="emoji in commonEmojis" :key="emoji" type="button" @click="insertEmoji(emoji)"
                  class="btn btn-ghost btn-sm text-lg hover:bg-primary/10">
                  {{ emoji }}
                </button>
              </div>
            </div>

            <div class="flex justify-end gap-2">
              <button @click="cancelReply" type="button" class="btn btn-ghost btn-sm">取消</button>
              <button type="submit" class="btn btn-primary btn-sm"
                :disabled="isSubmittingReply || replyContent.length > 1000">
                <span v-if="isSubmittingReply" class="loading loading-spinner loading-sm"></span>
                {{ isSubmittingReply ? '发布中...' : '发布回复' }}
              </button>
            </div>
          </form>
        </div>

        <!-- 回复列表 -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h4 class="font-semibold text-lg">回复 ({{ postReplies.length }})</h4>
            <div class="dropdown">
              <label tabindex="0" class="btn btn-outline btn-sm">
                {{ replySort === 'latest' ? '最新' : replySort === 'oldest' ? '最早' : '最热' }}
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </label>
              <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-32">
                <li><a @click="replySort = 'latest'">最新</a></li>
                <li><a @click="replySort = 'oldest'">最早</a></li>
                <li><a @click="replySort = 'hot'">最热</a></li>
              </ul>
            </div>
          </div>

          <div v-if="postReplies.length === 0" class="text-center py-8 text-base-content/50">
            <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z">
              </path>
            </svg>
            <p>暂无回复，来发表第一个回复吧！</p>
          </div>

          <div v-for="reply in sortedReplies" :key="reply.id" class="bg-base-100 rounded-lg p-4 border">
            <div class="flex items-start gap-3">
              <div class="avatar">
                <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span class="text-primary font-semibold text-sm">
                    {{ reply.author_name?.charAt(0).toUpperCase() || 'U' }}
                  </span>
                </div>
              </div>

              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <span class="font-medium">{{ reply.author_name || '匿名用户' }}</span>
                  <span class="badge badge-ghost badge-xs">{{ reply.status_display }}</span>
                  <span class="text-xs text-base-content/60">{{ formatDate(reply.created_at) }}</span>
                </div>

                <div class="prose prose-sm max-w-none mb-3">
                  <p class="whitespace-pre-wrap">{{ reply.content }}</p>
                </div>

                <div class="flex items-center gap-4 text-sm" v-show="false">
                  <button @click="toggleReplyLike(reply)" class="flex items-center gap-1 hover:text-primary">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z">
                      </path>
                    </svg>
                    <span>{{ reply.like_count }}</span>
                  </button>

                  <button class="hover:text-primary">回复</button>

                  <div class="dropdown">
                    <label tabindex="0" class="hover:text-primary cursor-pointer">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z">
                        </path>
                      </svg>
                    </label>
                    <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-32">
                      <li><a @click="reportReply(reply.id)">举报</a></li>
                    </ul>
                  </div>
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
import {
  type PostContent,
  type DiscussionCategory,
  SortType
} from '@/types/factory'
import {
  getPosts,
  createPost as createPostApi,
  getPostDetail,
  deletePost,
  togglePostLike,
  getReplies,
  createReply as createReplyApi,
  getCategories,
  updatePost,
  getCommunityStats
} from '@/api/user/Apis'
import { ElMessage } from 'element-plus'
import type {
  GetCommunityPostsParams,
  CreateCommunityPostBody,
  GetCommunityRepliesParams,
  CreateCommunityReplyBody,
  UpdateCommunityPostBody,
  CommunityStats,
  Post
} from '@/types/apis/users'
import { useUserStore } from '@/stores/auth/user'

// 创建帖子请求类型
interface CreatePostRequest {
  title: string
  content: string
  category: string
  tags: string[]
}

// 扩展Post接口以支持帖子详情页面
interface ExtendedPostContent extends Post {
  category_name: string
  author_name: string
  status_display: string
  is_hot: boolean
}

// 用户store
const userStore = useUserStore()

// 响应式数据
const selectedCategory = ref<string | 'all'>('all')
const sortType = ref<SortType>(SortType.LATEST)
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = 10
const showCreatePost = ref(false)
const isCreatingPost = ref(false)

const isLoading = ref(false)
const error = ref<string | null>(null)
const totalPosts = ref(0)

// 修改帖子相关状态
const showEditPost = ref(false)
const isEditingPost = ref(false)
const editPost = ref<{ title: string; content: string; category: string }>({ title: '', content: '', category: '' })

// 新帖子数据
const newPost = ref<CreatePostRequest>({
  title: '',
  content: '',
  category: '',
  tags: []
})

// 社区统计数据
const communityStats = ref<CommunityStats>({
  total_posts: 0,
  total_replies: 0,
  total_categories: 0,
  user_posts: 0,
  user_replies: 0
})

// 分类数据
const categories = ref([
  { value: 'all', label: '全部', icon: '📋', count: 0, id: 0 }
])

// 加载分类数据
const loadCategories = async () => {
  try {
    const response = await getCategories()

    if (response.code === 200 && response.data) {
      // 保留"全部"选项，并添加API返回的分类
      categories.value = [
        { value: 'all', label: '全部', icon: '📋', count: totalPosts.value, id: 0 },
        ...response.data.map(category => ({
          value: category.code || category.id.toString(),
          label: category.name,
          icon: category.icon || '📁',
          count: category.post_count || 0,
          id: category.id
        }))
      ]
    } else {
      console.error('获取分类失败:', response.msg)
    }
  } catch (err) {
    console.error('加载分类失败:', err)
  }
}

// 加载社区统计数据
const loadCommunityStats = async () => {
  try {
    const response = await getCommunityStats()

    if (response.code === 200 && response.data) {
      communityStats.value = response.data
    } else {
      console.error('获取社区统计失败:', response.msg)
    }
  } catch (err) {
    console.error('加载社区统计失败:', err)
  }
}

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
const posts = ref<PostContent[]>([])

// 加载帖子数据
const loadPosts = async () => {
  try {
    isLoading.value = true
    error.value = null


    const params: GetCommunityPostsParams = {
      page: currentPage.value,
      page_size: pageSize,
      category: selectedCategory.value === 'all' ? undefined : parseInt(selectedCategory.value)
    }

    const response = await getPosts(params)

    if (response.code === 200 && response.data) {
      // 转换API返回的数据格式以匹配前端使用的PostContent接口
      const apiPosts = response.data.posts || []
      // @ts-expect-error
      posts.value = apiPosts.map((apiPost: Post) => ({
        id: apiPost.id.toString(),
        title: apiPost.title,
        content: apiPost.content || '',
        category: apiPost.category_code || apiPost.category_name,
        author: {
          id: apiPost.author?.toString() || 'unknown',
          username: apiPost.author_name || '未知用户',
          avatar: '',
          reputation: 0
        },
        created_at: apiPost.created_at,
        updated_at: apiPost.updated_at,
        like_count: apiPost.like_count || 0,
        reply_count: apiPost.reply_count || 0,
        view_count: apiPost.view_count || 0,
        is_pinned: apiPost.is_pinned || false,
        status: 'published',
        tags: [],
        is_liked: apiPost.is_liked || false
      }))

      totalPosts.value = response.data.total || 0
    } else {
      error.value = response.msg || '获取帖子列表失败'
    }
  } catch (err) {
    console.error('加载帖子失败:', err)
    error.value = '网络错误，请稍后重试'
  } finally {
    isLoading.value = false
  }
}

// 计算属性
const filteredPosts = computed(() => {
  // 现在直接返回从API获取的帖子数据，筛选和排序由后端处理
  return posts.value
})

const totalPages = computed(() => {
  // 使用API返回的总数计算总页数
  return Math.ceil(totalPosts.value / pageSize)
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
const selectCategory = (category: string | 'all') => {
  selectedCategory.value = category
  currentPage.value = 1
  loadPosts()
}

const setSortType = (sort: SortType) => {
  sortType.value = sort
  currentPage.value = 1
  loadPosts()
}

const searchPosts = () => {
  currentPage.value = 1
  loadPosts()
}

const searchByTag = (tag: string) => {
  searchQuery.value = tag
  searchPosts()
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    loadPosts()
  }
}

// 帖子详情相关数据
const showPostDetail = ref(false)
const selectedPost = ref<ExtendedPostContent | null>(null)
const showReplyForm = ref(false)
const replyContent = ref('')
const isSubmittingReply = ref(false)
const replySort = ref<'latest' | 'oldest' | 'hot'>('latest')
const postReplies = ref<any[]>([])

// Emoji选择器相关数据
const showEmojiPicker = ref(false)
const replyTextarea = ref<HTMLTextAreaElement | null>(null)
const commonEmojis = ref([
  '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣',
  '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰',
  '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜',
  '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏',
  '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
  '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠',
  '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨',
  '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥',
  '👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙',
  '👈', '👉', '👆', '👇', '☝️', '✋', '🤚', '🖐️',
  '🖖', '👋', '🤝', '👏', '🙌', '👐', '🤲', '🙏',
  '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍',
  '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖',
  '💘', '💝', '💟', '♥️', '💯', '💢', '💥', '💫'
])

// 打开帖子详情
const openPostDetail = async (post: ExtendedPostContent) => {
  try {
    // 调用API获取帖子详情
    const response = await getPostDetail(post.id)
    if (response.code === 200) {
      selectedPost.value = response.data
      showPostDetail.value = true
      showReplyForm.value = false
      loadPostReplies(post.id)
    } else {
      ElMessage.error(response.msg || '获取帖子详情失败')
    }
  } catch (error) {
    console.error('获取帖子详情失败:', error)
    ElMessage.error('获取帖子详情失败')
  }
}

// 关闭帖子详情
const closePostDetail = () => {
  showPostDetail.value = false
  selectedPost.value = null
  postReplies.value = []
  replyContent.value = ''
  showReplyForm.value = false
}

// 加载帖子回复
const loadPostReplies = async (postId: number) => {
  try {
    const params = {
      page: 1,
      page_size: 50
    }

    const response = await getReplies(postId, params)

    if (response.code === 200 && response.data) {
      postReplies.value = response.data.replies || []
    } else {
      console.error('获取回复失败:', response.msg)
      postReplies.value = []
    }
  } catch (err) {
    console.error('加载回复失败:', err)
    postReplies.value = []
  }
}

// 切换点赞状态
const toggleLike = async (post: ExtendedPostContent) => {
  try {
    //@ts-ignore
    const response = await togglePostLike(parseInt(post.id))

    if (response.code === 200 && response.data) {
      post.is_liked = response.data.liked
      post.like_count = response.data.like_count
    } else {
      console.error('点赞操作失败:', response.msg)
    }
  } catch (err) {
    console.error('点赞操作失败:', err)
  }
}

// 切换回复点赞
const toggleReplyLike = (reply: any) => {
  if (reply.is_liked) {
    reply.like_count -= 1
    reply.is_liked = false
  } else {
    reply.like_count += 1
    reply.is_liked = true
  }
}

// Emoji相关方法
const insertEmoji = (emoji: string) => {
  const textarea = replyTextarea.value
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const text = replyContent.value

  replyContent.value = text.slice(0, start) + emoji + text.slice(end)

  // 设置光标位置到emoji后面
  setTimeout(() => {
    textarea.focus()
    textarea.setSelectionRange(start + emoji.length, start + emoji.length)
  }, 0)
}

const cancelReply = () => {
  replyContent.value = ''
  showReplyForm.value = false
  showEmojiPicker.value = false
}

// 提交回复
const submitReply = async () => {
  if (!replyContent.value.trim() || !selectedPost.value) return

  if (replyContent.value.length > 1000) {
    alert('回复内容不能超过1000个字符')
    return
  }

  isSubmittingReply.value = true

  try {
    const replyData: CreateCommunityReplyBody = {
      content: replyContent.value.trim()
    }
    // @ts-ignore
    const response = await createReplyApi(parseInt(selectedPost.value.id), replyData)

    if (response.code === 200 && response.data) {
      // 重新加载回复列表
      //@ts-ignore
      await loadPostReplies(parseInt(selectedPost.value.id))

      // 更新帖子回复数
      selectedPost.value.reply_count += 1

      // 更新原帖子数据
      const originalPost = posts.value.find(p => p.id === selectedPost.value?.id)
      if (originalPost) {
        originalPost.reply_count += 1
      }

      // 重置表单
      cancelReply()
    } else {
      // @ts-ignore
      console.error('提交回复失败:', response.message)
      alert('提交回复失败，请稍后重试')
    }
  } catch (error) {
    console.error('提交回复失败:', error)
    alert('网络错误，请稍后重试')
  } finally {
    isSubmittingReply.value = false
  }
}

// 开始编辑帖子
const startEditPost = () => {
  if (!selectedPost.value) return

  // 根据帖子的category找到对应的category选项值
  let categoryValue = ''
  const postCategory = selectedPost.value.category

  // 尝试通过category_name或label匹配
  const matchedCategory = categories.value.find(cat =>
    // @ts-ignore
    cat.label === postCategory || cat.value === postCategory
  )

  if (matchedCategory) {
    categoryValue = matchedCategory.value
  }

  editPost.value = {
    title: selectedPost.value.title,
    content: selectedPost.value.content as string,
    category: categoryValue
  }
  showEditPost.value = true
}

// 提交编辑帖子
const submitEditPost = async () => {
  console.log('editPost.value:', JSON.stringify(editPost.value, null, 2));
  console.log('selectedPost.value:', JSON.stringify(selectedPost.value, null, 2));
  console.log('editPost.category:', editPost.value.category);
  //@ts-ignore
  console.log('selectedPost.category_id:', selectedPost.value?.category_id);

  // 验证表单字段是否完整
  if (!editPost.value.title.trim() || !editPost.value.content.trim() || !editPost.value.category) {
    ElMessage.error('请填写完整信息')
    return
  }

  if (!selectedPost.value) {
    console.log('selectedPost.value is null or undefined');
    ElMessage.error('未选择要编辑的帖子')
    return
  }

  try {
    isEditingPost.value = true

    // 根据分类 value 找到对应的 id
    const selectedCategory = categories.value.find(cat => cat.value === editPost.value.category)
    if (!selectedCategory || selectedCategory.id === 0) {
      ElMessage.error('请选择有效的分类')
      return
    }

    const updateData: UpdateCommunityPostBody = {
      title: editPost.value.title.trim(),
      content: editPost.value.content.trim(),
      category: selectedCategory.id
    }
    // @ts-ignore
    const response = await updatePost(parseInt(selectedPost.value.id), updateData)

    if (response.code === 200) {
      ElMessage.success('修改帖子成功')

      // 更新本地数据
      if (selectedPost.value) {
        selectedPost.value.title = editPost.value.title
        selectedPost.value.content = editPost.value.content
        // @ts-ignore
        selectedPost.value.category = selectedCategory.label
      }

      // 更新帖子列表中的数据
      const postIndex = posts.value.findIndex(p => p.id === selectedPost.value?.id)
      if (postIndex !== -1) {
        posts.value[postIndex].title = editPost.value.title
        posts.value[postIndex].content = editPost.value.content
        //@ts-ignore
        posts.value[postIndex].category = selectedCategory.label
      }

      // 关闭编辑模态框
      showEditPost.value = false
      editPost.value = { title: '', content: '', category: '' }
    } else {
      ElMessage.error(response.msg || '修改帖子失败')
    }
  } catch (error) {
    console.error('修改帖子失败:', error)
    ElMessage.error('网络错误，请稍后重试')
  } finally {
    isEditingPost.value = false
  }
}

// 取消编辑帖子
const cancelEditPost = () => {
  showEditPost.value = false
  editPost.value = { title: '', content: '', category: '' }
}

// 举报帖子
const reportPost = (postId: number) => {
  console.log('举报帖子:', postId)
  // 这里应该调用举报API
}

// 举报回复
const reportReply = (replyId: number) => {
  console.log('举报回复:', replyId)
  // 这里应该调用举报API
}

// 分享帖子
const sharePost = (post: ExtendedPostContent) => {
  if (navigator.share) {
    navigator.share({
      title: post.title,
      //@ts-ignore
      text: post.content.substring(0, 100) + '...',
      url: window.location.href
    })
  } else {
    // 复制链接到剪贴板
    navigator.clipboard.writeText(window.location.href)
    console.log('链接已复制到剪贴板')
  }
}

// 排序后的回复列表
const sortedReplies = computed(() => {
  const replies = [...postReplies.value]

  switch (replySort.value) {
    case 'latest':
      return replies.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    case 'oldest':
      return replies.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    case 'hot':
      return replies.sort((a, b) => b.like_count - a.like_count)
    default:
      return replies
  }
})

const submitCreatePost = async () => {
  if (!newPost.value.title.trim() || !newPost.value.content.trim() || !newPost.value.category) {
    console.error('创建帖子失败: 请填写完整信息')
    return
  }

  // 根据分类 value 找到对应的 id
  const selectedCategoryData = categories.value.find(cat => cat.value === newPost.value.category)
  if (!selectedCategoryData || selectedCategoryData.id === 0) {
    console.error('创建帖子失败: 请选择帖子分类')
    return
  }

  isCreatingPost.value = true

  try {
    const postData: CreateCommunityPostBody = {
      title: newPost.value.title,
      content: newPost.value.content,
      category_id: selectedCategoryData.id
    }

    const response = await createPostApi(postData)

    if (response.code === 200 && response.data) {
      // 添加新帖子到列表顶部
      const newPostData: PostContent = {
        id: response.data.id,
        title: response.data.title,
        content: response.data.content || '',
        //@ts-ignore
        category: response.data.category_code || response.data.category_name,
        author: {
          //@ts-ignore
          id: response.data.author?.toString() || 'unknown',
          username: response.data.author_name || '未知用户',
          avatar: '',
          reputation: 0
        },
        created_at: response.data.created_at,
        updated_at: response.data.updated_at,
        like_count: response.data.like_count || 0,
        reply_count: response.data.reply_count || 0,
        view_count: response.data.view_count || 0,
        is_pinned: response.data.is_pinned || false,
        // @ts-ignore
        status: 'published',
        tags: [],
        is_liked: response.data.is_liked || false
      }

      posts.value.unshift(newPostData)
      communityStats.value.total_posts++
      communityStats.value.user_posts++

      // 重置表单
      newPost.value = {
        title: '',
        content: '',
        category: '',
        tags: []
      }

      showCreatePost.value = false
    } else {
      console.error('创建帖子失败:', response.msg)
    }
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
  // @ts-ignore
  return texts[sort] || '最新发布'
}

const getCategoryText = (category: string) => {
  const categoryMap = categories.value.find(c => c.value === category)
  return categoryMap?.label || category
}

const getCategoryBadgeClass = (category: string) => {
  const classes: Record<string, string> = {
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
  // 加载初始数据
  loadPosts()
  loadCategories()
  loadCommunityStats()
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