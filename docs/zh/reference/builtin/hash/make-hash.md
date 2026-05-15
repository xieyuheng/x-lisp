---
title: make-hash
---

# 类型

```scheme
(polymorphic (K V) (-> (hash-t K V)))
```

# 描述

创建一个空哈希表。

# 例子

```scheme
(let ((h (make-hash)))
  (hash-empty? h))  ;; => true
```
