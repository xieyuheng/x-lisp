---
title: set-disjoint?
---

# 类型

```scheme
(polymorphic (E) (-> (set-t E) (set-t E) bool-t))
```

# 描述

判断两个集合是否不相交（没有公共元素）。

# 例子

```scheme
(set-disjoint? #{1 2} #{3 4})  ;; => true
(set-disjoint? #{1 2} #{2 3})  ;; => false
```
