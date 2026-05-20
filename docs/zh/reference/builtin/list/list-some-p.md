---
title: list-some?
---

# 类型

```scheme
(polymorphic (A) (-> (-> A bool-t) (list-t A) bool-t))
```

# 描述

判断列表中是否有元素满足条件。空列表返回 `false`。派生函数。

# 例子

```scheme
(list-some? int-non-negative? [-1 0 1])  ;; => true
(list-some? int-non-negative? [-1 -2])   ;; => false
```
