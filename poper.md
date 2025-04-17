---
title: poper
language_tabs:
  - shell: Shell
  - http: HTTP
  - javascript: JavaScript
  - ruby: Ruby
  - python: Python
  - php: PHP
  - java: Java
  - go: Go
toc_footers: []
includes: []
search: true
code_clipboard: true
highlight_theme: darkula
headingLevel: 2
generator: "@tarslib/widdershins v4.0.30"

---

# poper

Base URLs:

* <a href="http://local.poper.edu.com">开发环境: http://local.poper.edu.com</a>

# Authentication

# teacher

## GET 课程列表

GET /api/teacher/course

> Body 请求参数

```json
{
  "username": "***",
  "password": "a123456"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|page|query|integer| 是 |none|
|page_size|query|integer| 是 |none|
|body|body|object| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "data": [
      {
        "id": 9,
        "name": "语文",
        "year_month": 0,
        "fee": "19.23",
        "teacher_id": 20,
        "created_at": "2025-04-16T09:35:50.000000Z",
        "updated_at": "2025-04-16T09:35:50.000000Z",
        "students": [
          {
            "id": 7,
            "name": "18814121804",
            "username": "18814121804",
            "pivot": {
              "course_id": 9,
              "student_id": 7
            }
          },
          {
            "id": 5,
            "name": "teacher0",
            "username": "student",
            "pivot": {
              "course_id": 9,
              "student_id": 5
            }
          }
        ]
      },
      {
        "id": 8,
        "name": "语文",
        "year_month": 202504,
        "fee": "19.23",
        "teacher_id": 20,
        "created_at": "2025-04-16T09:35:34.000000Z",
        "updated_at": "2025-04-16T09:35:34.000000Z",
        "students": []
      },
      {
        "id": 7,
        "name": "语文",
        "year_month": 202504,
        "fee": "19.23",
        "teacher_id": 20,
        "created_at": "2025-04-16T09:29:59.000000Z",
        "updated_at": "2025-04-16T09:29:59.000000Z",
        "students": [
          {
            "id": 7,
            "name": "18814121804",
            "username": "18814121804",
            "pivot": {
              "course_id": 7,
              "student_id": 7
            }
          },
          {
            "id": 5,
            "name": "teacher0",
            "username": "student",
            "pivot": {
              "course_id": 7,
              "student_id": 5
            }
          }
        ]
      },
      {
        "id": 6,
        "name": "语文",
        "year_month": 202504,
        "fee": "19.23",
        "teacher_id": 20,
        "created_at": "2025-04-16T09:20:06.000000Z",
        "updated_at": "2025-04-16T09:52:19.000000Z",
        "students": []
      },
      {
        "id": 5,
        "name": "数学",
        "year_month": 202504,
        "fee": "19.23",
        "teacher_id": 20,
        "created_at": "2025-04-16T08:50:49.000000Z",
        "updated_at": "2025-04-16T08:50:49.000000Z",
        "students": [
          {
            "id": 7,
            "name": "18814121804",
            "username": "18814121804",
            "pivot": {
              "course_id": 5,
              "student_id": 7
            }
          },
          {
            "id": 5,
            "name": "teacher0",
            "username": "student",
            "pivot": {
              "course_id": 5,
              "student_id": 5
            }
          }
        ]
      }
    ],
    "total": 5
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» data|[object]|true|none||none|
|»»» id|integer|true|none||none|
|»»» name|string|true|none||none|
|»»» year_month|integer|true|none||none|
|»»» fee|string|true|none||none|
|»»» teacher_id|integer|true|none||none|
|»»» created_at|string|true|none||none|
|»»» updated_at|string|true|none||none|
|»»» students|[object]|true|none||none|
|»»»» id|integer|true|none||none|
|»»»» name|string|true|none||none|
|»»»» username|string|true|none||none|
|»»»» pivot|object|true|none||none|
|»»»»» course_id|integer|true|none||none|
|»»»»» student_id|integer|true|none||none|
|»» total|integer|true|none||none|

## POST 课程新建

POST /api/teacher/course

> Body 请求参数

```json
{
  "name": "语文",
  "year_month": 202504,
  "fee": 19.231,
  "student_ids": [
    6,
    7,
    20
  ]
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|
|» name|body|string| 是 |none|
|» year_month|body|integer| 是 |none|
|» fee|body|number| 是 |none|
|» student_ids|body|[integer]| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|null|true|none||none|

## GET 课程详情

GET /api/teacher/course/7

> Body 请求参数

```json
{
  "username": "***",
  "password": "a123456"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 7,
    "name": "语文",
    "year_month": 202504,
    "fee": "19.23",
    "teacher_id": 20,
    "created_at": "2025-04-16T09:29:59.000000Z",
    "updated_at": "2025-04-16T09:29:59.000000Z",
    "students": [
      {
        "id": 7,
        "name": "18814121804",
        "username": "18814121804",
        "pivot": {
          "course_id": 7,
          "student_id": 7
        }
      },
      {
        "id": 5,
        "name": "teacher0",
        "username": "student",
        "pivot": {
          "course_id": 7,
          "student_id": 5
        }
      }
    ]
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» id|integer|true|none||none|
|»» name|string|true|none||none|
|»» year_month|integer|true|none||none|
|»» fee|string|true|none||none|
|»» teacher_id|integer|true|none||none|
|»» created_at|string|true|none||none|
|»» updated_at|string|true|none||none|
|»» students|[object]|true|none||none|
|»»» id|integer|true|none||none|
|»»» name|string|true|none||none|
|»»» username|string|true|none||none|
|»»» pivot|object|true|none||none|
|»»»» course_id|integer|true|none||none|
|»»»» student_id|integer|true|none||none|

## PUT 课程修改

PUT /api/teacher/course/6

> Body 请求参数

```json
{
  "name": "语文",
  "year_month": 202504,
  "fee": 19.231,
  "student_ids": [
    20
  ]
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|
|» name|body|string| 是 |none|
|» year_month|body|integer| 是 |none|
|» fee|body|number| 是 |none|
|» student_ids|body|[integer]| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|null|true|none||none|

## GET 账单管理

GET /api/teacher/invoice

> Body 请求参数

```json
{
  "username": "***",
  "password": "a123456"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|page|query|integer| 是 |none|
|page_size|query|integer| 是 |none|
|body|body|object| 否 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## POST 账单创建

POST /api/teacher/invoice

> Body 请求参数

```json
{
  "course_id": 5,
  "student_id": 7,
  "amount": 23.111
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|
|» course_id|body|integer| 是 |none|
|» student_id|body|integer| 是 |none|
|» amount|body|number| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|null|true|none||none|

## POST 账单发送

POST /api/teacher/invoice/1/send

> Body 请求参数

```json
{
  "name": "语文",
  "year_month": 202504,
  "fee": 19.231,
  "student_ids": [
    6,
    7,
    20
  ]
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|
|» name|body|string| 是 |none|
|» year_month|body|integer| 是 |none|
|» fee|body|number| 是 |none|
|» student_ids|body|[integer]| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|null|true|none||none|

# 数据模型

