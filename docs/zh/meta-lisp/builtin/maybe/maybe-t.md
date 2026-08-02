---
title: maybe-t
---

# 类型

```meta-lisp
type-t
```

# 描述

可选值类型构造器。`(maybe-t A)` 表示可能存在也可能不存在类型为 `A` 的值。

# 定义

```meta-lisp
(define-enum (maybe-t A)
  (just (value A))
  (nothing))
```

# 自动生成

```meta-lisp
(claim just  (polymorphic (A) (-> A (maybe-t A))))
(claim is-just (polymorphic (A) (-> (maybe-t A) bool-t)))
(claim just-value (polymorphic (A) (-> (maybe-t A) A)))
(claim just-put-value (polymorphic (A) (-> A (maybe-t A) (maybe-t A))))

(claim nothing (polymorphic (A) (-> (maybe-t A))))
(claim is-nothing (polymorphic (A) (-> (maybe-t A) bool-t)))
```

# 例子

```meta-lisp
(define x (just 42))
(is-just x)          ;; => true
(is-nothing x)       ;; => false
(just-value x)     ;; => 42
```
