---
title: maybe-t
---

# 类型

```scheme
type-t
```

# 描述

可选值类型构造器。`(maybe-t A)` 表示可能存在也可能不存在类型为 `A` 的值。

# 定义

```scheme
(define-enum (maybe-t A)
  (just (value A))
  (nothing))
```

# 自动生成

```scheme
(claim just  (polymorphic (A) (-> A (maybe-t A))))
(claim just? (polymorphic (A) (-> (maybe-t A) bool-t)))
(claim just-value (polymorphic (A) (-> (maybe-t A) A)))
(claim just-put-value! (polymorphic (A) (-> A (maybe-t A) (maybe-t A))))

(claim nothing (polymorphic (A) (-> (maybe-t A))))
(claim nothing? (polymorphic (A) (-> (maybe-t A) bool-t)))
```

# 例子

```scheme
(define x (just 42))
(just? x)          ;; => true
(nothing? x)       ;; => false
(just-value x)     ;; => 42
```
