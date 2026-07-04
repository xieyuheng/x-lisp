---
title: hash-values
---

# 类型

```meta-lisp
(polymorphic (K V) (-> (hash-t K V) (list-t V)))
```

# 描述

获取哈希表的所有值，以列表形式返回。

# 例子

```meta-lisp
(let ((h (@hash 1 2 3 4)))
  (list-fold-left iadd 0 (hash-values h)))  ;; => 6
```
