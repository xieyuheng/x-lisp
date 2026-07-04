---
title: hash-each-entry
---

# 类型

```meta-lisp
(polymorphic (K V Any) (-> (-> (hash-entry-t K V) Any) (hash-t K V) void-t))
```

# 描述

遍历每个条目并执行副作用。

# 例子

```meta-lisp
(hash-each-entry
  (lambda (entry) (println entry))
  (@hash 1 2 3 4))
```
