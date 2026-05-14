---
title: maybe-t
---

# 类型

```scheme
(-> type-t type-t)
```

# 描述

可选值类型构造器。`(maybe-t A)` 表示可能存在也可能不存在类型为 `A` 的值。使用 `(just value)` 构造存在值，使用 `nothing` 表示缺失。

# 自动生成

## 构造器

```scheme
(claim just  (polymorphic (A) (-> A (maybe-t A))))
(claim nothing (polymorphic (A) (-> (maybe-t A))))
```

## 谓词

```scheme
(claim just?    (polymorphic (A) (-> (maybe-t A) bool-t)))
(claim nothing? (polymorphic (A) (-> (maybe-t A) bool-t)))
```

## 访问器

```scheme
(claim just-value (polymorphic (A) (-> (maybe-t A) A)))
```

## 修改器

```scheme
(claim just-put-value! (polymorphic (A) (-> A (maybe-t A) (maybe-t A))))
```

# 例子

```scheme
(define x (just 42))
(just? x)          ;; => true
(nothing? x)       ;; => false
(just-value x)     ;; => 42
```
