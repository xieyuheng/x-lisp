---
title: hash-entry-t
---

# 类型

```meta-lisp
type-t
```

# 描述

哈希表条目类型构造器。`(hash-entry-t K V)` 表示一个键类型为 `K`、值类型为 `V` 的键值对条目。

# 定义

```meta-lisp
(define-struct (hash-entry-t K V)
  (key K)
  (value V))
```

# 自动生成

```meta-lisp
(claim make-hash-entry (polymorphic (K V) (-> K V (hash-entry-t K V))))
(claim hash-entry-key   (polymorphic (K V) (-> (hash-entry-t K V) K)))
(claim hash-entry-value (polymorphic (K V) (-> (hash-entry-t K V) V)))
```

# 例子

```meta-lisp
(let ((e (make-hash-entry "a" 1)))
  (hash-entry-key e))   ;; => "a"
```
