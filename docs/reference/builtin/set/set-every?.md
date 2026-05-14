---
title: set-every?
---

# 类型

```scheme
(polymorphic (A) (-> (-> A bool-t) (set-t A) bool-t))
```

# 描述

判断集合中是否所有元素都满足条件。派生函数。

# 例子

```scheme
(set-every? int-non-negative? #{0 1 2})  ;; => true
(set-every? int-non-negative? #{0 -1})   ;; => false
```
