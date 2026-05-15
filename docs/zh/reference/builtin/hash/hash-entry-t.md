---
title: hash-entry-t
---

# 类型

```scheme
(-> type-t type-t type-t)
```

# 描述

哈希表条目类型构造器。`(hash-entry-t K V)` 表示键类型为 `K`、值类型为 `V` 的键值条目。

# 自动生成

## 构造器

```scheme
(claim make-hash-entry (polymorphic (K V) (-> K V (hash-entry-t K V))))
```

## 访问器

```scheme
(claim hash-entry-key   (polymorphic (K V) (-> (hash-entry-t K V) K)))
(claim hash-entry-value (polymorphic (K V) (-> (hash-entry-t K V) V)))
```

# 例子

```scheme
(let ((e (make-hash-entry "a" 1)))
  (hash-entry-key e))   ;; => "a"
```
