---
title: hash-entry-key
---

# 类型

```meta-lisp
(polymorphic (K V) (-> (hash-entry-t K V) K))
```

# 描述

获取 entry 的键。

# 例子

```meta-lisp
(let ((h (@hash 'a 1 'b 2)))
  (list-map hash-entry-key (hash-entries h)))  ;; => ['a 'b]
```
