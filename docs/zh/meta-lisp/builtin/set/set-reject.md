---
title: set-reject
---

# 类型

```meta-lisp
(polymorphic (A) (-> (-> A bool-t) (set-t A) (set-t A)))
```

# 描述

从集合中排除满足条件的元素。

# 例子

```meta-lisp
(set-reject int-is-non-negative (@set -2 -1 0 1 2))  ;; => (@set -2 -1)
```
