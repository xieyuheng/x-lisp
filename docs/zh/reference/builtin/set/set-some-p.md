---
title: set-some?
---

# 类型

```scheme
(polymorphic (A) (-> (-> A bool-t) (set-t A) bool-t))
```

# 描述

判断集合中是否有元素满足条件。

# 例子

```scheme
(set-some? int-non-negative? #{-1 0 1})  ;; => true
(set-some? int-non-negative? #{-1 -2})   ;; => false
```
