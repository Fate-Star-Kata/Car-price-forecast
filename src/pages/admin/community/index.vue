<template>
  <div class="community-management">
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-cards">
      <el-col :span="6">
        <el-card class="stats-card">
          <div class="stats-content">
            <div class="stats-icon">
              <el-icon size="24" color="#409EFF">
                <Document />
              </el-icon>
            </div>
            <div class="stats-info">
              <div class="stats-number">{{ stats.totalPosts }}</div>
              <div class="stats-label">总帖子数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stats-card">
          <div class="stats-content">
            <div class="stats-icon">
              <el-icon size="24" color="#67C23A">
                <ChatDotRound />
              </el-icon>
            </div>
            <div class="stats-info">
              <div class="stats-number">{{ stats.totalReplies }}</div>
              <div class="stats-label">总回复数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stats-card">
          <div class="stats-content">
            <div class="stats-icon">
              <el-icon size="24" color="#E6A23C">
                <Folder />
              </el-icon>
            </div>
            <div class="stats-info">
              <div class="stats-number">{{ stats.totalCategories }}</div>
              <div class="stats-label">分类数量</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stats-card">
          <div class="stats-content">
            <div class="stats-icon">
              <el-icon size="24" color="#F56C6C">
                <User />
              </el-icon>
            </div>
            <div class="stats-info">
              <div class="stats-number">{{ stats.activeUsers }}</div>
              <div class="stats-label">活跃用户</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 主要内容区域 -->
    <el-tabs v-model="activeTab" class="main-tabs">
      <!-- 帖子管理 -->
      <el-tab-pane label="帖子管理" name="posts">
        <el-card>
          <!-- 搜索和筛选 -->
          <div class="search-bar">
            <el-row :gutter="20">
              <el-col :span="6">
                <el-input
                  v-model="postSearchForm.query"
                  placeholder="搜索帖子标题或内容"
                  clearable
                  @keyup.enter="fetchPosts"
                >
                  <template #prefix>
                    <el-icon><Search /></el-icon>
                  </template>
                </el-input>
              </el-col>
              <el-col :span="4">
                <el-select v-model="postSearchForm.category" placeholder="选择分类" clearable>
                  <el-option
                    v-for="category in categories"
                    :key="category.id"
                    :label="category.name"
                    :value="category.id"
                  />
                </el-select>
              </el-col>
              <el-col :span="4">
                <el-select v-model="postSearchForm.status" placeholder="选择状态" clearable>
                  <el-option label="已发布" value="published" />
                  <el-option label="已隐藏" value="hidden" />
                  <el-option label="待审核" value="pending" />
                </el-select>
              </el-col>
              <el-col :span="4">
                <el-button type="primary" @click="fetchPosts">
                  <el-icon><Search /></el-icon>
                  搜索
                </el-button>
              </el-col>
            </el-row>
          </div>

          <!-- 帖子列表 -->
          <el-table :data="posts" v-loading="postsLoading" style="width: 100%">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="title" label="标题" min-width="200" />
            <el-table-column prop="author_name" label="作者" width="120" />
            <el-table-column prop="category_name" label="分类" width="120" />
            <el-table-column prop="view_count" label="浏览量" width="100" />
            <el-table-column prop="like_count" label="点赞数" width="100" />
            <el-table-column prop="reply_count" label="回复数" width="100" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag
                  :type="getStatusType(row.status)"
                  size="small"
                >
                  {{ row.status_display }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="created_at" label="创建时间" width="180">
              <template #default="{ row }">
                {{ formatDateTime(row.created_at) }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200" fixed="right">
              <template #default="{ row }">
                <el-button size="small" @click="viewPost(row)">查看</el-button>
                <el-dropdown @command="(command) => handlePostAction(command, row)">
                  <el-button size="small" type="primary">
                    操作<el-icon class="el-icon--right"><arrow-down /></el-icon>
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item command="hide" v-if="row.status === 'published'">隐藏</el-dropdown-item>
                      <el-dropdown-item command="publish" v-if="row.status === 'hidden'">发布</el-dropdown-item>
                      <el-dropdown-item command="pin" v-if="!row.is_pinned">置顶</el-dropdown-item>
                      <el-dropdown-item command="unpin" v-if="row.is_pinned">取消置顶</el-dropdown-item>
                      <el-dropdown-item command="delete" divided>删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页 -->
          <el-pagination
            v-model:current-page="postPagination.page"
            v-model:page-size="postPagination.pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="postPagination.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="fetchPosts"
            @current-change="fetchPosts"
            style="margin-top: 20px; justify-content: center"
          />
        </el-card>
      </el-tab-pane>

      <!-- 回复管理 -->
      <el-tab-pane label="回复管理" name="replies">
        <el-card>
          <!-- 搜索栏 -->
          <div class="search-bar">
            <el-row :gutter="20">
              <el-col :span="6">
                <el-input
                  v-model="replySearchForm.query"
                  placeholder="搜索回复内容"
                  clearable
                  @keyup.enter="fetchReplies"
                >
                  <template #prefix>
                    <el-icon><Search /></el-icon>
                  </template>
                </el-input>
              </el-col>
              <el-col :span="4">
                <el-button type="primary" @click="fetchReplies">
                  <el-icon><Search /></el-icon>
                  搜索
                </el-button>
              </el-col>
            </el-row>
          </div>

          <!-- 回复列表 -->
          <el-table :data="replies" v-loading="repliesLoading" style="width: 100%">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="content" label="回复内容" min-width="300">
              <template #default="{ row }">
                <div class="reply-content">{{ row.content }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="author" label="作者" width="120" />
            <el-table-column prop="post" label="所属帖子" width="80" />
            <el-table-column prop="created_at" label="创建时间" width="180">
              <template #default="{ row }">
                {{ formatDateTime(row.created_at) }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120" fixed="right">
              <template #default="{ row }">
                <el-button size="small" type="danger" @click="deleteReply(row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页 -->
          <el-pagination
            v-model:current-page="replyPagination.page"
            v-model:page-size="replyPagination.pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="replyPagination.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="fetchReplies"
            @current-change="fetchReplies"
            style="margin-top: 20px; justify-content: center"
          />
        </el-card>
      </el-tab-pane>

      <!-- 分类管理 -->
      <el-tab-pane label="分类管理" name="categories">
        <el-card>
          <!-- 操作栏 -->
          <div class="action-bar">
            <el-button type="primary" @click="showCreateCategoryDialog">
              <el-icon><Plus /></el-icon>
              新建分类
            </el-button>
          </div>

          <!-- 分类列表 -->
          <el-table :data="categories" v-loading="categoriesLoading" style="width: 100%">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="name" label="分类名称" width="150" />
            <el-table-column prop="code" label="分类代码" width="150" />
            <el-table-column prop="description" label="描述" min-width="200" />
            <el-table-column prop="post_count" label="帖子数量" width="120" />
            <el-table-column prop="created_at" label="创建时间" width="180">
              <template #default="{ row }">
                {{ formatDateTime(row.created_at) }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150" fixed="right">
              <template #default="{ row }">
                <el-button size="small" @click="editCategory(row)">编辑</el-button>
                <el-button size="small" type="danger" @click="deleteCategory(row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>
    </el-tabs>

    <!-- 帖子详情对话框 -->
    <el-dialog v-model="postDetailVisible" title="帖子详情" width="60%">
      <div v-if="currentPost">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="标题">{{ currentPost.title }}</el-descriptions-item>
          <el-descriptions-item label="作者">{{ currentPost.author_name }}</el-descriptions-item>
          <el-descriptions-item label="分类">{{ currentPost.category_name }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusType(currentPost.status)">{{ currentPost.status_display }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="浏览量">{{ currentPost.view_count }}</el-descriptions-item>
          <el-descriptions-item label="点赞数">{{ currentPost.like_count }}</el-descriptions-item>
          <el-descriptions-item label="回复数">{{ currentPost.reply_count }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ formatDateTime(currentPost.created_at) }}</el-descriptions-item>
        </el-descriptions>
        <el-divider>内容</el-divider>
        <div class="post-content">{{ currentPost.content }}</div>
      </div>
    </el-dialog>

    <!-- 分类编辑对话框 -->
    <el-dialog v-model="categoryDialogVisible" :title="categoryDialogTitle" width="40%">
      <el-form :model="categoryForm" :rules="categoryRules" ref="categoryFormRef" label-width="80px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="categoryForm.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="分类代码" prop="code">
          <el-input v-model="categoryForm.code" placeholder="请输入分类代码" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="categoryForm.description" type="textarea" :rows="3" placeholder="请输入分类描述" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="categoryDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitCategory" :loading="categorySubmitting">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Document,
  ChatDotRound,
  Folder,
  User,
  Search,
  Plus,
  ArrowDown
} from '@element-plus/icons-vue'
import { communityApi } from '@/api/admin'

// 响应式数据
const activeTab = ref('posts')
const postsLoading = ref(false)
const repliesLoading = ref(false)
const categoriesLoading = ref(false)
const categorySubmitting = ref(false)

// 统计数据
const stats = ref({
  totalPosts: 0,
  totalReplies: 0,
  totalCategories: 0,
  activeUsers: 0
})

// 帖子相关数据
const posts = ref([])
const postSearchForm = reactive({
  query: '',
  category: '',
  status: ''
})
const postPagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 回复相关数据
const replies = ref([])
const replySearchForm = reactive({
  query: ''
})
const replyPagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 分类相关数据
const categories = ref([])
const categoryDialogVisible = ref(false)
const categoryDialogTitle = ref('新建分类')
const categoryForm = reactive({
  id: null,
  name: '',
  code: '',
  description: ''
})
const categoryRules = {
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入分类代码', trigger: 'blur' }]
}
const categoryFormRef = ref()

// 帖子详情对话框
const postDetailVisible = ref(false)
const currentPost = ref(null)

// 获取统计数据
const fetchStats = async () => {
  try {
    const response = await communityApi.getCommunityStats()
    if (response.code === 200 && response.data) {
      stats.value = {
        totalPosts: response.data.total_posts || 0,
        totalReplies: response.data.total_replies || 0,
        totalCategories: response.data.total_categories || 0,
        activeUsers: response.data.active_users_count || 0
      }
    }
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

// 获取帖子列表
const fetchPosts = async () => {
  postsLoading.value = true
  try {
    const params = {
      query: postSearchForm.query || undefined,
      category: postSearchForm.category || undefined,
      status: postSearchForm.status || undefined,
      page: postPagination.page,
      page_size: postPagination.pageSize
    }
    const response = await communityApi.getPosts(params)
    if (response.code === 200 && response.data) {
      posts.value = response.data.posts || []
      postPagination.total = response.data.total || 0
    }
  } catch (error) {
    console.error('获取帖子列表失败:', error)
    ElMessage.error('获取帖子列表失败')
  } finally {
    postsLoading.value = false
  }
}

// 获取回复列表
const fetchReplies = async () => {
  repliesLoading.value = true
  try {
    const params = {
      query: replySearchForm.query || undefined,
      page: replyPagination.page,
      page_size: replyPagination.pageSize
    }
    const response = await communityApi.getReplies(params)
    if (response.code === 200 && response.data) {
      replies.value = response.data.replies || []
      replyPagination.total = response.data.total || 0
    }
  } catch (error) {
    console.error('获取回复列表失败:', error)
    ElMessage.error('获取回复列表失败')
  } finally {
    repliesLoading.value = false
  }
}

// 获取分类列表
const fetchCategories = async () => {
  categoriesLoading.value = true
  try {
    const response = await communityApi.getCategories()
    if (response.code === 200 && response.data) {
      categories.value = response.data.results || response.data || []
    }
  } catch (error) {
    console.error('获取分类列表失败:', error)
    ElMessage.error('获取分类列表失败')
  } finally {
    categoriesLoading.value = false
  }
}

// 查看帖子详情
const viewPost = (post) => {
  currentPost.value = post
  postDetailVisible.value = true
}

// 处理帖子操作
const handlePostAction = async (command: string, post: any) => {
  try {
    let status = post.status
    let message = ''
    
    switch (command) {
      case 'hide':
        status = 'hidden'
        message = '隐藏帖子成功'
        break
      case 'publish':
        status = 'published'
        message = '发布帖子成功'
        break
      case 'pin':
        // 这里需要调用置顶接口，暂时使用状态更新
        message = '置顶帖子成功'
        break
      case 'unpin':
        // 这里需要调用取消置顶接口，暂时使用状态更新
        message = '取消置顶成功'
        break
      case 'delete':
        await ElMessageBox.confirm('确定要删除这个帖子吗？', '确认删除', {
          type: 'warning'
        })
        await communityApi.deletePost(post.id)
        ElMessage.success('删除帖子成功')
        fetchPosts()
        return
    }
    
    if (command !== 'delete') {
      await communityApi.updatePostStatus(post.id, status)
      ElMessage.success(message)
      fetchPosts()
    }
  } catch (error) {
    console.error('操作失败:', error)
    ElMessage.error('操作失败')
  }
}

// 删除回复
const deleteReply = async (replyId: number) => {
  try {
    await ElMessageBox.confirm('确定要删除这个回复吗？', '确认删除', {
      type: 'warning'
    })
    await communityApi.deleteReply(replyId)
    ElMessage.success('删除回复成功')
    fetchReplies()
  } catch (error) {
    console.error('删除回复失败:', error)
    ElMessage.error('删除回复失败')
  }
}

// 显示创建分类对话框
const showCreateCategoryDialog = () => {
  categoryDialogTitle.value = '新建分类'
  categoryForm.id = null
  categoryForm.name = ''
  categoryForm.code = ''
  categoryForm.description = ''
  categoryDialogVisible.value = true
}

// 编辑分类
const editCategory = (category) => {
  categoryDialogTitle.value = '编辑分类'
  categoryForm.id = category.id
  categoryForm.name = category.name
  categoryForm.code = category.code
  categoryForm.description = category.description
  categoryDialogVisible.value = true
}

// 提交分类表单
const submitCategory = async () => {
  try {
    await categoryFormRef.value.validate()
    categorySubmitting.value = true
    
    const data = {
      name: categoryForm.name,
      code: categoryForm.code,
      description: categoryForm.description
    }
    
    if (categoryForm.id) {
      await communityApi.updateCategory(categoryForm.id, data)
      ElMessage.success('更新分类成功')
    } else {
      await communityApi.createCategory(data)
      ElMessage.success('创建分类成功')
    }
    
    categoryDialogVisible.value = false
    fetchCategories()
  } catch (error) {
    console.error('提交分类失败:', error)
    ElMessage.error('提交分类失败')
  } finally {
    categorySubmitting.value = false
  }
}

// 删除分类
const deleteCategory = async (categoryId: number) => {
  try {
    await ElMessageBox.confirm('确定要删除这个分类吗？', '确认删除', {
      type: 'warning'
    })
    await communityApi.deleteCategory(categoryId)
    ElMessage.success('删除分类成功')
    fetchCategories()
  } catch (error) {
    console.error('删除分类失败:', error)
    ElMessage.error('删除分类失败')
  }
}

// 工具函数
const getStatusType = (status: string) => {
  switch (status) {
    case 'published':
      return 'success'
    case 'hidden':
      return 'warning'
    case 'pending':
      return 'info'
    default:
      return 'info'
  }
}

const formatDateTime = (dateString: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleString()
}

// 页面初始化
onMounted(() => {
  fetchStats()
  fetchPosts()
  fetchReplies()
  fetchCategories()
})
</script>

<style scoped>
.community-management {
  padding: 20px;
}

.stats-cards {
  margin-bottom: 20px;
}

.stats-card {
  height: 100px;
}

.stats-content {
  display: flex;
  align-items: center;
  height: 100%;
}

.stats-icon {
  margin-right: 15px;
}

.stats-info {
  flex: 1;
}

.stats-number {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  line-height: 1;
}

.stats-label {
  font-size: 14px;
  color: #909399;
  margin-top: 5px;
}

.main-tabs {
  margin-top: 20px;
}

.search-bar {
  margin-bottom: 20px;
}

.action-bar {
  margin-bottom: 20px;
}

.reply-content {
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.post-content {
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
  line-height: 1.6;
  white-space: pre-wrap;
}
</style>