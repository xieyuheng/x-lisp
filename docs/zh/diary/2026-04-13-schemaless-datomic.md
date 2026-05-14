---
title: schemaless datomic
date: 2026-04-13
---

为 basic-lisp 设计一个内置的 database，用来保存 metadata。

模仿 datomic，但是设计成 schemaless 的形式。
通过等一更多语义不同的 operation，
以使得 operation 完全不依赖于 attribute schema：

- (add e a v)
- (delete e a v)
- (delete-attribute e a)
- (delete-entity e)
- (put e a v) -- (delete-attribute e a) + (add e a v)
- (put-unique e a v)

另外，用 id 不是 int，而是特殊的类型。
literal id 用 `#1 #2 ...` 表示。

# db-transact

设计 `(db-transact)` 语法。

可以引入新 id：

```scheme
(db-transact (test)
  (put test :test/name 'test-suite/bool-test)
  (put test :test/status 'running))
```

也可用于找到已有的 id：

```scheme
(db-transact (new-user
              (existing-org :org/name "Acme"))
  (put new-user :user/name "Alice")
  (put new-user :user/org existing-org))
```

```scheme
(db-transact (order
              (user :email "alice@example.com")
              (item :sku "ABC-123"))
  (put order :order/user user)
  (put order :order/item item)
  (put order :order/status 'pending)
  (add order :order/log "created"))
```

more examples:

```scheme
;; 创建一个新用户，绑定到 user
(db-transact (user)
  (put user :user/name "Alice")
  (put user :user/email "alice@example.com")
  (put user :user/age 30))

;; 找到邮箱为 alice@example.com 的用户，更新年龄
(db-transact ((user :user/email "alice@example.com"))
  (put user :user/age 31))

(db-transact (order
              (user :user/email "alice@example.com"))
  (put order :order/id "ORD-001")
  (put order :order/user user)
  (put order :order/amount 99.99)
  (add order :order/tag "electronics")   ;; 多值追加
  (add order :order/tag "urgent"))

;; 给用户添加多个标签
(db-transact ((user :user/email "alice@example.com"))
  (add user :user/tag "clojure")
  (add user :user/tag "datomic")
  (add user :user/tag "functional"))

;; 尝试创建新用户，但邮箱必须全局唯一
(db-transact (new-user)
  (put-unique new-user :user/email "bob@example.com")
  (put new-user :user/name "Bob"))
;; 如果 bob@example.com 已存在，事务失败

;; 删除用户的某个标签
(db-transact ((user :user/email "alice@example.com"))
  (delete user :user/tag "clojure"))

;; 清空用户的所有标签（删除整个属性）
(db-transact ((user :user/email "alice@example.com"))
  (delete-attribute user :user/tag))

;; 删除整个实体（浅删除）
(db-transact ((user :user/email "alice@example.com"))
  (delete-entity user))

;; 将用户的年龄替换为 32（不管之前是否有值）
(db-transact ((user :user/email "alice@example.com"))
  (put user :user/age 32))
```

# db-find

设计 `(db-find (name ...) ...)` 语法，
其 body 中所有的 symbol 都被认为是 pattern variable，
只有 name 所生命的 name 是我们所关心的需要返回的 pattern variable：

```scheme
(db-find (name email)
  [e :user/name name]
  [e :user/email email])

;; 查询年龄大于 30 的用户
(db-find (name age)
  [e :user/name name]
  [e :user/age age]
  (int-greater? age 30))

;; 查询用户的所有标签（多值）
(db-find (tag)
  [e :user/email "alice@example.com"]
  [e :user/tag tag])

;; 查询用户及其订单的总金额
(db-find (user-name order-total)
  [u :user/name user-name]
  [o :order/user u]
  [o :order/total order-total]
  (> order-total 100))
```

# db-clause

```scheme
(db-clause (ancestor a d)
  [a :parent/child d])
(db-clause (ancestor a d)
  [a :parent/child x] (ancestor x d))
```

# db-pull

```scheme
(db-pull id
  :user/name
  (:user/address :address/street
                 (:address/country :country/name)))

{:user/name "Alice"
 :user/address {:address/street "123 Main St"
                :address/country {:country/name "USA"}}}
```

默认是一个值，多个值的时候出错。
可以用 `(first)` 来取多个值中的第一个，
或用 `(many)` 来让返回值变成 list。

```scheme
(db-pull id
  :user/name
  (many :user/tag))

{:user/name "Alice"
 :user/tag ["clojure" "datomic" "fun"]}

(db-pull id
  (many :order/items
    :item/name
    (many :item/tags)))

{:order/items [{:item/name "Laptop" :item/tags ["electronics" "expensive"]}
               {:item/name "Mouse"  :item/tags ["electronics"]}]}
```
