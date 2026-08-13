---
title: 在没有 subtype 的语言中设计 HTTP server API
authors: [xieyuheng, deepseek]
date: 2026-06-30
---

参考 [Bun.serve](https://bun.sh/docs/runtime/http/server) 的 API 设计，
思考如何在没有 subtype（没有继承、没有异常、没有 async）的 meta-lisp 中设计清晰且优雅的 HTTP server API。

# Bun 的 API 长什么样

```typescript
Bun.serve({
  routes: {
    "/api/status": new Response("OK"),
    "/users/:id": req => new Response(`Hello User ${req.params.id}!`),
    "/api/posts": {
      GET: () => new Response("List posts"),
      POST: async req => { ... }
    },
    "/api/*": Response.json({ message: "Not found" }, { status: 404 })
  },
  fetch(req) {
    return new Response("Not Found", { status: 404 });
  }
});
```

Bun 的 API 之所以能写得这么干净，关键在于 JS/TS 的对象字面量是异构的：value 可以是 `Response`、`(req) => Response`、或嵌套的 `{ GET: ..., POST: ... }` 对象——编译器不做统一类型约束。

在 meta-lisp 中，hash 的值必须是同构类型（`(hash-t K V)` 的 V 是单一类型）。直接翻译行不通。

# 约束条件

meta-lisp 的特性决定了 API 设计的上限和下限：

**没有的东西：**
- 没有 subtype / 继承——不能用 class hierarchy 建模不同 handler
- 没有 try/catch——错误处理只能靠 `maybe-t` 或 `(error "msg")`
- 没有 async/await/coroutine——所有 I/O 都是同步阻塞的

**有的武器：**
- **代数数据类型**（`define-enum`）——异构值的类型安全载体
- **模式匹配**（`match`）——取代 subtype 多态做分发
- **高阶函数 + 柯里化**——中间件 = 函数组合，无需特殊类型
- **`define-opaque-type`**——封装内部实现
- **`define-struct`**——记录类型，透明字段访问

# 核心洞察

Bun 的 route table 中每个 entry 的 value 类型不同（有的是 `Response`，有的是函数，有的是 `{ GET, POST }` 对象）。不用 subtype 要做到这一点，**只能用 ADT**——把异构的 handler 包装进同一个 enum。

但这样一来，每个 handler 都要包一层构造函数，样板变多。如何消除样板？

关键洞察：**handler 本身已经是统一类型** `(-> http-request-t http-response-t)`。静态响应只是一个忽略参数的 handler。路由分发只是一层调度，不对 handler 做类型区分。

所以不需要在 route entry 层面对 handler 分类——route entry 始终是 `(method, path, handler)` 三元组。静态响应用 `(lambda (req) response)` 包成 handler 即可。

# 设计

## 分层

- **Builtins（C 层）**：提供最小原语——请求/响应类型、服务器创建/停止、响应构造器
- **Library（meta-lisp 层）**：路由、method dispatch、中间件、helper 函数

## Builtins

```scheme
(define-struct http-request-t
  (method string-t)
  (path string-t)
  (params (hash-t string-t string-t))   ;; 路由提取的参数，builtin 初始为空 hash
  (query (hash-t string-t string-t))
  (headers (hash-t string-t string-t))
  (body (maybe-t string-t)))

(define-struct http-response-t
  (status int-t)
  (headers (hash-t string-t string-t))
  (body (maybe-t string-t)))

;; handler 统一类型
(claim http-handler-type type-t)
(define http-handler-type (-> http-request-t http-response-t))

;; 服务器
(define-opaque-type http-server-t ...)

(claim http-serve (-> string-t int-t http-handler-type http-server-t))
(claim http-server-stop (-> http-server-t void-t))
(claim http-server-port (-> http-server-t int-t))

;; 便捷响应构造器
(claim http-response-text (-> int-t string-t http-response-t))
(claim http-response-json (-> int-t json-t http-response-t))
(claim http-response-redirect (-> string-t http-response-t))
```

最简 hello world：

```scheme
(http-serve "0.0.0.0" 3000
  (lambda (req)
    (http-response-text 200 "Hello, World!")))
```

没有路由、没有中间件——就是一个函数。这是底线。

## Library — 路由

```scheme
;; HTTP 方法
(define-enum http-method-t
  (method-get) (method-post) (method-put)
  (method-delete) (method-patch))

;; 路由条目：method + path + handler
(define-struct route-entry-t
  (method (maybe-t http-method-t))   ;; nothing = 匹配任意方法
  (path string-t)                     ;; 支持 "/users/:id" 动态段
  (handler http-handler-type))

;; (http-router routes not-found) → handler
(claim http-router (-> (list-t route-entry-t) http-handler-type http-handler-type))

;; 路由构造器
(define (get path handler)    (make-route-entry (just (method-get))    path handler))
(define (post path handler)   (make-route-entry (just (method-post))   path handler))
(define (put path handler)    (make-route-entry (just (method-put))    path handler))
(define (delete path handler) (make-route-entry (just (method-delete)) path handler))
(define (any path handler)    (make-route-entry nothing path handler))

;; handler 构造器——把静态响应包装成 handler
(define (respond-text status body)
  (lambda (req) (http-response-text status body)))

(define (respond-json status body)
  (lambda (req) (http-response-json status body)))

(define (redirect-to url)
  (lambda (req) (http-response-redirect url)))
```

用法：

```scheme
(http-serve "0.0.0.0" 3000
  (http-router
    [(any "/api/status"    (respond-text 200 "OK"))
     (get "/api/users"     list-users)
     (post "/api/users"    create-user)
     (get "/api/users/:id" get-user-by-id)
     (any "/api/*"         (respond-text 404 "Not Found"))]
    (respond-text 500 "Internal Error")))
```

## Library — 中间件

中间件就是高阶函数：`(-> handler handler)`。不需要特殊类型。

```scheme
(define (wrap-logging handler)
  (lambda (req)
    (println (http-request-method req) (http-request-path req))
    (handler req)))

(define (wrap-json handler)
  (lambda (req)
    (= res (handler req))
    (make-http-response
      (http-response-status res)
      (@hash "content-type" "application/json")
      (http-response-body res))))

;; 使用
(http-serve "0.0.0.0" 3000
  (wrap-logging
    (wrap-json
      (http-router
        [(get "/api/posts" list-posts)]
        (respond-text 404 "Not Found")))))
```

# 为什么这个设计是自然的

| 约束 | 解决方案 |
|------|----------|
| 没有 subtype | 所有 handler 统一为 `(-> request response)`，不需要 subtype 多态 |
| 异构 route table | 不把异构放进 route table——route entry 始终是 `(method, path, handler)` 三元组 |
| 没有 try/catch | handler 内部用 `maybe-t` + `match` 做可恢复错误，用 `(error)` 做不可恢复错误 |
| 没有 async | 同步阻塞 I/O——和现有 `file-t` / `fs-read` 的设计哲学一致 |
| 静态强类型 | `define-enum` 做 method 枚举、`define-struct` 做 request/response 记录——编译期杜绝类型错误 |

# 为什么不引入更复杂的路由模型

Bun 的 `{ GET: ..., POST: ... }` 嵌套路由在 meta-lisp 中可以通过 `define-enum` 实现：

```scheme
(define-enum route-handler-t
  (respond-with (response http-response-t))
  (handle-with (fn http-handler-type))
  (method-routes (handlers (hash-t http-method-t route-handler-t))))
```

但这引入了递归的 ADT 和额外的概念。简单的一维 route list 已经够用：每个 `(get "/users" handler)` 本身就是完整的一行。method-based 路由不是嵌套对象，而是同一个 path 上多个 route entry，按顺序匹配即可。更简单，也更充分。
