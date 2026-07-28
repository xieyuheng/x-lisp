---
title: set-every
---

# 类型

```meta-lisp
(polymorphic (A) (-> (-> A bool-t) (set-t A) bool-t))
```

# 描述

判断集合中是否所有元素都满足条件。

# 例子

```meta-lisp
(set-every int-is-non-negative (@set 0 1 2))  ;; => true
(set-every int-is-non-negative (@set 0 -1))   ;; => false
```
