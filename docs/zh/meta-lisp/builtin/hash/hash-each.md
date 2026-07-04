---
title: hash-each
---

# 类型

```meta-lisp
(polymorphic (K V Any) (-> (-> K V Any) (hash-t K V) void-t))
```

# 描述

遍历每个键值对并执行副作用。

# 例子

```meta-lisp
(hash-each
  (lambda (key value)
    (println key)
    (println value))
  (@hash 1 2 3 4))
```
