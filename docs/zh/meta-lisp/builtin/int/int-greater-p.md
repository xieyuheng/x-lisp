---
title: int-greater?
---

# 类型

```scheme
(-> int-t int-t bool-t)
```

# 描述

判断第一个整数是否大于第二个。

# 例子

```scheme
(int-greater? 2 1)     ;; => true
(int-greater? 1 2)     ;; => false
(int-greater? 1 1)     ;; => false
```
