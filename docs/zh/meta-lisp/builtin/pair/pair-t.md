---
title: pair-t
---

# 类型

```meta-lisp
type-t
```

# 描述

二元组类型构造器。`(pair-t A B)` 表示一个包含类型 `A` 和 `B` 两个值的对。

# 定义

```meta-lisp
(define-struct (pair-t A B)
  (first A)
  (second B))
```

# 自动生成

```meta-lisp
(claim make-pair (polymorphic (A B) (-> A B (pair-t A B))))
(claim is-pair (polymorphic (A) (-> A bool-t)))
(claim pair-first  (polymorphic (A B) (-> (pair-t A B) A)))
(claim pair-second (polymorphic (A B) (-> (pair-t A B) B)))
(claim pair-put-first!  (polymorphic (A B) (-> A (pair-t A B) (pair-t A B))))
(claim pair-put-second! (polymorphic (A B) (-> B (pair-t A B) (pair-t A B))))
```

# 例子

```meta-lisp
(let ((p (make-pair 1 "hello")))
  (pair-first p))   ;; => 1
```
