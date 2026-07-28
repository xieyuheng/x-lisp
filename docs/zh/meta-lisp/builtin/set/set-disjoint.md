---
title: set-disjoint
---

# 类型

```meta-lisp
(polymorphic (E) (-> (set-t E) (set-t E) bool-t))
```

# 描述

判断两个集合是否不相交（没有公共元素）。

# 例子

```meta-lisp
(set-disjoint (@set 1 2) (@set 3 4))  ;; => true
(set-disjoint (@set 1 2) (@set 2 3))  ;; => false
```
