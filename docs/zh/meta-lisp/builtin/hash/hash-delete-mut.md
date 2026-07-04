---
title: hash-delete!
---

# 类型

```meta-lisp
(polymorphic (K V) (-> K (hash-t K V) (hash-t K V)))
```

# 描述

删除键值对，返回新的哈希表。

# 例子

```meta-lisp
(let ((h (@hash "a" 1 "b" 2 "c" 3)))
  (hash-delete! "a" h))  ;; => (@hash "b" 2 "c" 3)
```
