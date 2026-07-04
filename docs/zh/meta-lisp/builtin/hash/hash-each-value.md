---
title: hash-each-value
---

# 类型

```meta-lisp
(polymorphic (K V Any) (-> (-> V Any) (hash-t K V) void-t))
```

# 描述

遍历每个值并执行副作用。

# 例子

```meta-lisp
(hash-each-value
  (lambda (value) (println value))
  (@hash 1 2 3 4))
```
