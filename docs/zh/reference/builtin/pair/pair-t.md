---
title: pair-t
---

# 类型

```scheme
(-> type-t type-t type-t)
```

# 描述

二元组类型构造器。`(pair-t A B)` 表示一个包含类型 `A` 和 `B` 两个值的对。

# 自动生成

## 构造器

```scheme
(claim make-pair (polymorphic (A B) (-> A B (pair-t A B))))
```

## 谓词

```scheme
(claim pair? (polymorphic (A) (-> A bool-t)))
```

## 访问器

```scheme
(claim pair-first  (polymorphic (A B) (-> (pair-t A B) A)))
(claim pair-second (polymorphic (A B) (-> (pair-t A B) B)))
```

## 修改器

```scheme
(claim pair-put-first!  (polymorphic (A B) (-> A (pair-t A B) (pair-t A B))))
(claim pair-put-second! (polymorphic (A B) (-> B (pair-t A B) (pair-t A B))))
```

# 例子

```scheme
(let ((p (make-pair 1 "hello")))
  (pair-first p))   ;; => 1
```
