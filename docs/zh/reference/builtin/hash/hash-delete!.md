---
title: hash-delete!
---

# 类型

```scheme
(polymorphic (K V) (-> K (hash-t K V) (hash-t K V)))
```

# 描述

删除键值对，返回新的哈希表。

# 例子

```scheme
(hash-delete! "a" (@hash "a" 1 "b" 2))  ;; => (@hash "b" 2)
```
