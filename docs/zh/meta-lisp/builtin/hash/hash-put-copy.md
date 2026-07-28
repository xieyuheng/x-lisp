---
title: hash-put-copy
---

# 类型

```meta-lisp
(polymorphic (K V) (-> K V (hash-t K V) (hash-t K V)))
```

# 描述

设置键值对，返回新的哈希表。

# 例子

```meta-lisp
(hash-put-copy "c" 3 (@hash "a" 1 "b" 2))  ;; => (@hash "a" 1 "b" 2 "c" 3)
```
