---
title: hash-length
---

# 类型

```meta-lisp
(polymorphic (K V) (-> (hash-t K V) int-t))
```

# 描述

返回哈希表中键值对的数量。

# 例子

```meta-lisp
(let ((h (@hash "a" 1)))
  (hash-length h))  ;; => 1
```
