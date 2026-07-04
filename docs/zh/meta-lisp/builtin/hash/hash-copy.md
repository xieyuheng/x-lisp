---
title: hash-copy
---

# 类型

```meta-lisp
(polymorphic (K V) (-> (hash-t K V) (hash-t K V)))
```

# 描述

复制一个哈希表，返回新哈希表。

# 例子

```meta-lisp
(let ((h1 (@hash "a" 1 "b" 2))
      (h2 (hash-copy h1)))
  h2)  ;; => (@hash "a" 1 "b" 2)
```
