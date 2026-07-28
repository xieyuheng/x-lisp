---
title: list-some
---

# 类型

```meta-lisp
(polymorphic (A) (-> (-> A bool-t) (list-t A) bool-t))
```

# 描述

判断列表中是否有元素满足条件。空列表返回 `false`。

# 例子

```meta-lisp
(list-some int-is-non-negative [-1 0 1])  ;; => true
(list-some int-is-non-negative [-1 -2])   ;; => false
```
