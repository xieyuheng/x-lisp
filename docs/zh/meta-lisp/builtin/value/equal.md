---
title: equal
---

# 类型

```meta-lisp
(polymorphic (A B) (-> A B bool-t))
```

# 描述

判断两个值是否结构相等（深度比较）。

# 例子

```meta-lisp
(equal 1 1)          ;; => true
(equal "a" "a")      ;; => true
(equal [1 2] [1 2])  ;; => true
```
