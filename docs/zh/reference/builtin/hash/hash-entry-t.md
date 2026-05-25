---
title: hash-entry-t
---

# 类型

```scheme
type-t
```

# 定义

```scheme
(define-struct (hash-entry-t K V)
  (key K)
  (value V))
```

# 自动生成

```scheme
(claim make-hash-entry (polymorphic (K V) (-> K V (hash-entry-t K V))))
(claim hash-entry-key   (polymorphic (K V) (-> (hash-entry-t K V) K)))
(claim hash-entry-value (polymorphic (K V) (-> (hash-entry-t K V) V)))
```

# 例子

```scheme
(let ((e (make-hash-entry "a" 1)))
  (hash-entry-key e))   ;; => "a"
```
