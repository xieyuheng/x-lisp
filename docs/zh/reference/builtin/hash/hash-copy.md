---
title: hash-copy
---

# 类型

```scheme
(polymorphic (K V) (-> (hash-t K V) (hash-t K V)))
```

# 描述

复制一个哈希表，返回新哈希表。

# 例子

```scheme
(= h1 (@hash "a" 1 "b" 2))
(= h2 (hash-copy h1))
(hash-put! "c" 3 h2)
h1  ;; => (@hash "a" 1 "b" 2)
h2  ;; => (@hash "a" 1 "b" 2 "c" 3)
```
