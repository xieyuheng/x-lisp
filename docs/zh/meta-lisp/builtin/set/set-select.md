---
title: set-select
---

# 类型

```meta-lisp
(polymorphic (A) (-> (-> A bool-t) (set-t A) (set-t A)))
```

# 描述

筛选集合中满足条件的元素。

# 例子

```meta-lisp
(set-select int-is-non-negative (@set -2 -1 0 1 2))  ;; => (@set 0 1 2)
```
