---
title: list-member?
---

# 类型

```meta-lisp
(polymorphic (A) (-> A (list-t A) bool-t))
```

# 描述

判断列表中是否包含指定元素。

# 例子

```meta-lisp
(list-member? 2 [1 2 3])   ;; => true
(list-member? 0 [1 2 3])   ;; => false
```
