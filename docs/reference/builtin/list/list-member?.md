---
title: list-member?
---

# 类型

```scheme
(polymorphic (A) (-> A (list-t A) bool-t))
```

# 描述

判断列表中是否包含指定元素。派生函数。

# 例子

```scheme
(list-member? 2 [1 2 3])   ;; => true
(list-member? 0 [1 2 3])   ;; => false
```
