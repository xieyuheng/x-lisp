---
title: int-greater-or-equal?
---

# 类型

```scheme
(-> int-t int-t bool-t)
```

# 描述

判断第一个整数是否大于或等于第二个。

# 例子

```scheme
(int-greater-or-equal? 2 1)   ;; => true
(int-greater-or-equal? 1 1)   ;; => true
(int-greater-or-equal? 1 2)   ;; => false
```
