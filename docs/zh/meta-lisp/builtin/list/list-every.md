---
title: list-every
---

# 类型

```meta-lisp
(polymorphic (A) (-> (-> A bool-t) (list-t A) bool-t))
```

# 描述

判断列表中是否所有元素都满足条件。空列表返回 `true`。

# 例子

```meta-lisp
(list-every int-is-non-negative [0 1 2 3])  ;; => true
(list-every int-is-non-negative [0 1 -1])   ;; => false
```
