获取帖子详情

type:get
path: /car/community/posts?category=&page=0&page_size=10
params:
   number: category(分类 ID ) page page_size

res:
```json
{
	"code": 200,
	"msg": null,
	"data": {
		"total": 5,
		"page": 0,
		"page_size": 10,
		"posts": [
			{
				"id": 8,
				"title": "帖子标题",
				"category_name": "价格讨论",
				"category_code": "",
				"author_name": "client",
				"status": "published",
				"status_display": "已发布",
				"is_pinned": false,
				"is_hot": false,
				"view_count": 0,
				"like_count": 0,
				"reply_count": 0,
				"last_reply_time": null,
				"created_at": "2025-09-01T15:22:34.714951",
				"updated_at": "2025-09-01T15:22:34.716152"
			},
			{
				"id": 7,
				"title": "帖子标题",
				"category_name": "价格讨论",
				"category_code": "",
				"author_name": "client",
				"status": "published",
				"status_display": "已发布",
				"is_pinned": false,
				"is_hot": false,
				"view_count": 0,
				"like_count": 0,
				"reply_count": 0,
				"last_reply_time": null,
				"created_at": "2025-09-01T15:20:22.059417",
				"updated_at": "2025-09-01T15:20:22.059417"
			},
			{
				"id": 6,
				"title": "帖子标题",
				"category_name": "价格讨论",
				"category_code": "",
				"author_name": "admin",
				"status": "published",
				"status_display": "已发布",
				"is_pinned": false,
				"is_hot": false,
				"view_count": 0,
				"like_count": 0,
				"reply_count": 0,
				"last_reply_time": null,
				"created_at": "2025-09-01T15:05:54.008150",
				"updated_at": "2025-09-01T15:05:54.008150"
			},
			{
				"id": 5,
				"title": "测试帖子标题",
				"category_name": "价格讨论",
				"category_code": "",
				"author_name": "test_user",
				"status": "published",
				"status_display": "已发布",
				"is_pinned": false,
				"is_hot": false,
				"view_count": 0,
				"like_count": 0,
				"reply_count": 1,
				"last_reply_time": null,
				"created_at": "2025-09-01T14:49:02.148095",
				"updated_at": "2025-09-01T14:53:16.590970"
			},
			{
				"id": 4,
				"title": "帖子标题",
				"category_name": "价格讨论",
				"category_code": "",
				"author_name": "client",
				"status": "published",
				"status_display": "已发布",
				"is_pinned": false,
				"is_hot": false,
				"view_count": 0,
				"like_count": 1,
				"reply_count": 1,
				"last_reply_time": null,
				"created_at": "2025-09-01T14:44:35.807570",
				"updated_at": "2025-09-01T15:07:38.257645"
			}
		]
	}
}
```


创建帖子

type:post
path: /car/community/posts

body:
```json
{
  "title": "帖子标题",
	"content": "帖子内容",
	"category_id": 1
}
```

res:

```json
{
	"code": 200,
	"msg": "帖子发布成功",
	"data": {
		"id": 8,
		"author_name": "client",
		"category_name": "价格讨论",
		"category_code": "",
		"status_display": "已发布",
		"is_liked": false,
		"title": "帖子标题",
		"content": "帖子内容",
		"status": "published",
		"is_pinned": false,
		"is_hot": false,
		"view_count": 0,
		"like_count": 0,
		"reply_count": 0,
		"last_reply_time": null,
		"created_at": "2025-09-01T15:22:34.714951",
		"updated_at": "2025-09-01T15:22:34.716152",
		"category": 1,
		"author": 2,
		"last_reply_user": null
	}
}
```


查看帖子详情

type:get
path: /car/community/posts/:id
params:
   number: id

res:
```json
{
	"code": 200,
	"msg": null,
	"data": {
		"id": 4,
		"author_name": "client",
		"category_name": "价格讨论",
		"category_code": "",
		"status_display": "已发布",
		"is_liked": false,
		"title": "帖子标题",
		"content": "帖子内容",
		"status": "published",
		"is_pinned": false,
		"is_hot": false,
		"view_count": 0,
		"like_count": 1,
		"reply_count": 1,
		"last_reply_time": null,
		"created_at": "2025-09-01T14:44:35.807570",
		"updated_at": "2025-09-01T15:07:38.257645",
		"category": 1,
		"author": 2,
		"last_reply_user": null
	}
}
```

删除帖子

type:delete
path:/car/community/posts/:id
params:
  number: id

res:
{
	"code": 200,
	"msg": "帖子删除成功",
	"data": null
}

点赞与取消点赞

type:post
path:/car/community/posts/:id/like
body:
  number: id

res:

```json
{
	"code": 200,
	"msg": null,
	"data": {
		"liked": false,
		"like_count": 0
	}
}
```

获取回复列表

type:get
path:/car/community/posts/4/replies?page=0&page_size=10
params:
  number: id page page_size

res:

```json
{
	"code": 200,
	"msg": "回复发布成功",
	"data": {
		"id": 3,
		"author_name": "client",
		"status_display": "已发布",
		"is_liked": false,
		"child_replies": [],
		"content": "回复内容",
		"status": "published",
		"like_count": 0,
		"created_at": "2025-09-01T15:27:56.411845",
		"updated_at": "2025-09-01T15:27:56.411845",
		"post": 4,
		"author": 2,
		"parent_reply": null
	}
}
```
创建回复

type:post
path:/car/community/posts/:id/replies
body:
```json
{
	"content": "回复内容",
	"parent_reply": 0
}
```

获取帖子分类

type:get
path:/car/community/categories

res:

```json
{
	"code": 200,
	"msg": null,
	"data": [
		{
			"id": 1,
			"post_count": 4,
			"name": "价格讨论",
			"code": "",
			"description": "讨论汽车价格相关话题",
			"icon": null,
			"sort_order": 0,
			"is_active": true,
			"created_at": "2025-09-01T14:10:07.703522"
		},
		{
			"id": 4,
			"post_count": 0,
			"name": "价格讨论",
			"code": "price_discussion",
			"description": "讨论汽车价格相关话题",
			"icon": null,
			"sort_order": 0,
			"is_active": true,
			"created_at": "2025-09-01T14:12:14.161331"
		},
		{
			"id": 5,
			"post_count": 0,
			"name": "购车咨询",
			"code": "buying_advice",
			"description": "购车建议和咨询",
			"icon": "shopping-cart",
			"sort_order": 2,
			"is_active": true,
			"created_at": "2025-09-01T14:46:54.118257"
		},
		{
			"id": 6,
			"post_count": 0,
			"name": "车型评测",
			"code": "car_review",
			"description": "汽车评测和体验分享",
			"icon": "star",
			"sort_order": 3,
			"is_active": true,
			"created_at": "2025-09-01T14:46:54.121091"
		},
		{
			"id": 7,
			"post_count": 0,
			"name": "维修保养",
			"code": "maintenance",
			"description": "汽车维修保养相关讨论",
			"icon": "tool",
			"sort_order": 4,
			"is_active": true,
			"created_at": "2025-09-01T14:46:54.123104"
		},
		{
			"id": 8,
			"post_count": 0,
			"name": "经验分享",
			"code": "experience",
			"description": "用车经验和心得分享",
			"icon": "share",
			"sort_order": 5,
			"is_active": true,
			"created_at": "2025-09-01T14:46:54.125121"
		}
	]
}
```
